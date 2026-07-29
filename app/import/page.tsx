"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { importExcelAction } from "@/app/actions";

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    totalRows: number;
    importedCount: number;
    failedCount: number;
  } | null>(null);

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
      <div>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-outfit tracking-tight">
          Import Charging History
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Upload your existing Excel (`.xlsx`, `.xls`) or `.csv` charging spreadsheets into EV Tracker.
        </p>
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
                    Click to select Excel / CSV file
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">Supports .xlsx, .xls, and .csv formats</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{loading ? "Parsing & Importing..." : "Start Import Pipeline"}</span>
            </button>
          </form>

          {/* Feedback Result Card */}
          {result && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-sm font-outfit">
                <CheckCircle2 className="w-4 h-4" />
                <span>Import Completed Successfully</span>
              </div>
              <p>
                Processed {result.totalRows} total rows: <strong>{result.importedCount} valid sessions imported</strong> to your vehicle profile.
              </p>
              {result.failedCount > 0 && (
                <p className="text-amber-600 dark:text-amber-400">
                  ⚠️ {result.failedCount} rows were skipped due to missing date or negative energy values.
                </p>
              )}
            </div>
          )}
        </section>

        {/* Guidelines Card */}
        <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-outfit uppercase tracking-wider">
            Expected Headers
          </h3>

          <p className="text-xs text-neutral-500">
            The import engine automatically maps common column names. Ensure your sheet includes:
          </p>

          <ul className="text-xs space-y-2 text-neutral-700 dark:text-neutral-300 font-medium">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span><strong>Date:</strong> Date, Charging Date, Tarih</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span><strong>Energy:</strong> kWh, Energy (kWh), Enerji</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span><strong>Cost:</strong> Cost ($), Price, Maliyet, Tutar</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span><strong>Type:</strong> AC, DC, Fast, Tip</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span><strong>Provider:</strong> Provider, Network, İstasyon</span>
            </li>
          </ul>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400">
            Invalid rows are automatically reported and will not break valid imports.
          </div>
        </section>
      </div>
    </div>
  );
}
