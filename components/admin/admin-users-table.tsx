"use client";

import { useState } from "react";
import { Trash2, User, Car, Zap, Receipt, Search, Eye } from "lucide-react";
import Link from "next/link";
import { DeleteUserDialog } from "./delete-user-dialog";

export type AdminUser = {
  id: string;
  username: string;
  email: string | null;
  createdAt: Date;
  vehicleCount: number;
  sessionCount: number;
  expenseCount: number;
};

export function AdminUsersTable({ users }: { users: AdminUser[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter((u) => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold font-outfit">User Management ({users.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/80 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-all"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg dark:shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-xs uppercase text-neutral-500 dark:text-neutral-400 font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-center">Vehicles</th>
                <th className="px-6 py-4 text-center">Sessions</th>
                <th className="px-6 py-4 text-center">Expenses</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-neutral-900 dark:text-neutral-100 truncate">{user.username}</div>
                          <div className="text-xs text-neutral-500 truncate">{user.email || "No email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600 dark:text-neutral-300" suppressHydrationWarning>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                        <Car className="w-3.5 h-3.5" />
                        {user.vehicleCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        <Zap className="w-3.5 h-3.5" />
                        {user.sessionCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                        <Receipt className="w-3.5 h-3.5" />
                        {user.expenseCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-2 inline-flex items-center justify-center rounded-xl text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors mr-1"
                        title="View User Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="p-2 inline-flex items-center justify-center rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        title="Delete User"
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

      <DeleteUserDialog
        isOpen={!!userToDelete}
        userId={userToDelete?.id || ""}
        username={userToDelete?.username || ""}
        onClose={() => setUserToDelete(null)}
        onSuccess={() => setUserToDelete(null)}
      />
    </div>
  );
}
