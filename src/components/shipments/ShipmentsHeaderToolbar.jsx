import React from 'react';
import {
  Truck,
  Download,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  PlugZap,
  Clock,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const ShipmentsHeaderToolbar = ({
  shippingIntegration = {},
  selectedCount = 0,
  syncing = false,
  onSyncTelemetry,
  onDownloadManifest,
  onBulkNdrModal,
  onRefresh,
  onExportCSV
}) => {
  const isConfigured = Boolean(shippingIntegration?.isShiprocketConfigured);
  const connectionStatus = shippingIntegration?.connectionStatus || 'unconfigured';
  const lastSynced = shippingIntegration?.lastSyncedAt
    ? new Date(shippingIntegration.lastSyncedAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-[#171717] pb-4">
      {/* Title, Breadcrumb & Integration Status */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 bg-[#315FE8] border border-[#171717]" />
          <p className="font-mono text-xs font-bold tracking-widest uppercase text-gray-600">
            ADMIN / FULFILLMENT / SHIPMENTS & LOGISTICS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono font-black text-2xl md:text-3xl tracking-tight uppercase text-[#171717]">
            SHIPMENTS & CARRIER DISPATCH
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-mono text-[10px] font-bold">
            <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            LIVE TELEMETRY
          </span>
        </div>

        {/* Compact Integration Status Indicator */}
        <div className="flex flex-wrap items-center gap-2 mt-1.5 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-[#171717] text-[10px] font-bold">
            <PlugZap size={11} className={isConfigured ? 'text-emerald-600' : 'text-amber-600'} />
            <span className="text-gray-500 uppercase">SHIPROCKET API STATUS:</span>
            {isConfigured ? (
              <span className="text-emerald-700 uppercase font-black">CONNECTED</span>
            ) : (
              <span className="text-amber-800 uppercase font-black">CONFIGURATION REQUIRED</span>
            )}
          </div>

          {lastSynced && (
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <Clock size={10} />
              <span>Synced at {lastSynced}</span>
            </span>
          )}
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={syncing}
          className="px-2.5 py-2 bg-white hover:bg-gray-100 text-[#171717] font-mono font-bold text-xs border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
          title="Refresh shipment queue"
        >
          <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">REFRESH</span>
        </button>

        <button
          type="button"
          onClick={onExportCSV}
          className="px-3 py-2 bg-white hover:bg-[#FFF9F0] text-[#171717] font-mono font-bold text-xs border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5"
          title="Export CSV of visible/selected shipments"
        >
          <FileSpreadsheet size={14} />
          <span className="hidden md:inline">EXPORT CSV</span>
        </button>

        <button
          type="button"
          onClick={onDownloadManifest}
          className="px-3.5 py-2 bg-white hover:bg-[#FFF9F0] text-[#171717] font-mono font-bold text-xs border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5"
        >
          <Download size={14} />
          <span>DOWNLOAD MANIFEST {selectedCount > 0 ? `(${selectedCount})` : ''}</span>
        </button>

        <button
          type="button"
          onClick={onSyncTelemetry}
          disabled={syncing}
          className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-gray-100 text-[#171717] font-mono font-bold text-xs border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
        >
          <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
          <span>SYNC TELEMETRY</span>
        </button>

        <button
          type="button"
          onClick={onBulkNdrModal}
          className="px-4 py-2 bg-[#FF5638] hover:bg-[#e04529] text-white font-mono font-bold text-xs border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5"
        >
          <AlertTriangle size={14} />
          <span>BULK NDR RE-ATTEMPT</span>
        </button>
      </div>
    </div>
  );
};

export default ShipmentsHeaderToolbar;
