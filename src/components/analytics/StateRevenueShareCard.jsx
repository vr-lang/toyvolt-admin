import React from 'react';
import { MapPin, Globe2 } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';

export const StateRevenueShareCard = ({ states = [], isLoading = false }) => {
  const hasStates = Array.isArray(states) && states.length > 0;

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <MapPin className="w-3.5 h-3.5 text-[#315FE8]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-tight text-ink">
                STATE REVENUE SHARE
              </h3>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                Geographic order destination distribution
              </span>
            </div>
          </div>
          <StatusBadge variant="info" size="sm">
            {states.length} REGION{states.length === 1 ? '' : 'S'}
          </StatusBadge>
        </div>

        {/* States List */}
        <div className="space-y-3 my-2">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-[#F0EEEE] border border-ink/30" />
              ))}
            </div>
          ) : hasStates ? (
            states.slice(0, 5).map((st, idx) => (
              <div key={idx} className="space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-bold bg-[#171717] text-white px-1 py-0.2 text-[10px] tracking-wider">
                      {st.stateCode}
                    </span>
                    <span className="font-semibold text-ink truncate" title={st.state}>
                      {st.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-right shrink-0">
                    <span className="font-bold text-[#315FE8]">
                      {formatCurrencyINR(st.revenueRupees || 0)}
                    </span>
                    <span className="text-[#6E6E6E] text-[11px] w-12">
                      ({st.sharePercent}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#F0EEEE] h-2 border border-ink overflow-hidden">
                  <div
                    className="bg-[#315FE8] h-full transition-all duration-300"
                    style={{ width: `${Math.max(4, Math.min(100, st.sharePercent || 0))}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 bg-[#F7F3EB] border border-ink border-dashed text-center font-mono text-xs text-[#6E6E6E]">
              <Globe2 className="w-6 h-6 mx-auto mb-1.5 text-[#6E6E6E]" />
              No geographic shipping address data available for the selected window.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-ink/15 flex items-center justify-between font-mono text-[10px] text-[#6E6E6E] mt-3">
        <span>Source: Shipping addresses</span>
        <span className="font-bold text-ink">
          {hasStates ? `${states[0].state} (${states[0].sharePercent}%) Lead` : '0 States'}
        </span>
      </div>
    </div>
  );
};

export default StateRevenueShareCard;
