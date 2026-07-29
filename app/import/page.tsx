"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { importExcelAction } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    totalRows: number;
    importedCount: number;
    failedCount: number;
  } | null>(null);
  const { t, language } = useLanguage();

  const handleDownloadTemplate = () => {
    const isTr = language === "tr";
    const sampleData = [
      {
        [isTr ? "Tarih" : "Date"]: "2026-06-15",
        [isTr ? "Enerji (kWh)" : "Energy (kWh)"]: 45.2,
        [isTr ? "Maliyet" : "Cost"]: 22.60,
        [isTr ? "Tip" : "Charging Type"]: "DC",
        [isTr ? "İstasyon" : "Provider"]: "Tesla Supercharger",
        [isTr ? "Kilometre" : "Odometer (km)"]: 18500,
        [isTr ? "Notlar" : "Notes"]: "Highway Rest Stop #4",
      },
      {
        [isTr ? "Tarih" : "Date"]: "2026-06-18",
        [isTr ? "Enerji (kWh)" : "Energy (kWh)"]: 28.0,
        [isTr ? "Maliyet" : "Cost"]: 4.20,
        [isTr ? "Tip" : "Charging Type"]: "AC",
        [isTr ? "İstasyon" : "Provider"]: "Home Wallbox",
        [isTr ? "Kilometre" : "Odometer (km)"]: 18670,
        [isTr ? "Notlar" : "Notes"]: "Overnight AC Charge",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Charging Sessions");
    XLSX.writeFile(
      workbook,
      isTr ? "ev_tracker_sarj_sablonu.xlsx" : "ev_tracker_charging_template.xlsx"
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await importExcelAction(formData);
      setResult(res);
    } catch (err: any) {
      alert(err.message || "Failed to process Excel file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
            {t("importTitle")}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {t("importDesc")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-xl font-bold text-xs shadow-sm active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4 text-emerald-500" />
          <span>{t("downloadTemplate")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Form Card */}
        <section className="md:col-span-2 bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-100 rounded-2xl p-8 text-center transition-all cursor-pointer group bg-neutral-50/50 dark:bg-neutral-950/30">
              <input
                type="file"
                name="file"
                accept=".xlsx,.xls,.csv"
                required
                className="hidden"
                id="excel-upload-input"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const label = document.getElementById("file-label");
                    if (label) label.textContent = e.target.files[0].name;
                  }
                }}
              />
              <label htmlFor="excel-upload-input" className="cursor-pointer block space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100 mx-auto group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <p id="file-label" className="text-sm font-bold text-neutral-900 dark:text-white">
                    {t("clickToUpload")}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">{t("supportsFormats")}</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{loading ? t("parsing") : t("startImport")}</span>
            </button>
          </form>

          {/* Feedback Result Card */}
          {result && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-sm font-outfit">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t("importCompleted")}</span>
              </div>
              <p>
                {language === "tr"
                  ? `Toplam ${result.totalRows} satır işlendi: ${result.importedCount} geçerli şarj oturumu aracınıza aktarıldı.`
                  : `Processed ${result.totalRows} total rows: ${result.importedCount} valid sessions imported to your vehicle profile.`}
              </p>
            </div>
          )}
        </section>

        {/* Guidelines Card */}
        <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-outfit uppercase tracking-wider">
              {t("expectedHeaders")}
            </h3>
            <p className="text-xs text-neutral-500">
              {t("templateDesc")}
            </p>
          </div>

          <ul className="text-xs space-y-2 text-neutral-700 dark:text-neutral-300 font-medium pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span><strong>{t("tableDate")}:</strong> Date, Charging Date, Tarih</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span><strong>{t("tableEnergy")}:</strong> kWh, Energy (kWh), Enerji</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span><strong>{t("tableCost")}:</strong> Cost ($), Price, Maliyet, Tutar</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span><strong>{t("tableType")}:</strong> AC, DC, Fast, Tip</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span><strong>{t("tableProvider")}:</strong> Provider, Network, İstasyon</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
