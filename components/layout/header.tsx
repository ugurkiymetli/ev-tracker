"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, BatteryCharging, Receipt, TrendingUp, UploadCloud, Settings, Sun, Moon, User as UserIcon, LogOut, LogIn, Globe } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useLanguage } from "./language-provider";
import { signOutAction } from "@/app/actions";

interface HeaderProps {
  user?: { id: string; username: string } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "tr" : "en";
    setLanguage(nextLang);
  };

  const navItems = [
    { href: "/", label: t("navDashboard"), icon: LayoutDashboard },
    { href: "/charging", label: t("navCharging"), icon: BatteryCharging },
    { href: "/expenses", label: t("navExpenses"), icon: Receipt },
    { href: "/ice-comparison", label: t("navIceComparison"), icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-900 px-3 py-2 md:px-4 md:py-3.5 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2.5 md:gap-4">
        {/* Logo & Title */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-950 shadow-md group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 md:w-5 md:h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-base md:text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-outfit m-0 leading-none uppercase">
              {t("appName")}
            </h1>
            <p className="text-[9px] md:text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold tracking-wider uppercase mt-0.5 md:mt-1">
              {t("appTagline")}
            </p>
          </div>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 justify-between md:justify-end">
          {!isAuthPage && user && (
            <nav className="flex-grow md:flex-grow-0 flex bg-neutral-100 dark:bg-neutral-900/80 p-0.5 md:p-1 rounded-xl border border-neutral-200 dark:border-neutral-800/80">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 shadow-sm"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-2 md:gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{user.username}</span>
                </span>

                <Link
                  href="/settings"
                  title={t("navSettings")}
                  className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer flex items-center"
                >
                  <Settings className="w-4 h-4" />
                </Link>

                <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block"></div>

                <form action={signOutAction}>
                  <button
                    type="submit"
                    title={t("signOut")}
                    className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">{t("signOut")}</span>
                  </button>
                </form>
              </div>
            ) : (
              !isAuthPage && (
                <div className="flex items-center gap-2">
                  <Link
                    href="/signin"
                    className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl font-semibold text-xs border border-neutral-200 dark:border-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{t("signIn")}</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-sm active:scale-[0.99] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{t("signUp")}</span>
                  </Link>
                </div>
              )
            )}

            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="px-2.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800/80 text-neutral-700 dark:text-neutral-300 font-bold text-xs hover:text-neutral-900 dark:hover:text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span className="uppercase">{language}</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all shadow-sm flex-shrink-0 cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
