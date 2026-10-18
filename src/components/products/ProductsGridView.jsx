import React from 'react';
import {
  CheckSquare,
  Square,
  Eye,
  Edit3,
  Boxes,
  Trash2,
  Package,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import { paiseToRupees } from '../../services/productService';
import StatusBadge from '../common/StatusBadge';

export const ProductsGridView = ({
  products = [],
  selectedIds = new Set(),
  onToggleSelect,
  onViewProduct,
  onEditProduct,
  onQuickStock,
  onDeleteProduct,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 space-y-3 h-80 animate-pulse"
          >
            <div className="w-full h-36 bg-[#F0EEEE]" />
            <div className="h-4 bg-[#F0EEEE] w-3/4" />
            <div className="h-3 bg-[#F0EEEE] w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-12 text-center font-mono">
        <Package className="w-10 h-10 mx-auto mb-2 text-[#6E6E6E]" />
        <p className="font-bold text-ink uppercase text-sm">NO MATCHING PRODUCTS IN CATALOG</p>
        <p className="text-xs text-[#6E6E6E] mt-1 max-w-sm mx-auto">
          Try adjusting the search query, category, or stock level filters above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((prod) => {
        const isSelected = selectedIds.has(prod._id);
        const primaryImage =
          prod.images?.find((img) => img.isPrimary)?.url || prod.images?.[0]?.url;

        const sellingRupees = paiseToRupees(prod.sellingPrice);
        const compareRupees = prod.compareAtPrice
          ? paiseToRupees(prod.compareAtPrice)
          : null;

        // Margin
        let marginPercent = null;
        if (prod.costPrice && prod.sellingPrice > 0) {
          marginPercent =
            Math.round(
              ((prod.sellingPrice - prod.costPrice) / prod.sellingPrice) * 1000
            ) / 10;
        }

        // Discount
        let discountPercent = null;
        if (compareRupees && compareRupees > sellingRupees) {
          discountPercent = Math.round(
            ((compareRupees - sellingRupees) / compareRupees) * 100
          );
        }

        const stock = prod.availableStock ?? 0;
        const isOutOfStock = stock === 0;
        const isLowStock = stock > 0 && stock <= 10;

        const specs = prod.specifications || {};
        const ageGroup =
          specs['Age Group'] ||
          specs['Age'] ||
          (prod.category?.includes('RC') ? '8+ Years' : 'All Ages');

        const bisVerified =
          specs['BIS Verified'] === 'true' ||
          specs['BIS License'] ||
          Boolean(prod.bisCertification?.verified);

        return (
          <div
            key={prod._id}
            className={`bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between transition-colors ${
              isSelected ? 'bg-[#DCE5FF]/40 border-[#315FE8]' : 'hover:bg-[#FFF9F0]'
            } ${prod.isArchived ? 'opacity-60 bg-[#F0EEEE]/50' : ''}`}
          >
            <div>
              {/* Top Bar: Checkbox and SKU */}
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => onToggleSelect(prod._id)}
                  className="cursor-pointer text-ink hover:text-[#315FE8]"
                  aria-label={`Select product ${prod.name}`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#315FE8]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#6E6E6E]" />
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <span className="bg-[#DCE5FF] text-[#171717] px-1.5 py-0.2 border border-ink text-[10px] font-black font-mono tracking-wider">
                    {prod.sku}
                  </span>
                  {prod.isArchived && (
                    <span className="bg-[#FF5638] text-white px-1 py-0.2 text-[9px] font-bold font-mono">
                      ARCHIVED
                    </span>
                  )}
                </div>
              </div>

              {/* Product Image */}
              <div className="w-full h-36 border-2 border-ink bg-[#F7F3EB] flex items-center justify-center overflow-hidden mb-3 shadow-[1.5px_1.5px_0px_#171717]">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Package className="w-8 h-8 text-[#6E6E6E]" />
                )}
              </div>

              {/* Title & Category */}
              <h3
                onClick={() => onViewProduct(prod)}
                className="font-sans font-bold text-xs text-ink hover:text-[#315FE8] cursor-pointer line-clamp-2 leading-snug mb-1"
                title={prod.name}
              >
                {prod.name}
              </h3>

              <div className="flex items-center justify-between font-mono text-[10px] text-[#6E6E6E] mb-2">
                <span>{prod.category || 'Remote Control Cars'}</span>
                <span className="font-bold text-[#315FE8]">{ageGroup}</span>
              </div>

              {/* Pricing & Margin */}
              <div className="p-2 bg-[#FFF9F0] border border-ink mb-2.5 flex items-baseline justify-between font-mono">
                <div>
                  <span className="font-display font-black text-sm text-[#315FE8] block leading-none">
                    {formatCurrencyINR(sellingRupees)}
                  </span>
                  {compareRupees && (
                    <span className="text-[10px] text-[#6E6E6E] line-through block mt-0.5">
                      {formatCurrencyINR(compareRupees)}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  {marginPercent !== null ? (
                    <span className="text-emerald-800 font-bold text-[10px] bg-white px-1 py-0.2 border border-ink block">
                      {marginPercent}% Margin
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#6E6E6E] italic block">Cost N/A</span>
                  )}
                  {discountPercent && (
                    <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                      -{discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom: Stock Status & Action Buttons */}
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] mb-2.5 pb-2 border-b border-ink/15">
                <span className="text-[#6E6E6E]">Stock Level:</span>
                {isOutOfStock ? (
                  <StatusBadge variant="danger" size="sm">
                    OUT OF STOCK
                  </StatusBadge>
                ) : isLowStock ? (
                  <StatusBadge variant="warning" size="sm">
                    LOW ({stock})
                  </StatusBadge>
                ) : (
                  <StatusBadge variant="success" size="sm">
                    HEALTHY ({stock})
                  </StatusBadge>
                )}
              </div>

              <div className="grid grid-cols-4 gap-1">
                <button
                  type="button"
                  onClick={() => onViewProduct(prod)}
                  className="py-1 px-1 border border-ink bg-white hover:bg-[#DCE5FF] flex items-center justify-center shadow-[1px_1px_0px_#171717]"
                  title="View complete specifications and diagnostics"
                >
                  <Eye className="w-3.5 h-3.5 text-ink" />
                </button>
                <button
                  type="button"
                  onClick={() => onEditProduct(prod)}
                  className="py-1 px-1 border border-ink bg-white hover:bg-[#FFF9F0] flex items-center justify-center shadow-[1px_1px_0px_#171717]"
                  title="Edit product parameters & pricing"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#315FE8]" />
                </button>
                <button
                  type="button"
                  onClick={() => onQuickStock(prod)}
                  className="py-1 px-1 border border-ink bg-white hover:bg-[#FFF9F0] flex items-center justify-center shadow-[1px_1px_0px_#171717]"
                  title="Quick update available inventory"
                >
                  <Boxes className="w-3.5 h-3.5 text-amber-600" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteProduct(prod)}
                  className="py-1 px-1 border border-ink bg-white hover:bg-[#FF5638] hover:text-white flex items-center justify-center shadow-[1px_1px_0px_#171717] transition-colors"
                  title="Archive or permanently delete listing"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#FF5638] hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsGridView;
