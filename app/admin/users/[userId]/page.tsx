import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, BatteryCharging } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { ChargingTableView } from "@/components/charging/charging-table-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "User Details | Admin Panel",
};

export default async function AdminUserDetailsPage(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  const { userId } = params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      settings: true,
      vehicles: {
        include: {
          chargingSessions: {
            include: {
              provider: true,
            },
            orderBy: {
              date: "desc",
            },
          },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Get user's preferred settings or default
  const userSettings = user.settings[0] || { currencySymbol: "$", language: "en" };
  const currencySymbol = userSettings.currencySymbol;
  const lang = userSettings.language as "en" | "tr";

  // Aggregate all sessions across all vehicles
  const allSessions = user.vehicles.flatMap((v) => v.chargingSessions).sort((a, b) => b.date.getTime() - a.date.getTime());

  // Providers list
  const providers = await prisma.chargingProvider.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true, stationCount: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin Dashboard
      </Link>

      <div className="flex items-center gap-4 p-6 bg-white dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg dark:shadow-2xl">
        <div className="w-16 h-16 shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit m-0">
            {user.username}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium" suppressHydrationWarning>
            {user.email || "No email"} • Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            <h2 className="text-xl font-bold font-outfit text-neutral-900 dark:text-neutral-100">
              Charging Sessions
            </h2>
          </div>
          <div className="text-sm font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
            Total: {allSessions.length}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900/40 p-4 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg dark:shadow-2xl">
          <ChargingTableView
            sessions={allSessions}
            providers={providers}
            currencySymbol={currencySymbol}
            lang={lang}
            isAdmin={true}
          />
        </div>
      </div>
    </div>
  );
}
