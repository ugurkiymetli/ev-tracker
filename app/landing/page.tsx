"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  TrendingUp,
  Gauge,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  BatteryCharging,
  Cpu,
  Compass,
  Calendar,
  Search,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";
import { MonthlyTrendChart } from "@/components/dashboard/monthly-trend-chart";
import { ProviderBreakdownChart } from "@/components/dashboard/provider-breakdown-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MonthlyTrendPoint, ProviderStatPoint } from "@/types";

interface DemoSession {
  id: string;
  date: string;
  provider: string;
  type: "AC" | "DC";
  energyKwh: number;
  cost: number;
  durationMins: number;
  startBattery: number;
  endBattery: number;
  odometer: number;
  journeyName?: string;
}

const demoMonthlyTrendsEn: MonthlyTrendPoint[] = [
  { month: "2026-01", monthLabel: "Jan 2026", energyKwh: 340, cost: 48, sessionsCount: 7, avgPricePerKwh: 0.14 },
  { month: "2026-02", monthLabel: "Feb 2026", energyKwh: 290, cost: 41, sessionsCount: 6, avgPricePerKwh: 0.14 },
  { month: "2026-03", monthLabel: "Mar 2026", energyKwh: 410, cost: 62, sessionsCount: 9, avgPricePerKwh: 0.15 },
  { month: "2026-04", monthLabel: "Apr 2026", energyKwh: 380, cost: 55, sessionsCount: 8, avgPricePerKwh: 0.14 },
  { month: "2026-05", monthLabel: "May 2026", energyKwh: 450, cost: 68, sessionsCount: 10, avgPricePerKwh: 0.15 },
  { month: "2026-06", monthLabel: "Jun 2026", energyKwh: 490, cost: 74, sessionsCount: 11, avgPricePerKwh: 0.15 },
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
  { providerName: "Tesla Supercharger", totalEnergyKwh: 1250, totalCost: 210, sessionsCount: 24, avgPricePerKwh: 0.17 },
  { providerName: "Home AC Wallbox", totalEnergyKwh: 980, totalCost: 98, sessionsCount: 32, avgPricePerKwh: 0.10 },
  { providerName: "ZES Fast Charger", totalEnergyKwh: 410, totalCost: 82, sessionsCount: 8, avgPricePerKwh: 0.20 },
];

const demoProviderStatsTr: ProviderStatPoint[] = [
  { providerName: "Tesla Supercharger", totalEnergyKwh: 1250, totalCost: 7350, sessionsCount: 24, avgPricePerKwh: 5.88 },
  { providerName: "Ev AC İstasyonu", totalEnergyKwh: 980, totalCost: 3430, sessionsCount: 32, avgPricePerKwh: 3.50 },
  { providerName: "ZES Hızlı Şarj", totalEnergyKwh: 410, totalCost: 2870, sessionsCount: 8, avgPricePerKwh: 7.00 },
];

const demoSessionsEn: DemoSession[] = [
  {
    id: "s1",
    date: "Jun 12, 2026",
    provider: "Tesla Supercharger Susurluk",
    type: "DC",
    energyKwh: 48.5,
    cost: 16.5,
    durationMins: 24,
    startBattery: 18,
    endBattery: 82,
    odometer: 15320,
    journeyName: "Bodrum Summer Holiday 2026",
  },
  {
    id: "s2",
    date: "Jun 13, 2026",
    provider: "Trugo Akhisar Fast Charger",
    type: "DC",
    energyKwh: 42.0,
    cost: 14.7,
    durationMins: 21,
    startBattery: 15,
    endBattery: 78,
    odometer: 15610,
    journeyName: "Bodrum Summer Holiday 2026",
  },
  {
    id: "s3",
    date: "Jun 15, 2026",
    provider: "Bodrum Marina AC Station",
    type: "AC",
    energyKwh: 55.0,
    cost: 8.25,
    durationMins: 300,
    startBattery: 22,
    endBattery: 100,
    odometer: 15980,
    journeyName: "Bodrum Summer Holiday 2026",
  },
  {
    id: "s4",
    date: "Jun 20, 2026",
    provider: "ZES Balıkesir Fast Charger",
    type: "DC",
    energyKwh: 50.0,
    cost: 17.5,
    durationMins: 26,
    startBattery: 12,
    endBattery: 85,
    odometer: 16350,
    journeyName: "Bodrum Summer Holiday 2026",
  },
  {
    id: "s5",
    date: "Jun 24, 2026",
    provider: "Home AC Wallbox",
    type: "AC",
    energyKwh: 38.2,
    cost: 3.82,
    durationMins: 210,
    startBattery: 35,
    endBattery: 90,
    odometer: 16480,
  },
];

const demoSessionsTr: DemoSession[] = [
  {
    id: "s1",
    date: "12 Haz 2026",
    provider: "Tesla Supercharger Susurluk",
    type: "DC",
    energyKwh: 48.5,
    cost: 582.0,
    durationMins: 24,
    startBattery: 18,
    endBattery: 82,
    odometer: 15320,
    journeyName: "Bodrum Yaz Tatili 2026",
  },
  {
    id: "s2",
    date: "13 Haz 2026",
    provider: "Trugo Akhisar Hızlı Şarj",
    type: "DC",
    energyKwh: 42.0,
    cost: 514.5,
    durationMins: 21,
    startBattery: 15,
    endBattery: 78,
    odometer: 15610,
    journeyName: "Bodrum Yaz Tatili 2026",
  },
  {
    id: "s3",
    date: "15 Haz 2026",
    provider: "Bodrum Marina AC Şarj",
    type: "AC",
    energyKwh: 55.0,
    cost: 288.75,
    durationMins: 300,
    startBattery: 22,
    endBattery: 100,
    odometer: 15980,
    journeyName: "Bodrum Yaz Tatili 2026",
  },
  {
    id: "s4",
    date: "20 Haz 2026",
    provider: "ZES Balıkesir Hızlı Şarj",
    type: "DC",
    energyKwh: 50.0,
    cost: 612.5,
    durationMins: 26,
    startBattery: 12,
    endBattery: 85,
    odometer: 16350,
    journeyName: "Bodrum Yaz Tatili 2026",
  },
  {
    id: "s5",
    date: "24 Haz 2026",
    provider: "Ev AC Şarj İstasyonu",
    type: "AC",
    energyKwh: 38.2,
    cost: 133.7,
    durationMins: 210,
    startBattery: 35,
    endBattery: 90,
    odometer: 16480,
  },
];

export default function LandingPage() {
  const { language, t } = useLanguage();

  const [tableSearch, setTableSearch] = useState("");
  const [tableTypeFilter, setTableTypeFilter] = useState<"ALL" | "AC" | "DC">("ALL");
  const [selectedDemoSession, setSelectedDemoSession] = useState<DemoSession | null>(null);

  const sym = language === "tr" ? "₺" : "$";
  const monthlyTrends = language === "tr" ? demoMonthlyTrendsTr : demoMonthlyTrendsEn;
  const providerStats = language === "tr" ? demoProviderStatsTr : demoProviderStatsEn;
  const sessions = language === "tr" ? demoSessionsTr : demoSessionsEn;

  const filteredSessions = sessions.filter((s) => {
    const matchType = tableTypeFilter === "ALL" || s.type === tableTypeFilter;
    const q = tableSearch.toLowerCase();
    const matchSearch =
      !q ||
      s.provider.toLowerCase().includes(q) ||
      (s.journeyName && s.journeyName.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

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

      {/* Demo Interactive Charging Table Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-outfit">
                {t("demoChargingTableTitle")}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {t("demoChargingTableDesc")}
            </p>
          </div>

          {/* Filter controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder={t("filterByStation")}
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400 w-48 sm:w-60"
              />
            </div>
            <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl border border-neutral-200 dark:border-neutral-700/80 text-xs">
              {(["ALL", "AC", "DC"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTableTypeFilter(type)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    tableTypeFilter === type
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {type === "ALL" ? t("filterAll") : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Charging Sessions Table */}
        <div className="glass-card rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-800/30 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider font-outfit">
                  <th className="py-3 px-4">{t("date")}</th>
                  <th className="py-3 px-4">{t("placeholderProviderImport")}</th>
                  <th className="py-3 px-4">{t("fieldType")}</th>
                  <th className="py-3 px-4 text-right">{t("fieldEnergy")}</th>
                  <th className="py-3 px-4 text-right">{t("fieldCost")}</th>
                  <th className="py-3 px-4">{t("batteryGain")}</th>
                  <th className="py-3 px-4 text-center">{t("navJourneys")}</th>
                  <th className="py-3 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                {filteredSessions.map((session) => {
                  const kwSpeed = (session.energyKwh / (session.durationMins / 60)).toFixed(1);
                  return (
                    <tr
                      key={session.id}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                        {session.date}
                      </td>
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                        {session.provider}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            session.type === "DC"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {session.type === "DC" ? (
                            <Zap className="w-2.5 h-2.5 fill-current" />
                          ) : (
                            <BatteryCharging className="w-2.5 h-2.5" />
                          )}
                          <span>{session.type}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                        {session.energyKwh.toFixed(1)} kWh
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                        {sym}
                        {session.cost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-neutral-600 dark:text-neutral-300 font-semibold">
                          {session.startBattery}% → {session.endBattery}%
                        </span>
                        <span className="text-[10px] text-neutral-400 block font-normal">
                          {kwSpeed} kW ({session.durationMins}{t("minsAbbrev")})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {session.journeyName ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 text-[10px] font-bold shadow-xs">
                            <Compass className="w-2.5 h-2.5" />
                            <span>{session.journeyName}</span>
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedDemoSession(session)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        >
                          {t("viewSession")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Demo Interactive Road Trips & Journeys Section */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-outfit">
              {t("demoJourneysTitle")}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {t("demoJourneysDesc")}
          </p>
        </div>

        {/* Demo Journey Card & Timeline Box */}
        <div className="bg-white dark:bg-neutral-900/60 rounded-3xl border border-neutral-200 dark:border-neutral-800/80 shadow-md p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white font-outfit">
                  {language === "tr" ? "Bodrum Yaz Tatili 2026" : "Bodrum Summer Holiday 2026"}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {language === "tr" ? "12 Haz 2026 – 20 Haz 2026" : "Jun 12, 2026 – Jun 20, 2026"}
                  </span>
                </p>
              </div>
            </div>

            {/* Journey Key Metrics */}
            <div className="grid grid-cols-3 gap-4 text-right">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-outfit">
                  {t("distanceKm")}
                </span>
                <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                  1,480 km
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-outfit">
                  {t("chargingStops")}
                </span>
                <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                  4 {t("stops")}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-outfit">
                  {t("totalJourneyCost")}
                </span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {sym}
                  {language === "tr" ? "1,985.25" : "56.95"}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Timeline Visualization */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
              {t("journeyTimeline")}
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
              {/* Departure Node */}
              <div className="relative flex items-center gap-3">
                <div className="absolute -left-6 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">
                    {language === "tr" ? "Yola Çıkış (İstanbul)" : "Departure (Istanbul)"}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    {language === "tr" ? "Başlangıç Km: 15,000 km" : "Start Odometer: 15,000 km"}
                  </p>
                </div>
              </div>

              {/* Stop 1 */}
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="absolute -left-6 top-3.5 w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">
                      Tesla Supercharger Susurluk
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      DC Fast
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {language === "tr" ? "12 Haz 2026 • 24 dk şarj" : "Jun 12, 2026 • 24 min charge"}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">
                    48.5 kWh • {sym}
                    {language === "tr" ? "582.00" : "16.50"}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    18% → 82% (121.3 kW)
                  </p>
                </div>
              </div>

              {/* Stop 2 */}
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="absolute -left-6 top-3.5 w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">
                      Trugo Akhisar
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      DC Fast
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {language === "tr" ? "13 Haz 2026 • 21 dk şarj" : "Jun 13, 2026 • 21 min charge"}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">
                    42.0 kWh • {sym}
                    {language === "tr" ? "514.50" : "14.70"}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    15% → 78% (120.0 kW)
                  </p>
                </div>
              </div>

              {/* Destination Arrival Node */}
              <div className="relative flex items-center gap-3">
                <div className="absolute -left-6 w-5 h-5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                  🏁
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">
                    {language === "tr" ? "Varış (Bodrum Merkez)" : "Arrival (Bodrum Center)"}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    {language === "tr" ? "Bitiş Km: 16,480 km" : "End Odometer: 16,480 km"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight Cards (4 Columns) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="bg-white dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-outfit">
            {t("feature4Title")}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {t("feature4Desc")}
          </p>
        </div>
      </section>

      {/* Demo Session Details Modal Popup */}
      {selectedDemoSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedDemoSession(null)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white font-outfit m-0">
                    {t("sessionOverviewTitle")}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 m-0">
                    {selectedDemoSession.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDemoSession(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-neutral-900 dark:text-white font-outfit">
                  {selectedDemoSession.provider}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    selectedDemoSession.type === "DC"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {selectedDemoSession.type} Fast
                </span>
              </div>

              {/* Battery Gain Progress Bar */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
                    {t("batteryGain")}
                  </span>
                  <span className="font-extrabold text-neutral-900 dark:text-white">
                    +{selectedDemoSession.endBattery - selectedDemoSession.startBattery}% {t("chargedPercentage")}
                  </span>
                </div>
                <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${selectedDemoSession.startBattery}%` }}
                    className="bg-neutral-400/40"
                  />
                  <div
                    style={{
                      width: `${selectedDemoSession.endBattery - selectedDemoSession.startBattery}%`,
                    }}
                    className="bg-emerald-500"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-neutral-500 font-semibold pt-0.5">
                  <span>{selectedDemoSession.startBattery}% Start</span>
                  <span>{selectedDemoSession.endBattery}% End</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/40 dark:border-neutral-800/40 space-y-1">
                  <span className="text-neutral-500 dark:text-neutral-400 block font-medium">
                    {t("fieldEnergy")}
                  </span>
                  <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                    {selectedDemoSession.energyKwh} kWh
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/40 dark:border-neutral-800/40 space-y-1">
                  <span className="text-neutral-500 dark:text-neutral-400 block font-medium">
                    {t("fieldCost")}
                  </span>
                  <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                    {sym}
                    {selectedDemoSession.cost.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/40 dark:border-neutral-800/40 space-y-1">
                  <span className="text-neutral-500 dark:text-neutral-400 block font-medium">
                    {t("duration")}
                  </span>
                  <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                    {selectedDemoSession.durationMins} mins
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/40 dark:border-neutral-800/40 space-y-1">
                  <span className="text-neutral-500 dark:text-neutral-400 block font-medium">
                    {t("avgChargingPower")}
                  </span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {(
                      selectedDemoSession.energyKwh /
                      (selectedDemoSession.durationMins / 60)
                    ).toFixed(1)}{" "}
                    kW
                  </span>
                </div>
              </div>

              {selectedDemoSession.journeyName && (
                <div className="p-3 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    <span>{t("navJourneys")}</span>
                  </div>
                  <span>{selectedDemoSession.journeyName}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedDemoSession(null)}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

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
