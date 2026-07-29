"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getOrCreateDefaultVehicleAndSettings, importValidChargingSessions, findOrCreateProvider } from "@/server/services/ev-service";
import { parseExcelFileBuffer, type ParsedChargingSessionRow } from "@/server/importers/excel-importer";
import { hashPassword, verifyPassword, createAuthSession, destroyAuthSession } from "@/lib/auth/auth";

export async function signUpAction(formData: FormData): Promise<{ error?: string }> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const email = (formData.get("email") as string)?.trim() || null;

  if (!username || username.length < 3) {
    return { error: "Username must be at least 3 characters long." };
  }
  if (!password || password.length < 4) {
    return { error: "Password must be at least 4 characters long." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return { error: "Username is already taken." };
  }

  const passwordHash = hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });

  // Create default vehicle and settings for new user
  const vehicle = await prisma.vehicle.create({
    data: {
      userId: user.id,
      name: "My Electric Vehicle",
      make: "Tesla",
      model: "Model Y",
      year: 2024,
      batteryCapacityKwh: 75.0,
      initialOdometerKm: 10000,
      currentOdometerKm: 15000,
    },
  });

  await prisma.settings.create({
    data: {
      id: user.id,
      userId: user.id,
      currencySymbol: "$",
      defaultFuelPricePerL: 1.85,
      defaultFuelConsumptionPer100km: 7.5,
      language: "en",
      activeVehicleId: vehicle.id,
    },
  });

  await createAuthSession(user);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInAction(formData: FormData): Promise<{ error?: string }> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Please enter both username and password." };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Invalid username or password." };
  }

  await createAuthSession(user);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOutAction(): Promise<void> {
  await destroyAuthSession();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function createChargingSessionAction(formData: FormData): Promise<void> {
  const { vehicle } = await getOrCreateDefaultVehicleAndSettings();

  const dateStr = formData.get("date") as string;
  const energyChargedKwh = parseFloat(formData.get("energyChargedKwh") as string);
  const cost = parseFloat(formData.get("cost") as string);
  const chargingType = (formData.get("chargingType") as string) || "AC";
  const providerName = (formData.get("providerName") as string)?.trim();
  const odometerKmStr = formData.get("odometerKm") as string;
  const location = (formData.get("location") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim();

  if (!dateStr || isNaN(energyChargedKwh) || isNaN(cost) || energyChargedKwh <= 0) {
    throw new Error("Invalid session input data");
  }

  let providerId: string | null = null;
  if (providerName) {
    const provider = await findOrCreateProvider(providerName, chargingType);
    if (provider) providerId = provider.id;
  }

  const pricePerKwh = cost / energyChargedKwh;
  const odometerKm = odometerKmStr ? parseFloat(odometerKmStr) : null;

  await prisma.chargingSession.create({
    data: {
      vehicleId: vehicle.id,
      providerId,
      date: new Date(dateStr),
      energyChargedKwh,
      cost,
      pricePerKwh: Number(pricePerKwh.toFixed(2)),
      chargingType,
      odometerKm,
      location,
      notes,
    },
  });

  if (odometerKm && odometerKm > vehicle.currentOdometerKm) {
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { currentOdometerKm: odometerKm },
    });
  }

  revalidatePath("/");
  revalidatePath("/charging");
}

export async function updateChargingSessionAction(formData: FormData): Promise<void> {
  const sessionId = formData.get("sessionId") as string;
  const dateStr = formData.get("date") as string;
  const energyChargedKwh = parseFloat(formData.get("energyChargedKwh") as string);
  const cost = parseFloat(formData.get("cost") as string);
  const chargingType = (formData.get("chargingType") as string) || "AC";
  const providerName = (formData.get("providerName") as string)?.trim();
  const odometerKmStr = formData.get("odometerKm") as string;
  const location = (formData.get("location") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim();

  if (!sessionId || !dateStr || isNaN(energyChargedKwh) || isNaN(cost) || energyChargedKwh <= 0) {
    throw new Error("Invalid session update data");
  }

  let providerId: string | null = null;
  if (providerName) {
    const provider = await findOrCreateProvider(providerName, chargingType);
    if (provider) providerId = provider.id;
  }

  const pricePerKwh = cost / energyChargedKwh;
  const odometerKm = odometerKmStr ? parseFloat(odometerKmStr) : null;

  await prisma.chargingSession.update({
    where: { id: sessionId },
    data: {
      providerId,
      date: new Date(dateStr),
      energyChargedKwh,
      cost,
      pricePerKwh: Number(pricePerKwh.toFixed(2)),
      chargingType,
      odometerKm,
      location,
      notes,
    },
  });

  const { vehicle } = await getOrCreateDefaultVehicleAndSettings();
  if (odometerKm && odometerKm > vehicle.currentOdometerKm) {
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { currentOdometerKm: odometerKm },
    });
  }

  revalidatePath("/");
  revalidatePath("/charging");
  revalidatePath("/ice-comparison");
}

export async function deleteChargingSessionAction(id: string): Promise<void> {
  await prisma.chargingSession.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/charging");
}

export async function createExpenseAction(formData: FormData): Promise<void> {
  const { vehicle } = await getOrCreateDefaultVehicleAndSettings();

  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string) || "MAINTENANCE";
  const amount = parseFloat(formData.get("amount") as string);
  const dateStr = formData.get("date") as string;
  const description = (formData.get("description") as string)?.trim();

  if (!title || isNaN(amount) || amount <= 0 || !dateStr) {
    throw new Error("Invalid expense details");
  }

  await prisma.expense.create({
    data: {
      vehicleId: vehicle.id,
      title,
      category,
      amount,
      date: new Date(dateStr),
      description,
    },
  });

  revalidatePath("/");
  revalidatePath("/expenses");
}

export async function deleteExpenseAction(id: string): Promise<void> {
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/expenses");
}

export async function previewImportExcelAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    throw new Error("No valid file uploaded");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = parseExcelFileBuffer(buffer);

  const allProviders = await prisma.chargingProvider.findMany({
    orderBy: { name: "asc" },
  });

  for (const row of result.previewRows) {
    if (row.parsed) {
      const rawName =
        row.parsed.providerName ||
        row.raw["İstasyon"] ||
        row.raw["İstasyon / Konum"] ||
        row.raw["Istasyon"] ||
        row.raw["Provider"] ||
        row.raw["Firma"] ||
        row.raw["Sağlayıcı"] ||
        row.raw["Saglayici"];

      if (rawName) {
        const matched = await findOrCreateProvider(rawName, row.parsed.chargingType);
        if (matched) {
          row.parsed.providerName = matched.name;
        }
      }
    }
  }

  return {
    ...result,
    allProviders: allProviders.map((p) => ({
      id: p.id,
      name: p.name,
      stationCount: p.stationCount,
    })),
  };
}

export async function confirmImportExcelAction(rows: ParsedChargingSessionRow[]) {
  if (!rows || rows.length === 0) {
    throw new Error("No valid sessions to import");
  }

  const { vehicle } = await getOrCreateDefaultVehicleAndSettings();
  const importedCount = await importValidChargingSessions(rows, vehicle.id);

  revalidatePath("/");
  revalidatePath("/charging");
  revalidatePath("/import");
  revalidatePath("/ice-comparison");

  return { success: true, importedCount };
}

export async function importExcelAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file uploaded");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const parseResult = parseExcelFileBuffer(buffer);

  const validRows = parseResult.previewRows
    .filter((r) => r.isValid && r.parsed)
    .map((r) => r.parsed!);

  const { vehicle } = await getOrCreateDefaultVehicleAndSettings();
  const importedCount = await importValidChargingSessions(validRows, vehicle.id);

  revalidatePath("/");
  revalidatePath("/charging");
  revalidatePath("/import");

  return {
    success: true,
    totalRows: parseResult.totalRows,
    importedCount,
    failedCount: parseResult.invalidRowsCount,
  };
}

export async function updateSettingsAction(formData: FormData): Promise<void> {
  const { vehicle, settings } = await getOrCreateDefaultVehicleAndSettings();

  const currencySymbol = formData.has("currencySymbol")
    ? ((formData.get("currencySymbol") as string)?.trim() || settings.currencySymbol)
    : settings.currencySymbol;

  const defaultFuelPricePerL = formData.has("defaultFuelPricePerL")
    ? (parseFloat(formData.get("defaultFuelPricePerL") as string) || settings.defaultFuelPricePerL)
    : settings.defaultFuelPricePerL;

  const defaultFuelConsumptionPer100km = formData.has("defaultFuelConsumptionPer100km")
    ? (parseFloat(formData.get("defaultFuelConsumptionPer100km") as string) || settings.defaultFuelConsumptionPer100km)
    : settings.defaultFuelConsumptionPer100km;

  const language = formData.has("language")
    ? ((formData.get("language") as string) || settings.language)
    : settings.language;

  const vehicleName = (formData.get("vehicleName") as string)?.trim();
  const batteryCapacityKwh = parseFloat(formData.get("batteryCapacityKwh") as string);
  const initialOdometerKm = parseFloat(formData.get("initialOdometerKm") as string);
  const currentOdometerKm = parseFloat(formData.get("currentOdometerKm") as string);

  // If language changed and currency wasn't explicitly changed, map default currency
  let finalCurrencySymbol = currencySymbol;
  if (formData.has("language") && !formData.has("currencySymbol")) {
    if (language === "tr" && settings.currencySymbol === "$") finalCurrencySymbol = "₺";
    if (language === "en" && settings.currencySymbol === "₺") finalCurrencySymbol = "$";
  }

  await prisma.settings.update({
    where: { id: settings.id },
    data: {
      currencySymbol: finalCurrencySymbol,
      defaultFuelPricePerL,
      defaultFuelConsumptionPer100km,
      language,
    },
  });

  if (vehicleName || !isNaN(batteryCapacityKwh)) {
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        name: vehicleName || vehicle.name,
        batteryCapacityKwh: !isNaN(batteryCapacityKwh) ? batteryCapacityKwh : vehicle.batteryCapacityKwh,
        initialOdometerKm: !isNaN(initialOdometerKm) ? initialOdometerKm : vehicle.initialOdometerKm,
        currentOdometerKm: !isNaN(currentOdometerKm) ? currentOdometerKm : vehicle.currentOdometerKm,
      },
    });
  }

  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/settings");
    revalidatePath("/charging");
    revalidatePath("/expenses");
    revalidatePath("/ice-comparison");
  } catch (e) {}
}

export async function deleteAllDataAction(): Promise<void> {
  const { vehicle } = await getOrCreateDefaultVehicleAndSettings();

  await prisma.chargingSession.deleteMany({ where: { vehicleId: vehicle.id } });
  await prisma.expense.deleteMany({ where: { vehicleId: vehicle.id } });
  await prisma.trip.deleteMany({ where: { vehicleId: vehicle.id } });

  try {
    revalidatePath("/");
    revalidatePath("/charging");
    revalidatePath("/expenses");
    revalidatePath("/ice-comparison");
    revalidatePath("/settings");
  } catch (e) {}
}

export async function seedDemoDataAction(): Promise<void> {
  const { vehicle } = await getOrCreateDefaultVehicleAndSettings();

  // Clean existing sessions & expenses
  await prisma.chargingSession.deleteMany({ where: { vehicleId: vehicle.id } });
  await prisma.expense.deleteMany({ where: { vehicleId: vehicle.id } });

  const providers = [
    { name: "Supercharger Downtown", type: "FAST_CHARGER", price: 0.38 },
    { name: "Electrify America Highway", type: "FAST_CHARGER", price: 0.42 },
    { name: "Home Garage Wallbox", type: "HOME", price: 0.14 },
    { name: "Workplace ChargePoint", type: "WORK", price: 0.18 },
  ];

  const providerRecords = await Promise.all(
    providers.map((p) =>
      prisma.chargingProvider.upsert({
        where: { name: p.name },
        update: { pricePerKwhDefault: p.price },
        create: { name: p.name, type: p.type, pricePerKwhDefault: p.price },
      })
    )
  );

  // Generate 6 months of realistic charging history
  const today = new Date();
  const demoSessions = [];
  let odo = 12000;

  for (let i = 180; i >= 0; i -= 3) {
    const sessionDate = new Date(today);
    sessionDate.setDate(today.getDate() - i);

    const isHome = i % 2 === 0;
    const provider = isHome ? providerRecords[2] : providerRecords[i % providerRecords.length];
    const energy = isHome ? 35 + (i % 15) : 45 + (i % 25);
    const chargingType = isHome ? "AC" : i % 5 === 0 ? "DC" : "AC";
    const pricePerKwh = provider.pricePerKwhDefault || 0.25;
    const cost = Number((energy * pricePerKwh).toFixed(2));
    odo += 110 + (i % 60);

    demoSessions.push({
      vehicleId: vehicle.id,
      providerId: provider.id,
      date: sessionDate,
      energyChargedKwh: energy,
      cost,
      pricePerKwh,
      chargingType,
      startBatteryPct: 20,
      endBatteryPct: 80,
      odometerKm: odo,
      location: provider.name,
      notes: isHome ? "Overnight charge" : "En route fast charge",
    });
  }

  for (const s of demoSessions) {
    await prisma.chargingSession.create({ data: s });
  }

  // Update vehicle current odometer
  await prisma.vehicle.update({
    where: { id: vehicle.id },
    data: { initialOdometerKm: 12000, currentOdometerKm: odo },
  });

  // Seed sample operating expenses
  await prisma.expense.createMany({
    data: [
      {
        vehicleId: vehicle.id,
        date: new Date(today.getTime() - 90 * 86400000),
        category: "INSURANCE",
        amount: 450,
        title: "Annual EV Comprehensive Insurance",
        description: "Coverage with zero deductible glass replacement",
      },
      {
        vehicleId: vehicle.id,
        date: new Date(today.getTime() - 45 * 86400000),
        category: "MAINTENANCE",
        amount: 85,
        title: "Cabin Air Filter & Wiper Replacement",
        description: "OEM HEPA filter replacement",
      },
      {
        vehicleId: vehicle.id,
        date: new Date(today.getTime() - 15 * 86400000),
        category: "ACCESSORY",
        amount: 140,
        title: "All-Weather Floor Liners",
        description: "Custom fitted interior mats",
      },
    ],
  });

  try {
    revalidatePath("/");
    revalidatePath("/charging");
    revalidatePath("/expenses");
    revalidatePath("/ice-comparison");
  } catch (e) {
    // Ignore revalidatePath when called outside Next request lifecycle
  }
}

export async function softDeleteProviderAction(providerId: string) {
  if (!providerId) throw new Error("Provider ID is required");
  await prisma.chargingProvider.update({
    where: { id: providerId },
    data: { isDeleted: true },
  });

  revalidatePath("/");
  revalidatePath("/charging");
  revalidatePath("/settings");
  revalidatePath("/import");
  return { success: true };
}
