import { notFound } from "next/navigation";
import { getJourneyById, getDashboardData } from "@/server/services/ev-service";
import { JourneyDetailView } from "@/components/journeys/journey-detail-view";

export const revalidate = 0;

interface JourneyDetailPageProps {
  params: Promise<{
    journeyId: string;
  }>;
}

export default async function JourneyDetailPage({ params }: JourneyDetailPageProps) {
  const { journeyId } = await params;
  const { sessions, settings } = await getDashboardData();
  const journey = await getJourneyById(journeyId);

  if (!journey) {
    notFound();
  }

  const sym = settings.currencySymbol || "$";

  return (
    <JourneyDetailView
      journey={journey}
      availableSessions={sessions}
      currencySymbol={sym}
    />
  );
}
