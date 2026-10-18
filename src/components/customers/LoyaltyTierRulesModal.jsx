import React from 'react';
import { X, Sparkles, Award, Crown, CheckCircle2, Info } from 'lucide-react';

export default function LoyaltyTierRulesModal({
  isOpen,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="relative bg-[#FFF9F0] border-4 border-neutral-900 shadow-[8px_8px_0px_#000] w-full max-w-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#FFD983] text-neutral-900 p-4 border-b-2 border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neutral-900" />
            <h3 className="font-black text-sm uppercase tracking-tight">
              TOYBOX PLAY CLUB &middot; LOYALTY TIER SPECIFICATIONS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          <div className="p-3 bg-white border-2 border-neutral-900 text-xs font-sans text-neutral-700 leading-relaxed">
            The Toyvolt Play Club automatically enrolls parents upon account creation or checkout. Lifetime spend accumulates across delivered orders to upgrade tier levels and unlock loyalty multipliers.
          </div>

          {/* 3 Tiers Detailed Breakdown */}
          <div className="space-y-4">
            
            {/* Tier 1 */}
            <div className="p-4 bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_#000] space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-xs font-black bg-neutral-100 text-neutral-900 border border-neutral-900 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> TIER 1 &bull; TOY CADET
                </span>
                <span className="text-xs font-bold text-neutral-600">
                  Spend: ₹0 &ndash; ₹2,499
                </span>
              </div>
              <p className="text-xs text-neutral-600 font-sans">
                Base tier for all newly registered parents. Points accrue at 1 point per ₹10 spend.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 bg-[#F7F3EB] border border-neutral-300">
                  <strong>Points Multiplier:</strong> 1.0x Base
                </div>
                <div className="p-2 bg-[#F7F3EB] border border-neutral-300">
                  <strong>Welcome Benefit:</strong> 10% Instant Voucher
                </div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="p-4 bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_#000] space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-xs font-black bg-[#FFD983] text-neutral-900 border border-neutral-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> TIER 2 &bull; MASTER BUILDER
                </span>
                <span className="text-xs font-bold text-neutral-900">
                  Spend: ₹2,500 &ndash; ₹9,999
                </span>
              </div>
              <p className="text-xs text-neutral-600 font-sans">
                Targeted at active toy hobbyist families and multi-car collectors. Points earn rate boosted by 50%.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 bg-[#F7F3EB] border border-neutral-300">
                  <strong>Points Multiplier:</strong> 1.5x Accelerated
                </div>
                <div className="p-2 bg-[#F7F3EB] border border-neutral-300">
                  <strong>Birthday Perk:</strong> ₹250 Store Voucher
                </div>
                <div className="p-2 bg-[#F7F3EB] border border-neutral-300">
                  <strong>Fulfillment Perk:</strong> Priority Packing Queue
                </div>
                <div className="p-2 bg-[#F7F3EB] border border-neutral-300">
                  <strong>Hardware Perk:</strong> Free Spare Battery Pack
                </div>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="p-4 bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_#000] space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-xs font-black bg-[#FF5638] text-white border border-neutral-900 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> TIER 3 &bull; PLAYROOM VIP / LEGEND
                </span>
                <span className="text-xs font-bold text-[#FF5638]">
                  Spend: ₹10,000+
                </span>
              </div>
              <p className="text-xs text-neutral-600 font-sans">
                Elite loyalty tier with 2.5x point earnings and concierge-level priority logistics across India.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 bg-[#F7F3EB] border border-neutral-300">
                  <strong>Points Multiplier:</strong> 2.5x Maximum
                </div>
                <div className="p-2 bg-[#F7F3EB] border border-neutral-300">
                  <strong>Shipping Perk:</strong> Free BlueDart Air on all orders
                </div>
                <div className="p-2 bg-[#F7F3EB] border border-neutral-300">
                  <strong>Annual Perk:</strong> Toyvolt Birthday Hamper
                </div>
                <div className="p-2 bg-[#F7F3EB] border border-neutral-300">
                  <strong>Support Perk:</strong> Direct WhatsApp Concierge
                </div>
              </div>
            </div>

          </div>

          {/* Points Redemption Policy */}
          <div className="p-3 bg-neutral-100 border border-neutral-900 text-xs font-sans space-y-1">
            <div className="font-bold font-mono text-neutral-900 flex items-center gap-1">
              <Info className="w-4 h-4 text-[#315FE8]" />
              POINTS REDEMPTION RATIO:
            </div>
            <p className="text-[11px] text-neutral-600">
              100 Play Club points = ₹50 voucher redeemable at checkout. Minimum redemption threshold: 200 points.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F3EB] border-t-2 border-neutral-900 flex items-center justify-between">
          <span className="text-xs text-neutral-600">
            Rules Version: 1.0 &bull; Engine Active
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800"
          >
            DISMISS
          </button>
        </div>

      </div>
    </div>
  );
}
