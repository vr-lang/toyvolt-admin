import React from 'react';
import { IndianRupee, TrendingUp, Percent, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export const PricingMarginSection = ({
  pricing = {},
  errors = {},
  onChange
}) => {
  const compareAt = Number(pricing.compareAtPrice) || 0;
  const selling = Number(pricing.sellingPrice) || 0;
  const cost = Number(pricing.costPrice) || 0;

  // Real-time Financial Calculations
  const discountPercent =
    compareAt > selling && compareAt > 0
      ? Math.round(((compareAt - selling) / compareAt) * 100)
      : 0;

  const grossProfit = selling > 0 && cost > 0 ? selling - cost : selling;
  const grossMargin = selling > 0 && cost > 0 ? Math.round((grossProfit / selling) * 100) : 0;

  // 18% GST calculation (Toys HSN 9503)
  const gstBasePrice = selling > 0 ? Math.round((selling / 1.18) * 100) / 100 : 0;
  const gstAmount = selling > 0 ? Math.round((selling - gstBasePrice) * 100) / 100 : 0;

  // Margin classification
  const getMarginBadge = () => {
    if (!cost) return { label: 'COGS NOT SPECIFIED', color: 'bg-gray-100 text-gray-700' };
    if (grossMargin >= 45) return { label: 'PRIME MARGIN (>45%)', color: 'bg-emerald-100 text-emerald-850 font-bold border-emerald-400' };
    if (grossMargin >= 25) return { label: 'BALANCED MARGIN (25-45%)', color: 'bg-amber-100 text-amber-850 font-bold border-amber-400' };
    return { label: 'THIN MARGIN (<25%)', color: 'bg-red-100 text-red-800 font-bold border-red-400' };
  };

  const badge = getMarginBadge();

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#171717] pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#315FE8] text-white flex items-center justify-center font-mono font-bold text-[10px]">
            ₹
          </div>
          <h2 className="font-mono font-bold text-xs tracking-wider uppercase text-[#171717]">
            Pricing & Margin Intelligence
          </h2>
        </div>
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-[#DCE5FF] text-[#315FE8] border border-[#315FE8]">
          AUTO-CALCULATED
        </span>
      </div>

      <div className="space-y-3">
        {/* Selling Price (Required) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-mono font-bold uppercase text-[#171717] flex items-center gap-1">
              <span>Selling Price (Storefront)</span>
              <span className="text-[#FF5638]">*</span>
            </label>
            <span className="text-[10px] font-mono text-gray-500 font-bold">INR (₹)</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-mono font-bold text-[#171717]">
              ₹
            </div>
            <input
              type="number"
              min="1"
              step="1"
              value={pricing.sellingPrice ?? ''}
              onChange={(e) => onChange('sellingPrice', e.target.value)}
              placeholder="2999"
              className={`w-full bg-[#FAF8F5] border-2 ${
                errors.sellingPrice ? 'border-[#FF5638] bg-red-50/20' : 'border-[#171717]'
              } pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white`}
            />
          </div>
          {errors.sellingPrice && (
            <p className="mt-1 text-xs font-mono text-[#FF5638] flex items-center gap-1">
              <AlertCircle size={11} /> {errors.sellingPrice}
            </p>
          )}
        </div>

        {/* MRP / Compare-at Price & Cost Price Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* MRP / Compare-at Price */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono font-bold uppercase text-gray-700">
                MRP (Crossed Out)
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-xs font-mono text-gray-500">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="1"
                value={pricing.compareAtPrice ?? ''}
                onChange={(e) => onChange('compareAtPrice', e.target.value)}
                placeholder="4999"
                className={`w-full bg-[#FAF8F5] border-2 ${
                  errors.compareAtPrice ? 'border-[#FF5638] bg-red-50/20' : 'border-[#171717]'
                } pl-6 pr-2 py-1.5 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white`}
              />
            </div>
            {errors.compareAtPrice && (
              <p className="mt-1 text-[10px] font-mono text-[#FF5638]">
                {errors.compareAtPrice}
              </p>
            )}
          </div>

          {/* Cost Price (COGS) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono font-bold uppercase text-gray-700">
                Cost Price (COGS)
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-xs font-mono text-gray-500">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="1"
                value={pricing.costPrice ?? ''}
                onChange={(e) => onChange('costPrice', e.target.value)}
                placeholder="1450"
                className="w-full bg-[#FAF8F5] border-2 border-[#171717] pl-6 pr-2 py-1.5 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Real-time Financial KPI Cards */}
        <div className="pt-2 border-t border-gray-200 space-y-2">
          {/* Discount Card */}
          <div className="flex items-center justify-between p-2 bg-[#FAF8F5] border border-[#171717]">
            <span className="text-[10px] font-mono font-bold uppercase text-gray-600">
              Customer Discount
            </span>
            <div className="flex items-center gap-1.5">
              {discountPercent > 0 ? (
                <>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-[#FF5638] text-white">
                    {discountPercent}% OFF
                  </span>
                  <span className="text-[10px] font-mono text-gray-600">
                    (Saves ₹{(compareAt - selling).toLocaleString('en-IN')})
                  </span>
                </>
              ) : (
                <span className="text-[10px] font-mono text-gray-400">NO DISCOUNT</span>
              )}
            </div>
          </div>

          {/* Gross Margin Card */}
          {cost > 0 && (
            <div className="p-2 bg-[#FAF8F5] border border-[#171717] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-600">
                  Unit Gross Profit
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  ₹{grossProfit.toLocaleString('en-IN')}{' '}
                  <span className="text-[10px] font-normal text-gray-600">({grossMargin}%)</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-200 border border-[#171717] overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    grossMargin >= 45
                      ? 'bg-emerald-500'
                      : grossMargin >= 25
                      ? 'bg-amber-400'
                      : 'bg-[#FF5638]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, grossMargin))}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className={`px-1 py-0.2 border text-[8px] font-bold ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="text-gray-500">Target: &gt;40%</span>
              </div>
            </div>
          )}

          {/* GST Classification Card */}
          <div className="p-2 bg-[#DCE5FF]/40 border border-[#315FE8] text-[10px] font-mono space-y-1">
            <div className="flex justify-between font-bold text-[#171717]">
              <span>18% GST (Included in Price):</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Net Taxable Value (Base):</span>
              <span>₹{gstBasePrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingMarginSection;
