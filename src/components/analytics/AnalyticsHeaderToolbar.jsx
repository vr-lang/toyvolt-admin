import React from 'react';
import {
  Calendar,
  FileSpreadsheet,
  Download,
  FileText,
  RefreshCw,
  Activity,
  CheckCircle2
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const AnalyticsHeaderToolbar = ({
  timeframe = '30d',
  onTimeframeChange,
  isRefreshing = false,
  onRefresh,
  lastUpdated,
  isRealTime = true,
  onOpenGstModal,
  onExportFullCsv,
  onOpenDigestModal
}) => {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    : 'LIVE';

  return (
    <div className="space-y-4 pb-2 border-b-2 border-ink">
      {/* Top Row: Breadcrumb & Meta info */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-ink">
          <span className="text-[#6E6E6E]">CONSOLE</span>
          <span className="text-[#6E6E6E]">/</span>
          <span className="text-[#315FE8]">ANALYTICS &amp; INTELLIGENCE</span>
          <span className="text-[#6E6E6E]">/</span>
          <span className="bg-[#DCE5FF] px-1.5 py-0.5 border border-ink">
            EXECUTIVE OVERVIEW
          </span>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2">
          {isRealTime ? (
            <StatusBadge variant="success" size="sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse mr-1" />
              REAL-TIME DATA • SYNCED {formattedTime}
            </StatusBadge>
          ) : (
            <StatusBadge variant="warning" size="sm">
              <Activity className="w-2.5 h-2.5 text-ink mr-1" />
              CACHED SNAPSHOT
            </StatusBadge>
          )}

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="brutal-btn bg-white hover:bg-[#FFF9F0] text-ink text-xs px-2.5 py-1 flex items-center gap-1 shadow-[2px_2px_0px_#171717]"
            title="Re-sync data from live database"
          >
            <RefreshCw
              className={`w-3 h-3 text-[#315FE8] ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span className="font-mono text-[10px] font-bold">
              {isRefreshing ? 'SYNCING...' : 'SYNC'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tighter text-ink leading-tight">
            ANALYTICS &amp; FINANCIAL INTELLIGENCE
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-[#6E6E6E] mt-1">
            <span>Executive performance, unit economics, state distribution, and tax audit telemetry.</span>
            <span className="text-ink font-bold">•</span>
            <span className="text-ink font-semibold">
              Prior Period: <span className="text-[#315FE8]">Baseline Launch Window (No Prior Period)</span>
            </span>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Selector Button Group */}
          <div className="flex items-center border-2 border-ink bg-white shadow-[2.5px_2.5px_0px_#171717] p-0.5">
            {[
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '90d', label: '90D' },
              { id: 'all', label: 'ALL' }
            ].map((tf) => {
              const active = timeframe === tf.id;
              return (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => onTimeframeChange(tf.id)}
                  className={`font-mono text-xs font-bold uppercase px-2.5 py-1 transition-all ${
                    active
                      ? 'bg-[#315FE8] text-white shadow-[1px_1px_0px_#171717]'
                      : 'text-ink hover:bg-[#F0EEEE]'
                  }`}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>

          {/* Action 1: GSTR-1 JSON/CSV Export */}
          <button
            type="button"
            onClick={onOpenGstModal}
            className="brutal-btn bg-[#FFF9F0] hover:bg-white text-ink text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-[2.5px_2.5px_0px_#171717]"
            title="Export official Indian GST GSTR-1 Tax Ledger in JSON or CSV format"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#315FE8]" />
            <span className="font-mono font-bold text-[11px]">GST-1 JSON/CSV</span>
          </button>

          {/* Action 2: FULL CSV Export */}
          <button
            type="button"
            onClick={onExportFullCsv}
            className="brutal-btn bg-white hover:bg-[#F0EEEE] text-ink text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-[2.5px_2.5px_0px_#171717]"
            title="Download comprehensive executive metrics dataset CSV"
          >
            <Download className="w-3.5 h-3.5 text-ink" />
            <span className="font-mono font-bold text-[11px]">FULL CSV</span>
          </button>

          {/* Action 3: DIGEST Summary */}
          <button
            type="button"
            onClick={onOpenDigestModal}
            className="brutal-btn brutal-btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-[2.5px_2.5px_0px_#171717]"
            title="Generate executive intelligence summary digest"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span className="font-mono font-bold text-[11px]">DIGEST</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeaderToolbar;
