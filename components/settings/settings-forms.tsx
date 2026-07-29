"use client";

import { useState } from "react";
import { Sliders, Car, Fuel, Globe, DollarSign, CheckCircle2, Cpu, Trash2, Zap, Search } from "lucide-react";
import {
  updateSettingsAction,
  seedDemoDataAction,
  deleteAllDataAction,
  softDeleteProviderAction,
} from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";
import { useToast } from "@/components/ui/toast";
import { Vehicle, Settings } from "@/types";

interface ProviderSimple {
  id: string;
  name: string;
  type: string;
}

interface SettingsFormsProps {
  vehicle: Vehicle;
  settings: Settings;
  sessionsCount: number;
  providers?: ProviderSimple[];
}

export function SettingsForms({
  vehicle,
  settings,
  sessionsCount,
  providers = [],
}: SettingsFormsProps) {
  const { t, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [savingApp, setSavingApp] = useState(false);
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [savingBenchmark, setSavingBenchmark] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [providerSearch, setProviderSearch] = useState("");
  const [providerList, setProviderList] = useState<ProviderSimple[]>(providers);

  const filteredProviders = providerList.filter((p) =>
    p.name.toLowerCase().includes(providerSearch.toLowerCase().trim())
  );

  const handleAppSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingApp(true);
    try {
      const formData = new FormData(e.currentTarget);
      const newLang = formData.get("language") as "en" | "tr";
      if (newLang && (newLang === "en" || newLang === "tr")) {
        setLanguage(newLang);
      }
      await updateSettingsAction(formData);
      toast({
        title: t("appSettingsSavedTitle"),
        description: t("appSettingsSavedDesc"),
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save app settings.",
        variant: "error",
      });
    } finally {
      setSavingApp(false);
    }
  };

  const handleVehicleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingVehicle(true);
    try {
      const formData = new FormData(e.currentTarget);
      await updateSettingsAction(formData);
      toast({
        title: t("vehicleProfileSavedTitle"),
        description: t("vehicleProfileSavedDesc"),
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save vehicle profile.",
        variant: "error",
      });
    } finally {
      setSavingVehicle(false);
    }
  };

  const handleBenchmarkSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingBenchmark(true);
    try {
      const formData = new FormData(e.currentTarget);
      await updateSettingsAction(formData);
      toast({
        title: t("benchmarkSavedTitle"),
        description: t("benchmarkSavedDesc"),
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save gasoline benchmark.",
        variant: "error",
      });
    } finally {
      setSavingBenchmark(false);
    }
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      await seedDemoDataAction();
      toast({
        title: t("demoSeededTitle"),
        description: t("demoSeededDesc"),
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to seed demo data.",
        variant: "error",
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(t("confirmDeleteAll"))) return;
    setDeleting(true);
    try {
      await deleteAllDataAction();
      toast({
        title: t("dataDeletedTitle"),
        description: t("dataDeletedDesc"),
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete data.",
        variant: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleSoftDeleteProvider = async (providerId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from providers list?`)) return;
    try {
      await softDeleteProviderAction(providerId);
      setProviderList((prev) => prev.filter((p) => p.id !== providerId));
      toast({
        title: "Şarj İstasyonu Silindi",
        description: `"${name}" sağlayıcısı listeden kaldırıldı.`,
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Hata",
        description: err.message || "Provider silinemedi.",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
          {t("settingsTitle")}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {t("settingsDesc")}
        </p>
      </div>

      {/* 1. App Settings Panel (Language & Currency Symbol) */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <Sliders className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
            {t("appSettingsPanel")}
          </h3>
        </div>

        <form onSubmit={handleAppSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{t("languageSelection")}</span>
              </label>
              <select
                name="language"
                defaultValue={settings.language || "en"}
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all cursor-pointer"
              >
                <option value="en">English (US / UK) 🇬🇧</option>
                <option value="tr">Türkçe (TR) 🇹🇷</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{t("currencySymbol")}</span>
              </label>
              <select
                name="currencySymbol"
                defaultValue={settings.currencySymbol || "$"}
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all cursor-pointer"
              >
                <option value="$">USD ($) — US Dollar</option>
                <option value="€">EUR (€) — Euro</option>
                <option value="₺">TRY (₺) — Türk Lirası</option>
                <option value="£">GBP (£) — British Pound</option>
                <option value="C$">CAD ($) — Canadian Dollar</option>
                <option value="A$">AUD ($) — Australian Dollar</option>
                <option value="¥">JPY / CNY (¥) — Yen / Yuan</option>
                <option value="CHF">CHF (Fr) — Swiss Franc</option>
                <option value="kr">SEK / NOK / DKK (kr) — Krona</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <button
              type="submit"
              disabled={savingApp}
              className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savingApp ? t("saving") : t("saveAppSettings")}</span>
            </button>
          </div>
        </form>
      </section>

      {/* 2. Car Settings Panel (Vehicle Profile) */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <Car className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
            {t("activeProfilePanel")}
          </h3>
        </div>

        <form onSubmit={handleVehicleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                {t("vehicleName")}
              </label>
              <input
                type="text"
                name="vehicleName"
                defaultValue={vehicle.name}
                required
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                {t("batteryCapacity")}
              </label>
              <input
                type="number"
                step="0.1"
                name="batteryCapacityKwh"
                defaultValue={vehicle.batteryCapacityKwh}
                required
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                {t("initialOdometer")}
              </label>
              <input
                type="number"
                name="initialOdometerKm"
                defaultValue={vehicle.initialOdometerKm}
                required
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                {t("currentOdometer")}
              </label>
              <input
                type="number"
                name="currentOdometerKm"
                defaultValue={vehicle.currentOdometerKm}
                required
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <button
              type="submit"
              disabled={savingVehicle}
              className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savingVehicle ? t("saving") : t("saveVehicleProfile")}</span>
            </button>
          </div>
        </form>
      </section>

      {/* 3. Gasoline Benchmark Panel */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <Fuel className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
            {t("configBenchmark")}
          </h3>
        </div>

        <form onSubmit={handleBenchmarkSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                {t("fuelPriceLabel")} ({settings.currencySymbol} / {t("perLiter")})
              </label>
              <input
                type="number"
                step="0.01"
                name="defaultFuelPricePerL"
                defaultValue={settings.defaultFuelPricePerL}
                required
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                {t("fuelEconomyLabel")}
              </label>
              <input
                type="number"
                step="0.1"
                name="defaultFuelConsumptionPer100km"
                defaultValue={settings.defaultFuelConsumptionPer100km}
                required
                className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <button
              type="submit"
              disabled={savingBenchmark}
              className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savingBenchmark ? t("saving") : t("updateRecalc")}</span>
            </button>
          </div>
        </form>
      </section>

      {/* 4. Charging Providers Admin & Soft Delete Panel */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
              Charging Networks & Providers ({providerList.length})
            </h3>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search provider to manage or soft-delete..."
            value={providerSearch}
            onChange={(e) => setProviderSearch(e.target.value)}
            className="glass-input w-full pl-9 px-3.5 py-2 rounded-xl text-xs font-medium"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        <div className="max-h-56 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((prov) => (
              <div
                key={prov.id}
                className="p-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-neutral-900 dark:text-white">
                    {prov.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-medium">
                    {prov.type}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSoftDeleteProvider(prov.id, prov.name)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                  title="Remove / Soft-Delete Provider"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-neutral-400 italic">
              No matching providers found
            </div>
          )}
        </div>
      </section>

      {/* 5. Database Reset & Demo Seed Section */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-6">
        <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
            {t("demoDataGen")}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            {t("demoDataDesc")} ({sessionsCount} {t("sessionsCount")} logged)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            disabled={seeding}
            onClick={handleSeedDemo}
            className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-semibold text-xs transition-all active:scale-[0.99] border border-neutral-200 dark:border-neutral-700 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>{seeding ? t("saving") : sessionsCount === 0 ? t("seedDemoData") : t("resetDemoData")}</span>
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={handleDeleteAll}
            className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-xl font-bold text-xs transition-all active:scale-[0.99] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? t("saving") : t("deleteAllData")}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
