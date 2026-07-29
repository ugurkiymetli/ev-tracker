"use client";

import { useState } from "react";
import { Plus, Pencil, X, BatteryCharging } from "lucide-react";
import { createChargingSessionAction, updateChargingSessionAction } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";
import { useToast } from "@/components/ui/toast";
import { ProviderAutocomplete } from "@/components/ui/provider-autocomplete";
import { ChargingSession } from "@/types";

interface ChargingProviderSimple {
  id: string;
  name: string;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (isEdit) {
        await updateChargingSessionAction(formData);
      } else {
        await createChargingSessionAction(formData);
      }
      setOpen(false);
      toast({
        title: isEdit ? "Oturum Güncellendi" : "Oturum Kaydedildi",
        description: isEdit ? "Şarj kaydı başarıyla güncellendi." : "Yeni şarj oturumu geçmişe eklendi.",
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left font-sans">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <BatteryCharging className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
                  {isEdit ? t("editModalTitle") : t("logModalTitle")}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isEdit && session && (
                <input type="hidden" name="sessionId" value={session.id} />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    {t("fieldDate")}
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={initialDateStr}
                    required
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    {t("fieldType")}
                  </label>
                  <select
                    name="chargingType"
                    defaultValue={session?.chargingType || "AC"}
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  >
                    <option value="AC">{t("optAc")}</option>
                    <option value="DC">{t("optDc")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    {t("fieldEnergy")}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="energyChargedKwh"
                    defaultValue={session?.energyChargedKwh ?? ""}
                    placeholder="45.5"
                    required
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    {t("fieldCost")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost"
                    defaultValue={session?.cost ?? ""}
                    placeholder="12.50"
                    required
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
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
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
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

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
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

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold text-xs transition-all cursor-pointer"
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
