"use client";

import { useState } from "react";
import { ArrowLeftRight, Zap } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";

interface AcDcRatioCardProps {
  acSessionsCount: number;
  dcSessionsCount: number;
  acEnergyChargedKwh: number;
  dcEnergyChargedKwh: number;
  totalSessions: number;
}

export function AcDcRatioCard({
  acSessionsCount,
  dcSessionsCount,
  acEnergyChargedKwh,
  dcEnergyChargedKwh,
  totalSessions,
}: AcDcRatioCardProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"sessions" | "kwh">("sessions");

  const toggleMode = () => {
    setViewMode((prev) => (prev === "sessions" ? "kwh" : "sessions"));
  };

  const totalEnergy = acEnergyChargedKwh + dcEnergyChargedKwh;

  // Compute percentages & widths based on active view mode
  let acPct = 0;
  let dcPct = 0;
  let acWidth = 50;
  let dcWidth = 50;

  if (viewMode === "sessions") {
    if (totalSessions > 0) {
      acPct = Math.round((acSessionsCount / totalSessions) * 100);
      dcPct = 100 - acPct;
      acWidth = (acSessionsCount / totalSessions) * 100;
      dcWidth = (dcSessionsCount / totalSessions) * 100;
    }
  } else {
    if (totalEnergy > 0) {
      acPct = Math.round((acEnergyChargedKwh / totalEnergy) * 100);
      dcPct = 100 - acPct;
      acWidth = (acEnergyChargedKwh / totalEnergy) * 100;
      dcWidth = (dcEnergyChargedKwh / totalEnergy) * 100;
    }
  }

  const hasData = viewMode === "sessions" ? totalSessions > 0 : totalEnergy > 0;

  return (
    <div className="bg-white dark:bg-neutral-900/40 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-outfit">
          {t("acDcRatio")}
        </h4>
        <button
          type="button"
          onClick={toggleMode}
          title={t("toggleViewHint")}
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase font-outfit bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
        >
          <ArrowLeftRight className="w-3 h-3 text-neutral-500" />
          <span>{viewMode === "sessions" ? t("acSessions").split(" ")[1] || "Sessions" : "kWh"}</span>
        </button>
      </div>

      {/* Metrics Row (Clickable) */}
      <div className="flex items-center justify-between">
        {/* AC Metric */}
        <button
          type="button"
          onClick={toggleMode}
          title={t("toggleViewHint")}
          className="text-left group/ac transition-all hover:opacity-85 active:scale-[0.98] focus:outline-none cursor-pointer"
        >
          <div className="text-sm font-semibold">
            {viewMode === "sessions" ? (
              <>
                <span className="text-neutral-900 dark:text-white font-extrabold text-lg">
                  {acSessionsCount}
                </span>{" "}
                <span className="text-neutral-600 dark:text-neutral-400 group-hover/ac:text-neutral-900 dark:group-hover/ac:text-white transition-colors underline decoration-dotted decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4">
                  {t("acSessions")}
                </span>
              </>
            ) : (
              <>
                <span className="text-neutral-900 dark:text-white font-extrabold text-lg">
                  {acEnergyChargedKwh.toLocaleString()}
                </span>{" "}
                <span className="text-neutral-600 dark:text-neutral-400 group-hover/ac:text-neutral-900 dark:group-hover/ac:text-white transition-colors underline decoration-dotted decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4">
                  kWh ({t("acEnergy")})
                </span>
              </>
            )}
          </div>
        </button>

        {/* DC Metric */}
        <button
          type="button"
          onClick={toggleMode}
          title={t("toggleViewHint")}
          className="text-right group/dc transition-all hover:opacity-85 active:scale-[0.98] focus:outline-none cursor-pointer"
        >
          <div className="text-sm font-semibold">
            {viewMode === "sessions" ? (
              <>
                <span className="text-neutral-900 dark:text-white font-extrabold text-lg">
                  {dcSessionsCount}
                </span>{" "}
                <span className="text-neutral-600 dark:text-neutral-400 group-hover/dc:text-neutral-900 dark:group-hover/dc:text-white transition-colors underline decoration-dotted decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4">
                  {t("dcSessions")}
                </span>
              </>
            ) : (
              <>
                <span className="text-neutral-900 dark:text-white font-extrabold text-lg">
                  {dcEnergyChargedKwh.toLocaleString()}
                </span>{" "}
                <span className="text-neutral-600 dark:text-neutral-400 group-hover/dc:text-neutral-900 dark:group-hover/dc:text-white transition-colors underline decoration-dotted decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4">
                  kWh ({t("dcEnergy")})
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Progress Bars with Percentage Inside */}
      <div
        onClick={toggleMode}
        title={t("toggleViewHint")}
        className="w-full bg-neutral-200 dark:bg-neutral-800 h-6 rounded-full overflow-hidden flex cursor-pointer select-none"
      >
        <div
          className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 h-full transition-all duration-500 flex items-center justify-center font-outfit text-xs font-bold overflow-hidden"
          style={{ width: `${hasData ? acWidth : 50}%` }}
        >
          {hasData && acWidth >= 14 && (
            <span className="animate-fade-in tracking-tight">{acPct}%</span>
          )}
        </div>
        <div
          className="bg-amber-500 text-neutral-950 h-full transition-all duration-500 flex items-center justify-center font-outfit text-xs font-bold overflow-hidden"
          style={{ width: `${hasData ? dcWidth : 50}%` }}
        >
          {hasData && dcWidth >= 14 && (
            <span className="animate-fade-in tracking-tight">{dcPct}%</span>
          )}
        </div>
      </div>

      {/* Bottom Labels */}
      <div className="flex justify-between text-[10px] text-neutral-500 font-semibold uppercase">
        <span>{t("level2Home")}</span>
        <span>{t("fastChargers")}</span>
      </div>
    </div>
  );
}
