/**
 * Formats duration in minutes into a human-readable string (hours & minutes),
 * utilizing translation dictionary lookup function `t`.
 *
 * Example outputs:
 * - 45 mins  => "45 m" (EN) / "45 dk" (TR)
 * - 60 mins  => "1 hour" (EN) / "1 saat" (TR)
 * - 120 mins => "2 hours" (EN) / "2 saat" (TR)
 * - 150 mins => "2.5 hours" (EN) / "2.5 saat" (TR)
 */
export function formatDurationText(mins: number, t: (key: any) => string): string {
  if (!mins || mins <= 0) return "—";
  if (mins < 60) return `${mins} ${t("minsAbbrev")}`;

  const hours = Number((mins / 60).toFixed(1));
  const unit = hours === 1 ? t("hourUnit") : t("hoursUnit");
  return `${hours} ${unit}`;
}

/**
 * Formats full duration with exact hours and minutes breakdown.
 * Example outputs:
 * - 135 mins => "2 hours 15 m" (EN) / "2 saat 15 dk" (TR)
 */
export function formatDurationDetailed(mins: number, t: (key: any) => string): string {
  if (!mins || mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hourLabel = h === 1 ? t("hourUnit") : t("hoursUnit");

  if (mins < 60) return `${mins} ${t("minsAbbrev")}`;
  if (m === 0) return `${h} ${hourLabel}`;
  return `${h} ${hourLabel} ${m} ${t("minsAbbrev")}`;
}
