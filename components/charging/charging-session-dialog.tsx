"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, X, BatteryCharging, Zap, Clock, Gauge } from "lucide-react";
import { createChargingSessionAction, updateChargingSessionAction } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";
import { useToast } from "@/components/ui/toast";
import { ProviderAutocomplete } from "@/components/ui/provider-autocomplete";
import { ChargingSession } from "@/types";

interface ChargingProviderSimple {
  id: string;
  name: string;
  stationCount?: number;
}

interface ChargingSessionDialogProps {
  session?: ChargingSession;
  providers?: ChargingProviderSimple[];
  userTopProviderIds?: string[];
}

export function ChargingSessionDialog({
  session,
  providers = [],
  userTopProviderIds = [],
}: ChargingSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const isEdit = Boolean(session);

  // Form State for dynamic calculation & AC/DC selection
  const [chargingType, setChargingType] = useState<"AC" | "DC">(
    session?.chargingType === "DC" ? "DC" : "AC"
  );
  const [costMode, setCostMode] = useState<"TOTAL" | "PER_KWH">("TOTAL");

  const [energyVal, setEnergyVal] = useState<string>(
    session?.energyChargedKwh ? String(session.energyChargedKwh) : ""
  );
  const [costVal, setCostVal] = useState<string>(
    session?.cost ? String(session.cost) : ""
  );
  const [pricePerKwhVal, setPricePerKwhVal] = useState<string>(
    session?.pricePerKwh ? String(session.pricePerKwh) : ""
  );
  const [durationMins, setDurationMins] = useState<string>("");

  // Helper numeric parsers supporting comma (,) and period (.)
  const parseNum = (str: string) => {
    if (!str) return 0;
    const normalized = str.replace(",", ".");
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const energyNum = parseNum(energyVal);
  const costNum = parseNum(costVal);
  const pricePerKwhNum = parseNum(pricePerKwhVal);
  const durationNum = parseNum(durationMins);

  // Calculated values
  const computedPricePerKwh =
    costMode === "TOTAL" && energyNum > 0 && costNum > 0
      ? (costNum / energyNum).toFixed(3)
      : pricePerKwhVal;

  const computedTotalCost =
    costMode === "PER_KWH" && energyNum > 0 && pricePerKwhNum > 0
      ? (energyNum * pricePerKwhNum).toFixed(2)
      : costVal;

  const avgPowerKw =
    energyNum > 0 && durationNum > 0
      ? (energyNum / (durationNum / 60)).toFixed(1)
      : null;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);

      // Normalize decimal separators for energy and cost
      const rawEnergy = String(formData.get("energyChargedKwh") || "").replace(",", ".");
      formData.set("energyChargedKwh", rawEnergy);

      let finalCost = costVal;
      if (costMode === "PER_KWH" && energyNum > 0 && pricePerKwhNum > 0) {
        finalCost = (energyNum * pricePerKwhNum).toFixed(2);
      }
      formData.set("cost", finalCost.replace(",", "."));
      formData.set("chargingType", chargingType);

      if (isEdit) {
        await updateChargingSessionAction(formData);
      } else {
        await createChargingSessionAction(formData);
      }

      setOpen(false);
      toast({
        title: isEdit ? "Oturum Güncellendi" : "Oturum Kaydedildi",
        description: isEdit
          ? "Şarj kaydı başarıyla güncellendi."
          : "Yeni şarj oturumu geçmişe eklendi.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Hata",
        description: err.message || "Şarj oturumu kaydedilemedi.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const initialDateStr = session?.date
    ? new Date(session.date).toISOString().split("T")[0]
    : todayStr;

  return (
    <>
      {isEdit ? (
        <button
          onClick={() => setOpen(true)}
          title={t("editSession")}
          className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("logSession")}</span>
        </button>
      )}

      {open && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10px] pb-[10px] px-2 sm:px-4 bg-neutral-900/20 dark:bg-black/70 backdrop-blur-xl animate-fade-in text-left font-sans" 
          aria-labelledby="modal-title" 
          role="dialog" 
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg max-h-[calc(100vh-20px)] overflow-y-auto bg-white dark:bg-neutral-900 rounded-[28px] border border-neutral-200/60 dark:border-neutral-800/60 shadow-[0_0_80px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_0_80px_-15px_rgba(0,0,0,0.5)] p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
                  {isEdit ? t("editModalTitle") : t("logModalTitle")}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isEdit && session && (
                <input type="hidden" name="sessionId" value={session.id} />
              )}

              {/* Date & Visual Charging Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                    {t("fieldDate")}
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={initialDateStr}
                    required
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium dark:[color-scheme:dark]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                    {t("fieldType")}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl border border-neutral-200 dark:border-neutral-700/80">
                    <button
                      type="button"
                      onClick={() => setChargingType("AC")}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        chargingType === "AC"
                          ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      <BatteryCharging className="w-3.5 h-3.5" />
                      <span>AC</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setChargingType("DC")}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        chargingType === "DC"
                          ? "bg-amber-500 text-neutral-950 font-extrabold shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{t("dcFast")}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Energy (kWh) Input with 3 Decimal Precision */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                    {t("fieldEnergy")}
                  </label>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {t("supportsDecimal")}
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  name="energyChargedKwh"
                  value={energyVal}
                  onChange={(e) => setEnergyVal(e.target.value)}
                  placeholder="45.125"
                  required
                  className="glass-input w-full px-3.5 py-2.5 rounded-xl text-base font-bold tracking-wide"
                />
              </div>

              {/* Cost Entry Mode Selector (FEATURE-005) */}
              <div className="space-y-2 bg-neutral-50 dark:bg-neutral-800/40 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                    {t("costEntryMode")}
                  </span>
                  <div className="flex bg-neutral-200 dark:bg-neutral-800 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setCostMode("TOTAL")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        costMode === "TOTAL"
                          ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      {t("modeTotalCost")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCostMode("PER_KWH")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        costMode === "PER_KWH"
                          ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      {t("modePricePerKwh")}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {costMode === "TOTAL" ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 font-outfit">
                          {t("fieldCost")}
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          name="cost"
                          value={costVal}
                          onChange={(e) => setCostVal(e.target.value)}
                          placeholder="185.50"
                          required
                          className="glass-input w-full px-3 py-1.5 rounded-lg text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 font-outfit">
                          {t("fieldPricePerKwh")} {t("autoBadge")}
                        </label>
                        <div className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold border border-neutral-200 dark:border-neutral-700">
                          {computedPricePerKwh ? `${computedPricePerKwh} / kWh` : "—"}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 font-outfit">
                          {t("fieldPricePerKwh")}
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={pricePerKwhVal}
                          onChange={(e) => setPricePerKwhVal(e.target.value)}
                          placeholder="4.15"
                          required
                          className="glass-input w-full px-3 py-1.5 rounded-lg text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 font-outfit">
                          {t("fieldCost")} {t("autoBadge")}
                        </label>
                        <div className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-bold border border-neutral-200 dark:border-neutral-700">
                          {computedTotalCost ? computedTotalCost : "—"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Provider & Odometer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                    {t("fieldProvider")}
                  </label>
                  <ProviderAutocomplete
                    providers={providers}
                    userTopProviderIds={userTopProviderIds}
                    initialValue={session?.provider?.name || session?.location || ""}
                    name="providerName"
                    placeholder={t("placeholderProvider")}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                    {t("fieldOdometer")}
                  </label>
                  <input
                    type="number"
                    name="odometerKm"
                    defaultValue={session?.odometerKm ?? ""}
                    placeholder={t("placeholderOdometer")}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              {/* Optional Fields: Duration & Avg Power Calculation (FEATURE-007 & FEATURE-009) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{t("fieldDuration")}</span>
                  </label>
                  <input
                    type="number"
                    value={durationMins}
                    onChange={(e) => setDurationMins(e.target.value)}
                    placeholder={t("placeholderDuration")}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{t("avgPower")}</span>
                  </label>
                  <div className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-bold border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                    <span>{avgPowerKw ? `${avgPowerKw} kW` : "—"}</span>
                    {avgPowerKw && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">
                        {t("calculatedBadge")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-outfit">
                  {t("fieldNotes")}
                </label>
                <input
                  type="text"
                  name="notes"
                  defaultValue={session?.notes || ""}
                  placeholder={t("placeholderNotes")}
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
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
                  {loading ? t("saving") : isEdit ? t("updateSession") : t("saveSession")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
