"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ProviderStatPoint } from "@/types";

interface ProviderBreakdownChartProps {
  data: ProviderStatPoint[];
  currencySymbol?: string;
}

export function ProviderBreakdownChart({
  data,
  currencySymbol = "$",
}: ProviderBreakdownChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-sm font-medium">
        No provider breakdown data available.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data.slice(0, 5)}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#a3a3a3", fontSize: 11 }}
            tickFormatter={(val) => `${currencySymbol}${val}`}
          />
          <YAxis
            type="category"
            dataKey="providerName"
            tickLine={false}
            axisLine={false}
            width={120}
            tick={{ fill: "#a3a3a3", fontSize: 11, fontWeight: 600 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as ProviderStatPoint;
                return (
                  <div className="glass-card p-3 rounded-xl shadow-xl text-xs space-y-1 font-sans">
                    <p className="font-bold font-outfit text-neutral-900 dark:text-white uppercase">
                      {item.providerName}
                    </p>
                    <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-300">
                      <span>Total Cost:</span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {currencySymbol}{item.totalCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-300">
                      <span>Sessions Count:</span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {item.sessionsCount} sessions
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 text-neutral-600 dark:text-neutral-300">
                      <span>Avg Price/kWh:</span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {currencySymbol}{item.avgPricePerKwh}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="totalCost"
            fill="currentColor"
            className="fill-neutral-900 dark:fill-neutral-100"
            radius={[0, 6, 6, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
