import React, { useState } from 'react';
import { X, FileText, Copy, Check, Printer } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/formatters';

export const ExecutiveDigestModal = ({ isOpen, onClose, data = {} }) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const kpis = data.kpis || {};
  const topSku = data.skuVelocity?.[0];
  const topState = data.states?.[0];
  const paymentSplit = data.paymentSplit || {};

  const digestText = `TOYVOLT EXECUTIVE INTELLIGENCE BRIEFING
Window: ${data.timeframe?.toUpperCase()} (${data.timeframeDays || 30} Days) | Generated: ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
--------------------------------------------------
1. FINANCIAL HEADLINES:
• Gross Merchandise Value (GMV): ${formatCurrencyINR(kpis.gmvRupees || 0)} across ${kpis.totalOrders || 0} order(s).
• Net Realized (Paid): ${formatCurrencyINR(kpis.realizedRevenueRupees || 0)} (${kpis.paidOrdersCount || 0} settled).
• Blended Gross Margin: ${kpis.overallMarginPercent ? `${kpis.overallMarginPercent}%` : 'Pending catalog cost inputs'}.

2. COMMERCIAL CONCENTRATION:
• Top Selling SKU: ${topSku ? `${topSku.sku} - ${topSku.name} (${topSku.unitsSold} units, ${formatCurrencyINR(topSku.gmvRupees)})` : 'None logged'}.
• Dominant State: ${topState ? `${topState.state} (${topState.sharePercent}% share, ${formatCurrencyINR(topState.revenueRupees)})` : 'None logged'}.

3. CASH FLOW & RISK MIX:
• Prepaid Volume: ${paymentSplit.prepaidPercent || 0}% (${formatCurrencyINR(paymentSplit.prepaidAmountRupees || 0)} via Razorpay).
• COD Exposure: ${paymentSplit.codPercent || 0}% (${formatCurrencyINR(paymentSplit.codAmountRupees || 0)} at doorstep).
• Return-To-Origin (RTO): ${kpis.rtoRatePercent || 0}% (Target: < 5.0%).

4. FULFILLMENT & REGULATORY:
• Dispatches: ${kpis.dispatchedCount || 0} unit(s) (${kpis.inFlightCount || 0} In-Flight via Shiprocket).
• BIS IS-9873 Status: Compliance Data Not Configured (Awaiting lab PDF uploads).
--------------------------------------------------
Official Toyvolt Admin Intelligence Telemetry`;

  const handleCopy = () => {
    navigator.clipboard.writeText(digestText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-panel border-2 border-ink shadow-[6px_6px_0px_#171717] p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#315FE8] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-base uppercase tracking-tight text-ink">
                EXECUTIVE INTELLIGENCE DIGEST
              </h3>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                Structured briefing for leadership &amp; investors
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 border border-ink bg-white hover:bg-[#F0EEEE] shadow-[1px_1px_0px_#171717]"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digest Box */}
        <div className="p-3.5 bg-[#FFF9F0] border-2 border-ink shadow-[2px_2px_0px_#171717]">
          <pre className="font-mono text-xs text-ink whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto select-all">
            {digestText}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t-2 border-ink flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="brutal-btn bg-white hover:bg-[#F0EEEE] text-ink text-xs px-4 py-2"
          >
            CLOSE
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="brutal-btn brutal-btn-primary text-xs px-4 py-2 flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                COPIED TO CLIPBOARD!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white" />
                COPY DIGEST TEXT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDigestModal;
