"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Eye, X, BatteryCharging, Zap, Clock, Gauge, MapPin, Calendar, FileText } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";
import { ChargingSession } from "@/types";

interface ChargingSessionDetailsModalProps {
  session: ChargingSession;
  currencySymbol: string;
  lang: "en" | "tr";
}

export function ChargingSessionDetailsModal({
  session,
  currencySymbol,
  lang,
}: ChargingSessionDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isDc = session.chargingType === "DC";
  const dateObj = new Date(session.date);
  const formattedDate = dateObj.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasBatteryData =
    typeof session.startBatteryPct === "number" &&
    typeof session.endBatteryPct === "number";

  const batteryGain = hasBatteryData
    ? session.endBatteryPct! - session.startBatteryPct!
    : 0;

  const durationMinutes = session.durationMinutes;
  const avgSpeedKw =
    durationMinutes && durationMinutes > 0
      ? (session.energyChargedKwh / (durationMinutes / 60)).toFixed(1)
      : null;

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={t("viewSession")}
        className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
      >
        <Eye className="w-4 h-4" />
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity font-sans overscroll-contain"
            aria-labelledby="overview-title"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative w-full max-w-lg overflow-hidden text-left bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-5 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        isDc
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {isDc ? <Zap className="w-3 h-3 fill-current" /> : <BatteryCharging className="w-3 h-3" />}
                      {session.chargingType}
                    </span>
                    <h3
                      id="overview-title"
                      className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0"
                    >
                      {session.provider?.name || session.location || "Standard Charge"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Visual Battery Gain Banner (if start & end percentages exist) */}
              {hasBatteryData && (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 font-outfit">
                    <span className="uppercase">{t("batteryGain")}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold">
                      +{batteryGain}% {t("chargedPercentage")}
                    </span>
                  </div>

                  {/* Battery Bar Visualization */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {session.startBatteryPct}%
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        → {session.endBatteryPct}%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden flex relative">
                      <div
                        style={{ width: `${session.startBatteryPct}%` }}
                        className="h-full bg-neutral-400 dark:bg-neutral-500"
                        title={`Start: ${session.startBatteryPct}%`}
                      ></div>
                      <div
                        style={{ width: `${Math.max(0, batteryGain)}%` }}
                        className="h-full bg-emerald-500 animate-pulse"
                        title={`Gain: +${batteryGain}%`}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Duration & Avg Power Gauge Cards (if duration exists) */}
              {durationMinutes && durationMinutes > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{t("duration")}</span>
                    </div>
                    <div className="text-base font-extrabold text-neutral-900 dark:text-white font-outfit">
                      {formatDuration(durationMinutes)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                      <Gauge className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{t("avgChargingPower")}</span>
                    </div>
                    <div className="text-base font-extrabold text-neutral-900 dark:text-white font-outfit">
                      {avgSpeedKw ? `${avgSpeedKw} kW` : "—"}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Core Charging Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800/80">
                  <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-0.5">
                    {t("tableEnergy")}
                  </div>
                  <div className="text-sm font-extrabold text-neutral-900 dark:text-white font-outfit">
                    {session.energyChargedKwh.toFixed(1)} kWh
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800/80">
                  <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-0.5">
                    {t("tableCost")}
                  </div>
                  <div className="text-sm font-extrabold text-neutral-900 dark:text-white font-outfit">
                    {currencySymbol}
                    {session.cost.toFixed(2)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800/80">
                  <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-0.5">
                    {t("tablePricePerKwh")}
                  </div>
                  <div className="text-sm font-extrabold text-neutral-900 dark:text-white font-outfit">
                    {currencySymbol}
                    {session.pricePerKwh.toFixed(2)}
                  </div>
                </div>

                {session.odometerKm && (
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800/80 col-span-2 sm:col-span-3">
                    <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider mb-0.5">
                      {t("tableOdometer")}
                    </div>
                    <div className="text-sm font-extrabold text-neutral-900 dark:text-white font-outfit">
                      {session.odometerKm.toLocaleString()} km
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Location & Notes */}
              {(session.location || session.notes) && (
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                  {session.location && (
                    <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span>{session.location}</span>
                    </div>
                  )}
                  {session.notes && (
                    <div className="flex items-start gap-1.5 text-neutral-600 dark:text-neutral-400 font-normal">
                      <FileText className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
                      <span>{session.notes}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
