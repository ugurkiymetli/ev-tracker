import { IceComparisonStats } from "@/types";

export interface IceComparisonParams {
  distanceDrivenKm: number;
  evTotalChargingCost: number;
  iceFuelPricePerL: number;
  iceFuelConsumptionPer100km: number;
}

/**
 * Calculates detailed financial comparison between EV and ICE vehicle.
 */
export function calculateIceComparison({
  distanceDrivenKm,
  evTotalChargingCost,
  iceFuelPricePerL,
  iceFuelConsumptionPer100km,
}: IceComparisonParams): IceComparisonStats {
  const safeDistance = Math.max(0, distanceDrivenKm);
  const litersSaved = Number(((safeDistance / 100) * iceFuelConsumptionPer100km).toFixed(1));
  const iceEquivalentFuelCost = Number((litersSaved * iceFuelPricePerL).toFixed(2));
  const lifetimeSavings = Number((iceEquivalentFuelCost - evTotalChargingCost).toFixed(2));

  // CO2 savings estimate: ~2.31 kg CO2 per liter of gasoline
  const co2SavedKg = Math.round(litersSaved * 2.31);

  const costPerKmEv =
    safeDistance > 0 ? Number((evTotalChargingCost / safeDistance).toFixed(4)) : 0;
  const costPerKmIce =
    safeDistance > 0 ? Number((iceEquivalentFuelCost / safeDistance).toFixed(4)) : 0;

  // Monthly savings approximation (assumes ~1200 km per month or distance/months)
  const monthlySavings = Number((lifetimeSavings > 0 ? lifetimeSavings / 12 : 0).toFixed(2));

  return {
    evTotalChargingCost: Number(evTotalChargingCost.toFixed(2)),
    iceEquivalentFuelCost,
    lifetimeSavings,
    monthlySavings,
    costPerKmEv,
    costPerKmIce,
    litersSaved,
    co2SavedKg,
  };
}
