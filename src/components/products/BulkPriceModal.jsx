import React, { useState } from 'react';
import { X, Tag, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import { paiseToRupees } from '../../services/productService';

export const BulkPriceModal = ({
  isOpen,
  onClose,
  selectedProducts = [],
  onApplyBulkPrice
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState('percentage'); // 'percentage' or 'flat'
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const numericVal = parseFloat(value);
  const isValidNumber = !isNaN(numericVal) && numericVal !== 0;

  const handleApply = async () => {
    if (!isValidNumber) {
      setError('Please specify a valid non-zero price adjustment value.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await onApplyBulkPrice({
        productList: selectedProducts,
        type,
        value: numericVal
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Bulk price modification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-panel border-2 border-ink shadow-[6px_6px_0px_#171717] p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <Tag className="w-4 h-4 text-[#315FE8]" />
            </div>
            <div>
              <h3 className="font-display font-black text-base uppercase tracking-tight text-ink">
                BULK PRICE UPDATE
              </h3>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                Modifying {selectedProducts.length} selected catalog product{selectedProducts.length === 1 ? '' : 's'}
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

        {error && (
          <div className="p-3 bg-[#FF5638] text-white border-2 border-ink font-mono text-xs">
            ⚠️ {error}
          </div>
        )}

        {/* Selected Products Preview */}
        <div className="p-3 bg-[#FFF9F0] border-2 border-ink max-h-36 overflow-y-auto space-y-1.5 font-mono text-xs">
          <span className="font-bold text-[#6E6E6E] uppercase text-[10px] block mb-1">
            TARGET PRODUCTS ({selectedProducts.length}):
          </span>
          {selectedProducts.map((p) => {
            const currentRupees = paiseToRupees(p.sellingPrice);
            let projectedRupees = currentRupees;
            if (isValidNumber) {
              if (type === 'percentage') {
                projectedRupees = Math.max(1, Math.round(currentRupees * (1 + numericVal / 100)));
              } else {
                projectedRupees = Math.max(1, Math.round(currentRupees + numericVal));
              }
            }

            return (
              <div
                key={p._id}
                className="flex items-center justify-between py-1 border-b border-ink/10 last:border-0"
              >
                <div className="truncate max-w-[240px]">
                  <strong className="text-[#315FE8] mr-1.5">[{p.sku}]</strong>
                  <span>{p.name}</span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[#6E6E6E] line-through mr-1.5">
                    {formatCurrencyINR(currentRupees)}
                  </span>
                  <strong className="text-ink">
                    &rarr; {formatCurrencyINR(projectedRupees)}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>

        {/* Adjustment Type Selector */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="font-bold uppercase text-[11px] text-ink block">
            ADJUSTMENT FORMULA:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('percentage')}
              className={`p-2.5 border-2 border-ink font-bold uppercase text-xs transition-all ${
                type === 'percentage'
                  ? 'bg-[#315FE8] text-white shadow-[2px_2px_0px_#171717]'
                  : 'bg-white text-ink hover:bg-[#F0EEEE]'
              }`}
            >
              PERCENTAGE (%)
            </button>
            <button
              type="button"
              onClick={() => setType('flat')}
              className={`p-2.5 border-2 border-ink font-bold uppercase text-xs transition-all ${
                type === 'flat'
                  ? 'bg-[#315FE8] text-white shadow-[2px_2px_0px_#171717]'
                  : 'bg-white text-ink hover:bg-[#F0EEEE]'
              }`}
            >
              FLAT RUPEES (₹)
            </button>
          </div>
        </div>

        {/* Value Input */}
        <div className="font-mono text-xs space-y-1">
          <label className="font-bold uppercase text-[11px] text-ink block">
            {type === 'percentage' ? 'PERCENT CHANGE (e.g. +10 or -5):' : 'RUPEE DELTA (e.g. +150 or -50):'}
          </label>
          <div className="flex items-center">
            <span className="p-2 border-2 border-r-0 border-ink bg-[#F0EEEE] font-bold">
              {type === 'percentage' ? '%' : '₹'}
            </span>
            <input
              type="number"
              step={type === 'percentage' ? '0.5' : '1'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'percentage' ? '+10' : '+150'}
              className="w-full brutal-input font-mono text-sm font-bold"
              autoFocus
            />
          </div>
          <span className="text-[10px] text-[#6E6E6E] block">
            Enter positive values to increase price or negative values to discount.
          </span>
        </div>

        {/* Footer */}
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
            onClick={handleApply}
            disabled={loading || !isValidNumber}
            className="brutal-btn brutal-btn-primary text-xs px-4 py-2 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                UPDATING {selectedProducts.length} SKUS...
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                CONFIRM &amp; APPLY UPDATE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkPriceModal;
