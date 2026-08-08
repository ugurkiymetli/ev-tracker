import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { AdminVehiclesTable } from "@/components/admin/admin-vehicles-table";
import { Car } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vehicles | Admin Panel",
};

export default async function AdminVehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      _count: {
        select: {
          chargingSessions: true,
          expenses: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 p-6 bg-white dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg dark:shadow-2xl">
        <div className="w-16 h-16 shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
          <Car className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit m-0">
            Vehicles
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            Manage all registered vehicles and anonymous data.
          </p>
        </div>
      </div>

      <AdminVehiclesTable vehicles={vehicles} />
    </div>
  );
}
