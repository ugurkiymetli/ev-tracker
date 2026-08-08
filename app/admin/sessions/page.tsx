import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { AdminSessionsTable } from "@/components/admin/admin-sessions-table";
import { Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sessions | Admin Panel",
};

export default async function AdminSessionsPage() {
  const sessions = await prisma.chargingSession.findMany({
    include: {
      vehicle: {
        select: {
          id: true,
          name: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      provider: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 p-6 bg-white dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg dark:shadow-2xl">
        <div className="w-16 h-16 shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
          <Zap className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit m-0">
            Charging Sessions
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            Manage all charging sessions globally.
          </p>
        </div>
      </div>

      <AdminSessionsTable sessions={sessions} />
    </div>
  );
}
