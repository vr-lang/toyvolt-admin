import React, { useState } from 'react';
import {
  X,
  Truck,
  Layers,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  IndianRupee,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { orderService, formatINR } from '../../services/orderService';

const LIFECYCLE_STATUS_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed (Inventory Reserved)' },
  { value: 'processing', label: 'Processing (Ready for Dispatch)' },
  { value: 'shipped', label: 'Shipped (In-Transit)' },
  { value: 'delivered', label: 'Delivered (Completed)' },
  { value: 'cancelled', label: 'Cancelled (Release Stock)' }
];

export const BulkFulfillmentModal = ({
  isOpen = false,
  selectedOrders = [],
  onClose,
  onCompleted
}) => {
  const [actionMode, setActionMode] = useState('labels'); // 'labels' | 'status'
  const [targetStatus, setTargetStatus] = useState('processing');
  const [cancellationReason, setCancellationReason] = useState('Bulk batch cancellation');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  const totalPaise = selectedOrders.reduce((acc, o) => acc + (o.finalAmount || 0), 0);
  const orderIds = selectedOrders.map(o => o._id);

  const handleStartProcessing = async () => {
    setIsProcessing(true);
    setResults(null);
    setProgress({ current: 0, total: orderIds.length });

    try {
      if (actionMode === 'labels') {
        const res = await orderService.bulkCreateShipments(orderIds);
        setResults(res);
      } else {
        const res = await orderService.bulkUpdateStatus(orderIds, targetStatus);
        setResults(res);
      }
      if (onCompleted) {
        onCompleted();
      }
    } catch (err) {
      setResults({
        total: orderIds.length,
        successCount: 0,
        failedCount: orderIds.length,
        errors: [err.response?.data?.message || err.message || 'Bulk execution failed.']
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setProgress({ current: 0, total: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F7F3EB] border-4 border-[#171717] shadow-[8px_8px_0px_#171717] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#171717] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#171717] shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#315FE8] border border-white" />
            <div>
              <h3 className="font-mono font-bold text-sm tracking-wider uppercase text-white">
                BATCH FULFILLMENT & LOGISTICS OPERATIONS
              </h3>
              <p className="text-[10px] font-mono text-gray-400">
                Bulk action targeting {selectedOrders.length} selected orders ({formatINR(totalPaise, true)})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-7 h-7 bg-white hover:bg-[#FF5638] text-[#171717] hover:text-white flex items-center justify-center border border-white transition-colors disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 space-y-5 overflow-y-auto">
          {!results ? (
            <>
              {/* Selected Orders Overview */}
              <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-3.5">
                <div className="flex items-center justify-between border-b-2 border-[#171717] pb-2 mb-2 font-mono text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#171717]">
                    TARGET BATCH SCOPE
                  </span>
                  <span className="font-bold bg-[#E8EEFF] text-[#315FE8] px-2 py-0.5 border border-[#315FE8]">
                    {selectedOrders.length} ORDERS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block">Combined Value</span>
                    <span className="font-bold text-sm text-[#171717]">{formatINR(totalPaise, true)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block">Order IDs in Batch</span>
                    <span className="font-bold text-[11px] text-gray-700 truncate block">
                      {selectedOrders.slice(0, 3).map(o => o.orderNumber || o._id).join(', ')}
                      {selectedOrders.length > 3 ? ` +${selectedOrders.length - 3} more` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Mode Choice */}
              <div className="space-y-3 font-mono">
                <label className="block font-bold text-xs uppercase text-[#171717]">
                  SELECT BULK ACTION TYPE:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    onClick={() => !isProcessing && setActionMode('labels')}
                    className={`border-2 p-3 cursor-pointer transition-colors ${
                      actionMode === 'labels'
                        ? 'border-[#171717] bg-[#315FE8] text-white shadow-[3px_3px_0px_#171717]'
                        : 'border-[#171717] bg-white hover:bg-gray-100 text-[#171717]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Truck size={16} />
                      <h4 className="font-bold text-xs uppercase">Generate Labels / Book AWB</h4>
                    </div>
                    <p className={`text-[10px] ${actionMode === 'labels' ? 'text-blue-100' : 'text-gray-600'}`}>
                      Sends orders to Shiprocket carrier dispatch queue to assign AWB & courier partners.
                    </p>
                  </div>

                  <div
                    onClick={() => !isProcessing && setActionMode('status')}
                    className={`border-2 p-3 cursor-pointer transition-colors ${
                      actionMode === 'status'
                        ? 'border-[#171717] bg-[#FFD983] text-[#171717] shadow-[3px_3px_0px_#171717]'
                        : 'border-[#171717] bg-white hover:bg-gray-100 text-[#171717]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Layers size={16} />
                      <h4 className="font-bold text-xs uppercase">Batch Lifecycle Status</h4>
                    </div>
                    <p className="text-[10px] text-gray-700">
                      Instantly change status (e.g. Processing, Shipped, Delivered) across all selected rows.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-options for status change */}
              {actionMode === 'status' && (
                <div className="bg-white border-2 border-[#171717] p-3.5 space-y-3 font-mono text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-[#171717]">
                      TARGET STATUS FOR ALL {selectedOrders.length} ORDERS:
                    </label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value)}
                      disabled={isProcessing}
                      className="w-full bg-[#F7F3EB] border-2 border-[#171717] px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                    >
                      {LIFECYCLE_STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {targetStatus === 'cancelled' && (
                    <div>
                      <label className="block font-bold mb-1 text-red-700">
                        CANCELLATION REASON (MANDATORY):
                      </label>
                      <input
                        type="text"
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        placeholder="Reason for cancellation..."
                        className="w-full bg-[#F7F3EB] border-2 border-[#171717] px-3 py-2 text-xs font-mono focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Execution Progress */}
              {isProcessing && (
                <div className="bg-blue-50 border-2 border-[#315FE8] p-4 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[#315FE8] font-bold">
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      EXECUTING BATCH OPERATION...
                    </span>
                    <span>PLEASE WAIT</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Communicating with backend database and fulfillment services...
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Results Screen */
            <div className="space-y-4 font-mono text-xs">
              <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4">
                <div className="flex items-center justify-between border-b-2 border-[#171717] pb-2 mb-3">
                  <h4 className="font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    BATCH RUN COMPLETED
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 border border-gray-400">
                    {results.total} ORDERS TARGETED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-emerald-50 border-2 border-emerald-500 p-3">
                    <span className="text-[10px] text-emerald-800 uppercase block font-bold">Success</span>
                    <span className="text-xl font-bold text-emerald-900">{results.successCount}</span>
                  </div>
                  <div className={`p-3 border-2 ${results.failedCount > 0 ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-300'}`}>
                    <span className={`text-[10px] uppercase block font-bold ${results.failedCount > 0 ? 'text-red-800' : 'text-gray-500'}`}>
                      Failures / Skipped
                    </span>
                    <span className={`text-xl font-bold ${results.failedCount > 0 ? 'text-red-900' : 'text-gray-500'}`}>
                      {results.failedCount}
                    </span>
                  </div>
                </div>

                {/* Error log if any */}
                {results.errors && results.errors.length > 0 && (
                  <div className="bg-amber-50 border-2 border-amber-400 p-3 max-h-40 overflow-y-auto space-y-1">
                    <span className="text-[10px] font-bold text-amber-900 uppercase block">
                      Operational Feedback / Errors:
                    </span>
                    {results.errors.map((err, i) => (
                      <p key={i} className="text-[11px] text-amber-800 font-mono">
                        • {err}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t-2 border-[#171717] font-mono text-xs">
            {!results ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-white hover:bg-gray-100 text-[#171717] font-bold border-2 border-[#171717] shadow-[2px_2px_0px_#171717] disabled:opacity-40"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleStartProcessing}
                  disabled={isProcessing}
                  className="px-5 py-2 bg-[#315FE8] hover:bg-[#254bc4] text-white font-bold border-2 border-[#171717] shadow-[3px_3px_0px_#171717] disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={14} />
                      EXECUTE ON {selectedOrders.length} ORDERS
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#171717] hover:bg-black text-white font-bold border-2 border-[#171717] shadow-[3px_3px_0px_#171717]"
              >
                CLOSE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkFulfillmentModal;
