import React from 'react';
import { Package, AlertTriangle, AlertOctagon, ShieldCheck, ArrowRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const ProductsKpiCards = ({
  totalCount = 0,
  activeCount = 0,
  archivedCount = 0,
  lowStockCount = 0,
  outOfStockCount = 0,
  bisTestedCount = 0,
  onFilterLowStock,
  onFilterOutOfStock,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between h-32 animate-pulse"
          >
            <div className="h-3 w-24 bg-[#F0EEEE] mb-3" />
            <div className="h-8 w-28 bg-[#F0EEEE] mb-3" />
            <div className="h-3 w-full bg-[#F0EEEE]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Card 1: Total Master Items */}
      <div className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              TOTAL MASTER ITEMS
            </span>
            <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <Package className="w-3.5 h-3.5 text-[#315FE8]" />
            </div>
          </div>

          <div className="mb-2">
            <span className="font-display font-black text-2xl lg:text-[26px] tracking-tight text-ink block leading-none">
              {totalCount}
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-[#6E6E6E]">
              <span className="text-[#315FE8] font-bold">{activeCount} Active</span>
              <span>•</span>
              <span>{archivedCount} Archived</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-ink/15 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#6E6E6E]">Publication</span>
          <StatusBadge variant="info" size="sm">
            STOREFRONT SYNCED
          </StatusBadge>
        </div>
      </div>

      {/* Card 2: Low Stock Alert */}
      <div className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              LOW STOCK ALERT (&le;10)
            </span>
            <div className="w-6 h-6 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>

          <div className="mb-2">
            <span className="font-display font-black text-2xl lg:text-[26px] tracking-tight text-ink block leading-none">
              {lowStockCount}
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-[#6E6E6E]">
              <span>Threshold: &le;10 units per SKU</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-ink/15 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#6E6E6E]">Replenishment</span>
          {lowStockCount > 0 ? (
            <button
              type="button"
              onClick={onFilterLowStock}
              className="text-amber-800 font-bold hover:underline flex items-center gap-0.5"
            >
              FILTER LOW STOCK <ArrowRight className="w-2.5 h-2.5" />
            </button>
          ) : (
            <StatusBadge variant="success" size="sm">
              LEVELS HEALTHY
            </StatusBadge>
          )}
        </div>
      </div>

      {/* Card 3: Out of Stock */}
      <div className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              OUT OF STOCK (0 UNITS)
            </span>
            <div className="w-6 h-6 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <AlertOctagon className="w-3.5 h-3.5 text-[#FF5638]" />
            </div>
          </div>

          <div className="mb-2">
            <span className="font-display font-black text-2xl lg:text-[26px] tracking-tight text-ink block leading-none">
              {outOfStockCount}
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-[#6E6E6E]">
              <span>Zero warehouse stock</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-ink/15 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#6E6E6E]">Lost Demand</span>
          {outOfStockCount > 0 ? (
            <button
              type="button"
              onClick={onFilterOutOfStock}
              className="text-[#FF5638] font-bold hover:underline flex items-center gap-0.5"
            >
              REVIEW SKUS <ArrowRight className="w-2.5 h-2.5" />
            </button>
          ) : (
            <StatusBadge variant="neutral" size="sm">
              0 RUNOUTS
            </StatusBadge>
          )}
        </div>
      </div>

      {/* Card 4: BIS Lab Tested */}
      <div className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              BIS LAB TESTED (IS-9873)
            </span>
            <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#315FE8]" />
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-display font-black text-2xl lg:text-[26px] tracking-tight text-ink">
                {bisTestedCount}
              </span>
              <span className="font-mono text-xs text-[#6E6E6E]">
                / {totalCount} Verified
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 font-mono text-[10px] text-[#6E6E6E]">
              <span>Compliance:</span>
              <span className="text-ink font-bold">
                {bisTestedCount > 0 ? `${Math.round((bisTestedCount / totalCount) * 100)}% Lab Tested` : 'Pending Lab Uploads'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-ink/15 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#6E6E6E]">Standard Mark</span>
          <StatusBadge variant={bisTestedCount > 0 ? 'success' : 'warning'} size="sm">
            {bisTestedCount > 0 ? 'ISI CERTIFIED' : 'AWAITING LAB REPORTS'}
          </StatusBadge>
        </div>
      </div>
    </div>
  );
};

export default ProductsKpiCards;
