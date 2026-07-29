import Link from "next/link";
import { ShieldCheck, Database, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-neutral-200 dark:border-neutral-900 bg-white/50 dark:bg-neutral-950/50 py-6 px-4 text-xs text-neutral-500 dark:text-neutral-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Local-First & Private</span>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5" /> SQLite Engine
          </span>
        </div>
        <p className="m-0 text-center md:text-right font-sans text-neutral-400 dark:text-neutral-500">
          EV Tracker &copy; {new Date().getFullYear()} — Advanced Personal Ownership Analytics
        </p>
      </div>
    </footer>
  );
}
