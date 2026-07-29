"use client";

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

interface MonthlyTrendChartProps {
  data: MonthlyTrendPoint[];
  currencySymbol?: string;
}

export function MonthlyTrendChart({ data, currencySymbol = "$" }: MonthlyTrendChartProps) {
  const { t } = useLanguage();

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-sm font-medium">
        {t("noChartData")}
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            yAxisId="energy"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#a3a3a3", fontSize: 11 }}
            tickFormatter={(val) => `${val}kWh`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as MonthlyTrendPoint;
                return (
                  <div className="glass-card p-3 rounded-xl shadow-xl text-xs space-y-1 font-sans">
                    <p className="font-bold font-outfit text-neutral-900 dark:text-white uppercase tracking-wider">
                      {item.monthLabel}
                    </p>
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
                    <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-300">
                      <span>{t("avgPriceLabel")}</span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {currencySymbol}{item.avgPricePerKwh}/kWh
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            yAxisId="cost"
            dataKey="cost"
            name="Cost"
            fill="currentColor"
            className="fill-neutral-900 dark:fill-neutral-100"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
          <Line
            yAxisId="energy"
            type="monotone"
            dataKey="energyKwh"
            name="Energy (kWh)"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: "#10b981" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
