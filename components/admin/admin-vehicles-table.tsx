"use client";

import { useState } from "react";
import { Trash2, Car, Zap, Receipt, Search, User as UserIcon } from "lucide-react";
import { DeleteVehicleDialog } from "./delete-vehicle-dialog";
import Link from "next/link";

export type AdminVehicle = {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  batteryCapacityKwh: number;
  currentOdometerKm: number;
  createdAt: Date;
  user: {
    id: string;
    username: string;
  } | null;
  _count: {
    chargingSessions: number;
    expenses: number;
  };
};

interface AdminVehiclesTableProps {
  vehicles: AdminVehicle[];
}

export function AdminVehiclesTable({ vehicles: initialVehicles }: AdminVehiclesTableProps) {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>(initialVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleToDelete, setVehicleToDelete] = useState<AdminVehicle | null>(null);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.user?.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search vehicles, make, model or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-shadow outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs font-outfit">
                  Vehicle
                </th>
                <th className="px-6 py-4 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs font-outfit">
                  Owner
                </th>
                <th className="px-6 py-4 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs font-outfit text-right">
                  Specs
                </th>
                <th className="px-6 py-4 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs font-outfit text-center">
                  Data
                </th>
                <th className="px-6 py-4 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs font-outfit text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    No vehicles found.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">
                            {vehicle.name}
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vehicle.user ? (
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-neutral-400" />
                          <Link href={`/admin/users/${vehicle.user.id}`} className="font-medium text-neutral-900 dark:text-white hover:underline">
                            {vehicle.user.username}
                          </Link>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300">
                          Anonymous / Orphaned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium text-neutral-900 dark:text-white">
                        {vehicle.batteryCapacityKwh} kWh
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {vehicle.currentOdometerKm.toLocaleString()} km
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-1.5" title="Charging Sessions">
                          <Zap className="w-3.5 h-3.5 text-emerald-500" />
                          {vehicle._count.chargingSessions}
                        </div>
                        <div className="flex items-center gap-1.5" title="Expenses">
                          <Receipt className="w-3.5 h-3.5 text-indigo-500" />
                          {vehicle._count.expenses}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setVehicleToDelete(vehicle)}
                        className="p-2 inline-flex items-center justify-center rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteVehicleDialog
        vehicle={vehicleToDelete}
        onClose={() => setVehicleToDelete(null)}
        onDeleted={(id) => {
          setVehicles((prev) => prev.filter((v) => v.id !== id));
        }}
      />
    </div>
  );
}
