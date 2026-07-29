import { prisma } from "../lib/db/prisma";
import { seedDemoDataAction } from "../app/actions";
import { createClient } from "@libsql/client";

async function ensureTablesExist() {
  const url = process.env.DATABASE_URL || "";
  if (url.startsWith("libsql://") || url.startsWith("https://")) {
    console.log("Ensuring Turso database tables exist...");
    const client = createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    await client.executeMultiple(`
      CREATE TABLE IF NOT EXISTS "Vehicle" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "make" TEXT NOT NULL,
        "model" TEXT NOT NULL,
        "year" INTEGER NOT NULL,
        "batteryCapacityKwh" REAL NOT NULL,
        "initialOdometerKm" REAL NOT NULL DEFAULT 0,
        "currentOdometerKm" REAL NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "ChargingProvider" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "type" TEXT NOT NULL DEFAULT 'PUBLIC',
        "pricePerKwhDefault" REAL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "ChargingSession" (
        "id" TEXT PRIMARY KEY,
        "vehicleId" TEXT NOT NULL,
        "providerId" TEXT,
        "date" DATETIME NOT NULL,
        "energyChargedKwh" REAL NOT NULL,
        "cost" REAL NOT NULL,
        "pricePerKwh" REAL NOT NULL,
        "startBatteryPct" REAL,
        "endBatteryPct" REAL,
        "chargingType" TEXT NOT NULL DEFAULT 'AC',
        "odometerKm" REAL,
        "location" TEXT,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("providerId") REFERENCES "ChargingProvider" ("id") ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS "Expense" (
        "id" TEXT PRIMARY KEY,
        "vehicleId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "amount" REAL NOT NULL,
        "date" DATETIME NOT NULL,
        "description" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS "Trip" (
        "id" TEXT PRIMARY KEY,
        "vehicleId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "startDate" DATETIME NOT NULL,
        "endDate" DATETIME,
        "startOdometerKm" REAL NOT NULL,
        "endOdometerKm" REAL,
        "totalEnergyKwh" REAL,
        "totalCost" REAL,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS "Settings" (
        "id" TEXT PRIMARY KEY DEFAULT 'default',
        "currencySymbol" TEXT NOT NULL DEFAULT '$',
        "defaultFuelPricePerL" REAL NOT NULL DEFAULT 1.85,
        "defaultFuelConsumptionPer100km" REAL NOT NULL DEFAULT 7.5,
        "language" TEXT NOT NULL DEFAULT 'en',
        "activeVehicleId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);
    console.log("Turso tables created successfully!");
  }
}

async function main() {
  await ensureTablesExist();
  console.log("Seeding demo data into database...");
  await seedDemoDataAction();
  console.log("Demo data successfully seeded!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
