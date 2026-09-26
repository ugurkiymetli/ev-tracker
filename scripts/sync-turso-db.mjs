import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || (!url.startsWith("libsql://") && !url.startsWith("https://"))) {
  console.error("Error: DATABASE_URL in .env.local is not a Turso / libSQL URL.");
  process.exit(1);
}

console.log(`Connecting to Turso DB: ${url}`);
const client = createClient({ url, authToken });

async function run() {
  const alterStatements = [
    // Journey model creation & fields
    `CREATE TABLE IF NOT EXISTS Journey (
      id TEXT PRIMARY KEY,
      vehicleId TEXT NOT NULL,
      name TEXT NOT NULL,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      startOdometerKm REAL,
      endOdometerKm REAL,
      distanceKm REAL,
      startBatteryPct REAL,
      endBatteryPct REAL,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicleId) REFERENCES Vehicle(id) ON DELETE CASCADE
    );`,
    "ALTER TABLE Journey ADD COLUMN startBatteryPct REAL;",
    "ALTER TABLE Journey ADD COLUMN endBatteryPct REAL;",

    // ChargingSession new fields & relation
    "ALTER TABLE ChargingSession ADD COLUMN journeyId TEXT;",
    "ALTER TABLE ChargingSession ADD COLUMN durationMinutes REAL;",
    "ALTER TABLE ChargingSession ADD COLUMN startBatteryPct REAL;",
    "ALTER TABLE ChargingSession ADD COLUMN endBatteryPct REAL;",
    "ALTER TABLE ChargingSession ADD COLUMN odometerKm REAL;",
    "ALTER TABLE ChargingSession ADD COLUMN location TEXT;",
    "ALTER TABLE ChargingSession ADD COLUMN notes TEXT;",
    "ALTER TABLE ChargingSession ADD COLUMN chargingType TEXT DEFAULT 'AC';",
    "ALTER TABLE ChargingSession ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;",
    "ALTER TABLE ChargingSession ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP;",
    
    // Vehicle fields if any
    "ALTER TABLE Vehicle ADD COLUMN initialOdometerKm REAL DEFAULT 0;",
    "ALTER TABLE Vehicle ADD COLUMN currentOdometerKm REAL DEFAULT 0;",
    "ALTER TABLE Vehicle ADD COLUMN userId TEXT;",

    // Settings fields if any
    "ALTER TABLE Settings ADD COLUMN language TEXT DEFAULT 'en';",
    "ALTER TABLE Settings ADD COLUMN activeVehicleId TEXT;",
    "ALTER TABLE Settings ADD COLUMN defaultFuelPricePerL REAL DEFAULT 1.85;",
    "ALTER TABLE Settings ADD COLUMN defaultFuelConsumptionPer100km REAL DEFAULT 7.5;"
  ];

  for (const statement of alterStatements) {
    try {
      await client.execute(statement);
      console.log(`✓ Executed: ${statement}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("duplicate column name")) {
        console.log(`- Skipped (already exists): ${statement.split(" ")[5] || statement}`);
      } else {
        console.log(`! Note: ${msg}`);
      }
    }
  }

  console.log("✅ Turso database schema sync complete!");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
