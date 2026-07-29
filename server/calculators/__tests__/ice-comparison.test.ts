import { describe, it, expect } from "vitest";
import { calculateIceComparison } from "../ice-comparison";

describe("ICE Comparison Calculator", () => {
  it("calculates ICE savings and liters saved accurately", () => {
    // 1000 km driven. Gas car 8.0 L/100km @ $2.00/L = $160 fuel cost. EV charging = $40.
    const result = calculateIceComparison({
      distanceDrivenKm: 1000,
      evTotalChargingCost: 40,
      iceFuelPricePerL: 2.0,
      iceFuelConsumptionPer100km: 8.0,
    });

    expect(result.litersSaved).toBe(80);
    expect(result.iceEquivalentFuelCost).toBe(160);
    expect(result.lifetimeSavings).toBe(120);
    expect(result.costPerKmEv).toBe(0.04);
    expect(result.costPerKmIce).toBe(0.16);
  });
});
