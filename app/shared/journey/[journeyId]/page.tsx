import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Calendar,
  Gauge,
  Zap,
  Clock,
  BatteryCharging,
  MapPin,
  Car,
  TrendingUp,
  Share2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getJourneyById } from "@/server/services/ev-service";
import { prisma } from "@/lib/db/prisma";
import { Journey, ChargingSession } from "@/types";

export const revalidate = 0;

interface PublicJourneyPageProps {
  params: Promise<{
    journeyId: string;
  }>;
}

export default async function PublicJourneyPage({ params }: PublicJourneyPageProps) {
  const { journeyId } = await params;
  const journey = await getJourneyById(journeyId);

  if (!journey || journey.isPublic === false) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md text-center space-y-4 glass-card p-8 rounded-3xl border border-neutral-800">
          <Compass className="w-16 h-16 text-neutral-600 mx-auto animate-pulse" />
          <h1 className="text-xl font-bold font-outfit">Private or Unavailable Journey</h1>
          <p className="text-xs text-neutral-400">
            This road trip report is either set to private by its owner or does not exist.
          </p>
          <Link
            href="/landing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-950 font-bold text-xs hover:bg-white transition-all shadow-md"
          >
            <span>Explore EV Tracker</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  // Fetch currency symbol from vehicle owner settings
  let sym = "₺";
  try {
    const ownerSettings = await prisma.settings.findFirst({
      where: { activeVehicleId: journey.vehicleId },
    });
    if (ownerSettings?.currencySymbol) {
      sym = ownerSettings.currencySymbol;
    }
  } catch (e) {
    sym = "₺";
  }

  const sessions = journey.chargingSessions || [];
  const totalCost = sessions.reduce((acc, s) => acc + s.cost, 0);
  const totalEnergyChargedKwh = sessions.reduce((acc, s) => acc + s.energyChargedKwh, 0);

  let dcDurationMins = 0;
  let acDurationMins = 0;
  sessions.forEach((s) => {
    const dur = s.durationMinutes || 0;
    if (s.chargingType === "DC") dcDurationMins += dur;
    else acDurationMins += dur;
  });

  const batCapacity = journey.vehicle?.batteryCapacityKwh || 75.0;
  let netEnergyConsumedKwh = totalEnergyChargedKwh;
  let batteryDeltaKwh = 0;

  if (
    journey.startBatteryPct !== undefined &&
    journey.startBatteryPct !== null &&
    journey.endBatteryPct !== undefined &&
    journey.endBatteryPct !== null
  ) {
    const pctDiff = journey.startBatteryPct - journey.endBatteryPct;
    batteryDeltaKwh = (pctDiff / 100) * batCapacity;
    netEnergyConsumedKwh = totalEnergyChargedKwh + batteryDeltaKwh;
  }

  let avgConsumptionKwh100km: number | null = null;
  let avgCostPer100km: number | null = null;
  if (journey.distanceKm && journey.distanceKm > 0) {
    avgConsumptionKwh100km = (netEnergyConsumedKwh / journey.distanceKm) * 100;
    avgCostPer100km = (totalCost / journey.distanceKm) * 100;
  }

  const startFormatted = new Date(journey.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const endFormatted = new Date(journey.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Branding Nav Header */}
        <div className="flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 group-hover:scale-105 transition-all">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg font-outfit tracking-wide text-white">
              EV Tracker <span className="text-xs font-normal text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Public Report</span>
            </span>
          </Link>
          <Link
            href="/landing"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-all flex items-center gap-1.5"
          >
            <span>Try EV Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hero Card Header */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl shadow-2xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-neutral-800 pointer-events-none opacity-20">
            <Compass className="w-48 h-48 -mr-12 -mt-12" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4 fill-emerald-500/20" />
              <span>Verified Public EV Trip Log</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-outfit tracking-tight text-white">
              {journey.name}
            </h1>

            {journey.vehicle && (
              <p className="text-xs sm:text-sm text-neutral-300 font-semibold flex items-center gap-2">
                <Car className="w-4 h-4 text-neutral-400" />
                <span>
                  {journey.vehicle.make} {journey.vehicle.model} ({journey.vehicle.batteryCapacityKwh} kWh Pack)
                </span>
              </p>
            )}

            {(journey.startLocation || journey.endLocation) && (
              <p className="text-xs sm:text-sm text-emerald-400 font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>
                  {journey.startLocation || "Start"} {journey.isRoundTrip ? "⇄" : "➔"} {journey.endLocation || "Destination"}
                </span>
              </p>
            )}

            <p className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>
                {startFormatted} – {endFormatted}
              </span>
            </p>
          </div>

          {/* Key Metrics Dashboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-800">
            <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400 block font-outfit">
                Total Distance
              </span>
              <span className="text-lg font-black text-white font-outfit mt-0.5 block">
                {journey.distanceKm ? `${journey.distanceKm.toLocaleString()} km` : "—"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400 block font-outfit">
                Total Spend
              </span>
              <span className="text-lg font-black text-emerald-400 font-outfit mt-0.5 block">
                {sym}{totalCost.toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400 block font-outfit">
                Avg Consumption
              </span>
              <span className="text-lg font-black text-white font-outfit mt-0.5 block">
                {avgConsumptionKwh100km !== null ? `${avgConsumptionKwh100km.toFixed(1)} kWh` : "—"}
              </span>
              {avgConsumptionKwh100km !== null && (
                <span className="text-[10px] text-neutral-400 block">per 100 km</span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400 block font-outfit">
                Cost per 100km
              </span>
              <span className="text-lg font-black text-emerald-400 font-outfit mt-0.5 block">
                {avgCostPer100km !== null ? `${sym}${avgCostPer100km.toFixed(2)}` : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="glass-card p-6 rounded-3xl border border-neutral-800 bg-neutral-900/40 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <h2 className="text-base font-bold font-outfit text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Road Trip Timeline & Charging Stops</span>
            </h2>
            <span className="text-xs font-bold text-neutral-400 px-3 py-1 rounded-full bg-neutral-800">
              {sessions.length} charging stops
            </span>
          </div>

          <div className="relative pl-6 border-l-2 border-neutral-800 space-y-6">
            {/* Start Node */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                🚀
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-outfit block">
                  Departure Node
                </span>
                <p className="text-xs font-semibold text-white">
                  {journey.startLocation ? `Departed from ${journey.startLocation}` : "Trip Started"} • {startFormatted}
                </p>
                {journey.startOdometerKm && (
                  <p className="text-[11px] text-neutral-400">
                    Odometer: {journey.startOdometerKm.toLocaleString()} km
                    {journey.startBatteryPct !== undefined && journey.startBatteryPct !== null
                      ? ` • Battery: ${journey.startBatteryPct}%`
                      : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Charging Stops */}
            {sessions.map((session, index) => {
              const d = new Date(session.date);
              const isDc = session.chargingType === "DC";
              const stopDateFormatted = d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div key={session.id} className="relative">
                  <div
                    className={`absolute -left-[31px] top-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                      isDc ? "bg-amber-500 text-neutral-950" : "bg-emerald-500 text-neutral-950"
                    }`}
                  >
                    ⚡
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 hover:border-neutral-700 transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{session.provider?.name || session.location || `Stop #${index + 1}`}</span>
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          isDc
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {session.chargingType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                      <div>
                        <span className="text-neutral-400 text-[10px] block">Energy Charged</span>
                        <span className="font-bold text-white">{session.energyChargedKwh.toFixed(1)} kWh</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[10px] block">Cost</span>
                        <span className="font-bold text-emerald-400">{sym}{session.cost.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[10px] block">Price / kWh</span>
                        <span className="font-medium text-neutral-300">{sym}{session.pricePerKwh.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[10px] block font-outfit">Date</span>
                        <span className="font-medium text-neutral-300">{stopDateFormatted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Arrival Node */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center text-[10px] font-bold shadow-md">
                🏁
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-outfit block">
                  Arrival Node
                </span>
                <p className="text-xs font-semibold text-white">
                  {journey.endLocation ? `Arrived at ${journey.endLocation}` : "Trip Completed"} • {endFormatted}
                </p>
                {journey.endOdometerKm && (
                  <p className="text-[11px] text-neutral-400">
                    Odometer: {journey.endOdometerKm.toLocaleString()} km
                    {journey.endBatteryPct !== undefined && journey.endBatteryPct !== null
                      ? ` • Battery: ${journey.endBatteryPct}%`
                      : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-850 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-sm font-bold text-white font-outfit">Track Your EV Costs & Road Trips</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Calculate exact cost per km, battery efficiency, and ICE gasoline savings with EV Tracker.
            </p>
          </div>
          <Link
            href="/landing"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs transition-all shadow-lg hover:shadow-emerald-500/20 whitespace-nowrap"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </main>
  );
}
