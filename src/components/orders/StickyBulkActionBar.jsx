import React from 'react';
import { Printer, Truck, X, Layers, CheckSquare } from 'lucide-react';
import { formatINR } from '../../services/orderService';

export const StickyBulkActionBar = ({
  selectedOrders = [],
  onClearSelection,
  onBatchPrint,
  onBatchShip
}) => {
  if (!selectedOrders || selectedOrders.length === 0) return null;

  const totalPaise = selectedOrders.reduce((acc, o) => acc + (o.finalAmount || 0), 0);

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-[260px] md:right-8 z-40 animate-in slide-in-from-bottom duration-200">
      <div className="bg-[#171717] text-white border-4 border-[#171717] shadow-[6px_6px_0px_#315FE8] p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Selected count & total combined value */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#315FE8] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-white">
            <CheckSquare size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm tracking-wider uppercase text-white">
                {selectedOrders.length} ORDER{selectedOrders.length === 1 ? '' : 'S'} SELECTED
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#262626] text-[#FFD983] px-2 py-0.5 border border-gray-700">
                COMBINED: {formatINR(totalPaise, true)}
              </span>
            </div>
            <p className="text-[10px] font-mono text-gray-400 mt-0.5">
              Bulk actions will execute sequentially with real-time audit logging.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBatchPrint}
            className="px-3.5 py-2 bg-white hover:bg-gray-100 text-[#171717] text-xs font-mono font-bold uppercase border-2 border-white shadow-[2px_2px_0px_#315FE8] flex items-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <Printer size={13} />
            <span>Batch Print Slips</span>
          </button>

          <button
            type="button"
            onClick={onBatchShip}
            className="px-4 py-2 bg-[#315FE8] hover:bg-[#254bc0] text-white text-xs font-mono font-bold uppercase tracking-wider border-2 border-white shadow-[2px_2px_0px_#FFD983] flex items-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <Truck size={13} />
            <span>Generate Shipping Labels</span>
          </button>

          <button
            type="button"
            onClick={onClearSelection}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Deselect All"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyBulkActionBar;
