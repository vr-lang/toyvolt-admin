import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, ExternalLink } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

export const TopProductsPanel = ({ products = [], isLoading = false }) => {
  const hasProducts = Array.isArray(products) && products.length > 0;

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <Package className="w-3.5 h-3.5 text-[#315FE8]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-ink">
                TOP TOYS THIS WEEK
              </h2>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                ACTIVE CATALOG OVERVIEW
              </span>
            </div>
          </div>

          <Link
            to="/products"
            className="font-mono text-xs font-bold text-[#315FE8] hover:underline flex items-center gap-1 uppercase"
          >
            CATALOG <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="h-44 flex flex-col items-center justify-center bg-[#FFF9F0] border border-dashed border-ink p-6">
            <div className="w-8 h-8 border-3 border-ink border-t-[#315FE8] animate-spin mb-3" />
            <span className="font-mono text-xs uppercase text-[#6E6E6E]">
              LOADING PRODUCT CATALOG...
            </span>
          </div>
        ) : hasProducts ? (
          <div className="space-y-2.5">
            {products.slice(0, 5).map((prod) => {
              const primaryImage =
                prod.images?.find((img) => img.isPrimary)?.url ||
                prod.images?.[0]?.url ||
                null;
              const price = prod.sellingPriceInRupees || Math.round((prod.sellingPrice || 0) / 100);
              const isLow = prod.availableStock <= 10;

              return (
                <div
                  key={prod._id || prod.id}
                  className="border-2 border-ink p-2.5 bg-[#FFF9F0] flex items-center justify-between gap-3 shadow-[2px_2px_0px_#171717]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-white border border-ink shrink-0 overflow-hidden flex items-center justify-center">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-[#6E6E6E]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-display font-bold text-xs uppercase text-ink truncate block">
                        {prod.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#6E6E6E] block">
                        SKU: {prod.sku || 'N/A'} • {formatCurrencyINR(price)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <StatusBadge variant={isLow ? 'danger' : 'success'} size="sm">
                      STOCK: {prod.availableStock ?? 0}
                    </StatusBadge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="NO PRODUCTS IN CATALOG"
            description="The product catalog is currently empty. Use the Add New Product action to register initial inventory items."
            compact
          />
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-ink/20 flex items-center justify-between font-mono text-[10px] text-[#6E6E6E]">
        <span>Verified from catalog database</span>
        <span className="text-[#315FE8] font-bold">Total items: {products.length}</span>
      </div>
    </div>
  );
};

export default TopProductsPanel;
