"use client";

import { useState } from "react";
import { Trash2, Zap, Car, User as UserIcon, Calendar, BatteryCharging } from "lucide-react";
import Link from "next/link";
import { adminDeleteSessionAction } from "@/server/actions/admin";
import { useToast } from "@/components/ui/toast";

export type AdminSession = {
  id: string;
  date: Date;
  energyChargedKwh: number;
  cost: number;
  chargingType: string;
  vehicle: {
    id: string;
    name: string;
    user: {
      id: string;
      username: string;
    } | null;
  };
  provider: {
    name: string;
  } | null;
};

interface AdminSessionsTableProps {
  sessions: AdminSession[];
}

export function AdminSessionsTable({ sessions: initialSessions }: AdminSessionsTableProps) {
  const [sessions, setSessions] = useState<AdminSession[]>(initialSessions);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    
    setIsDeleting(id);
    try {
      await adminDeleteSessionAction(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "Session Deleted",
        description: "The charging session has been removed.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete session.",
        variant: "error",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-6 py-4 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs font-outfit">
                Date & Type
              </th>
              <th className="px-6 py-4 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs font-outfit">
                Owner / Vehicle
              </th>
              <th className="px-6 py-4 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs font-outfit">
                Provider
              </th>
              <th className="px-6 py-4 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs font-outfit text-right">
                Energy & Cost
              </th>
              <th className="px-6 py-4 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs font-outfit text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                  No charging sessions found.
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        session.chargingType === "DC" 
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                      }`}>
                        {session.chargingType === "DC" ? <Zap className="w-5 h-5 fill-current" /> : <BatteryCharging className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5" suppressHydrationWarning>
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs font-bold text-neutral-500 uppercase mt-0.5">
                          {session.chargingType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {session.vehicle.user ? (
                        <div className="flex items-center gap-1.5 text-sm">
                          <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                          <Link href={`/admin/users/${session.vehicle.user.id}`} className="font-medium text-neutral-900 dark:text-white hover:underline">
                            {session.vehicle.user.username}
                          </Link>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-sm">
                          <UserIcon className="w-3.5 h-3.5 text-rose-400" />
                          <span className="font-medium text-rose-600 dark:text-rose-400">
                            Anonymous / Orphaned
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <Car className="w-3.5 h-3.5" />
                        {session.vehicle.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900 dark:text-white">
                      {session.provider?.name || "Unknown Provider"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-neutral-900 dark:text-white">
                      {session.energyChargedKwh.toFixed(1)} kWh
                    </div>
                    <div className="text-xs text-neutral-500 font-medium mt-0.5">
                      Cost: {session.cost.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(session.id)}
                      disabled={isDeleting === session.id}
                      className="p-2 inline-flex items-center justify-center rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                      title="Delete Session"
                    >
                      {isDeleting === session.id ? (
                        <div className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
