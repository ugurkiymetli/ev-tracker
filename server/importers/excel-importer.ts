import * as XLSX from "xlsx";
import { z } from "zod";

export const ChargingSessionRowSchema = z.object({
  date: z.string().or(z.date()).transform((val) => {
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }),
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
  allProviders?: Array<{ id: string; name: string }>;
}

export function normalizeKey(str: string): string {
  if (!str) return "";
  return str
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .replace(/Ğ/g, "g")
    .replace(/ğ/g, "g")
    .replace(/Ü/g, "u")
    .replace(/ü/g, "u")
    .replace(/Ş/g, "s")
    .replace(/ş/g, "s")
    .replace(/Ö/g, "o")
    .replace(/ö/g, "o")
    .replace(/Ç/g, "c")
    .replace(/ç/g, "c")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Parses raw Excel/CSV file buffer and validates each row with Zod.
 * Handles Turkish diacritics and ensures 100% plain object serialization.
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
    // Sanitize raw row to plain string/number values
    const cleanRaw: Record<string, any> = {};
    Object.entries(row).forEach(([rk, rv]) => {
      if (rv instanceof Date) {
        cleanRaw[rk] = rv.toISOString();
      } else {
        cleanRaw[rk] = rv;
      }
    });

    // Column normalization matching flexible user headings with Turkish diacritic handling
    const normalized: Record<string, any> = {};

    Object.entries(row).forEach(([key, val]) => {
      const k = normalizeKey(key);
      const strVal = String(val || "").trim();

      if (
        k.includes("istasyon") ||
        k.includes("provider") ||
        k.includes("network") ||
        k.includes("station") ||
        k.includes("firma") ||
        k.includes("saglayici") ||
        k.includes("operator") ||
        k.includes("ag") ||
        k.includes("marka")
      ) {
        if (strVal && strVal.toLowerCase() !== "undefined" && strVal.toLowerCase() !== "null") {
          normalized.providerName = strVal;
        }
      } else if (k.includes("tarih") || k.includes("date") || k.includes("zaman")) {
        normalized.date = val;
      } else if (k.includes("kwh") || k.includes("energy") || k.includes("enerji") || k.includes("miktar")) {
        normalized.energyChargedKwh = parseFloat(strVal);
      } else if (k.includes("tip") || k.includes("type") || k.includes("ac/dc")) {
        const typeStr = strVal.toUpperCase();
        normalized.chargingType = typeStr.includes("DC") || typeStr.includes("FAST") || typeStr.includes("HIZLI") ? "DC" : "AC";
      } else if (
        k.includes("birim fiyat") ||
        k.includes("birimfiyat") ||
        k.includes("price/kwh") ||
        k.includes("kwh fiyat")
      ) {
        normalized.pricePerKwh = parseFloat(strVal.replace(/[^0-9.]/g, ""));
      } else if (
        k.includes("cost") ||
        k.includes("price") ||
        k.includes("tutar") ||
        k.includes("maliyet") ||
        k.includes("ucret")
      ) {
        if (!normalized.cost) normalized.cost = parseFloat(strVal.replace(/[^0-9.]/g, ""));
      } else if (k.includes("odometer") || k.includes("km") || k.includes("kilometre") || k.includes("sayac")) {
        normalized.odometerKm = parseFloat(strVal);
      } else if (k.includes("location") || k.includes("address") || k.includes("konum")) {
        if (strVal) normalized.location = strVal;
      } else if (k.includes("note") || k.includes("aciklama")) {
        if (strVal) normalized.notes = strVal;
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
        raw: cleanRaw,
        parsed: validation.data,
        isValid: true,
        errors: [],
      });
    } else {
      invalidCount += 1;
      const errors = validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
      previewRows.push({
        rowIndex: idx + 1,
        raw: cleanRaw,
        isValid: false,
        errors,
      });
    }
  });

  const result: ImportParseResult = {
    totalRows: jsonRows.length,
    validRowsCount: validCount,
    invalidRowsCount: invalidCount,
    previewRows,
    headers,
  };

  // Guarantee plain object serialization for React Server Components
  return JSON.parse(JSON.stringify(result));
}
