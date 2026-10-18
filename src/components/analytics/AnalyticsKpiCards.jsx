import React from 'react';
import {
  IndianRupee,
  TrendingUp,
  Truck,
  RotateCcw,
  Users,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { formatCurrencyINR, formatNumber } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';

export const AnalyticsKpiCards = ({ kpis = {}, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between h-36 animate-pulse"
          >
            <div className="h-3 w-24 bg-[#F0EEEE] mb-3" />
            <div className="h-8 w-32 bg-[#F0EEEE] mb-3" />
            <div className="h-3 w-full bg-[#F0EEEE]" />
          </div>
        ))}
      </div>
    );
  }

  const {
    gmvRupees = 0,
    realizedRevenueRupees = 0,
    overallMarginPercent = null,
    totalOrders = 0,
    paidOrdersCount = 0,
    dispatchedCount = 0,
    inFlightCount = 0,
    rtoRatePercent = 0.0,
    transitDamageRate = null,
    cacRupees = null,
    ltvRupees = 0,
    cacLtvRatio = null,
    totalDeductionsRupees = 0
  } = kpis;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* Card 1: Gross Merchandise Value (GMV) */}
      <div className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              GROSS MERCHANDISE VALUE
            </span>
            <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <IndianRupee className="w-3.5 h-3.5 text-[#315FE8]" />
            </div>
          </div>

          <div className="mb-2">
            <span className="font-display font-black text-2xl lg:text-[26px] tracking-tight text-ink block leading-none">
              {formatCurrencyINR(gmvRupees)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-[#6E6E6E]">
              <span className="text-[#315FE8] font-bold">100%</span>
              <span>• Total {totalOrders} order{totalOrders === 1 ? '' : 's'} placed</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-ink/15 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#6E6E6E]">Growth Trend</span>
          <StatusBadge variant="info" size="sm">
            BASELINE WINDOW
          </StatusBadge>
        </div>
      </div>

      {/* Card 2: Net Realized Revenue */}
      <div className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              NET REALIZED REVENUE
            </span>
            <div className="w-6 h-6 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <TrendingUp className="w-3.5 h-3.5 text-ink" />
            </div>
          </div>

          <div className="mb-2">
            <span className="font-display font-black text-2xl lg:text-[26px] tracking-tight text-ink block leading-none">
              {formatCurrencyINR(realizedRevenueRupees)}
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-[#6E6E6E]">
              {overallMarginPercent !== null ? (
                <span className="text-emerald-700 font-bold">
                  {overallMarginPercent}% Unit Margin
                </span>
              ) : (
                <span className="text-[#6E6E6E]">Margin: N/A (Awaiting Cost)</span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-ink/15 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#6E6E6E]">Deductions</span>
          <span className="font-bold text-ink">
            {totalDeductionsRupees > 0 ? `-${formatCurrencyINR(totalDeductionsRupees)}` : '₹0 Returns'}
          </span>
        </div>
      </div>

      {/* Card 3: Dispatched & In-Flight */}
      <div className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              DISPATCHED &amp; IN-FLIGHT
            </span>
            <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <Truck className="w-3.5 h-3.5 text-[#315FE8]" />
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-display font-black text-2xl lg:text-[26px] tracking-tight text-ink">
                {dispatchedCount}
              </span>
              <span className="font-mono text-xs text-[#6E6E6E]">
                / {inFlightCount} In-Flight
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-[#6E6E6E]">
              <span>Fulfillment: {totalOrders > 0 ? `${totalOrders - dispatchedCount} Awaiting Pickup` : 'Idle'}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-ink/15 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#6E6E6E]">Shiprocket Sync</span>
          <StatusBadge variant={dispatchedCount > 0 ? 'success' : 'neutral'} size="sm">
            {dispatchedCount > 0 ? 'ACTIVE TRANSIT' : 'STANDBY READY'}
          </StatusBadge>
        </div>
      </div>

      {/* Card 4: RTO / Transit Damage */}
      <div className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              RTO / TRANSIT DAMAGE
            </span>
            <div className="w-6 h-6 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <RotateCcw className="w-3.5 h-3.5 text-[#FF5638]" />
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-display font-black text-2xl lg:text-[26px] tracking-tight text-ink">
                {rtoRatePercent.toFixed(1)}%
              </span>
              <span className="font-mono text-[10px] text-emerald-700 font-bold">
                (Optimal)
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-[#6E6E6E]">
              <span>Damage: {transitDamageRate !== null ? `${transitDamageRate}%` : 'N/A (Damage unflagged)'}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-ink/15 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#6E6E6E]">Configured Target</span>
          <span className="font-bold text-ink">&lt; 5.0% Benchmark</span>
        </div>
      </div>

      {/* Card 5: CAC vs Lifetime Value */}
      <div className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              CAC VS. LIFETIME VALUE
            </span>
            <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <Users className="w-3.5 h-3.5 text-[#315FE8]" />
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-display font-black text-2xl lg:text-[26px] tracking-tight text-ink">
                {formatCurrencyINR(ltvRupees)}
              </span>
              <span className="font-mono text-xs text-[#6E6E6E]">LTV</span>
            </div>
            <div className="flex items-center gap-1 mt-1 font-mono text-[10px] text-[#6E6E6E]">
              <span>CAC:</span>
              <span className="text-[#171717] font-bold">N/A (Ad Spend Unlinked)</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-ink/15 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#6E6E6E]">LTV/CAC Ratio</span>
          <span className="font-mono text-[10px] text-[#6E6E6E] italic">
            Pending attribution
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsKpiCards;
