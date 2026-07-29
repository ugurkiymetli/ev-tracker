import { getDashboardData } from "@/server/services/ev-service";
import { updateSettingsAction } from "@/app/actions";
import { TrendingUp, Fuel, Zap, Leaf, DollarSign, RefreshCw, BarChart2 } from "lucide-react";

export const revalidate = 0;

export default async function IceComparisonPage() {
  const { stats, settings, iceComparison } = await getDashboardData();
  const sym = settings.currencySymbol || "$";

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
          ICE vs EV Savings Analysis
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Financial comparison between your electric vehicle and an equivalent internal combustion engine (ICE) car.
        </p>
      </div>

      {/* Primary Savings Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <span>Net Lifetime Savings</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-outfit">
            {sym}{iceComparison.lifetimeSavings.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500">
            Total fuel savings over {stats.totalDistanceDrivenKm.toLocaleString()} km driven.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <span>Fuel Avoided</span>
            <Fuel className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-white font-outfit">
            {iceComparison.litersSaved.toLocaleString()} Liters
          </div>
          <p className="text-xs text-neutral-500">
            Gasoline saved based on {settings.defaultFuelConsumptionPer100km} L/100km benchmark.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <span>CO2 Avoided</span>
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-outfit">
            {iceComparison.co2SavedKg.toLocaleString()} kg
          </div>
          <p className="text-xs text-neutral-500">
            Direct tailpipe emissions prevented from burning fuel.
          </p>
        </div>
      </div>

      {/* Cost per Km Comparison Visualizer */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <BarChart2 className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
              Per-Kilometer Cost Comparison
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 space-y-2 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase">EV Actual Cost</span>
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit">
              {sym}{iceComparison.costPerKmEv.toFixed(3)} / km
            </div>
            <p className="text-xs text-neutral-500">
              {sym}{(iceComparison.costPerKmEv * 100).toFixed(2)} per 100 km (actual charging log average).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 space-y-2 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase">ICE Equivalent Cost</span>
              <Fuel className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit">
              {sym}{iceComparison.costPerKmIce.toFixed(3)} / km
            </div>
            <p className="text-xs text-neutral-500">
              {sym}{(iceComparison.costPerKmIce * 100).toFixed(2)} per 100 km (at {sym}{settings.defaultFuelPricePerL}/L & {settings.defaultFuelConsumptionPer100km} L/100km).
            </p>
          </div>
        </div>
      </section>

      {/* Adjust Benchmark Parameters Form */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          Configure Gasoline Benchmark Parameters
        </h3>

        <form action={updateSettingsAction} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              Fuel Price ({sym} / Liter)
            </label>
            <input
              type="number"
              step="0.01"
              name="defaultFuelPricePerL"
              defaultValue={settings.defaultFuelPricePerL}
              required
              className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              ICE Fuel Economy (L / 100 km)
            </label>
            <input
              type="number"
              step="0.1"
              name="defaultFuelConsumptionPer100km"
              defaultValue={settings.defaultFuelConsumptionPer100km}
              required
              className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Update & Recalculate</span>
          </button>
        </form>
      </section>
    </div>
  );
}
