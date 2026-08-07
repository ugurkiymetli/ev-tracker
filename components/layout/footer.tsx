"use client";

import { ShieldCheck, Code, Globe } from "lucide-react";
import { useLanguage } from "@/components/layout/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-12 border-t border-neutral-200 dark:border-neutral-900 bg-white/50 dark:bg-neutral-950/50 py-6 px-4 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t("footerLocalFirst")}</span>
        </div>

        <div className="flex items-center gap-4 font-semibold">
          <a
            href="https://github.com/ugurkiymetli/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{t("footerGithub")}</span>
          </a>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <a
            href="https://www.linkedin.com/in/ugurkiymetli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t("footerLinkedin")}</span>
          </a>
        </div>

        <p className="m-0 text-center sm:text-right font-sans text-neutral-400 dark:text-neutral-500">
          {t("footerCopyright")}
        </p>
      </div>
    </footer>
  );
}
