"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, LogIn, AlertCircle } from "lucide-react";
import { signInAction } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await signInAction(formData);
      if (res?.error) {
        setError(res.error);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes("NEXT_REDIRECT")) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-950 mx-auto shadow-lg">
          <Zap className="w-6 h-6 fill-current" />
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
          {t("signInTitle")}
        </h2>
      </div>

      <div className="bg-white dark:bg-neutral-900/50 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              {t("username")}
            </label>
            <input
              type="text"
              name="username"
              required
              autoFocus
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              {t("password")}
            </label>
            <input
              type="password"
              name="password"
              required
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "..." : t("signIn")}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500">
          <span>{t("dontHaveAccount")}&nbsp;</span>
          <Link href="/signup" className="font-bold text-neutral-900 dark:text-white hover:underline">
            {t("signUp")}
          </Link>
        </div>
      </div>
    </div>
  );
}
