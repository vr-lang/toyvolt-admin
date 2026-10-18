import React from 'react';
import { CheckSquare, Square, Printer, Truck, MessageSquare, X } from 'lucide-react';

export const OrdersBulkToolbar = ({
  selectedCount = 0,
  totalVisible = 0,
  isAllSelected = false,
  onToggleSelectAll,
  onClearSelection,
  onBatchPrint,
  onBatchShip,
  onOpenWhatsApp
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-[#171717] text-white p-2.5 md:p-3 border-2 border-[#171717] shadow-[3px_3px_0px_#315FE8] mb-3 flex flex-wrap items-center justify-between gap-3">
      {/* Left: Selection count & select all toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSelectAll}
          className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase hover:text-[#FFD983] transition-colors"
        >
          {isAllSelected ? (
            <CheckSquare size={16} className="text-[#315FE8]" />
          ) : (
            <Square size={16} />
          )}
          <span>
            {isAllSelected ? 'Deselect All' : `Select Page (${totalVisible})`}
          </span>
        </button>

        <span className="text-gray-500">|</span>

        <span className="text-xs font-mono font-bold text-[#FFD983] bg-[#262626] px-2 py-0.5 border border-gray-700">
          {selectedCount} ORDER{selectedCount === 1 ? '' : 'S'} SELECTED
        </span>
      </div>

      {/* Right: Quick Bulk Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onBatchPrint}
          className="px-2.5 py-1.5 bg-white hover:bg-gray-100 text-[#171717] text-xs font-mono font-bold uppercase border border-white flex items-center gap-1.5 transition-colors"
        >
          <Printer size={13} />
          <span>Print Labels / Slips</span>
        </button>

        <button
          type="button"
          onClick={onBatchShip}
          className="px-2.5 py-1.5 bg-[#315FE8] hover:bg-[#254bc0] text-white text-xs font-mono font-bold uppercase border border-[#315FE8] flex items-center gap-1.5 transition-colors"
        >
          <Truck size={13} />
          <span>Batch Ship / Fulfill</span>
        </button>

        <button
          type="button"
          onClick={onOpenWhatsApp}
          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase border border-emerald-500 flex items-center gap-1.5 transition-colors"
        >
          <MessageSquare size={13} />
          <span className="hidden sm:inline">WhatsApp Update</span>
        </button>

        <button
          type="button"
          onClick={onClearSelection}
          className="p-1.5 text-gray-400 hover:text-white transition-colors"
          title="Clear Selection"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

export default OrdersBulkToolbar;
