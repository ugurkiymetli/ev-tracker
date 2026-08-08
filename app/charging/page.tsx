import { cookies } from "next/headers";
import Link from "next/link";
import { UploadCloud } from "lucide-react";
import { getDashboardData } from "@/server/services/ev-service";
import { ChargingSessionDialog } from "@/components/charging/charging-session-dialog";
import { ChargingTableView } from "@/components/charging/charging-table-view";
import { translations } from "@/lib/i18n/translations";

export const revalidate = 0;

export default async function ChargingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const shouldOpenLog = params?.log === "true";
  const { sessions, settings, allProviders = [], userTopProviderIds = [] } = await getDashboardData();
  const sym = settings.currencySymbol || "$";
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("ev_tracker_lang")?.value;
  const dbLang = settings.language;
  const lang = (cookieLang === "tr" || (!cookieLang && dbLang === "tr") ? "tr" : "en") as "en" | "tr";
  const t = (key: keyof typeof translations.en) => translations[lang][key] || translations.en[key];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
            {t("chargingHistoryTitle")}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {t("chargingHistoryDesc")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/import"
            className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-bold text-xs shadow-sm active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">{t("navImport")}</span>
          </Link>
          <ChargingSessionDialog providers={allProviders} userTopProviderIds={userTopProviderIds} defaultOpen={shouldOpenLog} />
        </div>
      </div>

      {/* Interactive Sessions Table Card (FEATURE-008 Sorting & Filtering) */}
      <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md">
        <ChargingTableView
          sessions={sessions}
          providers={allProviders}
          userTopProviderIds={userTopProviderIds}
          currencySymbol={sym}
          lang={lang}
        />
      </section>
    </div>
  );
}
