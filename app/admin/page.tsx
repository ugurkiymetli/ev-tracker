import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { AdminUsersTable, AdminUser } from "@/components/admin/admin-users-table";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Panel | EV Tracker",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rawUsers = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          vehicles: true,
        },
      },
      vehicles: {
        include: {
          _count: {
            select: {
              chargingSessions: true,
              expenses: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const users: AdminUser[] = rawUsers.map((u) => {
    // Sum sessions and expenses across all vehicles of the user
    const sessionCount = u.vehicles.reduce((acc, v) => acc + v._count.chargingSessions, 0);
    const expenseCount = u.vehicles.reduce((acc, v) => acc + v._count.expenses, 0);

    return {
      id: u.id,
      username: u.username,
      email: u.email,
      createdAt: u.createdAt,
      vehicleCount: u._count.vehicles,
      sessionCount,
      expenseCount,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-900 shadow-md">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-outfit m-0 leading-none">
            Admin Dashboard
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold mt-1">
            Manage users and platform data
          </p>
        </div>
      </div>

      <AdminUsersTable users={users} />
    </div>
  );
}
