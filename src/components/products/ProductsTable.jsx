import React from 'react';
import {
  CheckSquare,
  Square,
  Eye,
  Edit3,
  Boxes,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Package,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import { paiseToRupees } from '../../services/productService';
import StatusBadge from '../common/StatusBadge';

export const ProductsTable = ({
  products = [],
  selectedIds = new Set(),
  onToggleSelect,
  onViewProduct,
  onEditProduct,
  onQuickStock,
  onDeleteProduct,
  isLoading = false
}) => {
  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FFF9F0] border-b-2 border-ink font-mono text-[11px] font-bold text-ink uppercase tracking-wider select-none">
              <th className="py-2.5 px-3 border-r border-ink/30 w-10 text-center">
                #
              </th>
              <th className="py-2.5 px-3 border-r border-ink/30 w-16 text-center">
                IMAGE
              </th>
              <th className="py-2.5 px-3 border-r border-ink/30 min-w-[240px]">
                PRODUCT TITLE, SKU &amp; CATEGORY
              </th>
              <th className="py-2.5 px-3 border-r border-ink/30 min-w-[140px]">
                COMPLIANCE (IS-9873)
              </th>
              <th className="py-2.5 px-3 border-r border-ink/30 min-w-[160px] text-right">
                PRICING &amp; MARGIN
              </th>
              <th className="py-2.5 px-3 border-r border-ink/30 min-w-[150px] text-right">
                STOCK &amp; FULFILLMENT
              </th>
              <th className="py-2.5 px-3 text-center w-28">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/20 font-mono text-xs bg-white">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="py-5 px-3 bg-[#F7F3EB]/60">
                    <div className="h-4 bg-[#F0EEEE] w-3/4" />
                  </td>
                </tr>
              ))
            ) : products.length > 0 ? (
              products.map((prod) => {
                const isSelected = selectedIds.has(prod._id);
                const primaryImage =
                  prod.images?.find((img) => img.isPrimary)?.url ||
                  prod.images?.[0]?.url;

                const sellingRupees = paiseToRupees(prod.sellingPrice);
                const compareRupees = prod.compareAtPrice
                  ? paiseToRupees(prod.compareAtPrice)
                  : null;
                const costRupees = prod.costPrice
                  ? paiseToRupees(prod.costPrice)
                  : null;

                // Margin % calculation if cost price exists
                let marginPercent = null;
                if (prod.costPrice && prod.sellingPrice > 0) {
                  marginPercent =
                    Math.round(
                      ((prod.sellingPrice - prod.costPrice) / prod.sellingPrice) *
                        1000
                    ) / 10;
                }

                // Discount % calculation if compare at price exists
                let discountPercent = null;
                if (compareRupees && compareRupees > sellingRupees) {
                  discountPercent = Math.round(
                    ((compareRupees - sellingRupees) / compareRupees) * 100
                  );
                }

                // Stock status
                const stock = prod.availableStock ?? 0;
                const isOutOfStock = stock === 0;
                const isLowStock = stock > 0 && stock <= 10;

                // Specifications extraction (Age group & BIS)
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
                  <tr
                    key={prod._id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-[#DCE5FF]/40'
                        : 'hover:bg-[#FFF9F0]/80'
                    } ${prod.isArchived ? 'opacity-60 bg-[#F0EEEE]/50' : ''}`}
                  >
                    {/* 1. Selection Checkbox */}
                    <td className="py-2.5 px-3 border-r border-ink/20 text-center">
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
                    </td>

                    {/* 2. Product Image */}
                    <td className="py-2.5 px-3 border-r border-ink/20 text-center">
                      <div className="w-12 h-12 border-2 border-ink bg-[#F7F3EB] flex items-center justify-center overflow-hidden mx-auto shadow-[1px_1px_0px_#171717]">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement.classList.add('flex-col');
                            }}
                          />
                        ) : (
                          <Package className="w-5 h-5 text-[#6E6E6E]" />
                        )}
                      </div>
                    </td>

                    {/* 3. Product Title, SKU & Category */}
                    <td className="py-2.5 px-3 border-r border-ink/20 max-w-[280px]">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="bg-[#DCE5FF] text-[#171717] px-1.5 py-0.2 border border-ink text-[10px] font-black tracking-wider">
                          {prod.sku}
                        </span>
                        {prod.isArchived && (
                          <span className="bg-[#FF5638] text-white px-1 py-0.2 text-[9px] font-bold">
                            ARCHIVED
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onViewProduct(prod)}
                        className="font-sans font-bold text-xs text-ink hover:text-[#315FE8] text-left truncate block w-full transition-colors"
                        title={prod.name}
                      >
                        {prod.name}
                      </button>

                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#6E6E6E] mt-0.5">
                        <span className="text-ink font-semibold">
                          {prod.category || 'Remote Control Cars'}
                        </span>
                        <span>•</span>
                        <span className="text-[#315FE8] font-bold">{ageGroup}</span>
                      </div>
                    </td>

                    {/* 4. Compliance (IS-9873) */}
                    <td className="py-2.5 px-3 border-r border-ink/20">
                      {bisVerified ? (
                        <div className="space-y-0.5">
                          <StatusBadge variant="success" size="sm">
                            <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                            IS-9873 TESTED
                          </StatusBadge>
                          <span className="text-[9px] text-[#6E6E6E] block font-mono">
                            ISI Mark Verified
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <StatusBadge variant="warning" size="sm">
                            <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                            PENDING VERIF
                          </StatusBadge>
                          <span className="text-[9px] text-[#6E6E6E] block font-mono">
                            Awaiting Lab PDF
                          </span>
                        </div>
                      )}
                    </td>

                    {/* 5. Pricing & Margin */}
                    <td className="py-2.5 px-3 border-r border-ink/20 text-right">
                      <div className="font-display font-black text-sm text-[#315FE8]">
                        {formatCurrencyINR(sellingRupees)}
                      </div>

                      {compareRupees && (
                        <div className="flex items-center justify-end gap-1 font-mono text-[10px] text-[#6E6E6E]">
                          <span className="line-through">
                            {formatCurrencyINR(compareRupees)}
                          </span>
                          {discountPercent && (
                            <span className="text-emerald-700 font-bold">
                              (-{discountPercent}%)
                            </span>
                          )}
                        </div>
                      )}

                      <div className="font-mono text-[10px] mt-0.5">
                        {marginPercent !== null ? (
                          <span className="text-emerald-800 font-bold bg-[#F7F3EB] px-1 py-0.2 border border-ink/30">
                            {marginPercent}% Margin
                          </span>
                        ) : (
                          <span className="text-[#6E6E6E] italic">Cost N/A</span>
                        )}
                      </div>
                    </td>

                    {/* 6. Stock & Fulfillment */}
                    <td className="py-2.5 px-3 border-r border-ink/20 text-right">
                      <div className="flex items-center justify-end gap-1 mb-0.5">
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

                      <div className="font-mono text-[10px] text-[#6E6E6E]">
                        <span>{prod.reservedStock || 0} Reserved</span>
                      </div>

                      <div className="text-[9px] text-ink font-semibold mt-0.5">
                        Shiprocket Primary Hub
                      </div>
                    </td>

                    {/* 7. Row Actions */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => onViewProduct(prod)}
                          className="p-1 border border-ink bg-white hover:bg-[#DCE5FF] shadow-[1px_1px_0px_#171717]"
                          title="View complete specifications and diagnostics"
                        >
                          <Eye className="w-3.5 h-3.5 text-ink" />
                        </button>

                        {/* Edit Product */}
                        <button
                          type="button"
                          onClick={() => onEditProduct(prod)}
                          className="p-1 border border-ink bg-white hover:bg-[#FFF9F0] shadow-[1px_1px_0px_#171717]"
                          title="Edit product parameters & pricing"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#315FE8]" />
                        </button>

                        {/* Quick Stock */}
                        <button
                          type="button"
                          onClick={() => onQuickStock(prod)}
                          className="p-1 border border-ink bg-white hover:bg-[#FFF9F0] shadow-[1px_1px_0px_#171717]"
                          title="Quick update available inventory"
                        >
                          <Boxes className="w-3.5 h-3.5 text-amber-600" />
                        </button>

                        {/* Delete / Archive */}
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(prod)}
                          className="p-1 border border-ink bg-white hover:bg-[#FF5638] hover:text-white shadow-[1px_1px_0px_#171717] transition-colors"
                          title="Archive or permanently delete listing"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#FF5638] hover:text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#6E6E6E] font-mono">
                  <Package className="w-10 h-10 mx-auto mb-2 text-[#6E6E6E]" />
                  <p className="font-bold text-ink uppercase text-sm">
                    NO MATCHING PRODUCTS IN CATALOG
                  </p>
                  <p className="text-xs text-[#6E6E6E] mt-1 max-w-sm mx-auto">
                    Try adjusting the search query, category, or stock level filters above.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
