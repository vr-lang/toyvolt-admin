import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, ShoppingCart, Truck, AlertOctagon, ArrowUpRight, ArrowRight } from 'lucide-react';
import { formatCurrencyINR, formatNumber } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';

export const KpiCardsGrid = ({ metrics, lowStockCount = 0, isLoading = false }) => {
  const navigate = useNavigate();

  // Low stock severity
  const isHighSeverity = lowStockCount > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Revenue */}
      <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              TOTAL PAID REVENUE
            </span>
            <div className="w-7 h-7 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <IndianRupee className="w-3.5 h-3.5 text-[#315FE8]" />
            </div>
          </div>

          <div className="mb-2">
            {isLoading ? (
              <div className="h-9 w-28 bg-[#F0EEEE] animate-pulse" />
            ) : metrics ? (
              <span className="font-display font-bold text-2xl lg:text-3xl text-ink tracking-tight block">
                {formatCurrencyINR(metrics.paidRevenueInRupees || 0)}
              </span>
            ) : (
              <span className="font-mono text-xs text-[#6E6E6E] italic block">
                Connect API to sync
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-ink/15 flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#6E6E6E]">All-time verified</span>
          <StatusBadge variant="info" size="sm">
            INR ₹
          </StatusBadge>
        </div>
      </div>

      {/* Card 2: Orders Count & Status */}
      <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              ORDER VOLUME
            </span>
            <div className="w-7 h-7 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <ShoppingCart className="w-3.5 h-3.5 text-ink" />
            </div>
          </div>

          <div className="mb-2">
            {isLoading ? (
              <div className="h-9 w-20 bg-[#F0EEEE] animate-pulse" />
            ) : metrics ? (
              <span className="font-display font-bold text-2xl lg:text-3xl text-ink tracking-tight block">
                {formatNumber(metrics.totalOrders ?? 0)}
              </span>
            ) : (
              <span className="font-mono text-xs text-[#6E6E6E] italic block">
                —
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-ink/15 flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#6E6E6E]">Pending: {metrics ? metrics.pendingOrders ?? 0 : '—'}</span>
          <StatusBadge variant={metrics?.pendingOrders > 0 ? 'warning' : 'neutral'} size="sm">
            {metrics?.pendingOrders > 0 ? 'ACTIVE QUEUE' : 'CLEAR'}
          </StatusBadge>
        </div>
      </div>

      {/* Card 3: Active Logistics / Delivered */}
      <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E]">
              FULFILLMENT / TRANSIT
            </span>
            <div className="w-7 h-7 bg-[#F0EEEE] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <Truck className="w-3.5 h-3.5 text-ink" />
            </div>
          </div>

          <div className="mb-2">
            {isLoading ? (
              <div className="h-9 w-20 bg-[#F0EEEE] animate-pulse" />
            ) : metrics ? (
              <span className="font-display font-bold text-2xl lg:text-3xl text-ink tracking-tight block">
                {formatNumber(metrics.deliveredOrders ?? 0)}
              </span>
            ) : (
              <span className="font-mono text-xs text-[#6E6E6E] italic block">
                —
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-ink/15 flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#6E6E6E]">Delivered orders</span>
          <StatusBadge variant="success" size="sm">
            DELIVERED
          </StatusBadge>
        </div>
      </div>

      {/* Card 4: Low Stock Alerts (Contrast Orange/Red) */}
      <div
        className={`border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 flex flex-col justify-between ${
          isHighSeverity ? 'bg-[#FF5638] text-white' : 'bg-panel text-ink'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span
              className={`font-mono text-[10px] uppercase font-bold tracking-wider ${
                isHighSeverity ? 'text-white/90' : 'text-[#6E6E6E]'
              }`}
            >
              LOW STOCK ALERTS
            </span>
            <div
              className={`w-7 h-7 border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717] ${
                isHighSeverity ? 'bg-white text-ink' : 'bg-[#FF5638] text-white'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="mb-2">
            {isLoading ? (
              <div className="h-9 w-16 bg-white/30 animate-pulse" />
            ) : (
              <span className="font-display font-bold text-2xl lg:text-3xl tracking-tight block">
                {formatNumber(lowStockCount)}
              </span>
            )}
          </div>
        </div>

        <div
          className={`pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
            isHighSeverity ? 'border-white/30' : 'border-ink/15'
          }`}
        >
          <span className={isHighSeverity ? 'text-white/90' : 'text-[#6E6E6E]'}>
            {lowStockCount > 0 ? 'Threshold: ≤ 10 units' : 'Optimal Inventory'}
          </span>
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-ink shadow-[1px_1px_0px_#171717] flex items-center gap-1 transition-all ${
              isHighSeverity
                ? 'bg-white text-ink hover:bg-[#FFF9F0]'
                : 'bg-[#FF5638] text-white hover:bg-[#D9381E]'
            }`}
          >
            INSPECT <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KpiCardsGrid;
