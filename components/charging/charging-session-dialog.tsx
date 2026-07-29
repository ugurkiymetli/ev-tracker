"use client";

import { useState } from "react";
import { Plus, X, BatteryCharging } from "lucide-react";
import { createChargingSessionAction } from "@/app/actions";

export function ChargingSessionDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createChargingSessionAction(formData);
      setOpen(false);
    } catch (err) {
      alert("Failed to save charging session. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-[0.99]"
      >
        <Plus className="w-4 h-4" />
        <span>Log Session</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <BatteryCharging className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
                  Log Charging Session
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={todayStr}
                    required
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Type
                  </label>
                  <select
                    name="chargingType"
                    defaultValue="AC"
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  >
                    <option value="AC">AC (Level 2 / Home)</option>
                    <option value="DC">DC (Fast Charger / Supercharger)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Energy (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="energyChargedKwh"
                    placeholder="45.5"
                    required
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Total Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost"
                    placeholder="12.50"
                    required
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Provider / Network
                  </label>
                  <input
                    type="text"
                    name="providerName"
                    placeholder="Supercharger / Home"
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Odometer (km)
                  </label>
                  <input
                    type="number"
                    name="odometerKm"
                    placeholder="18500"
                    className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Location & Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Optional notes or station location..."
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
