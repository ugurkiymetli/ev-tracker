import { cookies } from "next/headers";
import { getDashboardData, getJourneys } from "@/server/services/ev-service";
import { JourneysView } from "@/components/journeys/journeys-view";

export const revalidate = 0;

export default async function JourneysPage() {
  const { vehicle, settings, sessions } = await getDashboardData();
  const journeys = await getJourneys(vehicle.id);
  const sym = settings.currencySymbol || "$";

  return (
    <JourneysView
      journeys={journeys}
      availableSessions={sessions}
      currencySymbol={sym}
    />
  );
}
