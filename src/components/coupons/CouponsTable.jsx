import React, { useState } from 'react';
import { 
  Tag, 
  Copy, 
  Check, 
  Edit3, 
  Pause, 
  Play, 
  Calendar, 
  Percent, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Ban
} from 'lucide-react';
import { couponService } from '../../services/couponService';
import { formatINR } from '../../utils/formatters';

export default function CouponsTable({
  coupons = [],
  loading = false,
  selectedIds = [],
  onSelectId,
  onSelectAll,
  onEdit,
  onToggleStatus
}) {
  const [copiedId, setCopiedId] = useState(null);
  const isAllSelected = coupons.length > 0 && selectedIds.length === coupons.length;

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (loading) {
    return (
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-8 text-center font-mono">
        <div className="animate-spin w-8 h-8 border-4 border-neutral-900 border-t-transparent mx-auto mb-3" />
        <div className="text-sm font-bold text-neutral-800">LOADING PROMOTIONAL CAMPAIGNS...</div>
        <div className="text-xs text-neutral-500 mt-1">Fetching coupon rules, caps, and checkout redemption data.</div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-12 text-center font-mono space-y-3">
        <div className="w-12 h-12 bg-neutral-100 border-2 border-neutral-900 mx-auto flex items-center justify-center text-neutral-600">
          <Tag className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black uppercase text-neutral-900">
          NO PROMOTIONAL COUPONS FOUND
        </h3>
        <p className="text-xs text-neutral-600 max-w-md mx-auto font-sans">
          No coupons match your selected status tab or search filter. Create a coupon to launch your campaign.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] overflow-hidden font-mono">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#171717] text-white text-[11px] uppercase tracking-wider border-b-2 border-neutral-900 select-none">
              <th className="p-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="w-4 h-4 accent-[#315FE8] cursor-pointer"
                />
              </th>
              <th className="p-3">PROMO CODE & CAMPAIGN</th>
              <th className="p-3">DISCOUNT FORMULA</th>
              <th className="p-3">REDEMPTIONS / CAP</th>
              <th className="p-3">ELIGIBILITY</th>
              <th className="p-3">VALIDITY WINDOW</th>
              <th className="p-3">STATUS</th>
              <th className="p-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200 text-xs text-neutral-900">
            {coupons.map((c) => {
              const isSelected = selectedIds.includes(c._id);
              const status = couponService.getCouponLifecycleStatus(c);
              const isFlat = c.discountType === 'flat';
              const discountDisplay = isFlat
                ? `₹${Math.round(c.discountValue / 100)} FLAT`
                : `${c.discountValue}% OFF`;
              const minOrderRupees = c.minOrderValue ? Math.round(c.minOrderValue / 100) : 0;
              const maxCapRupees = c.maxDiscountValue ? Math.round(c.maxDiscountValue / 100) : null;

              const usagePercent = c.globalUsageLimit
                ? Math.min(100, Math.round((c.usedCount / c.globalUsageLimit) * 100))
                : null;

              return (
                <tr
                  key={c._id}
                  className={`hover:bg-[#FFF9F0] transition-colors ${
                    isSelected ? 'bg-[#FFD983]/30' : (!c.isActive ? 'bg-neutral-50' : '')
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectId(c._id)}
                      className="w-4 h-4 accent-[#315FE8] cursor-pointer"
                    />
                  </td>

                  {/* Promo Code & Description */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-neutral-900 bg-[#F7F3EB] px-2 py-0.5 border border-neutral-900 shadow-[1px_1px_0px_#000]">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(c._id, c.code)}
                        className="text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Copy code"
                      >
                        {copiedId === c._id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] text-neutral-600 font-sans mt-1 max-w-[220px] truncate" title={c.description}>
                      {c.description || 'Promotional coupon code'}
                    </div>
                  </td>

                  {/* Discount Formula */}
                  <td className="p-3 font-mono">
                    <div className="font-black text-neutral-900 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-[#FF7626]" />
                      <span>{discountDisplay}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 font-sans">
                      {minOrderRupees > 0 ? `Min cart: ${formatINR(minOrderRupees)}` : 'No min order'}
                      {maxCapRupees && ` • Max: ${formatINR(maxCapRupees)}`}
                    </div>
                  </td>

                  {/* Redemptions / Cap */}
                  <td className="p-3 font-mono">
                    <div className="font-bold text-neutral-900">
                      {c.usedCount} <span className="text-neutral-500 font-normal">/ {c.globalUsageLimit || '&infin;'}</span>
                    </div>
                    {usagePercent !== null && (
                      <div className="w-24 h-1.5 bg-neutral-200 border border-neutral-900 mt-1">
                        <div className="h-full bg-[#315FE8]" style={{ width: `${usagePercent}%` }} />
                      </div>
                    )}
                  </td>

                  {/* Eligibility */}
                  <td className="p-3 text-[11px] font-sans">
                    <div className="font-bold text-neutral-800">
                      {c.perCustomerLimit === 1 ? '1 use per parent' : `${c.perCustomerLimit} uses per parent`}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      {c.productRestrictions && c.productRestrictions.length > 0 
                        ? `${c.productRestrictions.length} product restriction(s)`
                        : 'Storewide Catalog'}
                    </div>
                  </td>

                  {/* Validity Window */}
                  <td className="p-3 font-mono text-[11px]">
                    <div className="flex items-center gap-1 text-neutral-800">
                      <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span>{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-IN') : 'Ongoing'}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      From {c.startDate ? new Date(c.startDate).toLocaleDateString('en-IN') : 'Now'}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-3">
                    {status === 'ACTIVE' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black border border-emerald-600 bg-emerald-100 text-emerald-900">
                        <CheckCircle2 className="w-3 h-3" /> ACTIVE
                      </span>
                    )}
                    {status === 'SCHEDULED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black border border-amber-600 bg-amber-100 text-amber-900">
                        <Clock className="w-3 h-3" /> SCHEDULED
                      </span>
                    )}
                    {status === 'EXPIRED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black border border-neutral-400 bg-neutral-100 text-neutral-700">
                        EXPIRED
                      </span>
                    )}
                    {status === 'PAUSED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black border border-neutral-900 bg-neutral-200 text-neutral-800">
                        <Ban className="w-3 h-3" /> PAUSED
                      </span>
                    )}
                    {status === 'DEPLETED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black border border-red-600 bg-red-100 text-red-900">
                        DEPLETED
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(c)}
                        className="px-2.5 py-1 border border-neutral-900 bg-white hover:bg-neutral-100 text-[10px] font-bold text-neutral-900 shadow-[1px_1px_0px_#000] flex items-center gap-1 active:translate-x-0.5 active:translate-y-0.5"
                        title="Edit Campaign Rules"
                      >
                        <Edit3 className="w-3 h-3 text-[#315FE8]" />
                        <span>EDIT</span>
                      </button>

                      <button
                        onClick={() => onToggleStatus(c)}
                        className={`px-2 py-1 border border-neutral-900 text-[10px] font-bold shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                          c.isActive
                            ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                        }`}
                        title={c.isActive ? 'Pause Campaign' : 'Activate Campaign'}
                      >
                        {c.isActive ? 'PAUSE' : 'ACTIVATE'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
