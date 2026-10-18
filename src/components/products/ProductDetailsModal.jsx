import React from 'react';
import {
  X,
  Package,
  Layers,
  IndianRupee,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import { paiseToRupees } from '../../services/productService';
import StatusBadge from '../common/StatusBadge';

export const ProductDetailsModal = ({ isOpen, onClose, product = null }) => {
  if (!isOpen || !product) return null;

  const sellingRupees = paiseToRupees(product.sellingPrice);
  const compareRupees = product.compareAtPrice ? paiseToRupees(product.compareAtPrice) : null;
  const costRupees = product.costPrice ? paiseToRupees(product.costPrice) : null;

  let marginPercent = null;
  let profitPerUnitRupees = null;
  if (product.costPrice && product.sellingPrice > 0) {
    profitPerUnitRupees = sellingRupees - costRupees;
    marginPercent =
      Math.round(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 1000) / 10;
  }

  const specs = product.specifications instanceof Map
    ? Object.fromEntries(product.specifications)
    : product.specifications || {};

  const dimensions = product.dimensions || {};
  const weightGrams = product.weightGrams ?? 0;
  const images = Array.isArray(product.images) ? product.images : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-panel border-2 border-ink shadow-[6px_6px_0px_#171717] p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <Package className="w-4 h-4 text-[#315FE8]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="bg-[#DCE5FF] text-[#171717] px-1.5 py-0.2 border border-ink text-[10px] font-black font-mono tracking-wider">
                  {product.sku}
                </span>
                {product.isActive ? (
                  <StatusBadge variant="success" size="sm">
                    ACTIVE LISTING
                  </StatusBadge>
                ) : (
                  <StatusBadge variant="neutral" size="sm">
                    DRAFT / INACTIVE
                  </StatusBadge>
                )}
              </div>
              <h3 className="font-display font-black text-base uppercase tracking-tight text-ink mt-0.5 truncate max-w-md">
                {product.name}
              </h3>
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

        {/* Gallery Preview */}
        {images.length > 0 && (
          <div className="p-3 bg-[#FFF9F0] border-2 border-ink space-y-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#6E6E6E] block">
              CATALOG MEDIA GALLERY ({images.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="w-16 h-16 border-2 border-ink bg-white overflow-hidden relative shadow-[1px_1px_0px_#171717]"
                >
                  <img
                    src={img.url}
                    alt={`${product.name} - ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {img.isPrimary && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#315FE8] text-white text-[8px] font-mono font-bold text-center">
                      PRIMARY
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial & Economics Breakdown */}
        <div className="p-3.5 bg-[#FFF9F0] border-2 border-ink shadow-[2px_2px_0px_#171717] font-mono text-xs space-y-2">
          <div className="font-bold text-[#315FE8] uppercase text-[11px] pb-1 border-b border-ink/15 flex items-center justify-between">
            <span>FINANCIAL &amp; MARGIN TELEMETRY</span>
            <span>CATEGORY: {product.category}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-ink">
            <div>
              <span className="text-[#6E6E6E] text-[10px] block">SELLING PRICE</span>
              <strong className="text-sm font-display text-[#315FE8]">
                {formatCurrencyINR(sellingRupees)}
              </strong>
            </div>
            <div>
              <span className="text-[#6E6E6E] text-[10px] block">COMPARE AT (MRP)</span>
              <strong className="text-sm font-display">
                {compareRupees ? formatCurrencyINR(compareRupees) : '—'}
              </strong>
            </div>
            <div>
              <span className="text-[#6E6E6E] text-[10px] block">COST PRICE</span>
              <strong className="text-sm font-display text-emerald-800">
                {costRupees ? formatCurrencyINR(costRupees) : 'N/A'}
              </strong>
            </div>
            <div>
              <span className="text-[#6E6E6E] text-[10px] block">GROSS MARGIN</span>
              <strong className="text-sm font-display text-emerald-800">
                {marginPercent !== null ? `${marginPercent}% (₹${profitPerUnitRupees}/unit)` : 'N/A'}
              </strong>
            </div>
          </div>
        </div>

        {/* Physical Logistics Dimensions */}
        <div className="p-3 bg-white border-2 border-ink font-mono text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#315FE8] font-bold text-[11px] uppercase pb-1 border-b border-ink/15">
            <Truck className="w-3.5 h-3.5" />
            SHIPROCKET PHYSICAL PARAMETERS:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-[#6E6E6E] block text-[10px]">WEIGHT:</span>
              <strong className="text-ink">{weightGrams} grams</strong>
            </div>
            <div>
              <span className="text-[#6E6E6E] block text-[10px]">LENGTH:</span>
              <strong className="text-ink">{dimensions.lengthCm || '—'} cm</strong>
            </div>
            <div>
              <span className="text-[#6E6E6E] block text-[10px]">BREADTH:</span>
              <strong className="text-ink">{dimensions.breadthCm || '—'} cm</strong>
            </div>
            <div>
              <span className="text-[#6E6E6E] block text-[10px]">HEIGHT:</span>
              <strong className="text-ink">{dimensions.heightCm || '—'} cm</strong>
            </div>
          </div>
        </div>

        {/* Specifications Map */}
        {Object.keys(specs).length > 0 && (
          <div className="p-3 bg-[#FFF9F0] border-2 border-ink font-mono text-xs space-y-1.5">
            <span className="font-bold text-[#6E6E6E] uppercase text-[10px] block pb-1 border-b border-ink/15">
              TECHNICAL &amp; RC SPECIFICATIONS:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-ink/10 py-0.5">
                  <span className="text-[#6E6E6E]">{k}:</span>
                  <strong className="text-ink truncate max-w-[180px]">{String(v)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="p-3 bg-white border border-ink font-mono text-xs">
          <span className="text-[10px] font-bold text-[#6E6E6E] uppercase block mb-1">
            CATALOG DESCRIPTION:
          </span>
          <p className="font-sans text-xs text-ink/90 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-ink flex items-center justify-between font-mono text-xs">
          <span className="text-[10px] text-[#6E6E6E]">
            Created: {product.createdAt ? product.createdAt.slice(0, 10) : '—'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="brutal-btn bg-white hover:bg-[#F0EEEE] text-ink text-xs px-4 py-1.5"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
