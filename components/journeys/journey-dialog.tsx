"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Pencil, X, Compass, Calendar, Gauge, BatteryCharging, FileText } from "lucide-react";
import { createJourneyAction, updateJourneyAction } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";
import { useToast } from "@/components/ui/toast";
import { Journey, ChargingSession } from "@/types";

interface JourneyDialogProps {
  journey?: Journey;
  availableSessions?: ChargingSession[];
  currencySymbol?: string;
  defaultOpen?: boolean;
}

export function JourneyDialog({
  journey,
  availableSessions = [],
  currencySymbol = "$",
  defaultOpen = false,
}: JourneyDialogProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const isEdit = Boolean(journey);

  // Form states
  const [name, setName] = useState(journey?.name || "");
  const [startDate, setStartDate] = useState(
    journey?.startDate
      ? new Date(journey.startDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    journey?.endDate
      ? new Date(journey.endDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [startOdo, setStartOdo] = useState(
    journey?.startOdometerKm ? String(journey.startOdometerKm) : ""
  );
  const [endOdo, setEndOdo] = useState(
    journey?.endOdometerKm ? String(journey.endOdometerKm) : ""
  );
  const [distanceKm, setDistanceKm] = useState(
    journey?.distanceKm ? String(journey.distanceKm) : ""
  );
  const [notes, setNotes] = useState(journey?.notes || "");

  // Selected session IDs
  const initialSelectedIds =
    journey?.chargingSessions?.map((s) => s.id) || [];
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>(initialSelectedIds);

  // Automatically compute distance when start/end odometer change
  useEffect(() => {
    const start = parseFloat(startOdo);
    const end = parseFloat(endOdo);
    if (!isNaN(start) && !isNaN(end) && end >= start) {
      setDistanceKm(String(end - start));
    }
  }, [startOdo, endOdo]);

  const toggleSession = (id: string) => {
    setSelectedSessionIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      if (startOdo) formData.append("startOdometerKm", startOdo);
      if (endOdo) formData.append("endOdometerKm", endOdo);
      if (distanceKm) formData.append("distanceKm", distanceKm);
      if (notes) formData.append("notes", notes);

      selectedSessionIds.forEach((id) => formData.append("sessionIds", id));

      if (isEdit && journey) {
        await updateJourneyAction(journey.id, formData);
      } else {
        await createJourneyAction(formData);
      }

      toast({
        title: t("journeySavedTitle"),
        description: t("journeySavedDesc"),
        variant: "success",
      });
      setOpen(false);
    } catch (err: any) {
      toast({
        title: t("errorTitle"),
        description: err.message || t("errSaveJourney"),
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return isEdit ? (
      <button className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg">
        <Pencil className="w-4 h-4" />
      </button>
    ) : (
      <button className="py-2.5 px-4 bg-neutral-900 text-white rounded-xl text-xs font-bold">
        {t("newJourney")}
      </button>
    );
  }

  return (
    <>
      {isEdit ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          title={t("editJourney")}
        >
          <Pencil className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("newJourney")}</span>
        </button>
      )}

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-end bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity font-sans overscroll-contain"
            aria-labelledby="drawer-title"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative w-full sm:w-[540px] max-h-[85vh] sm:max-h-none sm:h-[100dvh] overflow-y-auto text-left bg-white dark:bg-neutral-900 rounded-t-[28px] sm:rounded-none sm:border-l border-neutral-200/60 dark:border-neutral-800/60 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] sm:shadow-[-8px_0_40px_rgba(0,0,0,0.12)] p-5 sm:p-6 space-y-4 flex flex-col animate-drawer overscroll-contain"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
                      {isEdit ? t("editJourney") : t("createJourney")}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal m-0 mt-0.5">
                      {t("journeysDesc")}
                    </p>
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

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Journey Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                      {t("journeyName")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("placeholderJourneyName")}
                      className="glass-input w-full px-3.5 py-2 rounded-xl text-base sm:text-sm font-medium"
                    />
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                        {t("startDate")} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="glass-input w-full px-3.5 py-2 rounded-xl text-base sm:text-sm font-medium dark:[color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                        {t("endDate")} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="glass-input w-full px-3.5 py-2 rounded-xl text-base sm:text-sm font-medium dark:[color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Odometers & Distance */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col justify-end space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit min-h-[28px] flex items-end">
                        {t("startOdometer")}
                      </label>
                      <input
                        type="number"
                        value={startOdo}
                        onChange={(e) => setStartOdo(e.target.value)}
                        placeholder={t("placeholderOdometerStart")}
                        className="glass-input w-full px-3.5 py-2 rounded-xl text-base sm:text-sm font-medium"
                      />
                    </div>
                    <div className="flex flex-col justify-end space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit min-h-[28px] flex items-end">
                        {t("endOdometer")}
                      </label>
                      <input
                        type="number"
                        value={endOdo}
                        onChange={(e) => setEndOdo(e.target.value)}
                        placeholder={t("placeholderOdometerEnd")}
                        className="glass-input w-full px-3.5 py-2 rounded-xl text-base sm:text-sm font-medium"
                      />
                    </div>
                    <div className="flex flex-col justify-end space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit min-h-[28px] flex items-end">
                        {t("distanceKm")}
                      </label>
                      <input
                        type="number"
                        value={distanceKm}
                        onChange={(e) => setDistanceKm(e.target.value)}
                        placeholder={t("placeholderDistanceKm")}
                        className="glass-input w-full px-3.5 py-2 rounded-xl text-base sm:text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                      {t("fieldNotes")}
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t("placeholderJourneyNotes")}
                      className="glass-input w-full px-3.5 py-2 rounded-xl text-base sm:text-sm font-medium"
                    />
                  </div>

                  {/* Attach Charging Sessions Checklist */}
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                        {t("attachSessions")} ({selectedSessionIds.length})
                      </label>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {t("selectSessionsForJourney")}
                      </span>
                    </div>

                    {availableSessions.length === 0 ? (
                      <div className="p-4 rounded-xl bg-neutral-100/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        {t("noSessionsAttached")}
                      </div>
                    ) : (
                      <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                        {availableSessions.map((session) => {
                          const isSelected = selectedSessionIds.includes(session.id);
                          const sDate = new Date(session.date).toLocaleDateString(
                            lang === "tr" ? "tr-TR" : "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          );
                          const providerName =
                            session.provider?.name || session.location || t("unspecified");

                          return (
                            <div
                              key={session.id}
                              onClick={() => toggleSession(session.id)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${isSelected
                                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 border-neutral-900 dark:border-neutral-100 font-semibold"
                                  : "bg-neutral-100/80 hover:bg-neutral-200/80 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800"
                                }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => { }} // handled by parent onClick
                                  className="w-4 h-4 rounded text-neutral-900 focus:ring-0 cursor-pointer"
                                />
                                <div>
                                  <p className="font-bold">{providerName}</p>
                                  <p className="text-[10px] opacity-75">{sDate}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">
                                  {session.energyChargedKwh} kWh • {currencySymbol}
                                  {session.cost.toFixed(2)}
                                </p>
                                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                                  {session.chargingType}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold text-xs transition-all cursor-pointer"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading
                      ? t("saving")
                      : isEdit
                        ? t("editJourney")
                        : t("createJourney")}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
