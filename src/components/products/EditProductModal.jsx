import React, { useState } from 'react';
import { X, Edit3, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { paiseToRupees, rupeesToPaise } from '../../services/productService';

export const EditProductModal = ({
  isOpen,
  onClose,
  product = null,
  categoriesList = [],
  onSaveProduct
}) => {
  if (!isOpen || !product) return null;

  const [name, setName] = useState(product.name || '');
  const [sku, setSku] = useState(product.sku || '');
  const [category, setCategory] = useState(product.category || 'Remote Control Cars');
  const [sellingPriceRupees, setSellingPriceRupees] = useState(
    String(paiseToRupees(product.sellingPrice))
  );
  const [comparePriceRupees, setComparePriceRupees] = useState(
    product.compareAtPrice ? String(paiseToRupees(product.compareAtPrice)) : ''
  );
  const [costPriceRupees, setCostPriceRupees] = useState(
    product.costPrice ? String(paiseToRupees(product.costPrice)) : ''
  );
  const [stock, setStock] = useState(String(product.availableStock ?? 0));
  const [isActive, setIsActive] = useState(product.isActive !== false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!sku.trim()) {
      setError('Product SKU is required.');
      return;
    }

    const sellingNum = parseFloat(sellingPriceRupees);
    if (isNaN(sellingNum) || sellingNum <= 0) {
      setError('Selling price must be a positive rupee value.');
      return;
    }

    let compareNum = null;
    if (comparePriceRupees.trim()) {
      compareNum = parseFloat(comparePriceRupees);
      if (isNaN(compareNum) || compareNum <= 0) {
        setError('Compare-at price must be positive if specified.');
        return;
      }
      if (compareNum < sellingNum) {
        setError('Compare-at price cannot be less than selling price.');
        return;
      }
    }

    let costNum = null;
    if (costPriceRupees.trim()) {
      costNum = parseFloat(costPriceRupees);
      if (isNaN(costNum) || costNum < 0) {
        setError('Cost price must be non-negative if specified.');
        return;
      }
    }

    const stockInt = parseInt(stock, 10);
    if (isNaN(stockInt) || stockInt < 0) {
      setError('Available stock must be a non-negative integer.');
      return;
    }

    const payload = {
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category: category.trim(),
      sellingPrice: rupeesToPaise(sellingNum),
      compareAtPrice: compareNum ? rupeesToPaise(compareNum) : null,
      costPrice: costNum ? rupeesToPaise(costNum) : null,
      availableStock: stockInt,
      isActive
    };

    setLoading(true);
    try {
      await onSaveProduct(product._id, payload);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-panel border-2 border-ink shadow-[6px_6px_0px_#171717] p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <Edit3 className="w-4 h-4 text-[#315FE8]" />
            </div>
            <div>
              <h3 className="font-display font-black text-base uppercase tracking-tight text-ink">
                EDIT PRODUCT LISTING
              </h3>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                {product.sku} • ID: {product._id?.slice(-8)}
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

        <form onSubmit={handleSave} className="space-y-3 font-mono text-xs">
          {/* Name */}
          <div>
            <label className="font-bold uppercase text-[11px] text-ink block mb-1">
              PRODUCT TITLE:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full brutal-input font-sans text-xs"
            />
          </div>

          {/* SKU & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold uppercase text-[11px] text-ink block mb-1">
                MASTER SKU:
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full brutal-input font-mono text-xs font-bold"
              />
            </div>
            <div>
              <label className="font-bold uppercase text-[11px] text-ink block mb-1">
                CATEGORY:
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Remote Control Cars"
                className="w-full brutal-input font-mono text-xs"
              />
            </div>
          </div>

          {/* Pricing Grid (Selling, Compare, Cost) */}
          <div className="p-3 bg-[#FFF9F0] border-2 border-ink space-y-2">
            <span className="font-bold uppercase text-[11px] text-[#315FE8] block pb-1 border-b border-ink/15">
              PRICING &amp; UNIT COST (INR ₹):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold uppercase text-[10px] text-ink block mb-1">
                  SELLING PRICE (₹):
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={sellingPriceRupees}
                  onChange={(e) => setSellingPriceRupees(e.target.value)}
                  className="w-full brutal-input font-mono text-xs font-bold text-[#315FE8]"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[10px] text-[#6E6E6E] block mb-1">
                  COMPARE AT (₹):
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={comparePriceRupees}
                  onChange={(e) => setComparePriceRupees(e.target.value)}
                  placeholder="Optional"
                  className="w-full brutal-input font-mono text-xs text-[#6E6E6E]"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-[10px] text-emerald-800 block mb-1">
                  COST PRICE (₹):
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={costPriceRupees}
                  onChange={(e) => setCostPriceRupees(e.target.value)}
                  placeholder="For Margin"
                  className="w-full brutal-input font-mono text-xs text-emerald-800"
                />
              </div>
            </div>
          </div>

          {/* Stock & Active Status */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="font-bold uppercase text-[11px] text-ink block mb-1">
                AVAILABLE STOCK (UNITS):
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full brutal-input font-mono text-xs font-bold"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#315FE8] border-2 border-ink"
                />
                <span className="font-bold uppercase text-xs text-ink">
                  ACTIVE ON STOREFRONT
                </span>
              </label>
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
              disabled={loading}
              className="brutal-btn brutal-btn-primary text-xs px-4 py-2 flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  SAVING PRODUCT...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  SAVE MODIFICATIONS
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
