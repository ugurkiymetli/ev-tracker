"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  Calendar,
  Gauge,
  Zap,
  Clock,
  BatteryCharging,
  MapPin,
  Trash2,
  ChevronRight,
  TrendingUp,
  Car,
  Share2,
} from "lucide-react";
import { deleteJourneyAction } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";
import { useToast } from "@/components/ui/toast";
import { Journey, ChargingSession } from "@/types";
import { formatDurationText } from "@/lib/utils";
import { JourneyDialog } from "./journey-dialog";

interface JourneyDetailViewProps {
  journey: Journey;
  availableSessions?: ChargingSession[];
  currencySymbol: string;
}

export function JourneyDetailView({
  journey,
  availableSessions = [],
  currencySymbol = "$",
}: JourneyDetailViewProps) {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { t, language } = useLanguage();
  const lang = language;
  const { toast } = useToast();
  const router = useRouter();

  // Date formatting
  const formatDateStr = (dateVal: Date | string) => {
    const d = new Date(dateVal);
    return d.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const startFormatted = formatDateStr(journey.startDate);
  const endFormatted = formatDateStr(journey.endDate);

  const sessions = journey.chargingSessions || [];

  // Statistics math
  const totalCost = sessions.reduce((acc, s) => acc + s.cost, 0);
  const totalEnergyChargedKwh = sessions.reduce((acc, s) => acc + s.energyChargedKwh, 0);

  let dcDurationMins = 0;
  let acDurationMins = 0;
  sessions.forEach((s) => {
    const dur = s.durationMinutes || 0;
    if (s.chargingType === "DC") {
      dcDurationMins += dur;
    } else {
      acDurationMins += dur;
    }
  });

  const totalDurationMins = dcDurationMins + acDurationMins;

  const batCapacity = journey.vehicle?.batteryCapacityKwh || 75.0;
  let netEnergyConsumedKwh = totalEnergyChargedKwh;
  let batteryDeltaKwh = 0;

  if (
    journey.startBatteryPct !== undefined &&
    journey.startBatteryPct !== null &&
    journey.endBatteryPct !== undefined &&
    journey.endBatteryPct !== null
  ) {
    const pctDiff = journey.startBatteryPct - journey.endBatteryPct;
    batteryDeltaKwh = (pctDiff / 100) * batCapacity;
    netEnergyConsumedKwh = totalEnergyChargedKwh + batteryDeltaKwh;
  }

  let avgConsumptionKwh100km: number | null = null;
  let avgCostPer100km: number | null = null;
  if (journey.distanceKm && journey.distanceKm > 0) {
    avgConsumptionKwh100km = (netEnergyConsumedKwh / journey.distanceKm) * 100;
    avgCostPer100km = (totalCost / journey.distanceKm) * 100;
  }

  const handleDelete = async () => {
    if (!confirm(t("confirmDeleteJourney"))) {
      return;
    }
    setLoadingDelete(true);
    try {
      await deleteJourneyAction(journey.id);
      toast({
        title: t("journeyDeletedTitle"),
        description: t("journeyDeletedDesc"),
        variant: "success",
      });
      router.push("/journeys");
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

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/journey/${journey.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: t("shareJourney"),
        description: t("linkCopied"),
        variant: "success",
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      {/* Back Button Nav & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="space-y-1">
          <Link
            href="/journeys"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t("navJourneys") || "Back to Journeys"}</span>
          </Link>
          <div className="flex items-center gap-2.5 pt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
              {journey.name}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            title={t("shareJourney")}
            className="px-3.5 py-2 text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>{t("shareJourney")}</span>
          </button>

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
        </div>
      </div>

      {/* Journey Header Card */}
      <div className="p-6 rounded-3xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            {journey.vehicle && (
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-semibold flex items-center gap-1.5">
                <Car className="w-4 h-4 text-neutral-400" />
                <span>
                  {journey.vehicle.make} {journey.vehicle.model} ({journey.vehicle.batteryCapacityKwh} kWh)
                </span>
              </p>
            )}

            {(journey.startLocation || journey.endLocation) && (
              <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>
                  {journey.startLocation || t("unspecified")} {journey.isRoundTrip ? "⇄" : "➔"} {journey.endLocation || t("unspecified")}
                </span>
              </p>
            )}

            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>
                {startFormatted} – {endFormatted}
              </span>
            </p>
          </div>

          {journey.distanceKm && (
            <div className="px-4 py-2 rounded-2xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-black text-lg font-outfit shadow-md">
              {journey.distanceKm.toLocaleString()} km
            </div>
          )}
        </div>

        {journey.notes && (
          <div className="text-xs text-neutral-600 dark:text-neutral-300 italic bg-neutral-100/70 dark:bg-neutral-800/60 p-3 rounded-2xl border border-neutral-200/60 dark:border-neutral-800">
            "{journey.notes}"
          </div>
        )}
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("totalJourneyCost")}
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {currencySymbol}
            {totalCost.toFixed(2)}
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("totalEnergyCharged")}
          </span>
          <p className="text-2xl font-black text-neutral-900 dark:text-white">
            {totalEnergyChargedKwh.toFixed(1)} kWh
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("avgConsumption")}
          </span>
          <p className="text-2xl font-black text-neutral-900 dark:text-white">
            {avgConsumptionKwh100km !== null ? avgConsumptionKwh100km.toFixed(1) : "—"}
            <span className="text-xs font-normal text-neutral-500 ml-1">kWh / 100km</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("avgCostPer100km")}
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {avgCostPer100km !== null ? `${currencySymbol}${avgCostPer100km.toFixed(2)}` : "—"}
            <span className="text-xs font-normal text-neutral-500 ml-1">/ 100km</span>
          </p>
        </div>
      </div>

      {/* Charging Duration & Speed Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 space-y-2">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("duration")}
          </span>
          <div className="flex items-center gap-3 pt-1">
            {dcDurationMins > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>
                  DC: {formatDurationText(dcDurationMins, t)}
                </span>
              </span>
            )}
            {acDurationMins > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>
                  AC: {formatDurationText(acDurationMins, t)}
                </span>
              </span>
            )}
            {totalDurationMins === 0 && (
              <span className="text-xs text-neutral-400">—</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 space-y-2">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("totalEnergyConsumed")}
          </span>
          <p className="text-lg font-bold text-neutral-900 dark:text-white">
            {netEnergyConsumedKwh.toFixed(1)} kWh
            {batteryDeltaKwh !== 0 && (
              <span className="text-xs text-neutral-500 font-normal ml-2">
                ({t("chargedLabel")} {totalEnergyChargedKwh.toFixed(1)} + {t("batDeltaLabel")} {batteryDeltaKwh > 0 ? `+${batteryDeltaKwh.toFixed(1)}` : batteryDeltaKwh.toFixed(1)})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Interactive Road Trip Timeline */}
      <div className="p-6 rounded-3xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
          <h2 className="text-lg font-extrabold font-outfit text-neutral-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            <span>{t("journeyTimeline")}</span>
          </h2>
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
            {sessions.length} {t("stops")}
          </span>
        </div>

        <div className="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-6">
          {/* Start Node */}
          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center text-[10px] font-bold shadow-md">
              🚀
            </div>
            <div className="p-4 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-outfit block">
                {t("departureNode")}
              </span>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                {journey.startLocation ? `${t("departedFrom")} ${journey.startLocation}` : t("tripStarted")} • {startFormatted}
              </p>
              {journey.startOdometerKm && (
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {t("odometerLabel")}: {journey.startOdometerKm.toLocaleString()} km
                  {journey.startBatteryPct !== undefined && journey.startBatteryPct !== null
                    ? ` • ${t("batteryLabel")}: ${journey.startBatteryPct}%`
                    : ""}
                </p>
              )}
            </div>
          </div>

          {/* Charging Stops */}
          {sessions.map((session, index) => {
            const d = new Date(session.date);
            const isDc = session.chargingType === "DC";
            const stopDateFormatted = d.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div key={session.id} className="relative">
                <div
                  className={`absolute -left-[31px] top-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                    isDc ? "bg-amber-500 text-neutral-950" : "bg-emerald-500 text-neutral-950"
                  }`}
                >
                  ⚡
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{session.provider?.name || session.location || `Stop #${index + 1}`}</span>
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        isDc
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {session.chargingType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400 text-[10px] block font-outfit">
                        {t("fieldEnergy")}
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-white">{session.energyChargedKwh.toFixed(1)} kWh</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400 text-[10px] block font-outfit">
                        {t("fieldCost")}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {currencySymbol}{session.cost.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400 text-[10px] block font-outfit">
                        {t("tablePricePerKwh")}
                      </span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {currencySymbol}{session.pricePerKwh.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400 text-[10px] block font-outfit">
                        {t("tableDate")}
                      </span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{stopDateFormatted}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Arrival Node */}
          <div className="relative">
            <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center text-[10px] font-bold shadow-md">
              🏁
            </div>
            <div className="p-4 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-800 space-y-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-outfit block">
                {t("arrivalNode")}
              </span>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                {journey.endLocation ? `${t("arrivedAt")} ${journey.endLocation}` : t("tripCompleted")} • {endFormatted}
              </p>
              {journey.endOdometerKm && (
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {t("odometerLabel")}: {journey.endOdometerKm.toLocaleString()} km
                  {journey.endBatteryPct !== undefined && journey.endBatteryPct !== null
                    ? ` • ${t("batteryLabel")}: ${journey.endBatteryPct}%`
                    : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
