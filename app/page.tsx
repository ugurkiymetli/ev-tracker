import Link from "next/link";
import { getDashboardData } from "@/server/services/ev-service";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MonthlyTrendChart } from "@/components/dashboard/monthly-trend-chart";
import { ProviderBreakdownChart } from "@/components/dashboard/provider-breakdown-chart";
import { AcDcRatioCard } from "@/components/dashboard/ac-dc-ratio-card";
import { seedDemoDataAction } from "@/app/actions";
import { translations } from "@/lib/i18n/translations";
import {
  Zap,
  Gauge,
  TrendingUp,
  BatteryCharging,
  DollarSign,
  Compass,
  ArrowRight,
  Cpu,
} from "lucide-react";

import { cookies } from "next/headers";
import LandingPage from "./landing/page";

export const revalidate = 0;

export default async function MainPage() {
  const { user, vehicle, settings, stats, monthlyTrends, providerStats, sessions, allProviders = [], userTopProviderIds = [] } =
    await getDashboardData();

  if (!user) {
    return <LandingPage />;
  }

  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("ev_tracker_lang")?.value;
  const lang = (cookieLang === "tr" || cookieLang === "en")
    ? (cookieLang as "en" | "tr")
    : (settings.language === "tr" ? "tr" : "en");

  const sym = settings.currencySymbol || "$";
  const t = (key: keyof typeof translations.en) => translations[lang][key] || translations.en[key];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 font-outfit uppercase">
              {t("activeVehicle")}
            </span>
            <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight m-0">
              {vehicle.name}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {vehicle.year} {vehicle.make} {vehicle.model} • {vehicle.batteryCapacityKwh} kWh Pack •{" "}
            {vehicle.currentOdometerKm.toLocaleString()} km Odometer
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          {sessions.length === 0 && (
            <form action={seedDemoDataAction} className="w-full sm:w-auto">
              <button
                type="submit"
                className="w-full sm:w-auto py-2 px-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-semibold text-xs transition-all active:scale-[0.99] border border-neutral-200 dark:border-neutral-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{t("seedDemoData")}</span>
              </button>
            </form>
          )}

          {/* Inverted Monotone Theme Button: Dark mode = White button with Black Zap badge; Light mode = Black button with White Zap badge */}
          <Link
            href="/charging?log=true"
            className="group/btn w-full sm:w-auto py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 rounded-xl font-bold text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-neutral-800 dark:border-white shadow-md hover:shadow-lg"
          >
            {/* Inverted Clean Zap Icon Badge: White in light mode, Black in dark mode */}
            <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-white dark:bg-black shadow-sm border border-neutral-200/60 dark:border-neutral-800">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400 group-hover/btn:scale-110 transition-transform" />
            </span>

            {/* Button Label */}
            <span className="tracking-tight font-extrabold">{t("logSession")}</span>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t("avgConsumption")}
          value={`${stats.avgConsumptionKwh100km} kWh`}
          subtitle={t("per100km")}
          icon={Gauge}
          badgeText={t("efficiency")}
          badgeVariant="emerald"
        />

        <KpiCard
          title={t("costPerKm")}
          value={`${sym}${stats.costPerKm.toFixed(3)}`}
          subtitle={`${sym}${stats.costPer100km} ${t("per100kmValue")}`}
          icon={DollarSign}
          badgeText={t("economy")}
          badgeVariant="neutral"
        />

        <KpiCard
          title={t("iceSavings")}
          value={`${sym}${stats.totalSavedVsIce.toLocaleString()}`}
          subtitle={t("vsGasVehicle")}
          icon={TrendingUp}
          badgeText={t("netSaved")}
          badgeVariant="emerald"
        />

        <KpiCard
          title={t("batteryCycles")}
          value={`${stats.estimatedBatteryCycles}`}
          subtitle={`~${stats.estimatedRangeKm} km ${t("fullRange")}`}
          icon={BatteryCharging}
          badgeText={t("utilization")}
          badgeVariant="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <section className="lg:col-span-2 bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800/80">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
                {t("monthlyTrends")}
              </h3>
            </div>
            <span className="text-xs text-neutral-500 font-medium">{t("costVsKwh")}</span>
          </div>

          <MonthlyTrendChart data={monthlyTrends} currencySymbol={sym} />
        </section>

        {/* Provider Breakdown */}
        <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800/80">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
                {t("chargingNetworks")}
              </h3>
            </div>
            <span className="text-xs text-neutral-500 font-medium">{t("topProviders")}</span>
          </div>

          <ProviderBreakdownChart data={providerStats} currencySymbol={sym} />
        </section>
      </div>

      {/* Additional Stats & Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AC vs DC Distribution */}
        <AcDcRatioCard
          acSessionsCount={stats.acSessionsCount}
          dcSessionsCount={stats.dcSessionsCount}
          acEnergyChargedKwh={stats.acEnergyChargedKwh}
          dcEnergyChargedKwh={stats.dcEnergyChargedKwh}
          totalSessions={stats.totalSessions}
        />

        {/* Total Cost of Ownership */}
        <div className="bg-white dark:bg-neutral-900/40 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-outfit">
            {t("totalCostOwnership")}
          </h4>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit">
            {sym}{stats.totalOwnershipCost.toLocaleString()}
          </div>
          <div className="text-xs text-neutral-500 space-y-1">
            <div className="flex justify-between">
              <span>{t("chargingCost")}:</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {sym}{stats.totalChargingCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("expensesCost")}:</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {sym}{stats.totalExpensesCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Session Teaser */}
        <div className="bg-white dark:bg-neutral-900/40 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-outfit">
              {t("logStatus")}
            </h4>
            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit mt-1">
              {stats.totalSessions} {t("sessionsCount")}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {t("totalChargedSummary")} ({stats.totalEnergyChargedKwh.toLocaleString()} kWh / {stats.totalDistanceDrivenKm.toLocaleString()} km).
            </p>
          </div>

          <Link
            href="/charging"
            className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 hover:underline pt-2 border-t border-neutral-100 dark:border-neutral-800"
          >
            <span>{t("viewFullHistory")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
