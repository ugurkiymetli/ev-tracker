"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowRight,
  RefreshCw,
  Zap,
} from "lucide-react";
import * as XLSX from "xlsx";
import { previewImportExcelAction, confirmImportExcelAction } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";
import { ImportParseResult, ParsedChargingSessionRow } from "@/server/importers/excel-importer";

export default function ImportPage() {
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<ImportParseResult | null>(null);
  const [importResult, setImportResult] = useState<{ importedCount: number } | null>(null);
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

  const handlePreviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setParsing(true);
    setPreview(null);
    setImportResult(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await previewImportExcelAction(formData);
      setPreview(res);
    } catch (err: any) {
      alert(err.message || "Failed to process Excel file.");
    } finally {
      setParsing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!preview) return;

    const validRows = preview.previewRows
      .filter((r) => r.isValid && r.parsed)
      .map((r) => r.parsed!);

    if (validRows.length === 0) {
      alert("No valid rows to import.");
      return;
    }

    setSaving(true);
    try {
      const res = await confirmImportExcelAction(validRows);
      setImportResult({ importedCount: res.importedCount });
    } catch (err: any) {
      alert(err.message || "Failed to import sessions.");
    } finally {
      setSaving(false);
    }
  };

  const validRowsList: ParsedChargingSessionRow[] = preview
    ? preview.previewRows.filter((r) => r.isValid && r.parsed).map((r) => r.parsed!)
    : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
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

      {/* SUCCESS STATE */}
      {importResult ? (
        <section className="bg-white dark:bg-neutral-900/40 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl text-center space-y-5 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white font-outfit">
              {t("importCompleted")}
            </h3>
            <p className="text-xs text-neutral-500">
              {language === "tr"
                ? `Toplam ${importResult.importedCount} şarj oturumu ve istasyon verisi veritabanınıza kaydedildi.`
                : `Successfully saved ${importResult.importedCount} charging sessions and network providers to your vehicle database.`}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setPreview(null);
                setImportResult(null);
              }}
              className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-bold text-xs border border-neutral-200 dark:border-neutral-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t("selectAnotherFile")}</span>
            </button>
            <Link
              href="/charging"
              className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{t("viewFullHistory")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      ) : preview ? (
        /* STEP 2: PREVIEW DATA TABLE */
        <section className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-outfit">
                {t("previewTitle")}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">{t("previewDesc")}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {preview.validRowsCount} {t("validRows")}
              </span>
              {preview.invalidRowsCount > 0 && (
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  {preview.invalidRowsCount} {t("invalidRows")}
                </span>
              )}
            </div>
          </div>

          <datalist id="preview-providers-datalist">
            {preview.allProviders?.map((prov) => (
              <option key={prov.id} value={prov.name} />
            ))}
          </datalist>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-3">#</th>
                  <th className="px-3 py-3">{t("tableDate")}</th>
                  <th className="px-3 py-3">{t("tableProvider")}</th>
                  <th className="px-3 py-3">{t("tableType")}</th>
                  <th className="px-3 py-3">{t("tableEnergy")}</th>
                  <th className="px-3 py-3">{t("tableCost")}</th>
                  <th className="px-3 py-3">{t("tableOdometer")}</th>
                  <th className="px-3 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-medium">
                {preview.previewRows.map((row) => {
                  const p = row.parsed;
                  return (
                    <tr
                      key={row.rowIndex}
                      className={
                        row.isValid
                          ? "hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                          : "bg-rose-500/5 hover:bg-rose-500/10"
                      }
                    >
                      <td className="px-3 py-3 text-neutral-400">{row.rowIndex}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {p ? new Date(p.date).toISOString().split("T")[0] : String(row.raw.date || row.raw.Tarih || "-")}
                      </td>
                      <td className="px-3 py-3">
                        {p ? (
                          <input
                            type="text"
                            list="preview-providers-datalist"
                            value={p.providerName || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPreview((prev) => {
                                if (!prev) return null;
                                const nextRows = prev.previewRows.map((r) => {
                                  if (r.rowIndex === row.rowIndex && r.parsed) {
                                    return {
                                      ...r,
                                      parsed: { ...r.parsed, providerName: val },
                                    };
                                  }
                                  return r;
                                });
                                return { ...prev, previewRows: nextRows };
                              });
                            }}
                            placeholder="Şarj İstasyonu / Marka"
                            className="glass-input px-2.5 py-1 text-xs rounded-lg font-bold w-44 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                          />
                        ) : (
                          <span className="text-neutral-400 italic">Unspecified</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p?.chargingType === "DC"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {p?.chargingType || "AC"}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-bold">
                        {p ? `${p.energyChargedKwh} kWh` : "-"}
                      </td>
                      <td className="px-3 py-3 font-bold">
                        {p ? `${p.cost.toFixed(2)}` : "-"}
                      </td>
                      <td className="px-3 py-3 text-neutral-500">
                        {p?.odometerKm ? `${p.odometerKm} km` : "-"}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {row.isValid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t("statusValid")}</span>
                          </span>
                        ) : (
                          <span
                            title={row.errors.join("; ")}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20"
                          >
                            <AlertCircle className="w-3 h-3" />
                            <span>{t("statusInvalid")}</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="w-full sm:w-auto py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-bold text-xs border border-neutral-200 dark:border-neutral-700 transition-all cursor-pointer"
            >
              {t("selectAnotherFile")}
            </button>

            <button
              type="button"
              disabled={saving || validRowsList.length === 0}
              onClick={handleConfirmImport}
              className="w-full sm:w-auto py-3 px-6 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs shadow-lg hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {saving
                  ? t("savingSessions")
                  : `${t("confirmImport")} (${validRowsList.length})`}
              </span>
            </button>
          </div>
        </section>
      ) : (
        /* STEP 1: UPLOAD FILE FORM */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2 bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-5">
            <form onSubmit={handlePreviewSubmit} className="space-y-5">
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
                disabled={parsing}
                className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{parsing ? t("parsing") : t("startImport")}</span>
              </button>
            </form>
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
      )}
    </div>
  );
}
