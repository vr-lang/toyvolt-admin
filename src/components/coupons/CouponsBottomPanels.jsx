import React from 'react';
import { Gift, Sparkles, Share2, Layers, CheckCircle2, Info, ArrowUpRight } from 'lucide-react';

export default function CouponsBottomPanels() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono">
      {/* Panel 1: Automated Cart Rules & Free Gift Triggers */}
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#FF7626]" />
              <h3 className="font-black text-sm uppercase text-neutral-900">
                AUTOMATED CART RULES & FREE GIFT TRIGGERS
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-black uppercase border border-neutral-900 bg-emerald-100 text-emerald-900">
              ACTIVE IN STORE ENGINE
            </span>
          </div>

          <p className="text-xs text-neutral-600 font-sans mb-3 leading-relaxed">
            Rule tiers evaluated in real-time during customer checkout. Automatically attaches bonus items and shipping fee waivers without requiring manual voucher inputs.
          </p>

          <div className="space-y-2 text-xs">
            {/* Rule 1 */}
            <div className="p-2.5 bg-[#FFF9F0] border-2 border-neutral-900 flex items-center justify-between">
              <div>
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Express Surface Shipping (₹149 value)</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  Threshold: Cart Subtotal ≥ ₹999 across all pin codes
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold bg-white px-2 py-1 border border-neutral-900">
                AUTO-APPLIED
              </span>
            </div>

            {/* Rule 2 */}
            <div className="p-2.5 bg-[#FFF9F0] border-2 border-neutral-900 flex items-center justify-between">
              <div>
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Die-Cast Metal Supercar (SKU: DC-GT-01)</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  Threshold: Cart Subtotal ≥ ₹2,499 (Festive Tier 1)
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold bg-white px-2 py-1 border border-neutral-900">
                INVENTORY SYNCED
              </span>
            </div>

            {/* Rule 3 */}
            <div className="p-2.5 bg-[#FFF9F0] border-2 border-neutral-900 flex items-center justify-between">
              <div>
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Toyvolt Mystery Play Box + Duracell Pack</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  Threshold: Cart Subtotal ≥ ₹4,999 (High GMV Tier)
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold bg-white px-2 py-1 border border-neutral-900">
                AUTO-PACKED
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t-2 border-neutral-200 mt-4 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>ENGINE: TOYVOLT RULE ENGINE v2.4</span>
          <span className="text-emerald-700 font-bold">100% CHECKOUT ACCURACY</span>
        </div>
      </div>

      {/* Panel 2: Parent Affiliate & Community Creator Attribution */}
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#315FE8]" />
              <h3 className="font-black text-sm uppercase text-neutral-900">
                PARENT COMMUNITY & AFFILIATE ATTRIBUTION
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-black uppercase border border-neutral-900 bg-[#FFD983] text-neutral-900">
              COMMUNITY BETA
            </span>
          </div>

          <p className="text-xs text-neutral-600 font-sans mb-3 leading-relaxed">
            Attribution engine for parent influencers, mommy bloggers, and preschool WhatsApp group ambassadors. Provides automated store credit kickbacks on validated orders.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-[#F7F3EB] border border-neutral-900">
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-neutral-900">@DelhiMomAdventures (Neha K.)</span>
                <span className="font-mono font-bold text-[#315FE8]">CODE: NEHATOYS10</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-600 font-sans">
                <span>38 Orders Referred • ₹94,200 Gross GMV</span>
                <span className="font-bold text-emerald-700 font-mono">₹4,710 Credit Paid</span>
              </div>
            </div>

            <div className="p-2.5 bg-[#F7F3EB] border border-neutral-900">
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-neutral-900">@BangaloreToyParent (Arjun M.)</span>
                <span className="font-mono font-bold text-[#315FE8]">CODE: ARJUNPLAY</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-600 font-sans">
                <span>24 Orders Referred • ₹61,500 Gross GMV</span>
                <span className="font-bold text-emerald-700 font-mono">₹3,075 Credit Paid</span>
              </div>
            </div>

            <div className="p-2 bg-amber-50 border border-amber-600 text-[10px] text-amber-900 font-sans flex items-start gap-1.5 mt-2">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Backend Status: Dedicated affiliate ledger endpoints (<code className="font-mono">/admin/affiliates</code>) are planned for next release. Current influencer codes are routed through standard promotion vouchers.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t-2 border-neutral-200 mt-4 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>REFERRAL COMMISSION: 5.0% STORE CREDIT</span>
          <span className="text-neutral-800 font-bold uppercase">PAYOUT CYCLE: MONTHLY</span>
        </div>
      </div>
    </div>
  );
}
