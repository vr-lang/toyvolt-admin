import React, { useState } from 'react';
import { X, Boxes, Check, AlertTriangle, RefreshCw } from 'lucide-react';

export const QuickStockModal = ({
  isOpen,
  onClose,
  product = null,
  onSaveStock
}) => {
  if (!isOpen || !product) return null;

  const currentStock = product.availableStock ?? 0;
  const [stockValue, setStockValue] = useState(String(currentStock));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parsedStock = parseInt(stockValue, 10);
  const isValidStock = !isNaN(parsedStock) && parsedStock >= 0;

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!isValidStock) {
      setError('Available stock must be a non-negative integer.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSaveStock(product._id, parsedStock);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update stock quantity.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (delta) => {
    const cur = isNaN(parsedStock) ? 0 : parsedStock;
    setStockValue(String(Math.max(0, cur + delta)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-panel border-2 border-ink shadow-[6px_6px_0px_#171717] p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <Boxes className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-display font-black text-base uppercase tracking-tight text-ink">
                UPDATE INVENTORY STOCK
              </h3>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                {product.sku} • {product.category}
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

        {/* Product Identity */}
        <div className="p-3 bg-[#FFF9F0] border-2 border-ink font-mono text-xs space-y-1">
          <strong className="text-ink font-sans text-xs block leading-snug">
            {product.name}
          </strong>
          <div className="flex items-center justify-between text-[11px] text-[#6E6E6E] pt-1 border-t border-ink/10">
            <span>Current Available: <strong className="text-ink">{currentStock} Units</strong></span>
            <span>Reserved: <strong>{product.reservedStock || 0} Units</strong></span>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSave} className="space-y-3 font-mono text-xs">
          <div>
            <label className="font-bold uppercase text-[11px] text-ink block mb-1">
              NEW AVAILABLE PHYSICAL UNITS:
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              className="w-full brutal-input font-mono text-base font-bold text-ink"
              autoFocus
            />
          </div>

          {/* Quick Adjustment Shortcuts */}
          <div>
            <span className="text-[10px] text-[#6E6E6E] uppercase font-bold block mb-1">
              QUICK ADJUST SHORTCUTS:
            </span>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => handleQuickAdd(5)}
                className="py-1 border border-ink bg-white hover:bg-[#F0EEEE] font-bold"
              >
                +5
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(10)}
                className="py-1 border border-ink bg-white hover:bg-[#F0EEEE] font-bold"
              >
                +10
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(50)}
                className="py-1 border border-ink bg-white hover:bg-[#F0EEEE] font-bold"
              >
                +50
              </button>
              <button
                type="button"
                onClick={() => setStockValue('0')}
                className="py-1 border border-ink bg-white hover:bg-[#FF5638] hover:text-white font-bold text-[#FF5638]"
              >
                SET 0
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t-2 border-ink flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="brutal-btn bg-white hover:bg-[#F0EEEE] text-ink text-xs px-4 py-2"
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={loading || !isValidStock}
              className="brutal-btn brutal-btn-primary text-xs px-4 py-2 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  SAVING...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  SAVE STOCK LEVEL
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickStockModal;
