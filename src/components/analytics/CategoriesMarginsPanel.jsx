import React from 'react';
import { Tags, Percent, Layers, AlertCircle } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';

export const CategoriesMarginsPanel = ({
  categories = [],
  overallMarginPercent = null,
  isLoading = false
}) => {
  const hasCategories = Array.isArray(categories) && categories.length > 0;

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <Tags className="w-3.5 h-3.5 text-ink" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-ink">
                CATEGORIES &amp; MARGINS
              </h2>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                Product lines, contribution &amp; profitability
              </span>
            </div>
          </div>
          <StatusBadge variant="neutral" size="sm">
            {categories.length} LINE{categories.length === 1 ? '' : 'S'}
          </StatusBadge>
        </div>

        {/* Categories List */}
        <div className="space-y-3.5 my-2">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-[#F0EEEE] border border-ink/30" />
              ))}
            </div>
          ) : hasCategories ? (
            categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#FFF9F0] border-2 border-ink shadow-[2px_2px_0px_#171717] space-y-2"
              >
                {/* Top Row: Name and GMV */}
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="font-bold text-ink truncate mr-2" title={cat.name}>
                    {cat.name}
                  </div>
                  <div className="font-bold text-[#315FE8] shrink-0">
                    {formatCurrencyINR(cat.gmvRupees || 0)}
                  </div>
                </div>

                {/* Progress Bar (Share %) */}
                <div className="w-full bg-white h-2.5 border border-ink overflow-hidden flex">
                  <div
                    className="bg-[#315FE8] h-full transition-all duration-300"
                    style={{ width: `${Math.max(5, Math.min(100, cat.sharePercent || 0))}%` }}
                  />
                </div>

                {/* Bottom Row: Share % and Margin % */}
                <div className="flex items-center justify-between font-mono text-[11px] text-[#6E6E6E] pt-0.5">
                  <span>
                    Share: <strong className="text-ink">{cat.sharePercent || 0}%</strong> ({cat.unitsSold || 0} unit{cat.unitsSold === 1 ? '' : 's'})
                  </span>
                  <div>
                    {cat.marginPercent !== null ? (
                      <span className="text-emerald-700 font-bold bg-white px-1.5 py-0.2 border border-ink">
                        {cat.marginPercent}% Margin
                      </span>
                    ) : (
                      <span className="text-[#6E6E6E] italic text-[10px]">
                        Cost pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 bg-[#F7F3EB] border border-ink border-dashed text-center font-mono text-xs text-[#6E6E6E]">
              <Layers className="w-6 h-6 mx-auto mb-1.5 text-[#6E6E6E]" />
              No category transaction records found in active window.
            </div>
          )}
        </div>
      </div>

      {/* Footer: Portfolio Margin Calculation */}
      <div className="pt-3 border-t-2 border-ink mt-4 bg-[#F0EEEE] -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 flex items-center justify-between font-mono text-xs">
        <span className="font-bold uppercase text-ink flex items-center gap-1.5">
          <Percent className="w-3.5 h-3.5 text-[#315FE8]" />
          PORTFOLIO BLENDED MARGIN:
        </span>
        {overallMarginPercent !== null ? (
          <span className="font-black text-sm text-emerald-800 bg-white px-2 py-0.5 border border-ink shadow-[1px_1px_0px_#171717]">
            {overallMarginPercent}%
          </span>
        ) : (
          <span className="text-[#6E6E6E] italic text-[11px]">
            N/A (Catalog cost data unconfigured)
          </span>
        )}
      </div>
    </div>
  );
};

export default CategoriesMarginsPanel;
