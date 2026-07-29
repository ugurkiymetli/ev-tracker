import { getDashboardData } from "@/server/services/ev-service";
import { SettingsForms } from "@/components/settings/settings-forms";

export const revalidate = 0;

export default async function SettingsPage() {
  const { vehicle, settings, sessions, allProviders } = await getDashboardData();

  return (
    <SettingsForms
      vehicle={vehicle}
      settings={settings}
      sessionsCount={sessions.length}
      providers={allProviders.map((p) => ({ id: p.id, name: p.name, type: p.type }))}
    />
  );
}
