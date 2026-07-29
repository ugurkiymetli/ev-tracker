"use client";

import { useState } from "react";
import { Receipt, Plus } from "lucide-react";
import { createExpenseAction } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";
import { useToast } from "@/components/ui/toast";

export function ExpenseForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createExpenseAction(formData);
      (e.target as HTMLFormElement).reset();
      toast({
        title: "Gider Kaydedildi",
        description: "Araç gideri başarıyla listeye eklendi.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Hata",
        description: err.message || "Gider kaydedilemedi.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <Receipt className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
          {t("addExpense")}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            {t("expenseTitle")}
          </label>
          <input
            type="text"
            name="title"
            placeholder={t("placeholderExpenseTitle")}
            required
            className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              {t("category")}
            </label>
            <select
              name="category"
              className="glass-input w-full px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
            >
              <option value="MAINTENANCE">{t("catMaintenance")}</option>
              <option value="INSURANCE">{t("catInsurance")}</option>
              <option value="TAX">{t("catTax")}</option>
              <option value="PARKING">{t("catParking")}</option>
              <option value="ACCESSORY">{t("catAccessory")}</option>
              <option value="OTHER">{t("catOther")}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              {t("amount")}
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              placeholder="0.00"
              required
              className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            {t("date")}
          </label>
          <input
            type="date"
            name="date"
            defaultValue={todayStr}
            required
            className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            {t("description")}
          </label>
          <input
            type="text"
            name="notes"
            placeholder={t("placeholderNotesOpt")}
            className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{loading ? t("saving") : t("logExpense")}</span>
        </button>
      </form>
    </section>
  );
}
