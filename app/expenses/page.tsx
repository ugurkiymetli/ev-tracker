import { getDashboardData } from "@/server/services/ev-service";
import { createExpenseAction, deleteExpenseAction } from "@/app/actions";
import { Receipt, Plus, Trash2 } from "lucide-react";
import { Expense } from "@/types";
import { translations } from "@/lib/i18n/translations";

export const revalidate = 0;

export default async function ExpensesPage() {
  const { expenses, settings, stats } = await getDashboardData();
  const sym = settings.currencySymbol || "$";
  const lang = (settings.language === "tr" ? "tr" : "en") as "en" | "tr";
  const t = (key: keyof typeof translations.en) => translations[lang][key] || translations.en[key];

  const todayStr = new Date().toISOString().split("T")[0];

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "MAINTENANCE": return t("catMaintenance");
      case "INSURANCE": return t("catInsurance");
      case "TAX": return t("catTax");
      case "PARKING": return t("catParking");
      case "ACCESSORY": return t("catAccessory");
      default: return t("catOther");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
          {t("expensesTitle")}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {t("expensesDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Expense Log Form Card */}
        <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <Receipt className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
              {t("addExpense")}
            </h3>
          </div>

          <form action={createExpenseAction} className="space-y-4">
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
                  defaultValue="MAINTENANCE"
                  className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
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
                  {t("amount")} ({sym})
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  placeholder="150.00"
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
                name="description"
                placeholder={t("placeholderNotesOpt")}
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t("logExpense")}</span>
            </button>
          </form>
        </section>

        {/* Expenses List & TCO Summary */}
        <section className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-outfit m-0">
                {t("expenseLogs")}
              </h3>
              <span className="text-xs font-bold text-neutral-500 font-outfit">
                {t("totalExpenses")}: {sym}{stats.totalExpensesCost.toLocaleString()}
              </span>
            </div>

            {expenses.length === 0 ? (
              <div className="text-center py-8 text-neutral-400 text-xs">
                {t("noExpensesYet")}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold uppercase">
                      <th className="pb-3 px-3">{t("tableDate")}</th>
                      <th className="pb-3 px-3">{t("expenseTitle")}</th>
                      <th className="pb-3 px-3">{t("category")}</th>
                      <th className="pb-3 px-3">{t("amount")}</th>
                      <th className="pb-3 px-3 text-right">{t("tableAction")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                    {expenses.map((expense: Expense) => {
                      const d = new Date(expense.date);
                      const dateStr = d.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <tr
                          key={expense.id}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                        >
                          <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                            {dateStr}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-neutral-900 dark:text-neutral-100">
                              {expense.title}
                            </div>
                            {expense.description && (
                              <div className="text-[10px] text-neutral-400">
                                {expense.description}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                              {getCategoryLabel(expense.category)}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                            {sym}{expense.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <form action={deleteExpenseAction.bind(null, expense.id)}>
                              <button
                                type="submit"
                                title="Delete Expense"
                                className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </form>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
