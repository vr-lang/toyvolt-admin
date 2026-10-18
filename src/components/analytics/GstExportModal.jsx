import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, FileJson, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import analyticsService from '../../services/analyticsService';

export const GstExportModal = ({ isOpen, onClose, data = {} }) => {
  if (!isOpen) return null;

  const [exportFormat, setExportFormat] = useState('csv');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [error, setError] = useState(null);

  const orders = data.rawOrders || [];
  const gmvRupees = data.kpis?.gmvRupees || 0;
  const taxableRupees = Math.round((gmvRupees / 1.18) * 100) / 100;
  const totalGstRupees = Math.round((gmvRupees - taxableRupees) * 100) / 100;

  const handleExport = () => {
    setError(null);
    try {
      const result = analyticsService.generateGstr1Export(data, exportFormat);
      const blob = new Blob([result.data], { type: `${result.mimeType};charset=utf-8;` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', result.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to generate GSTR-1 export.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-panel border-2 border-ink shadow-[6px_6px_0px_#171717] p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <FileSpreadsheet className="w-4 h-4 text-[#315FE8]" />
            </div>
            <div>
              <h3 className="font-display font-black text-base uppercase tracking-tight text-ink">
                GSTR-1 TAX LEDGER EXPORT
              </h3>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                B2C Small (B2CS) Invoices • HSN 9503 (Toys) • 18% GST Rate
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 border border-ink bg-white hover:bg-[#F0EEEE] shadow-[1px_1px_0px_#171717]"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error notification if empty */}
        {error && (
          <div className="p-3 bg-[#FF5638] text-white border-2 border-ink font-mono text-xs">
            ⚠️ {error}
          </div>
        )}

        {/* Tax Breakdown Summary Box */}
        <div className="p-3.5 bg-[#FFF9F0] border-2 border-ink shadow-[2px_2px_0px_#171717] space-y-2 font-mono text-xs">
          <div className="font-bold text-[#315FE8] uppercase text-[11px] pb-1 border-b border-ink/20">
            GST COMPLIANCE SUMMARY (INDIA)
          </div>
          <div className="grid grid-cols-2 gap-2 text-ink">
            <div>
              <span className="text-[#6E6E6E] text-[10px] block">TOTAL INVOICE VALUE</span>
              <strong className="text-sm font-display">{formatCurrencyINR(gmvRupees)}</strong>
            </div>
            <div>
              <span className="text-[#6E6E6E] text-[10px] block">ESTIMATED TAXABLE VALUE</span>
              <strong className="text-sm font-display">{formatCurrencyINR(taxableRupees)}</strong>
            </div>
            <div>
              <span className="text-[#6E6E6E] text-[10px] block">TOTAL GST (18%)</span>
              <strong className="text-sm font-display text-emerald-800">{formatCurrencyINR(totalGstRupees)}</strong>
            </div>
            <div>
              <span className="text-[#6E6E6E] text-[10px] block">TRANSACTIONS COUNT</span>
              <strong className="text-sm font-display">{orders.length} Verified Invoices</strong>
            </div>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="font-bold uppercase text-[11px] text-ink block">
            SELECT EXPORT FORMAT:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`p-3 border-2 border-ink cursor-pointer flex items-center gap-2 transition-all ${
                exportFormat === 'csv'
                  ? 'bg-[#315FE8] text-white shadow-[2px_2px_0px_#171717]'
                  : 'bg-white text-ink hover:bg-[#F0EEEE]'
              }`}
            >
              <input
                type="radio"
                name="gstFormat"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={() => setExportFormat('csv')}
                className="hidden"
              />
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              <div>
                <strong className="block text-xs uppercase">CSV LEDGER</strong>
                <span className="text-[10px] opacity-80 block">Standard spreadsheet for CA audit</span>
              </div>
            </label>

            <label
              className={`p-3 border-2 border-ink cursor-pointer flex items-center gap-2 transition-all ${
                exportFormat === 'json'
                  ? 'bg-[#315FE8] text-white shadow-[2px_2px_0px_#171717]'
                  : 'bg-white text-ink hover:bg-[#F0EEEE]'
              }`}
            >
              <input
                type="radio"
                name="gstFormat"
                value="json"
                checked={exportFormat === 'json'}
                onChange={() => setExportFormat('json')}
                className="hidden"
              />
              <FileJson className="w-4 h-4 shrink-0" />
              <div>
                <strong className="block text-xs uppercase">JSON (GSTN)</strong>
                <span className="text-[10px] opacity-80 block">Official GST Portal offline schema</span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t-2 border-ink flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="brutal-btn bg-white hover:bg-[#F0EEEE] text-ink text-xs px-4 py-2"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={orders.length === 0}
            className="brutal-btn brutal-btn-primary text-xs px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                DOWNLOADED!
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-white" />
                DOWNLOAD GSTR-1 {exportFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GstExportModal;
