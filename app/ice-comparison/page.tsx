import { getDashboardData } from "@/server/services/ev-service";
import { updateSettingsAction } from "@/app/actions";
import { TrendingUp, Fuel, Zap, Leaf, CheckCircle2, BarChart2 } from "lucide-react";
import { translations } from "@/lib/i18n/translations";

export const revalidate = 0;

export default async function IceComparisonPage() {
  const { stats, settings, iceComparison } = await getDashboardData();
  const sym = settings.currencySymbol || "$";
  const lang = (settings.language === "tr" ? "tr" : "en") as "en" | "tr";
  const t = (key: keyof typeof translations.en) => translations[lang][key] || translations.en[key];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
          {t("iceTitle")}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {t("iceDesc")}
        </p>
      </div>

      {/* Primary Savings Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <span>{t("netSavings")}</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-outfit">
            {sym}{iceComparison.lifetimeSavings.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500">
            {t("totalFuelSaved")} ({stats.totalDistanceDrivenKm.toLocaleString()} km).
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <span>{t("fuelAvoided")}</span>
            <Fuel className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-white font-outfit">
            {iceComparison.litersSaved.toLocaleString()} {lang === "tr" ? "Litre" : "Liters"}
          </div>
          <p className="text-xs text-neutral-500">
            {t("gasolineSavedBenchmark")} ({settings.defaultFuelConsumptionPer100km} L/100km).
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <span>{t("co2Avoided")}</span>
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-outfit">
            {iceComparison.co2SavedKg.toLocaleString()} kg
          </div>
          <p className="text-xs text-neutral-500">
            {t("emissionsPrevented")}.
          </p>
        </div>
      </div>

      {/* Cost per Km Comparison Visualizer */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <BarChart2 className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
              {t("costPerKmComp")}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 space-y-2 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase">{t("evActualCost")}</span>
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit">
              {sym}{iceComparison.costPerKmEv.toFixed(3)} / km
            </div>
            <p className="text-xs text-neutral-500">
              {sym}{(iceComparison.costPerKmEv * 100).toFixed(2)} / 100 km ({t("actualLogAvg")}).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 space-y-2 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase">{t("iceEqCost")}</span>
              <Fuel className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit">
              {sym}{iceComparison.costPerKmIce.toFixed(3)} / km
            </div>
            <p className="text-xs text-neutral-500">
              {sym}{(iceComparison.costPerKmIce * 100).toFixed(2)} / 100 km ({t("atBenchmark")}).
            </p>
          </div>
        </div>
      </section>

      {/* Adjust Benchmark Parameters Form */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          {t("configBenchmark")}
        </h3>

        <form action={updateSettingsAction} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              {t("fuelPriceLabel")} ({sym} / {t("perLiter")})
            </label>
            <input
              type="number"
              step="0.01"
              name="defaultFuelPricePerL"
              defaultValue={settings.defaultFuelPricePerL}
              required
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              {t("fuelEconomyLabel")}
            </label>
            <input
              type="number"
              step="0.1"
              name="defaultFuelConsumptionPer100km"
              defaultValue={settings.defaultFuelConsumptionPer100km}
              required
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t("updateRecalc")}</span>
          </button>
        </form>
      </section>
    </div>
  );
}
