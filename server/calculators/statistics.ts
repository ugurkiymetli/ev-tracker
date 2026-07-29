import {
  ChargingSession,
  Expense,
  Vehicle,
  Settings,
  DashboardStats,
  MonthlyTrendPoint,
  ProviderStatPoint,
} from "@/types";

/**
 * Calculates average consumption in kWh per 100 km.
 */
export function calculateAverageConsumption(
  totalEnergyChargedKwh: number,
  distanceDrivenKm: number
): number {
  if (distanceDrivenKm <= 0 || totalEnergyChargedKwh <= 0) return 0;
  return Number(((totalEnergyChargedKwh / distanceDrivenKm) * 100).toFixed(2));
}

/**
 * Calculates cost per kilometer (2 decimal places).
 */
export function calculateCostPerKm(
  totalCost: number,
  distanceDrivenKm: number
): number {
  if (distanceDrivenKm <= 0 || totalCost <= 0) return 0;
  return Number((totalCost / distanceDrivenKm).toFixed(2));
}

/**
 * Calculates estimated full battery discharge cycles.
 */
export function calculateBatteryCycles(
  totalEnergyChargedKwh: number,
  batteryCapacityKwh: number
): number {
  if (batteryCapacityKwh <= 0 || totalEnergyChargedKwh <= 0) return 0;
  return Number((totalEnergyChargedKwh / batteryCapacityKwh).toFixed(1));
}

/**
 * Calculates estimated full range (km) based on average consumption.
 */
export function calculateEstimatedRange(
  batteryCapacityKwh: number,
  avgConsumptionKwh100km: number
): number {
  if (avgConsumptionKwh100km <= 0 || batteryCapacityKwh <= 0) return 0;
  return Math.round((batteryCapacityKwh / avgConsumptionKwh100km) * 100);
}

/**
 * Aggregates monthly trends from charging sessions with locale support.
 * All prices & costs rounded to 2 decimal places.
 */
export function calculateMonthlyTrends(
  sessions: ChargingSession[],
  locale: string = "en-US"
): MonthlyTrendPoint[] {
  const map = new Map<string, { energyKwh: number; cost: number; count: number; date: Date }>();

  sessions.forEach((s) => {
    const d = new Date(s.date);
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    const existing = map.get(yearMonth) || {
      energyKwh: 0,
      cost: 0,
      count: 0,
      date: new Date(d.getFullYear(), d.getMonth(), 1),
    };

    existing.energyKwh += s.energyChargedKwh;
    existing.cost += s.cost;
    existing.count += 1;
    map.set(yearMonth, existing);
  });

  const sortedKeys = Array.from(map.keys()).sort();

  return sortedKeys.map((key) => {
    const item = map.get(key)!;
    const monthLabel = item.date.toLocaleDateString(locale, {
      month: "short",
      year: "numeric",
    });

    return {
      month: key,
      monthLabel,
      energyKwh: Number(item.energyKwh.toFixed(1)),
      cost: Number(item.cost.toFixed(2)),
      sessionsCount: item.count,
      avgPricePerKwh:
        item.energyKwh > 0 ? Number((item.cost / item.energyKwh).toFixed(2)) : 0,
    };
  });
}

/**
 * Aggregates stats by charging provider with localized unknown fallback.
 * All prices rounded to 2 decimal places.
 */
export function calculateProviderStats(
  sessions: ChargingSession[],
  lang: string = "en"
): ProviderStatPoint[] {
  const map = new Map<string, { count: number; energy: number; cost: number }>();
  const unknownFallback = lang === "tr" ? "Bilinmeyen İstasyon" : "Unknown Provider";

  sessions.forEach((s) => {
    let providerName = s.provider?.name || s.location || unknownFallback;
    if (providerName === "Unknown Provider" && lang === "tr") {
      providerName = "Bilinmeyen İstasyon";
    }
    const existing = map.get(providerName) || { count: 0, energy: 0, cost: 0 };
    existing.count += 1;
    existing.energy += s.energyChargedKwh;
    existing.cost += s.cost;
    map.set(providerName, existing);
  });

  return Array.from(map.entries())
    .map(([providerName, data]) => ({
      providerName,
      sessionsCount: data.count,
      totalEnergyKwh: Number(data.energy.toFixed(1)),
      totalCost: Number(data.cost.toFixed(2)),
      avgPricePerKwh:
        data.energy > 0 ? Number((data.cost / data.energy).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.totalCost - a.totalCost);
}

/**
 * Aggregates primary dashboard KPIs and ownership statistics.
 * All prices & costs formatted to 2 decimal places.
 */
export function calculateDashboardStats(
  vehicle: Vehicle | null,
  sessions: ChargingSession[],
  expenses: Expense[],
  settings: Settings
): DashboardStats {
  const totalSessions = sessions.length;
  const totalEnergyChargedKwh = sessions.reduce((acc, s) => acc + s.energyChargedKwh, 0);
  const totalChargingCost = sessions.reduce((acc, s) => acc + s.cost, 0);

  const avgPricePerKwh =
    totalEnergyChargedKwh > 0 ? Number((totalChargingCost / totalEnergyChargedKwh).toFixed(2)) : 0;

  // Calculate distance driven
  let distanceDrivenKm = 0;
  if (vehicle) {
    distanceDrivenKm = Math.max(0, vehicle.currentOdometerKm - vehicle.initialOdometerKm);
  }

  // If vehicle odometer distance is 0, estimate distance from max session odometer
  if (distanceDrivenKm <= 0 && sessions.length > 0) {
    const odometers = sessions
      .map((s) => s.odometerKm)
      .filter((o): o is number => o !== null && o !== undefined && o > 0);
    if (odometers.length >= 2) {
      distanceDrivenKm = Math.max(...odometers) - Math.min(...odometers);
    }
  }

  const avgConsumptionKwh100km = calculateAverageConsumption(
    totalEnergyChargedKwh,
    distanceDrivenKm
  );
  const costPerKm = calculateCostPerKm(totalChargingCost, distanceDrivenKm);
  const costPer100km = Number((costPerKm * 100).toFixed(2));

  const batteryCapacity = vehicle?.batteryCapacityKwh || 75.0;
  const estimatedBatteryCycles = calculateBatteryCycles(
    totalEnergyChargedKwh,
    batteryCapacity
  );
  const estimatedRangeKm = calculateEstimatedRange(
    batteryCapacity,
    avgConsumptionKwh100km > 0 ? avgConsumptionKwh100km : 18.0
  );

  let acSessionsCount = 0;
  let dcSessionsCount = 0;
  sessions.forEach((s) => {
    if (s.chargingType === "DC") {
      dcSessionsCount += 1;
    } else {
      acSessionsCount += 1;
    }
  });

  const totalExpensesCost = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalOwnershipCost = totalChargingCost + totalExpensesCost;

  // ICE savings calculation
  const fuelPricePerL = settings.defaultFuelPricePerL || 1.85;
  const fuelConsumption100km = settings.defaultFuelConsumptionPer100km || 7.5;
  const equivalentIceFuelCost =
    distanceDrivenKm > 0
      ? (distanceDrivenKm / 100) * fuelConsumption100km * fuelPricePerL
      : 0;
  const totalSavedVsIce = Math.max(0, Number((equivalentIceFuelCost - totalChargingCost).toFixed(2)));

  return {
    totalSessions,
    totalEnergyChargedKwh: Number(totalEnergyChargedKwh.toFixed(1)),
    totalChargingCost: Number(totalChargingCost.toFixed(2)),
    avgPricePerKwh,
    avgConsumptionKwh100km,
    costPerKm,
    costPer100km,
    totalDistanceDrivenKm: Math.round(distanceDrivenKm),
    estimatedBatteryCycles,
    estimatedRangeKm,
    acSessionsCount,
    dcSessionsCount,
    totalExpensesCost: Number(totalExpensesCost.toFixed(2)),
    totalOwnershipCost: Number(totalOwnershipCost.toFixed(2)),
    totalSavedVsIce,
  };
}
