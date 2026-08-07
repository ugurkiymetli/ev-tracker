export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse max-w-6xl mx-auto p-4">
      {/* Top Banner Skeleton */}
      <div className="h-24 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-2xl w-full border border-neutral-200/40 dark:border-neutral-800/40" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200/30 dark:border-neutral-800/30"
          />
        ))}
      </div>

      {/* Main Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200/30 dark:border-neutral-800/30" />
        <div className="h-80 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200/30 dark:border-neutral-800/30" />
      </div>
    </div>
  );
}
