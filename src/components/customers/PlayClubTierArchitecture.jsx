import React from 'react';
import { Sparkles, Send, ShieldAlert, Award, Crown, CheckCircle2 } from 'lucide-react';

export default function PlayClubTierArchitecture({
  tierCounts = { tier_1: 0, tier_2: 0, tier_3: 0 },
  totalCustomers = 0,
  onOpenTierRules
}) {
  const t1Percent = totalCustomers > 0 ? Math.round((tierCounts.tier_1 / totalCustomers) * 100) : 0;
  const t2Percent = totalCustomers > 0 ? Math.round((tierCounts.tier_2 / totalCustomers) * 100) : 0;
  const t3Percent = totalCustomers > 0 ? Math.round((tierCounts.tier_3 / totalCustomers) * 100) : 0;

  return (
    <div className="bg-[#FFF9F0] border-4 border-neutral-900 shadow-[6px_6px_0px_#000] p-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-neutral-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#315FE8]" />
          <div>
            <h2 className="text-sm sm:text-base font-black text-neutral-900 uppercase tracking-tight">
              TOYBOX PLAY CLUB &middot; TIER SEGMENTATION ARCHITECTURE
            </h2>
            <p className="text-[11px] text-neutral-600 font-sans mt-0.5">
              Automated spend-based tier classification & loyalty point multipliers for registered parents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Campaign Engine Standby: Email/SMS integration requires SendGrid / Twilio credentials configured in system settings.')}
            className="px-3 py-1.5 border-2 border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>LAUNCH EMAIL/SMS CAMPAIGN</span>
            <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1 py-0.2">
              STANDBY
            </span>
          </button>
        </div>
      </div>

      {/* 3 Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        
        {/* Tier 1: Toy Cadet */}
        <div className="bg-white border-2 border-neutral-900 p-4 shadow-[3px_3px_0px_#000] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-black border border-neutral-900 bg-neutral-100 text-neutral-900">
                TIER 1 &bull; ENTRY
              </span>
              <span className="text-xs font-bold font-mono text-neutral-500">
                1x Points Multiplier
              </span>
            </div>

            <h3 className="text-base font-black text-neutral-900 mt-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-neutral-600" />
              TOY CADET
            </h3>

            <div className="text-xs text-neutral-700 font-sans mt-1">
              <strong>Criteria:</strong> ₹0 &ndash; ₹2,499 Lifetime Spend
            </div>

            <div className="mt-3 p-2 bg-[#F7F3EB] border border-neutral-300 text-[11px] text-neutral-700 space-y-1 font-sans">
              <div className="font-bold text-neutral-900">Tier Perks:</div>
              <div>&bull; Welcome 10% instant checkout discount</div>
              <div>&bull; Member exclusive festival previews</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-mono font-bold mb-1">
              <span>{tierCounts.tier_1} Parents</span>
              <span>{t1Percent}% of club</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-100 border border-neutral-900 overflow-hidden">
              <div className="h-full bg-neutral-400" style={{ width: `${t1Percent}%` }} />
            </div>
          </div>
        </div>

        {/* Tier 2: Master Builder */}
        <div className="bg-white border-2 border-neutral-900 p-4 shadow-[3px_3px_0px_#000] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-black border border-neutral-900 bg-[#FFD983] text-neutral-900">
                TIER 2 &bull; SILVER
              </span>
              <span className="text-xs font-bold font-mono text-neutral-800">
                1.5x Points Multiplier
              </span>
            </div>

            <h3 className="text-base font-black text-neutral-900 mt-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              MASTER BUILDER
            </h3>

            <div className="text-xs text-neutral-700 font-sans mt-1">
              <strong>Criteria:</strong> ₹2,500 &ndash; ₹9,999 Lifetime Spend
            </div>

            <div className="mt-3 p-2 bg-[#F7F3EB] border border-neutral-300 text-[11px] text-neutral-700 space-y-1 font-sans">
              <div className="font-bold text-neutral-900">Tier Perks:</div>
              <div>&bull; Priority warehouse packing & linehaul queue</div>
              <div>&bull; Free spare rechargeable battery pack</div>
              <div>&bull; ₹250 Birthday Voucher</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-mono font-bold mb-1">
              <span>{tierCounts.tier_2} Parents</span>
              <span>{t2Percent}% of club</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-100 border border-neutral-900 overflow-hidden">
              <div className="h-full bg-[#FFD983]" style={{ width: `${t2Percent}%` }} />
            </div>
          </div>
        </div>

        {/* Tier 3: Playroom VIP / Legend */}
        <div className="bg-white border-2 border-neutral-900 p-4 shadow-[3px_3px_0px_#000] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-[10px] font-black border border-neutral-900 bg-[#FF5638] text-white">
                TIER 3 &bull; GOLD VIP
              </span>
              <span className="text-xs font-bold font-mono text-[#FF5638]">
                2.5x Points Multiplier
              </span>
            </div>

            <h3 className="text-base font-black text-neutral-900 mt-2 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-[#FF5638]" />
              PLAYROOM VIP / LEGEND
            </h3>

            <div className="text-xs text-neutral-700 font-sans mt-1">
              <strong>Criteria:</strong> ₹10,000+ Lifetime Spend
            </div>

            <div className="mt-3 p-2 bg-[#F7F3EB] border border-neutral-300 text-[11px] text-neutral-700 space-y-1 font-sans">
              <div className="font-bold text-neutral-900">Tier Perks:</div>
              <div>&bull; Free Express Air Shipping on all orders</div>
              <div>&bull; Annual Toyvolt Birthday Surprise Box</div>
              <div>&bull; Direct WhatsApp Concierge Support</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-mono font-bold mb-1">
              <span>{tierCounts.tier_3} Parents</span>
              <span>{t3Percent}% of club</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-100 border border-neutral-900 overflow-hidden">
              <div className="h-full bg-[#FF5638]" style={{ width: `${t3Percent}%` }} />
            </div>
          </div>
        </div>

      </div>

      {/* Footer tier config link */}
      <div className="mt-4 pt-3 border-t border-neutral-300 flex items-center justify-between text-xs text-neutral-600">
        <span>Tier advancement is computed automatically upon order delivery confirmation.</span>
        <button
          onClick={onOpenTierRules}
          className="font-bold text-[#315FE8] hover:underline"
        >
          VIEW TIER SPECIFICATIONS &rarr;
        </button>
      </div>
    </div>
  );
}
