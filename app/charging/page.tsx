import { getDashboardData } from "@/server/services/ev-service";
import { ChargingSessionDialog } from "@/components/charging/charging-session-dialog";
import { deleteChargingSessionAction } from "@/app/actions";
import { BatteryCharging, Trash2, Zap, Search, SlidersHorizontal } from "lucide-react";

import { ChargingSession } from "@/types";

export const revalidate = 0;

export default async function ChargingPage() {
  const { sessions, settings } = await getDashboardData();
  const sym = settings.currencySymbol || "$";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
            Charging History & Sessions
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Detailed log of all AC level 2 and DC fast charging sessions.
          </p>
        </div>

        <ChargingSessionDialog />
      </div>

      {/* Sessions Table Card */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <BatteryCharging className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200 font-outfit">
              No Charging Sessions Logged Yet
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Click &quot;Log Session&quot; above to manually add your first charge, or import your Excel charging logs from the Import tab.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Provider / Location</th>
                  <th className="pb-3 px-3">Type</th>
                  <th className="pb-3 px-3">Energy (kWh)</th>
                  <th className="pb-3 px-3">Cost</th>
                  <th className="pb-3 px-3">Price / kWh</th>
                  <th className="pb-3 px-3">Odometer</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                {sessions.map((session: ChargingSession) => {
                  const d = new Date(session.date);
                  const dateStr = d.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const isDc = session.chargingType === "DC";

                  return (
                    <tr
                      key={session.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-3 text-neutral-800 dark:text-neutral-200">
                        <div>{session.provider?.name || session.location || "Standard Charge"}</div>
                        {session.notes && (
                          <div className="text-[10px] text-neutral-400 font-normal">
                            {session.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isDc
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                          }`}
                        >
                          <Zap className="w-3 h-3" />
                          {session.chargingType}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-neutral-900 dark:text-neutral-100 font-bold">
                        {session.energyChargedKwh.toFixed(1)} kWh
                      </td>
                      <td className="py-3.5 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                        {sym}{session.cost.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-neutral-500 dark:text-neutral-400">
                        {sym}{session.pricePerKwh.toFixed(3)}
                      </td>
                      <td className="py-3.5 px-3 text-neutral-500 dark:text-neutral-400">
                        {session.odometerKm ? `${session.odometerKm.toLocaleString()} km` : "—"}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <form action={deleteChargingSessionAction.bind(null, session.id)}>
                          <button
                            type="submit"
                            title="Delete Session"
                            className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
