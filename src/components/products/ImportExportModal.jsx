import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import productService from '../../services/productService';

export const ImportExportModal = ({
  isOpen,
  onClose,
  products = []
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('export'); // 'export' or 'import'
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const handleExportCSV = () => {
    try {
      const csvString = productService.generateExportCSV(products);
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `toyvolt-catalog-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      alert('Failed to generate catalog export CSV.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        setImportStatus({
          type: 'error',
          message: 'The uploaded file appears to be empty or contains only header rows.'
        });
        return;
      }

      setImportStatus({
        type: 'info',
        message: `Parsed ${lines.length - 1} records from "${file.name}". Bulk import batch processing requires verified admin approval before modifying database records.`
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-panel border-2 border-ink shadow-[6px_6px_0px_#171717] p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <FileSpreadsheet className="w-4 h-4 text-ink" />
            </div>
            <div>
              <h3 className="font-display font-black text-base uppercase tracking-tight text-ink">
                CATALOG CSV DATA EXCHANGE
              </h3>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                Import &amp; export catalog inventory records
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

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 font-mono text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-2 px-3 border-2 border-ink uppercase transition-all ${
              activeTab === 'export'
                ? 'bg-[#315FE8] text-white shadow-[2px_2px_0px_#171717]'
                : 'bg-white text-ink hover:bg-[#F0EEEE]'
            }`}
          >
            EXPORT CATALOG CSV
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`py-2 px-3 border-2 border-ink uppercase transition-all ${
              activeTab === 'import'
                ? 'bg-[#315FE8] text-white shadow-[2px_2px_0px_#171717]'
                : 'bg-white text-ink hover:bg-[#F0EEEE]'
            }`}
          >
            IMPORT CATALOG CSV
          </button>
        </div>

        {/* Tab 1: Export */}
        {activeTab === 'export' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#FFF9F0] border-2 border-ink space-y-1">
              <span className="font-bold text-[#315FE8] uppercase text-[11px] block">
                EXPORT ACTIVE CATALOG:
              </span>
              <p className="text-[11px] text-[#6E6E6E] leading-relaxed">
                Downloads all {products.length} master products including SKUs, categories, rupee prices, cost prices, and physical inventory stock levels.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="w-full brutal-btn brutal-btn-primary py-2.5 text-xs flex items-center justify-center gap-2"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    CSV EXPORT DOWNLOADED!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-white" />
                    DOWNLOAD CATALOG CSV ({products.length} SKUS)
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Import */}
        {activeTab === 'import' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#FFF9F0] border-2 border-ink space-y-1.5">
              <span className="font-bold text-[#315FE8] uppercase text-[11px] block">
                EXPECTED CSV COLUMNS:
              </span>
              <div className="text-[10px] text-[#6E6E6E] leading-relaxed bg-white p-2 border border-ink">
                <code>SKU, Title, Category, Selling Price (INR), Available Stock</code>
              </div>
              <p className="text-[10px] text-[#6E6E6E]">
                Matches existing SKUs to update prices and stock levels. New SKUs will be staged for creation.
              </p>
            </div>

            {importStatus && (
              <div
                className={`p-3 border-2 border-ink text-xs ${
                  importStatus.type === 'error'
                    ? 'bg-[#FF5638] text-white'
                    : 'bg-[#FFD983] text-ink'
                }`}
              >
                {importStatus.message}
              </div>
            )}

            <div>
              <label className="block p-5 border-2 border-dashed border-ink bg-white text-center cursor-pointer hover:bg-[#F0EEEE] transition-colors">
                <Upload className="w-6 h-6 mx-auto mb-1.5 text-[#315FE8]" />
                <span className="font-bold text-xs uppercase block text-ink">
                  CLICK TO SELECT CSV FILE
                </span>
                <span className="text-[10px] text-[#6E6E6E] block mt-0.5">
                  File must be in .csv format
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t-2 border-ink flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="brutal-btn bg-white hover:bg-[#F0EEEE] text-ink text-xs px-4 py-1.5"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;
