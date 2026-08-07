"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MonthlyTrendPoint } from "@/types";
import { useLanguage } from "@/components/layout/language-provider";
import { Fuel, Zap } from "lucide-react";

interface MonthlyTrendChartProps {
  data: MonthlyTrendPoint[];
  currencySymbol?: string;
  iceFuelConsumptionPer100km?: number;
}

export function MonthlyTrendChart({
  data,
  currencySymbol = "$",
  iceFuelConsumptionPer100km = 7.5,
}: MonthlyTrendChartProps) {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<"EV" | "ICE">("EV");

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-sm font-medium">
        {t("noChartData")}
      </div>
    );
  }

  // Transform data for ICE fuel consumption mode (FEATURE-010)
  // Approx 18 kWh per 100km for EV, converted to ICE Liters benchmark
  const chartData = data.map((d) => {
    const estDistanceKm = (d.energyKwh / 18) * 100;
    const equivalentIceLiters = Number(((estDistanceKm / 100) * iceFuelConsumptionPer100km).toFixed(1));
    const equivalentIceCost = Number((d.cost * 3.2).toFixed(2));

    const [year, monthStr] = d.month.split("-");
    const date = new Date(parseInt(year), parseInt(monthStr) - 1, 1);
    const locale = language === "tr" ? "tr-TR" : "en-US";
    const localizedMonthLabel = date.toLocaleDateString(locale, { month: "short", year: "numeric" });

    return {
      ...d,
      monthLabel: localizedMonthLabel,
      iceLiters: equivalentIceLiters,
      iceCost: equivalentIceCost,
    };
  });

  return (
    <div className="space-y-4">
      {/* View Mode Toggle (EV vs ICE Comparison) */}
      <div className="flex justify-end">
        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode("EV")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "EV"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t("toggleEvConsumption")}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("ICE")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "ICE"
                ? "bg-amber-500 text-neutral-950 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>{t("toggleIceConsumption")}</span>
          </button>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" vertical={false} />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              yAxisId="cost"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 11 }}
              tickFormatter={(val) => `${currencySymbol}${val}`}
            />
            <YAxis
              yAxisId="volume"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 11 }}
              tickFormatter={(val) => (viewMode === "EV" ? `${val}kWh` : `${val}L`)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="glass-card p-3 rounded-xl shadow-xl text-xs space-y-1 font-sans">
                      <p className="font-bold font-outfit text-neutral-900 dark:text-white uppercase tracking-wider">
                        {item.monthLabel} ({viewMode === "EV" ? "EV" : t("tooltipIceEquivalent")})
                      </p>
                      {viewMode === "EV" ? (
                        <>
                          <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-300">
                            <span>{t("totalCostLabel")}</span>
                            <span className="font-bold text-neutral-900 dark:text-white">
                              {currencySymbol}{item.cost.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-300">
                            <span>{t("energyChargedLabel")}</span>
                            <span className="font-bold text-neutral-900 dark:text-white">
                              {item.energyKwh} kWh
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-300">
                            <span>{t("tooltipEstFuelCost")}</span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              {currencySymbol}{item.iceCost.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-300">
                            <span>{t("tooltipFuelConsumption")}</span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              {item.iceLiters} {t("tooltipLiters")}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              yAxisId="cost"
              dataKey={viewMode === "EV" ? "cost" : "iceCost"}
              name={viewMode === "EV" ? "EV Cost" : "Est. ICE Fuel Cost"}
              fill="currentColor"
              className={viewMode === "EV" ? "fill-neutral-900 dark:fill-neutral-100" : "fill-amber-500/80"}
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            <Line
              yAxisId="volume"
              type="monotone"
              dataKey={viewMode === "EV" ? "energyKwh" : "iceLiters"}
              name={viewMode === "EV" ? "Energy (kWh)" : "Equivalent Fuel (L)"}
              stroke={viewMode === "EV" ? "#10b981" : "#f59e0b"}
              strokeWidth={3}
              dot={{ r: 4, fill: viewMode === "EV" ? "#10b981" : "#f59e0b" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
