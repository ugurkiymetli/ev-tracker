import { getDashboardData } from "@/server/services/ev-service";
import { updateSettingsAction, seedDemoDataAction } from "@/app/actions";
import { Settings as SettingsIcon, Car, Cpu, RefreshCw, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function SettingsPage() {
  const { vehicle, settings, sessions } = await getDashboardData();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
          Vehicle & System Settings
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Manage your EV profile specifications, currency formatting, and database options.
        </p>
      </div>

      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <Car className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
            Active Vehicle Profile
          </h3>
        </div>

        <form action={updateSettingsAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Vehicle Name / Nickname
              </label>
              <input
                type="text"
                name="vehicleName"
                defaultValue={vehicle.name}
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Battery Pack Usable Capacity (kWh)
              </label>
              <input
                type="number"
                step="0.1"
                name="batteryCapacityKwh"
                defaultValue={vehicle.batteryCapacityKwh}
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Currency Symbol
              </label>
              <input
                type="text"
                name="currencySymbol"
                defaultValue={settings.currencySymbol}
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Initial Odometer (km)
              </label>
              <input
                type="number"
                name="initialOdometerKm"
                defaultValue={vehicle.initialOdometerKm}
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Current Odometer (km)
              </label>
              <input
                type="number"
                name="currentOdometerKm"
                defaultValue={vehicle.currentOdometerKm}
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Vehicle Settings</span>
            </button>
          </div>
        </form>
      </section>

      {/* Database Reset & Demo Seed Section */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
              Demo Data Generator
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Populate or reset SQLite database with 6 months of realistic charging sessions & operating expenses.
            </p>
          </div>

          <form action={seedDemoDataAction}>
            <button
              type="submit"
              className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-semibold text-xs transition-all border border-neutral-200 dark:border-neutral-700 flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Seed / Reset Demo Data ({sessions.length} sessions logged)</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
