"use client";

import Link from "next/link";
import { Zap, TrendingUp, Gauge, ArrowRight, DollarSign, CheckCircle2, BatteryCharging, Cpu } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";
import { MonthlyTrendChart } from "@/components/dashboard/monthly-trend-chart";
import { ProviderBreakdownChart } from "@/components/dashboard/provider-breakdown-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MonthlyTrendPoint, ProviderStatPoint } from "@/types";

const demoMonthlyTrendsEn: MonthlyTrendPoint[] = [
  { month: "2026-01", monthLabel: "Jan 2026", energyKwh: 340, cost: 48, sessionsCount: 7, avgPricePerKwh: 0.141 },
  { month: "2026-02", monthLabel: "Feb 2026", energyKwh: 290, cost: 41, sessionsCount: 6, avgPricePerKwh: 0.141 },
  { month: "2026-03", monthLabel: "Mar 2026", energyKwh: 410, cost: 62, sessionsCount: 9, avgPricePerKwh: 0.151 },
  { month: "2026-04", monthLabel: "Apr 2026", energyKwh: 380, cost: 55, sessionsCount: 8, avgPricePerKwh: 0.144 },
  { month: "2026-05", monthLabel: "May 2026", energyKwh: 450, cost: 68, sessionsCount: 10, avgPricePerKwh: 0.151 },
  { month: "2026-06", monthLabel: "Jun 2026", energyKwh: 490, cost: 74, sessionsCount: 11, avgPricePerKwh: 0.151 },
];

const demoMonthlyTrendsTr: MonthlyTrendPoint[] = [
  { month: "2026-01", monthLabel: "Oca 2026", energyKwh: 340, cost: 1680, sessionsCount: 7, avgPricePerKwh: 4.94 },
  { month: "2026-02", monthLabel: "Şub 2026", energyKwh: 290, cost: 1435, sessionsCount: 6, avgPricePerKwh: 4.94 },
  { month: "2026-03", monthLabel: "Mar 2026", energyKwh: 410, cost: 2170, sessionsCount: 9, avgPricePerKwh: 5.29 },
  { month: "2026-04", monthLabel: "Nis 2026", energyKwh: 380, cost: 1925, sessionsCount: 8, avgPricePerKwh: 5.06 },
  { month: "2026-05", monthLabel: "May 2026", energyKwh: 450, cost: 2380, sessionsCount: 10, avgPricePerKwh: 5.29 },
  { month: "2026-06", monthLabel: "Haz 2026", energyKwh: 490, cost: 2590, sessionsCount: 11, avgPricePerKwh: 5.29 },
];

const demoProviderStatsEn: ProviderStatPoint[] = [
  { providerName: "Tesla Supercharger", totalEnergyKwh: 1250, totalCost: 210, sessionsCount: 24, avgPricePerKwh: 0.168 },
  { providerName: "Home AC Wallbox", totalEnergyKwh: 980, totalCost: 98, sessionsCount: 32, avgPricePerKwh: 0.100 },
  { providerName: "ZES Fast Charger", totalEnergyKwh: 410, totalCost: 82, sessionsCount: 8, avgPricePerKwh: 0.200 },
];

const demoProviderStatsTr: ProviderStatPoint[] = [
  { providerName: "Tesla Supercharger", totalEnergyKwh: 1250, totalCost: 7350, sessionsCount: 24, avgPricePerKwh: 5.88 },
  { providerName: "Ev AC İstasyonu", totalEnergyKwh: 980, totalCost: 3430, sessionsCount: 32, avgPricePerKwh: 3.50 },
  { providerName: "ZES Hızlı Şarj", totalEnergyKwh: 410, totalCost: 2870, sessionsCount: 8, avgPricePerKwh: 7.00 },
];

export default function LandingPage() {
  const { language, t } = useLanguage();

  const sym = language === "tr" ? "₺" : "$";
  const monthlyTrends = language === "tr" ? demoMonthlyTrendsTr : demoMonthlyTrendsEn;
  const providerStats = language === "tr" ? demoProviderStatsTr : demoProviderStatsEn;

  return (
    <div className="space-y-16 animate-fade-in py-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/5 dark:bg-neutral-100/10 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-current text-emerald-500" />
          <span>{t("landingHeroBadge")}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight leading-tight">
          {t("heroTitle")}
        </h1>

        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {t("heroSubtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto py-3.5 px-8 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t("getStartedFree")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/signin"
            className="w-full sm:w-auto py-3.5 px-8 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t("signIn")}</span>
          </Link>
        </div>
      </section>

      {/* Demo KPI Summary Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("liveAnalyticsTeaser")}
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {t("sampleData")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title={t("avgConsumption")}
            value="16.4 kWh"
            subtitle={t("per100km")}
            icon={Gauge}
          />
          <KpiCard
            title={t("costPerKm")}
            value={language === "tr" ? "₺1.40" : "$0.04"}
            subtitle={language === "tr" ? "₺140 / 100 km" : "$4.12 / 100 km"}
            icon={DollarSign}
            badgeText="-14.2% vs gas"
            badgeVariant="emerald"
          />
          <KpiCard
            title={t("iceSavings")}
            value={language === "tr" ? "₺64,575" : "$1,845"}
            subtitle={t("vsGasVehicle")}
            icon={TrendingUp}
            badgeText={language === "tr" ? "+₺6,475 / ay" : "+$185 / mo"}
            badgeVariant="emerald"
          />
          <KpiCard
            title={t("batteryCycles")}
            value="31.8"
            subtitle={language === "tr" ? "457 km tam menzil" : "457 km full range"}
            icon={Cpu}
          />
        </div>
      </section>

      {/* Demo Interactive Charts Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyTrendChart data={monthlyTrends} currencySymbol={sym} />
        </div>
        <div className="lg:col-span-1">
          <ProviderBreakdownChart data={providerStats} />
        </div>
      </section>

      {/* Feature Highlight Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-outfit">
            {t("feature1Title")}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {t("feature1Desc")}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-outfit">
            {t("feature2Title")}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {t("feature2Desc")}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-outfit">
            {t("feature3Title")}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {t("feature3Desc")}
          </p>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-white dark:bg-neutral-900/40 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit">
              {t("ctaBannerTitle")}
            </h3>
            <ul className="text-xs text-neutral-600 dark:text-neutral-300 space-y-2 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t("ctaPoint1")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t("ctaPoint2")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t("ctaPoint3")}</span>
              </li>
            </ul>
          </div>

          <Link
            href="/signup"
            className="py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>{t("startTrackingNow")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
