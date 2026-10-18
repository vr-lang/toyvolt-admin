import React from 'react';
import { Download, ShieldCheck, UserPlus, RefreshCw, Sparkles, Users } from 'lucide-react';

export default function CustomersHeaderToolbar({
  onExportCSV,
  onOpenTierRules,
  onOpenAddCustomer,
  onRefresh,
  refreshing = false,
  totalCustomers = 0
}) {
  return (
    <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-4 sm:p-5 font-mono">
      {/* Breadcrumb & Sub-System Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-neutral-600 font-bold uppercase tracking-wider">
          <span>ADMIN</span>
          <span>/</span>
          <span>CUSTOMERS & GROWTH</span>
          <span>/</span>
          <span className="text-neutral-900 bg-[#FFD983] px-1.5 py-0.5 border border-neutral-900">
            CUSTOMER DIRECTORY & PLAY LOYALTY CLUB
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold border border-neutral-900 bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            PLAY CLUB ENGINE: ACTIVE
          </span>
          <span className="text-[10px] text-neutral-500 font-bold">
            {totalCustomers} REGISTERED PARENTS
          </span>
        </div>
      </div>

      {/* Title & Action Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#315FE8]" />
            CUSTOMER DIRECTORY & PLAY LOYALTY CLUB
          </h1>
          <p className="text-xs text-neutral-600 mt-1 max-w-2xl font-sans">
            Manage parent profiles, purchase history, loyalty points, and customer engagement.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="p-2 border-2 border-neutral-900 bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_#000] text-neutral-900 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 border-2 border-neutral-900 bg-white hover:bg-neutral-100 shadow-[3px_3px_0px_#000] text-xs font-bold text-neutral-900 flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT AUDIENCE CSV</span>
          </button>

          <button
            onClick={onOpenTierRules}
            className="px-3.5 py-2 border-2 border-neutral-900 bg-[#FFD983] hover:bg-[#fed166] shadow-[3px_3px_0px_#000] text-xs font-bold text-neutral-900 flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>LOYALTY TIER RULES</span>
          </button>

          <button
            onClick={onOpenAddCustomer}
            className="px-4 py-2 border-2 border-neutral-900 bg-[#315FE8] hover:bg-[#254bc4] shadow-[3px_3px_0px_#000] text-xs font-bold text-white flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ ADD NEW CUSTOMER / OFFLINE PARENT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
