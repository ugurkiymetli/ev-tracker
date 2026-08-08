"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { findOrCreateProvider } from "@/server/services/ev-service";

async function isLocalhost() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export async function deleteUserAction(userId: string) {
  if (!(await isLocalhost())) {
    return { success: false, error: "Forbidden: Admin actions are restricted to localhost." };
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, error: error.message || "Failed to delete user" };
  }
}

export async function adminDeleteSessionAction(sessionId: string): Promise<void> {
  if (!(await isLocalhost())) throw new Error("Forbidden: Admin actions are restricted to localhost.");

  const session = await prisma.chargingSession.findUnique({ where: { id: sessionId }, include: { vehicle: true } });
  if (!session) throw new Error("Session not found");

  await prisma.chargingSession.delete({ where: { id: sessionId } });

  if (session.vehicle.userId) {
    revalidatePath(`/admin/users/${session.vehicle.userId}`);
  }
  revalidatePath("/admin");
}

export async function adminUpdateSessionAction(formData: FormData): Promise<void> {
  if (!(await isLocalhost())) throw new Error("Forbidden: Admin actions are restricted to localhost.");

  const sessionId = formData.get("sessionId") as string;
  const dateStr = formData.get("date") as string;
  const energyChargedKwh = parseFloat(formData.get("energyChargedKwh") as string);
  const cost = parseFloat(formData.get("cost") as string);
  const chargingType = (formData.get("chargingType") as string) || "AC";
  const pricePerKwh = cost / energyChargedKwh;
  const providerName = (formData.get("providerName") as string)?.trim();
  const odometerKmStr = formData.get("odometerKm") as string;
  const location = (formData.get("location") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim();

  if (!dateStr || !chargingType || isNaN(energyChargedKwh) || isNaN(cost) || isNaN(pricePerKwh)) {
    throw new Error("Invalid session update data.");
  }

  const existingSession = await prisma.chargingSession.findUnique({
    where: { id: sessionId },
    include: { vehicle: true }
  });

  if (!existingSession) throw new Error("Session not found");

  let providerId: string | null = null;
  if (providerName) {
    const provider = await findOrCreateProvider(providerName, chargingType);
    if (provider) providerId = provider.id;
  }

  const odometerKm = odometerKmStr ? parseFloat(odometerKmStr) : null;

  await prisma.chargingSession.update({
    where: { id: sessionId },
    data: {
      providerId,
      date: new Date(dateStr),
      energyChargedKwh,
      cost,
      pricePerKwh: Number(pricePerKwh.toFixed(2)),
      chargingType,
      odometerKm,
      location,
      notes,
    },
  });

  // Only update the odometer if it is higher than current
  if (odometerKm && odometerKm > existingSession.vehicle.currentOdometerKm) {
    await prisma.vehicle.update({
      where: { id: existingSession.vehicle.id },
      data: { currentOdometerKm: odometerKm },
    });
  }

  if (existingSession.vehicle.userId) {
    revalidatePath(`/admin/users/${existingSession.vehicle.userId}`);
  }
  revalidatePath("/admin");
}

export async function deleteVehicleAction(vehicleId: string) {
  if (!(await isLocalhost())) {
    return { success: false, error: "Forbidden: Admin actions are restricted to localhost." };
  }

  try {
    await prisma.vehicle.delete({
      where: { id: vehicleId },
    });
    
    revalidatePath("/admin/vehicles");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete vehicle:", error);
    return { success: false, error: error.message || "Failed to delete vehicle" };
  }
}

