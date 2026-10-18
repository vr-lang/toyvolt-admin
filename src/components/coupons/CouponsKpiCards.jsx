import React from 'react';
import { Tag, IndianRupee, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export default function CouponsKpiCards({
  coupons = [],
  attributedSalesRupees = 0,
  discountsIssuedRupees = 0,
  totalRedemptions = 0,
  avgBasketLift = null,
  loading = false
}) {
  const now = new Date();
  const activeCount = coupons.filter(
    (c) => c.isActive && (!c.expiryDate || new Date(c.expiryDate) > now)
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      
      {/* Card 1: Discounts Issued (Lifetime) */}
      <div className="bg-[#FFF9F0] border-3 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
          <span>DISCOUNTS ISSUED (LIFETIME)</span>
          <div className="p-1.5 bg-[#FF7626]/10 border border-neutral-900 text-[#FF7626]">
            <Tag className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900">
            {loading ? '...' : (discountsIssuedRupees > 0 ? formatINR(discountsIssuedRupees) : `${totalRedemptions} claims`)}
          </div>
          <div className="text-[11px] text-neutral-600 font-sans mt-1">
            Across {totalRedemptions} total coupon checkout redemptions
          </div>
        </div>
      </div>

      {/* Card 2: Sales Driven by Coupons */}
      <div className="bg-[#FFF9F0] border-3 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
          <span>SALES DRIVEN BY COUPONS</span>
          <div className="p-1.5 bg-[#315FE8]/10 border border-neutral-900 text-[#315FE8]">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900">
            {loading ? '...' : (attributedSalesRupees > 0 ? formatINR(attributedSalesRupees) : '₹0')}
          </div>
          <div className="text-[11px] text-neutral-600 font-sans mt-1">
            Attributed GMV with promo code applied
          </div>
        </div>
      </div>

      {/* Card 3: Active Promotional Campaigns */}
      <div className="bg-[#FFF9F0] border-3 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
          <span>ACTIVE CAMPAIGNS</span>
          <div className="p-1.5 bg-[#FFD983] border border-neutral-900 text-neutral-900">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900">
            {loading ? '...' : activeCount}
          </div>
          <div className="text-[11px] text-neutral-600 font-sans mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <strong className="font-mono text-neutral-900">{activeCount}</strong> live / {coupons.length - activeCount} expired or paused
          </div>
        </div>
      </div>

      {/* Card 4: Average Basket Lift */}
      <div className="bg-[#FFF9F0] border-3 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-neutral-600 text-xs font-bold uppercase mb-2">
          <span>AVERAGE BASKET LIFT</span>
          <div className="p-1.5 bg-neutral-100 border border-neutral-900 text-neutral-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900">
            {loading ? '...' : (avgBasketLift !== null ? `+${avgBasketLift}%` : 'N/A')}
          </div>
          <div className="text-[11px] text-neutral-600 font-sans mt-1">
            {avgBasketLift !== null ? 'AOV increase vs non-coupon cart' : 'Requires min 10 coupon orders to calculate'}
          </div>
        </div>
      </div>

    </div>
  );
}
