import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider } from "@/components/layout/language-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getOrCreateDefaultVehicleAndSettings } from "@/server/services/ev-service";
import { getCurrentUser } from "@/lib/auth/auth";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "EV Tracker | EV Ownership Analytics & Dashboards",
  description: "Local-first electric vehicle ownership platform for charging, efficiency, operating costs, and ICE savings analytics.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const { settings } = await getOrCreateDefaultVehicleAndSettings();
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("ev_tracker_lang")?.value;
  const initialLanguage = cookieLang || settings.language || "en";

  return (
    <html lang={initialLanguage} className="h-full dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col justify-between bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-300 font-sans antialiased"
      >
        <ThemeProvider>
          <LanguageProvider initialLanguage={initialLanguage}>
            <Header user={user} />
            <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
