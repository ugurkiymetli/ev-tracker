export type ChargingType = "AC" | "DC";

export type ExpenseCategory =
  | "MAINTENANCE"
  | "INSURANCE"
  | "TAX"
  | "PARKING"
  | "ACCESSORY"
  | "OTHER";

export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  batteryCapacityKwh: number;
  initialOdometerKm: number;
  currentOdometerKm: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChargingProvider {
  id: string;
  name: string;
  type: string;
  pricePerKwhDefault?: number | null;
}

export interface ChargingSession {
  id: string;
  vehicleId: string;
  providerId?: string | null;
  provider?: ChargingProvider | null;
  date: Date | string;
  energyChargedKwh: number;
  cost: number;
  pricePerKwh: number;
  startBatteryPct?: number | null;
  endBatteryPct?: number | null;
  chargingType: ChargingType | string;
  odometerKm?: number | null;
  location?: string | null;
  notes?: string | null;
}

export interface Expense {
  id: string;
  vehicleId: string;
  date: Date | string;
  category: ExpenseCategory | string;
  amount: number;
  title: string;
  description?: string | null;
  odometerKm?: number | null;
}

export interface Settings {
  id: string;
  currencySymbol: string;
  defaultFuelPricePerL: number;
  defaultFuelConsumptionPer100km: number;
  language: string;
  activeVehicleId?: string | null;
}

// Analytics and Calculated KPI DTOs
export interface DashboardStats {
  totalSessions: number;
  totalEnergyChargedKwh: number;
  totalChargingCost: number;
  avgPricePerKwh: number;
  avgConsumptionKwh100km: number;
  costPerKm: number;
  costPer100km: number;
  totalDistanceDrivenKm: number;
  estimatedBatteryCycles: number;
  estimatedRangeKm: number;
  acSessionsCount: number;
  dcSessionsCount: number;
  totalExpensesCost: number;
  totalOwnershipCost: number;
  totalSavedVsIce: number;
}

export interface MonthlyTrendPoint {
  month: string; // "YYYY-MM"
  monthLabel: string; // "Jan 2026"
  energyKwh: number;
  cost: number;
  sessionsCount: number;
  avgPricePerKwh: number;
}

export interface ProviderStatPoint {
  providerName: string;
  sessionsCount: number;
  totalEnergyKwh: number;
  totalCost: number;
  avgPricePerKwh: number;
}

export interface IceComparisonStats {
  evTotalChargingCost: number;
  iceEquivalentFuelCost: number;
  lifetimeSavings: number;
  monthlySavings: number;
  costPerKmEv: number;
  costPerKmIce: number;
  litersSaved: number;
  co2SavedKg: number;
}
