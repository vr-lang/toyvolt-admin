import React, { useState } from 'react';
import { Sliders, MessageCircle, BarChart2, ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { reviewService } from '../../services/reviewService';

const SENTIMENT_TOPICS = [
  { topic: 'Drop Resistance & Build Durability', score: '95% POSITIVE', count: 142, tone: 'text-emerald-700 bg-emerald-100 border-emerald-600' },
  { topic: 'STEM Learning & Problem Solving', score: '98% POSITIVE', count: 98, tone: 'text-emerald-700 bg-emerald-100 border-emerald-600' },
  { topic: 'Battery Life & USB-C Rechargeability', score: '88% POSITIVE', count: 76, tone: 'text-neutral-800 bg-[#FFD983] border-neutral-900' },
  { topic: 'Festive Gift Packaging & Unboxing', score: '92% POSITIVE', count: 64, tone: 'text-emerald-700 bg-emerald-100 border-emerald-600' },
  { topic: 'Assembly Manual & Parent Guide', score: '84% POSITIVE', count: 39, tone: 'text-neutral-800 bg-[#FFD983] border-neutral-900' }
];

export default function ReviewsBottomPanels({ onConfigSaved }) {
  const [config, setConfig] = useState(() => reviewService.getDisplayConfig());
  const [savedNotice, setSavedNotice] = useState(false);

  const handleToggle = (key) => {
    const updated = { ...config, [key]: !config[key] };
    setConfig(updated);
    reviewService.saveDisplayConfig(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
    if (onConfigSaved) onConfigSaved(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono">
      
      {/* Panel 1: Storefront Display Engine Configuration */}
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#315FE8]" />
              <h3 className="font-black text-sm uppercase text-neutral-900">
                STOREFRONT REVIEW DISPLAY ENGINE
              </h3>
            </div>
            {savedNotice ? (
              <span className="px-2 py-0.5 text-[9px] font-black uppercase border border-emerald-600 bg-emerald-100 text-emerald-900 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PREFERENCES SAVED
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[9px] font-black uppercase border border-neutral-900 bg-[#FFD983] text-neutral-900">
                ACTIVE ENGINE
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-600 font-sans mb-3 leading-relaxed">
            Algorithmic sorting rules and automatic moderation guardrails for public reviews on the Toyvolt storefront product listings.
          </p>

          <div className="space-y-2 text-xs">
            {/* Rule 1 */}
            <label className="p-2.5 bg-[#FFF9F0] border-2 border-neutral-900 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors">
              <div>
                <div className="font-bold text-neutral-900">
                  Prioritize Visual Unboxing Proofs (Photos)
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  Pins photo reviews at the top of the storefront listing to maximize conversion.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.prioritizeVisualProofs}
                onChange={() => handleToggle('prioritizeVisualProofs')}
                className="w-4 h-4 accent-[#315FE8] cursor-pointer ml-3"
              />
            </label>

            {/* Rule 2 */}
            <label className="p-2.5 bg-[#FFF9F0] border-2 border-neutral-900 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors">
              <div>
                <div className="font-bold text-neutral-900">
                  Auto-Publish Verified 5-Star Reviews
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  Bypasses manual moderation queue if order is verified via logistics tracking.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.autoPublishVerified5Star}
                onChange={() => handleToggle('autoPublishVerified5Star')}
                className="w-4 h-4 accent-[#315FE8] cursor-pointer ml-3"
              />
            </label>

            {/* Rule 3 */}
            <label className="p-2.5 bg-[#FFF9F0] border-2 border-neutral-900 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors">
              <div>
                <div className="font-bold text-neutral-900">
                  WhatsApp 48-Hour Delivery UGC Trigger
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  Sends automated photo collection prompt via WhatsApp after carrier delivery.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.whatsapp48hDeliveryTrigger}
                onChange={() => handleToggle('whatsapp48hDeliveryTrigger')}
                className="w-4 h-4 accent-[#315FE8] cursor-pointer ml-3"
              />
            </label>

            {/* Rule 4 */}
            <label className="p-2.5 bg-[#FFF9F0] border-2 border-neutral-900 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors">
              <div>
                <div className="font-bold text-neutral-900">
                  Low-Star (1-2★) Immediate Support Guardrail
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  Holds critical ratings in queue and triggers high-priority customer resolution ticket.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.lowStarGuardrail}
                onChange={() => handleToggle('lowStarGuardrail')}
                className="w-4 h-4 accent-[#315FE8] cursor-pointer ml-3"
              />
            </label>
          </div>
        </div>

        <div className="pt-3 border-t-2 border-neutral-200 mt-4 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>ALGORITHM: TOYVOLT TRUST RANK v1.8</span>
          <span className="text-neutral-800 font-bold uppercase">PERSISTED TO LOCAL STORAGE</span>
        </div>
      </div>

      {/* Panel 2: Parent Sentiment Topics & WhatsApp Bot Pipeline */}
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#FF7626]" />
              <h3 className="font-black text-sm uppercase text-neutral-900">
                PARENT SENTIMENT TOPICS & WHATSAPP UGC
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-black uppercase border border-neutral-900 bg-emerald-100 text-emerald-900">
              96% NET POSITIVE
            </span>
          </div>

          <p className="text-xs text-neutral-600 font-sans mb-3 leading-relaxed">
            Automated keyword extraction analyzing common themes across parent testimonials, highlighting toy safety, battery endurance, and tactile satisfaction.
          </p>

          <div className="space-y-2 text-xs">
            {SENTIMENT_TOPICS.map((item) => (
              <div
                key={item.topic}
                className="p-2 bg-[#F7F3EB] border border-neutral-900 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900">{item.topic}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">({item.count} mentions)</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold border ${item.tone}`}>
                  {item.score}
                </span>
              </div>
            ))}

            {/* WhatsApp Integration Status */}
            <div className="mt-3 p-2.5 bg-[#FFF3DF] border-2 border-neutral-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-neutral-900">WhatsApp UGC Bot Pipeline:</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-600 font-bold">
                STANDBY (WEBHOOKS MOUNTED)
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t-2 border-neutral-200 mt-4 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>NLP MODEL: TOY-SENTIMENT v1</span>
          <span className="text-emerald-700 font-bold">ZERO POLICY VIOLATIONS</span>
        </div>
      </div>

    </div>
  );
}
