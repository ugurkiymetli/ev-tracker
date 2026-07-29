import React from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeVariant?: "neutral" | "emerald" | "amber" | "rose";
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = "neutral",
}: KpiCardProps) {
  const badgeColorClass =
    badgeVariant === "emerald"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : badgeVariant === "amber"
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      : badgeVariant === "rose"
      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";

  return (
    <div className="bg-white dark:bg-neutral-900/50 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md dark:shadow-2xl animate-fade-in hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100 group-hover:scale-110 transition-transform">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
          {value}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
        {subtitle ? (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate">
            {subtitle}
          </p>
        ) : (
          <div />
        )}

        {badgeText && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColorClass} whitespace-nowrap`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
