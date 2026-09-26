"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Compass,
  X,
  Calendar,
  Gauge,
  Zap,
  Clock,
  BatteryCharging,
  MapPin,
  Trash2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { deleteJourneyAction } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";
import { useToast } from "@/components/ui/toast";
import { Journey, ChargingSession } from "@/types";
import { JourneyDialog } from "./journey-dialog";

interface JourneyDetailsModalProps {
  journey: Journey;
  availableSessions?: ChargingSession[];
  currencySymbol: string;
}

export function JourneyDetailsModal({
  journey,
  availableSessions = [],
  currencySymbol,
}: JourneyDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { t, language } = useLanguage();
  const lang = language;
  const { toast } = useToast();

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

  // Date formatting
  const formatDateStr = (dateVal: Date | string) => {
    const d = new Date(dateVal);
    return d.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const startFormatted = formatDateStr(journey.startDate);
  const endFormatted = formatDateStr(journey.endDate);

  // Attached sessions list
  const sessions = journey.chargingSessions || [];
  const totalCost = sessions.reduce((acc, s) => acc + s.cost, 0);
  const totalEnergy = sessions.reduce((acc, s) => acc + s.energyChargedKwh, 0);
  const totalDurationMins = sessions.reduce(
    (acc, s) => acc + (s.durationMinutes || 0),
    0
  );

  const distanceKm = journey.distanceKm || 0;

  // Key metrics
  const costPer100km =
    distanceKm > 0 ? ((totalCost / distanceKm) * 100).toFixed(2) : null;

  const avgConsumption =
    distanceKm > 0 ? ((totalEnergy / distanceKm) * 100).toFixed(1) : null;

  const avgPowerKw =
    totalDurationMins > 0
      ? (totalEnergy / (totalDurationMins / 60)).toFixed(1)
      : null;

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (lang === "tr") {
      if (mins < 60) return `${mins} dk`;
      if (m === 0) return `${h} saat`;
      return `${h} saat ${m} dk`;
    }
    if (mins < 60) return `${mins} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDeleteJourney"))) return;
    setLoadingDelete(true);
    try {
      await deleteJourneyAction(journey.id);
      toast({
        title: t("journeyDeletedTitle"),
        description: t("journeyDeletedDesc"),
        variant: "info",
      });
      setOpen(false);
    } catch (err: any) {
      toast({
        title: t("errorTitle"),
        description: err.message || t("errDeleteJourney"),
        variant: "error",
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
      >
        <span>{t("viewJourneyDetails")}</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-md">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white font-outfit">
                      {journey.name}
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>
                        {startFormatted} – {endFormatted}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <JourneyDialog
                    journey={journey}
                    availableSessions={availableSessions}
                    currencySymbol={currencySymbol}
                  />
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loadingDelete}
                    title={t("deleteJourney")}
                    className="p-2 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Key Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Distance */}
                  <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs font-bold font-outfit uppercase">
                      <Gauge className="w-3.5 h-3.5" />
                      <span>{t("distanceKm")}</span>
                    </div>
                    <p className="text-lg font-extrabold text-neutral-900 dark:text-white mt-1">
                      {distanceKm > 0 ? `${distanceKm} km` : "—"}
                    </p>
                  </div>

                  {/* Total Cost */}
                  <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs font-bold font-outfit uppercase">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t("totalJourneyCost")}</span>
                    </div>
                    <p className="text-lg font-extrabold text-neutral-900 dark:text-white mt-1">
                      {currencySymbol}
                      {totalCost.toFixed(2)}
                    </p>
                  </div>

                  {/* Total Energy */}
                  <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs font-bold font-outfit uppercase">
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{t("totalEnergyCharged")}</span>
                    </div>
                    <p className="text-lg font-extrabold text-neutral-900 dark:text-white mt-1">
                      {totalEnergy.toFixed(1)} kWh
                    </p>
                  </div>

                  {/* Cost per 100km */}
                  <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs font-bold font-outfit uppercase">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      <span>{t("avgCostPer100km")}</span>
                    </div>
                    <p className="text-lg font-extrabold text-neutral-900 dark:text-white mt-1">
                      {costPer100km
                        ? `${currencySymbol}${costPer100km}`
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-900 text-white dark:bg-neutral-800 border border-neutral-800 dark:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10 text-white">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider font-outfit">
                        {t("fieldDuration")}
                      </p>
                      <p className="text-sm font-extrabold">
                        {totalDurationMins > 0
                          ? formatDuration(totalDurationMins)
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10 text-white">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider font-outfit">
                        {t("avgConsumption")}
                      </p>
                      <p className="text-sm font-extrabold">
                        {avgConsumption ? `${avgConsumption} kWh/100km` : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Journey Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-outfit flex items-center gap-2">
                      <Compass className="w-4 h-4 text-neutral-400" />
                      <span>{t("journeyTimeline")}</span>
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {sessions.length} {t("chargingStops")}
                    </span>
                  </div>

                  {sessions.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-dashed border-neutral-300 dark:border-neutral-700 text-center space-y-2">
                      <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                        {t("noSessionsAttached")}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {t("selectSessionsForJourney")}
                      </p>
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
                      {/* Journey Start Node */}
                      <div className="relative flex items-start gap-3">
                        <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                          🚀
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-white font-outfit">
                            {t("startDate")}
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                            {startFormatted}{" "}
                            {journey.startOdometerKm &&
                              `• ${journey.startOdometerKm} km`}
                          </p>
                        </div>
                      </div>

                      {/* Charging Stops */}
                      {sessions.map((session, index) => {
                        const sDate = new Date(session.date).toLocaleDateString(
                          lang === "tr" ? "tr-TR" : "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        );
                        const isDc = session.chargingType === "DC";
                        const providerName =
                          session.provider?.name ||
                          session.location ||
                          `Stop #${index + 1}`;

                        return (
                          <div
                            key={session.id}
                            className="relative p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-2"
                          >
                            {/* Node indicator */}
                            <div
                              className={`absolute -left-6 top-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                                isDc
                                  ? "bg-amber-500 text-neutral-950"
                                  : "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950"
                              }`}
                            >
                              ⚡
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-neutral-900 dark:text-white">
                                  {providerName}
                                </span>
                                <span
                                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                    isDc
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                  }`}
                                >
                                  {session.chargingType}
                                </span>
                              </div>

                              <p className="font-extrabold text-sm text-neutral-900 dark:text-white">
                                {currencySymbol}
                                {session.cost.toFixed(2)}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-neutral-600 dark:text-neutral-300 pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                              <div>
                                <span className="text-[10px] uppercase text-neutral-400 font-bold block">
                                  {t("tableEnergy")}
                                </span>
                                <span className="font-bold">
                                  {session.energyChargedKwh} kWh
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] uppercase text-neutral-400 font-bold block">
                                  {t("tablePricePerKwh")}
                                </span>
                                <span className="font-bold">
                                  {currencySymbol}
                                  {session.pricePerKwh.toFixed(2)}/kWh
                                </span>
                              </div>

                              {session.durationMinutes ? (
                                <div>
                                  <span className="text-[10px] uppercase text-neutral-400 font-bold block">
                                    {t("fieldDuration")}
                                  </span>
                                  <span className="font-bold">
                                    {formatDuration(session.durationMinutes)}
                                  </span>
                                </div>
                              ) : null}

                              {session.startBatteryPct !== undefined &&
                              session.startBatteryPct !== null &&
                              session.endBatteryPct !== undefined &&
                              session.endBatteryPct !== null ? (
                                <div>
                                  <span className="text-[10px] uppercase text-neutral-400 font-bold block">
                                    {t("chargedPercentage")}
                                  </span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    {session.startBatteryPct}% →{" "}
                                    {session.endBatteryPct}%
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                              <span>{sDate}</span>
                              {session.odometerKm && (
                                <span>{session.odometerKm} km</span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Journey Arrival Node */}
                      <div className="relative flex items-start gap-3 pt-2">
                        <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                          🏁
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-white font-outfit">
                            {t("endDate")}
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                            {endFormatted}{" "}
                            {journey.endOdometerKm &&
                              `• ${journey.endOdometerKm} km`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
