import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  calculateDashboardStats,
  calculateMonthlyTrends,
  calculateProviderStats,
} from "../calculators/statistics";
import { calculateIceComparison } from "../calculators/ice-comparison";
import { ParsedChargingSessionRow } from "../importers/excel-importer";

let columnsChecked = false;

/**
 * Ensures stationCount and isDeleted columns exist in the physical database table.
 * Automatically runs SQL ALTER TABLE if missing in production DB.
 */
export async function ensureChargingProviderColumns() {
  if (columnsChecked) return;
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "ChargingProvider" ADD COLUMN "stationCount" INTEGER NOT NULL DEFAULT 0;`
    );
  } catch (e) {
    // Column already exists or alter ignored
  }

  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "ChargingProvider" ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT 0;`
    );
  } catch (e) {
    // Column already exists or alter ignored
  }

  columnsChecked = true;
}

/**
 * Seeds Turkish charging providers from tr-charging-providers.json into DB if needed.
 */
export async function seedTrChargingProviders() {
  await ensureChargingProviderColumns();
  try {
    const jsonPath = path.join(process.cwd(), "tr-charging-providers.json");
    if (fs.existsSync(jsonPath)) {
      const rawData = fs.readFileSync(jsonPath, "utf-8");
      const providersArr: Array<{
        BrandName: string;
        StationCount?: string;
        "DC Price"?: number;
        "AC Price"?: number;
      }> = JSON.parse(rawData);

      for (const item of providersArr) {
        if (!item.BrandName) continue;
        const name = item.BrandName.trim();
        const dcPrice = item["DC Price"];
        const acPrice = item["AC Price"];
        const defaultPrice = dcPrice || acPrice || null;
        const type = dcPrice ? "FAST_CHARGER" : "PUBLIC";

        const stationCount = parseInt(item.StationCount || "0", 10);

        try {
          await prisma.chargingProvider.upsert({
            where: { name },
            update: {
              pricePerKwhDefault: defaultPrice,
              type,
              stationCount,
            },
            create: {
              name,
              type,
              pricePerKwhDefault: defaultPrice,
              stationCount,
            },
          });
        } catch (upsertErr) {
          // Fallback upsert without new columns if DB migration pending
          await prisma.chargingProvider.upsert({
            where: { name },
            update: {
              pricePerKwhDefault: defaultPrice,
              type,
            },
            create: {
              name,
              type,
              pricePerKwhDefault: defaultPrice,
            },
          });
        }
      }
    }
  } catch (err) {
    console.error("Error seeding TR charging providers:", err);
  }
}

/**
 * Smart matches or creates a ChargingProvider by raw string name.
 */
export async function findOrCreateProvider(rawName: string, chargingType: string = "AC") {
  await ensureChargingProviderColumns();
  const trimmed = rawName.trim();
  if (!trimmed || trimmed.toLowerCase() === "undefined" || trimmed.toLowerCase() === "null") {
    return null;
  }

  // 1. Direct match
  const exact = await prisma.chargingProvider.findUnique({
    where: { name: trimmed },
  });
  if (exact) return exact;

  // 2. Fetch all providers for fuzzy/normalized match
  const allProviders = await prisma.chargingProvider.findMany();

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/\b(sarj|sarji|charge|charging|net|supercharge|supercharger|ev|station|istasyon|istasyonu|ağ|agi|firma|saglayici|sağlayıcı)\b/g, "")
      .replace(/[^a-z0-9]/g, "");

  const normInput = normalize(trimmed);

  if (normInput.length > 1) {
    for (const provider of allProviders) {
      const normDB = normalize(provider.name);
      if (
        normDB === normInput ||
        (normInput.length > 2 && normDB.length > 2 && (normDB.includes(normInput) || normInput.includes(normDB)))
      ) {
        return provider;
      }
    }
  }

  // 3. Fallback: Upsert new provider with input name
  return prisma.chargingProvider.upsert({
    where: { name: trimmed },
    update: {},
    create: {
      name: trimmed,
      type: chargingType === "DC" ? "FAST_CHARGER" : "PUBLIC",
    },
  });
}

/**
 * Gets or initializes default vehicle and settings for current user session.
 */
export async function getOrCreateDefaultVehicleAndSettings() {
  await ensureChargingProviderColumns();
  await seedTrChargingProviders();

  const currentUser = await getCurrentUser();
  const userId = currentUser?.id;

  let settings = null;

  if (userId) {
    settings = await prisma.settings.findFirst({
      where: { userId },
    });
  } else {
    settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });
  }

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: userId ? undefined : "default",
        userId: userId || null,
        currencySymbol: "$",
        defaultFuelPricePerL: 1.85,
        defaultFuelConsumptionPer100km: 7.5,
      },
    });
  }

  let vehicle = null;
  if (settings.activeVehicleId) {
    vehicle = await prisma.vehicle.findUnique({
      where: { id: settings.activeVehicleId },
    });
  }

  if (!vehicle && userId) {
    vehicle = await prisma.vehicle.findFirst({
      where: { userId },
    });
  }

  if (!vehicle) {
    vehicle = await prisma.vehicle.create({
      data: {
        userId: userId || null,
        name: "My Electric Vehicle",
        make: "Tesla",
        model: "Model Y Long Range",
        year: 2024,
        batteryCapacityKwh: 75.0,
        initialOdometerKm: 0,
        currentOdometerKm: 15000,
      },
    });

    await prisma.settings.update({
      where: { id: settings.id },
      data: { activeVehicleId: vehicle.id },
    });
  }

  return { vehicle, settings, user: currentUser };
}

/**
 * Fetches all metrics and records for the main application pages.
 */
export async function getDashboardData() {
  await ensureChargingProviderColumns();
  const { vehicle, settings, user } = await getOrCreateDefaultVehicleAndSettings();

  const sessions = await prisma.chargingSession.findMany({
    where: { vehicleId: vehicle.id },
    include: { provider: true },
    orderBy: { date: "desc" },
  });

  const expenses = await prisma.expense.findMany({
    where: { vehicleId: vehicle.id },
    orderBy: { date: "desc" },
  });

  let allProviders: any[] = [];
  try {
    allProviders = await prisma.chargingProvider.findMany({
      where: { isDeleted: false },
      orderBy: [{ stationCount: "desc" }, { name: "asc" }],
    });
  } catch (e) {
    try {
      allProviders = await prisma.chargingProvider.findMany({
        orderBy: { name: "asc" },
      });
    } catch (err) {
      allProviders = [];
    }
  }

  // Calculate user's top 3 most used provider IDs
  const providerUsageMap = new Map<string, number>();
  sessions.forEach((s) => {
    if (s.providerId) {
      providerUsageMap.set(s.providerId, (providerUsageMap.get(s.providerId) || 0) + 1);
    }
  });

  const userTopProviderIds = Array.from(providerUsageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  const lang = settings.language || "en";
  const locale = lang === "tr" ? "tr-TR" : "en-US";

  const stats = calculateDashboardStats(vehicle, sessions, expenses, settings);
  const monthlyTrends = calculateMonthlyTrends(sessions, locale);
  const providerStats = calculateProviderStats(sessions, lang);

  const iceComparison = calculateIceComparison({
    distanceDrivenKm: stats.totalDistanceDrivenKm,
    evTotalChargingCost: stats.totalChargingCost,
    iceFuelPricePerL: settings.defaultFuelPricePerL,
    iceFuelConsumptionPer100km: settings.defaultFuelConsumptionPer100km,
  });

  return {
    vehicle,
    settings,
    user,
    sessions,
    expenses,
    stats,
    monthlyTrends,
    providerStats,
    iceComparison,
    allProviders,
    userTopProviderIds,
  };
}

/**
 * Batch imports validated charging session rows into database.
 */
export async function importValidChargingSessions(
  rows: ParsedChargingSessionRow[],
  vehicleId: string
) {
  await ensureChargingProviderColumns();
  let importedCount = 0;

  for (const row of rows) {
    let providerId: string | null = null;

    if (row.providerName) {
      const provider = await findOrCreateProvider(row.providerName, row.chargingType);
      if (provider) {
        providerId = provider.id;
      }
    }

    const pricePerKwh = row.pricePerKwh || (row.cost / row.energyChargedKwh);

    await prisma.chargingSession.create({
      data: {
        vehicleId,
        providerId,
        date: new Date(row.date),
        energyChargedKwh: row.energyChargedKwh,
        cost: row.cost,
        pricePerKwh: Number(pricePerKwh.toFixed(2)),
        chargingType: row.chargingType,
        odometerKm: row.odometerKm || null,
        location: row.location || null,
        notes: row.notes || null,
      },
    });

    importedCount++;
  }

  return importedCount;
}
