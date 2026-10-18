import React, { useState } from 'react';
import { Cake, Sparkles, Send, Gift, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function CustomersBottomPanels() {
  const [testSent, setTestSent] = useState(false);

  const handleSendTestPreview = () => {
    const confirmed = window.confirm(
      'SEND TEST PREVIEW: This will simulate dispatching the birthday greeting template to the administrator phone only. No customer will be messaged. Proceed?'
    );
    if (confirmed) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 5000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 font-mono">
      
      {/* Left Panel: Automated Birthday Concierge */}
      <div className="bg-[#FFF9F0] border-4 border-neutral-900 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="bg-[#FF7626] text-white p-4 border-b-2 border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cake className="w-5 h-5 text-white" />
              <h3 className="font-black text-sm uppercase tracking-tight">
                AUTOMATED BIRTHDAY CONCIERGE
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-bold">
              STANDBY
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-300 text-xs text-amber-900 font-sans leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Schema Notification:</strong> Child birthday data is not yet collected on the default storefront sign-up form. Once the custom birthdate field is enabled in the checkout schema, automatic birthday vouchers will trigger 7 days prior.
              </div>
            </div>

            {/* Template Preview */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-neutral-500 uppercase">
                WHATSAPP / SMS GREETING TEMPLATE (PREVIEW)
              </div>
              <div className="p-3 bg-white border-2 border-neutral-900 text-xs text-neutral-800 leading-relaxed font-sans shadow-[2px_2px_0px_#000]">
                &ldquo;🏎️ Happy Birthday to your young speed racer from <strong>Toyvolt</strong>! We’ve credited your Play Club wallet with a special <strong>15% birthday celebration gift</strong>. Use code <span className="font-mono font-bold bg-[#FFD983] px-1">BDAY15</span> on any remote control vehicle this week!&rdquo;
              </div>
            </div>

            {testSent && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-600 text-emerald-900 text-xs flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Simulated test dispatch logged. No external customer notification was sent.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F3EB] border-t-2 border-neutral-900 flex items-center justify-between">
          <span className="text-xs text-neutral-600">
            Upcoming Birthdays: <strong>0</strong>
          </span>
          <button
            onClick={handleSendTestPreview}
            className="px-4 py-2 border-2 border-neutral-900 bg-white hover:bg-neutral-100 text-xs font-bold text-neutral-900 shadow-[2px_2px_0px_#000] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
          >
            <Send className="w-3.5 h-3.5 text-[#315FE8]" />
            <span>DISPATCH TEST PREVIEW</span>
          </button>
        </div>
      </div>

      {/* Right Panel: Top Loyalty Reward Redemptions */}
      <div className="bg-[#FFF9F0] border-4 border-neutral-900 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="bg-[#315FE8] text-white p-4 border-b-2 border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-white" />
              <h3 className="font-black text-sm uppercase tracking-tight">
                TOP LOYALTY REWARD REDEMPTIONS
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-bold">
              PLAY CLUB
            </span>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-xs text-neutral-700 font-sans leading-relaxed">
              Real-time leaderboard of rewards and checkout discounts claimed by Toybox Play Club members.
            </p>

            {/* Empty State */}
            <div className="p-6 bg-white border-2 border-dashed border-neutral-400 text-center space-y-2">
              <div className="w-10 h-10 bg-neutral-100 border border-neutral-900 mx-auto flex items-center justify-center text-neutral-500">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-xs font-black uppercase text-neutral-800">
                NO REWARD REDEMPTIONS RECORDED YET
              </div>
              <p className="text-[11px] text-neutral-500 font-sans max-w-sm mx-auto">
                Vouchers claimed at storefront checkout will automatically populate this leaderboard with redemption frequency and points cost.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F3EB] border-t-2 border-neutral-900 flex items-center justify-between">
          <span className="text-xs text-neutral-600">
            Catalog: 3 Active Reward Rules
          </span>
          <button
            onClick={() => alert('Reward Catalog Engine: Direct reward item creation is managed through the Coupons & Promos engine.')}
            className="px-4 py-2 border-2 border-neutral-900 bg-white hover:bg-neutral-100 text-xs font-bold text-neutral-900 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            CONFIGURE REWARDS &rarr;
          </button>
        </div>
      </div>

    </div>
  );
}
