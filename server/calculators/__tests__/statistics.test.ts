import { describe, it, expect } from "vitest";
import {
  calculateAverageConsumption,
  calculateCostPerKm,
  calculateBatteryCycles,
  calculateEstimatedRange,
  calculateMonthlyTrends,
} from "../statistics";
import { ChargingSession } from "@/types";

describe("Statistics Calculator", () => {
  it("calculates average consumption correctly", () => {
    // 50 kWh over 250 km = 20 kWh / 100km
    const result = calculateAverageConsumption(50, 250);
    expect(result).toBe(20);
  });

  it("handles zero distance gracefully", () => {
    expect(calculateAverageConsumption(50, 0)).toBe(0);
  });

  it("calculates cost per km correctly", () => {
    // $25 over 250 km = $0.10 / km
    const result = calculateCostPerKm(25, 250);
    expect(result).toBe(0.1);
  });

  it("calculates battery cycles correctly", () => {
    // 150 kWh charged into 75 kWh battery = 2.0 cycles
    const cycles = calculateBatteryCycles(150, 75);
    expect(cycles).toBe(2.0);
  });

  it("calculates estimated range correctly", () => {
    // 75 kWh battery at 15 kWh/100km = 500 km range
    const range = calculateEstimatedRange(75, 15);
    expect(range).toBe(500);
  });

  it("aggregates monthly trends correctly", () => {
    const mockSessions: Partial<ChargingSession>[] = [
      { date: "2026-01-10", energyChargedKwh: 40, cost: 10, chargingType: "AC" },
      { date: "2026-01-15", energyChargedKwh: 60, cost: 15, chargingType: "DC" },
      { date: "2026-02-01", energyChargedKwh: 50, cost: 12, chargingType: "AC" },
    ];

    const trends = calculateMonthlyTrends(mockSessions as ChargingSession[]);
    expect(trends.length).toBe(2);
    expect(trends[0].month).toBe("2026-01");
    expect(trends[0].energyKwh).toBe(100);
    expect(trends[0].cost).toBe(25);
    expect(trends[1].month).toBe("2026-02");
  });

  it("formats monthly trend month labels according to locale", () => {
    const mockSessions: Partial<ChargingSession>[] = [
      { date: "2026-01-10", energyChargedKwh: 40, cost: 10, chargingType: "AC" },
    ];

    const trTrends = calculateMonthlyTrends(mockSessions as ChargingSession[], "tr-TR");
    expect(trTrends[0].monthLabel).toContain("Oca");
  });
});
