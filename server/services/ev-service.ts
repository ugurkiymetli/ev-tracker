import { prisma } from "@/lib/db/prisma";
import {
  calculateDashboardStats,
  calculateMonthlyTrends,
  calculateProviderStats,
} from "../calculators/statistics";
import { calculateIceComparison } from "../calculators/ice-comparison";
import { ParsedChargingSessionRow } from "../importers/excel-importer";

/**
 * Gets or initializes default vehicle and settings if none exist.
 */
export async function getOrCreateDefaultVehicleAndSettings() {
  let settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: "default",
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

  if (!vehicle) {
    vehicle = await prisma.vehicle.findFirst();
  }

  if (!vehicle) {
    vehicle = await prisma.vehicle.create({
      data: {
        name: "Tesla Model Y",
        make: "Tesla",
        model: "Model Y Long Range",
        year: 2024,
        batteryCapacityKwh: 75.0,
        initialOdometerKm: 12000,
        currentOdometerKm: 18500,
      },
    });

    await prisma.settings.update({
      where: { id: "default" },
      data: { activeVehicleId: vehicle.id },
    });
  }

  return { vehicle, settings };
}

/**
 * Retrieves full dashboard analytics dataset.
 */
export async function getDashboardData() {
  const { vehicle, settings } = await getOrCreateDefaultVehicleAndSettings();

  const sessions = await prisma.chargingSession.findMany({
    where: { vehicleId: vehicle.id },
    include: { provider: true },
    orderBy: { date: "desc" },
  });

  const expenses = await prisma.expense.findMany({
    where: { vehicleId: vehicle.id },
    orderBy: { date: "desc" },
  });

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
    sessions,
    expenses,
    stats,
    monthlyTrends,
    providerStats,
    iceComparison,
  };
}

/**
 * Batch imports validated charging session rows into database.
 */
export async function importValidChargingSessions(
  rows: ParsedChargingSessionRow[],
  vehicleId: string
) {
  let importedCount = 0;

  for (const row of rows) {
    let providerId: string | null = null;

    if (row.providerName) {
      const provider = await prisma.chargingProvider.upsert({
        where: { name: row.providerName },
        update: {},
        create: {
          name: row.providerName,
          type: row.chargingType === "DC" ? "FAST_CHARGER" : "PUBLIC",
        },
      });
      providerId = provider.id;
    }

    const pricePerKwh = row.pricePerKwh || (row.cost / row.energyChargedKwh);

    await prisma.chargingSession.create({
      data: {
        vehicleId,
        providerId,
        date: row.date,
        energyChargedKwh: row.energyChargedKwh,
        cost: row.cost,
        pricePerKwh: Number(pricePerKwh.toFixed(4)),
        chargingType: row.chargingType,
        odometerKm: row.odometerKm,
        location: row.location,
        notes: row.notes,
      },
    });

    // Update vehicle current odometer if higher
    if (row.odometerKm) {
      const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
      if (vehicle && row.odometerKm > vehicle.currentOdometerKm) {
        await prisma.vehicle.update({
          where: { id: vehicleId },
          data: { currentOdometerKm: row.odometerKm },
        });
      }
    }

    importedCount += 1;
  }

  return importedCount;
}
