import { getDashboardData } from "@/server/services/ev-service";
import { updateSettingsAction, seedDemoDataAction, deleteAllDataAction } from "@/app/actions";
import { Car, Cpu, Trash2, CheckCircle2, Globe, Sliders, Fuel, DollarSign } from "lucide-react";
import { translations } from "@/lib/i18n/translations";

export const revalidate = 0;

export default async function SettingsPage() {
  const { vehicle, settings, sessions } = await getDashboardData();
  const lang = (settings.language === "tr" ? "tr" : "en") as "en" | "tr";
  const t = (key: keyof typeof translations.en) => translations[lang][key] || translations.en[key];

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

        <form action={updateSettingsAction} className="space-y-4">
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
              className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("saveAppSettings")}</span>
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

        <form action={updateSettingsAction} className="space-y-4">
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
              className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("saveVehicleProfile")}</span>
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

        <form action={updateSettingsAction} className="space-y-4">
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
              className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("updateRecalc")}</span>
            </button>
          </div>
        </form>
      </section>

      {/* 4. Database Reset & Demo Seed Section */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-6">
        <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
            {t("demoDataGen")}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            {t("demoDataDesc")} ({sessions.length} {t("sessionsCount")} logged)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <form action={seedDemoDataAction}>
            <button
              type="submit"
              className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-semibold text-xs transition-all active:scale-[0.99] border border-neutral-200 dark:border-neutral-700 flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>{sessions.length === 0 ? t("seedDemoData") : t("resetDemoData")}</span>
            </button>
          </form>

          <form action={deleteAllDataAction}>
            <button
              type="submit"
              className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-xl font-bold text-xs transition-all active:scale-[0.99] flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t("deleteAllData")}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
