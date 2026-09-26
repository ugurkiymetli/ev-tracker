"use client";

import Link from "next/link";
import { Compass, Calendar, Gauge, Zap, BatteryCharging, Plus, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";
import { Journey, ChargingSession } from "@/types";
import { JourneyDialog } from "./journey-dialog";

interface JourneysViewProps {
  journeys: Journey[];
  availableSessions: ChargingSession[];
  currencySymbol: string;
}

export function JourneysView({
  journeys = [],
  availableSessions = [],
  currencySymbol = "$",
}: JourneysViewProps) {
  const { t, language } = useLanguage();
  const lang = language;

  const totalJourneysCount = journeys.length;
  const totalDistanceDrivenKm = journeys.reduce(
    (acc, j) => acc + (j.distanceKm || 0),
    0
  );
  const totalAttachedSessions = journeys.reduce(
    (acc, j) => acc + (j.chargingSessions?.length || 0),
    0
  );
  const totalSpend = journeys.reduce((acc, j) => {
    const sCost = (j.chargingSessions || []).reduce((sAcc, s) => sAcc + s.cost, 0);
    return acc + sCost;
  }, 0);

  const formatDateStr = (dateVal: Date | string) => {
    const d = new Date(dateVal);
    return d.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-outfit uppercase">
              {t("journeysTitle")}
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1">
            {t("journeysDesc")}
          </p>
        </div>

        <div>
          <JourneyDialog
            availableSessions={availableSessions}
            currencySymbol={currencySymbol}
          />
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("totalJourneys")}
          </span>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {totalJourneysCount}
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("totalRoadTripDistance")}
          </span>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {totalDistanceDrivenKm.toLocaleString()} km
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("chargingStops")}
          </span>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {totalAttachedSessions}
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-outfit">
            {t("totalJourneySpend")}
          </span>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            {currencySymbol}
            {totalSpend.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Journeys List Grid */}
      {journeys.length === 0 ? (
        <div className="p-12 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white font-outfit">
              {t("noJourneysFound")}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-1">
              {t("noJourneysDesc")}
            </p>
          </div>
          <div className="pt-2">
            <JourneyDialog
              availableSessions={availableSessions}
              currencySymbol={currencySymbol}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {journeys.map((journey) => {
            const sessions = journey.chargingSessions || [];
            const jCost = sessions.reduce((acc, s) => acc + s.cost, 0);
            const jEnergy = sessions.reduce((acc, s) => acc + s.energyChargedKwh, 0);

            return (
              <div
                key={journey.id}
                className="p-5 rounded-2xl glass-card border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Title & Dates */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-outfit">
                        {journey.name}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>
                          {formatDateStr(journey.startDate)} – {formatDateStr(journey.endDate)}
                        </span>
                      </p>
                    </div>

                    {journey.distanceKm ? (
                      <span className="px-2.5 py-1 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-extrabold text-xs font-outfit shadow-sm">
                        {journey.distanceKm} km
                      </span>
                    ) : null}
                  </div>

                  {/* Notes snippet */}
                  {journey.notes && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 italic line-clamp-2 bg-neutral-100/60 dark:bg-neutral-800/60 p-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
                      "{journey.notes}"
                    </p>
                  )}

                  {/* Stat Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                        {t("chargingStops")}
                      </span>
                      <span className="font-extrabold text-neutral-900 dark:text-white">
                        {sessions.length} {t("stops")}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                        {t("tableEnergy")}
                      </span>
                      <span className="font-extrabold text-neutral-900 dark:text-white">
                        {jEnergy.toFixed(1)} kWh
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                        {t("tableCost")}
                      </span>
                      <span className="font-extrabold text-neutral-900 dark:text-white">
                        {currencySymbol}
                        {jCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">
                    {sessions.length} {t("sessionsAttached")}
                  </span>
                  <Link
                    href={`/journeys/${journey.id}`}
                    className="py-1.5 px-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("viewJourneyDetails")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
