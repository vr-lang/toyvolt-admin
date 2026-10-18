import React from 'react';
import { AlertTriangle, Trash2, X, RefreshCw } from 'lucide-react';

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  product = null,
  isBulk = false,
  bulkCount = 0,
  onConfirm,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-panel border-2 border-ink shadow-[6px_6px_0px_#171717] p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FF5638] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-base uppercase tracking-tight text-ink">
                CONFIRM ARCHIVE / DELETE
              </h3>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                Destructive catalog action
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

        {/* Description */}
        <div className="p-3 bg-[#FFF9F0] border-2 border-ink font-mono text-xs space-y-1.5">
          {isBulk ? (
            <p className="text-ink">
              Are you sure you want to archive or remove the{' '}
              <strong className="text-[#FF5638]">{bulkCount} selected products</strong>?
            </p>
          ) : (
            <p className="text-ink">
              Are you sure you want to archive or remove{' '}
              <strong className="text-ink">
                [{product?.sku}] {product?.name}
              </strong>
              ?
            </p>
          )}
          <p className="text-[11px] text-[#6E6E6E] leading-relaxed pt-1 border-t border-ink/10">
            Note: If any product has historical customer orders, the backend will safely archive it rather than permanently deleting to preserve fulfillment and financial audit logs.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t-2 border-ink flex items-center justify-between gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="brutal-btn bg-white hover:bg-[#F0EEEE] text-ink text-xs px-4 py-2"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="brutal-btn bg-[#FF5638] hover:bg-[#d9442a] text-white text-xs px-4 py-2 flex items-center gap-1.5 shadow-[2px_2px_0px_#171717] disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                PROCESSING...
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5 text-white" />
                CONFIRM ARCHIVE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
