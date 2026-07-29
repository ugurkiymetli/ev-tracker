import * as XLSX from "xlsx";
import { z } from "zod";

export const ChargingSessionRowSchema = z.object({
  date: z.string().or(z.date()).transform((val) => new Date(val)),
  energyChargedKwh: z.number().positive("Energy charged must be greater than 0"),
  cost: z.number().min(0, "Cost cannot be negative"),
  pricePerKwh: z.number().min(0, "Price per kWh cannot be negative").optional(),
  chargingType: z.enum(["AC", "DC"]).default("AC"),
  providerName: z.string().optional(),
  odometerKm: z.number().positive().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type ParsedChargingSessionRow = z.infer<typeof ChargingSessionRowSchema>;

export interface ImportPreviewRow {
  rowIndex: number;
  raw: Record<string, any>;
  parsed?: ParsedChargingSessionRow;
  isValid: boolean;
  errors: string[];
}

export interface ImportParseResult {
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  previewRows: ImportPreviewRow[];
  headers: string[];
}

/**
 * Parses raw Excel/CSV file buffer and validates each row with Zod.
 */
export function parseExcelFileBuffer(fileBuffer: Buffer): ImportParseResult {
  const workbook = XLSX.read(fileBuffer, { type: "buffer", cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  if (!sheet) {
    throw new Error("Excel file appears to be empty or has no readable sheets.");
  }

  const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { raw: false, dateNF: "yyyy-mm-dd" });

  if (jsonRows.length === 0) {
    return {
      totalRows: 0,
      validRowsCount: 0,
      invalidRowsCount: 0,
      previewRows: [],
      headers: [],
    };
  }

  const headers = Object.keys(jsonRows[0]);
  const previewRows: ImportPreviewRow[] = [];
  let validCount = 0;
  let invalidCount = 0;

  jsonRows.forEach((row, idx) => {
    // Column normalization matching flexible user headings
    const normalized: Record<string, any> = {};

    Object.entries(row).forEach(([key, val]) => {
      const k = key.trim().toLowerCase();
      if (k.includes("date") || k.includes("tarih")) normalized.date = val;
      else if (k.includes("kwh") || k.includes("energy") || k.includes("enerji")) normalized.energyChargedKwh = parseFloat(String(val));
      else if (k.includes("cost") || k.includes("price") || k.includes("tutar") || k.includes("maliyet")) {
        if (!normalized.cost) normalized.cost = parseFloat(String(val).replace(/[^0-9.]/g, ""));
      } else if (k.includes("type") || k.includes("tip")) {
        const typeStr = String(val).toUpperCase();
        normalized.chargingType = typeStr.includes("DC") || typeStr.includes("FAST") ? "DC" : "AC";
      } else if (k.includes("provider") || k.includes("network") || k.includes("station") || k.includes("istasyon")) {
        normalized.providerName = String(val);
      } else if (k.includes("odometer") || k.includes("km")) {
        normalized.odometerKm = parseFloat(String(val));
      } else if (k.includes("location") || k.includes("address") || k.includes("konum")) {
        normalized.location = String(val);
      } else if (k.includes("note") || k.includes("aciklama") || k.includes("açıklama")) {
        normalized.notes = String(val);
      }
    });

    // Default cost/energy fallback if price per kwh provided
    if (normalized.energyChargedKwh && !normalized.cost && normalized.pricePerKwh) {
      normalized.cost = normalized.energyChargedKwh * normalized.pricePerKwh;
    }

    if (normalized.energyChargedKwh && normalized.cost && !normalized.pricePerKwh) {
      normalized.pricePerKwh = normalized.cost / normalized.energyChargedKwh;
    }

    // Default values if not mapped explicitly
    if (!normalized.chargingType) normalized.chargingType = "AC";

    const validation = ChargingSessionRowSchema.safeParse(normalized);

    if (validation.success) {
      validCount += 1;
      previewRows.push({
        rowIndex: idx + 1,
        raw: row,
        parsed: validation.data,
        isValid: true,
        errors: [],
      });
    } else {
      invalidCount += 1;
      const errors = validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
      previewRows.push({
        rowIndex: idx + 1,
        raw: row,
        isValid: false,
        errors,
      });
    }
  });

  return {
    totalRows: jsonRows.length,
    validRowsCount: validCount,
    invalidRowsCount: invalidCount,
    previewRows,
    headers,
  };
}
