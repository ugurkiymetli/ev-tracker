"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getOrCreateDefaultVehicleAndSettings, importValidChargingSessions } from "@/server/services/ev-service";
import { parseExcelFileBuffer } from "@/server/importers/excel-importer";

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
    const provider = await prisma.chargingProvider.upsert({
      where: { name: providerName },
      update: {},
      create: { name: providerName, type: chargingType === "DC" ? "FAST_CHARGER" : "PUBLIC" },
    });
    providerId = provider.id;
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
      pricePerKwh: Number(pricePerKwh.toFixed(4)),
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
  const currencySymbol = (formData.get("currencySymbol") as string) || "$";
  const defaultFuelPricePerL = parseFloat(formData.get("defaultFuelPricePerL") as string) || 1.85;
  const defaultFuelConsumptionPer100km = parseFloat(formData.get("defaultFuelConsumptionPer100km") as string) || 7.5;
  const vehicleName = (formData.get("vehicleName") as string)?.trim();
  const batteryCapacityKwh = parseFloat(formData.get("batteryCapacityKwh") as string);
  const initialOdometerKm = parseFloat(formData.get("initialOdometerKm") as string);
  const currentOdometerKm = parseFloat(formData.get("currentOdometerKm") as string);

  const { vehicle } = await getOrCreateDefaultVehicleAndSettings();

  await prisma.settings.update({
    where: { id: "default" },
    data: {
      currencySymbol,
      defaultFuelPricePerL,
      defaultFuelConsumptionPer100km,
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

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/ice-comparison");
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
