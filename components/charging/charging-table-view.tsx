"use client";

import { useState, useMemo } from "react";
import { Zap, BatteryCharging, ArrowUpDown, ArrowUp, ArrowDown, Search, Filter } from "lucide-react";
import { ChargingSession } from "@/types";
import { ChargingRowActions } from "@/components/charging/charging-row-actions";
import { useLanguage } from "@/components/layout/language-provider";

interface ProviderSimple {
  id: string;
  name: string;
  stationCount?: number;
}

interface ChargingTableViewProps {
  sessions: ChargingSession[];
  providers: ProviderSimple[];
  userTopProviderIds?: string[];
  currencySymbol: string;
  lang: "en" | "tr";
}

type SortField = "date" | "provider" | "energy" | "cost" | "price" | "odometer";
type SortOrder = "asc" | "desc";

export function ChargingTableView({
  sessions,
  providers,
  userTopProviderIds = [],
  currencySymbol,
  lang,
}: ChargingTableViewProps) {
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "AC" | "DC">("ALL");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedSessions = useMemo(() => {
    return sessions
      .filter((s) => {
        // Type filter
        if (typeFilter !== "ALL" && s.chargingType !== typeFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const providerName = (s.provider?.name || "").toLowerCase();
          const location = (s.location || "").toLowerCase();
          const notes = (s.notes || "").toLowerCase();
          if (!providerName.includes(q) && !location.includes(q) && !notes.includes(q)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        let valA: any = 0;
        let valB: any = 0;

        switch (sortField) {
          case "date":
            valA = new Date(a.date).getTime();
            valB = new Date(b.date).getTime();
            break;
          case "provider":
            valA = (a.provider?.name || a.location || "").toLowerCase();
            valB = (b.provider?.name || b.location || "").toLowerCase();
            break;
          case "energy":
            valA = a.energyChargedKwh;
            valB = b.energyChargedKwh;
            break;
          case "cost":
            valA = a.cost;
            valB = b.cost;
            break;
          case "price":
            valA = a.pricePerKwh;
            valB = b.pricePerKwh;
            break;
          case "odometer":
            valA = a.odometerKm || 0;
            valB = b.odometerKm || 0;
            break;
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [sessions, searchQuery, typeFilter, sortField, sortOrder]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-50 group-hover:opacity-100" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 text-neutral-900 dark:text-white" />
    ) : (
      <ArrowDown className="w-3 h-3 text-neutral-900 dark:text-white" />
    );
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <BatteryCharging className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto" />
        <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200 font-outfit">
          {t("noSessionsYet")}
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">{t("noSessionsDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls (FEATURE-008) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="relative flex-grow max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("filterByStation")}
            className="glass-input w-full pl-9 pr-3.5 py-1.5 rounded-xl text-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setTypeFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${typeFilter === "ALL"
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
            >
              {t("filterAll")} ({sessions.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("AC")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${typeFilter === "AC"
                  ? "bg-emerald-500 text-white dark:text-neutral-950 shadow-xs"
                  : "text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
            >
              AC
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("DC")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${typeFilter === "DC"
                  ? "bg-amber-500 text-neutral-950 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
            >
              DC
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap sm:whitespace-normal">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider select-none text-[10px] sm:text-xs">
              <th
                onClick={() => handleSort("date")}
                className="pb-3 px-2 sm:px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1">
                  <span>{t("tableDate")}</span>
                  {renderSortIcon("date")}
                </div>
              </th>

              <th
                onClick={() => handleSort("provider")}
                className="pb-3 px-2 sm:px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1">
                  <span>{t("tableProvider")}</span>
                  {renderSortIcon("provider")}
                </div>
              </th>

              <th className="pb-3 px-2 sm:px-3">{t("tableType")}</th>

              <th
                onClick={() => handleSort("energy")}
                className="pb-3 px-2 sm:px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1">
                  <span>{t("tableEnergy")}</span>
                  {renderSortIcon("energy")}
                </div>
              </th>

              <th
                onClick={() => handleSort("cost")}
                className="pb-3 px-2 sm:px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1">
                  <span>{t("tableCost")}</span>
                  {renderSortIcon("cost")}
                </div>
              </th>

              <th
                onClick={() => handleSort("price")}
                className="pb-3 px-2 sm:px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1">
                  <span>{t("tablePricePerKwh")}</span>
                  {renderSortIcon("price")}
                </div>
              </th>

              <th
                onClick={() => handleSort("odometer")}
                className="pb-3 px-2 sm:px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1">
                  <span>{t("tableOdometer")}</span>
                  {renderSortIcon("odometer")}
                </div>
              </th>

              <th className="pb-3 px-2 sm:px-3 text-right">{t("tableAction")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
            {filteredAndSortedSessions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-neutral-400 font-medium">
                  No charging sessions match your filters.
                </td>
              </tr>
            ) : (
              filteredAndSortedSessions.map((session: ChargingSession) => {
                const d = new Date(session.date);
                const dateStr = d.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
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
                    <td className="py-3 px-2 sm:px-3 font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-neutral-800 dark:text-neutral-200">
                      <div className="font-bold text-neutral-900 dark:text-white">
                        {session.provider?.name || session.location || "Standard Charge"}
                      </div>
                      {session.notes && (
                        <div className="text-[10px] text-neutral-400 font-normal">
                          {session.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 sm:px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 rounded-md text-[10px] font-bold ${isDc
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                      >
                        {isDc ? <Zap className="w-3 h-3" /> : <BatteryCharging className="w-3 h-3" />}
                        {session.chargingType}
                      </span>
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-neutral-900 dark:text-neutral-100 font-bold">
                      {session.energyChargedKwh.toFixed(1)} kWh
                    </td>
                    <td className="py-3 px-2 sm:px-3 font-bold text-neutral-900 dark:text-neutral-100">
                      {currencySymbol}
                      {session.cost.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-neutral-500 dark:text-neutral-400">
                      {currencySymbol}
                      {session.pricePerKwh.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-neutral-500 dark:text-neutral-400">
                      {session.odometerKm ? `${session.odometerKm.toLocaleString()} km` : "—"}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right">
                      <ChargingRowActions
                        session={session}
                        providers={providers}
                        userTopProviderIds={userTopProviderIds}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
