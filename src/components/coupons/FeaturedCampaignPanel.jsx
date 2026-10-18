import React, { useState } from 'react';
import { Sparkles, Copy, Check, Edit3, Pause, Play, Tag, ExternalLink, Calendar, Flame } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { couponService } from '../../services/couponService';

export default function FeaturedCampaignPanel({
  featuredCoupon = null,
  onEditCampaign,
  onToggleStatus,
  onCreateNew
}) {
  const [copied, setCopied] = useState(false);

  if (!featuredCoupon) {
    return (
      <div className="bg-[#FFF9F0] border-4 border-neutral-900 shadow-[6px_6px_0px_#000] p-6 font-mono text-center space-y-3">
        <div className="w-12 h-12 bg-[#FFD983] border-2 border-neutral-900 mx-auto flex items-center justify-center text-neutral-900">
          <Sparkles className="w-6 h-6 text-[#FF7626]" />
        </div>
        <h3 className="text-base font-black uppercase text-neutral-900">
          NO ACTIVE FESTIVE CAMPAIGN SPOTLIGHTED
        </h3>
        <p className="text-xs text-neutral-600 max-w-md mx-auto font-sans">
          Create a festival coupon (such as a Diwali Mega Sale or Children's Day Speed Carnival) to pin it as the primary store checkout discount.
        </p>
        <button
          onClick={onCreateNew}
          className="px-5 py-2.5 border-2 border-neutral-900 bg-[#315FE8] text-white text-xs font-black shadow-[3px_3px_0px_#000] hover:bg-[#254bc4] inline-flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>CREATE YOUR FIRST CAMPAIGN</span>
        </button>
      </div>
    );
  }

  const isFlat = featuredCoupon.discountType === 'flat';
  const discountDisplay = isFlat 
    ? `FLAT ₹${Math.round(featuredCoupon.discountValue / 100)} OFF` 
    : `FLAT ${featuredCoupon.discountValue}% OFF`;

  const minOrderRupees = featuredCoupon.minOrderValue ? Math.round(featuredCoupon.minOrderValue / 100) : 0;
  const maxCapRupees = featuredCoupon.maxDiscountValue ? Math.round(featuredCoupon.maxDiscountValue / 100) : null;
  const status = couponService.getCouponLifecycleStatus(featuredCoupon);
  const isActive = status === 'ACTIVE';

  const usagePercent = featuredCoupon.globalUsageLimit 
    ? Math.min(100, Math.round((featuredCoupon.usedCount / featuredCoupon.globalUsageLimit) * 100))
    : 0;

  const handleCopyLink = () => {
    const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || 'https://toyvolt.com';
    const link = `${storefrontUrl}/?coupon=${encodeURIComponent(featuredCoupon.code)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-[#FFD983] border-4 border-neutral-900 shadow-[6px_6px_0px_#000] p-5 sm:p-6 font-mono relative overflow-hidden">
      
      {/* Decorative Stamp */}
      <div className="absolute right-4 top-4 hidden md:flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-neutral-900 shadow-[2px_2px_0px_#000] text-xs font-black">
        <Flame className="w-4 h-4 text-[#FF7626]" />
        <span>STORE SPOTLIGHT CAMPAIGN</span>
      </div>

      <div className="space-y-4">
        
        {/* Header Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-0.5 text-xs font-black border-2 border-neutral-900 shadow-[1px_1px_0px_#000] ${
            isActive ? 'bg-emerald-400 text-neutral-900' : 'bg-neutral-200 text-neutral-700'
          }`}>
            {status}
          </span>
          <span className="text-xs font-bold text-neutral-800">
            FESTIVE CHECKOUT ENGINE &bull; TOYVOLT SPECIAL
          </span>
        </div>

        {/* Campaign Hero Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-2 flex-wrap">
            <span>{featuredCoupon.code}</span>
            <span className="text-base sm:text-lg font-bold text-neutral-800 bg-white/70 px-2 py-0.5 border border-neutral-900">
              {discountDisplay}
            </span>
          </h2>
          <p className="text-xs text-neutral-800 mt-1 max-w-2xl font-sans font-medium">
            {featuredCoupon.description || 'Applies instant promo discount on verified parent checkouts.'}
          </p>
        </div>

        {/* Specifications Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          
          <div className="p-3 bg-white border-2 border-neutral-900 shadow-[2px_2px_0px_#000]">
            <div className="text-[10px] text-neutral-500 font-bold uppercase">MINIMUM CART</div>
            <div className="text-sm font-black text-neutral-900 mt-0.5">
              {minOrderRupees > 0 ? formatINR(minOrderRupees) : 'No Min Spend'}
            </div>
          </div>

          <div className="p-3 bg-white border-2 border-neutral-900 shadow-[2px_2px_0px_#000]">
            <div className="text-[10px] text-neutral-500 font-bold uppercase">MAXIMUM SAVINGS</div>
            <div className="text-sm font-black text-neutral-900 mt-0.5">
              {maxCapRupees ? formatINR(maxCapRupees) : 'Uncapped'}
            </div>
          </div>

          <div className="p-3 bg-white border-2 border-neutral-900 shadow-[2px_2px_0px_#000]">
            <div className="text-[10px] text-neutral-500 font-bold uppercase">USAGE / CAP</div>
            <div className="text-sm font-black text-neutral-900 mt-0.5">
              {featuredCoupon.usedCount} / {featuredCoupon.globalUsageLimit || '&infin;'}
            </div>
            {featuredCoupon.globalUsageLimit && (
              <div className="w-full h-1.5 bg-neutral-200 mt-1 border border-neutral-900">
                <div className="h-full bg-[#FF7626]" style={{ width: `${usagePercent}%` }} />
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-2 border-neutral-900 shadow-[2px_2px_0px_#000]">
            <div className="text-[10px] text-neutral-500 font-bold uppercase">EXPIRATION DATE</div>
            <div className="text-xs font-black text-neutral-900 mt-0.5 truncate">
              {featuredCoupon.expiryDate ? new Date(featuredCoupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No Expiry'}
            </div>
          </div>

        </div>

        {/* Action Strip */}
        <div className="pt-3 border-t-2 border-neutral-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-white hover:bg-neutral-100 border-2 border-neutral-900 shadow-[2px_2px_0px_#000] text-xs font-bold text-neutral-900 flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'DEEP LINK COPIED!' : 'COPY DEEP LINK'}</span>
            </button>

            <button
              onClick={() => onEditCampaign(featuredCoupon)}
              className="px-3.5 py-2 bg-white hover:bg-neutral-100 border-2 border-neutral-900 shadow-[2px_2px_0px_#000] text-xs font-bold text-neutral-900 flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Edit3 className="w-4 h-4 text-[#315FE8]" />
              <span>EDIT CAMPAIGN RULES</span>
            </button>
          </div>

          <button
            onClick={() => onToggleStatus(featuredCoupon)}
            className={`px-4 py-2 border-2 border-neutral-900 text-xs font-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 ${
              featuredCoupon.isActive
                ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-neutral-900'
            }`}
          >
            {featuredCoupon.isActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE CAMPAIGN</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>RESUME CAMPAIGN</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
