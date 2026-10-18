import React from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Ban, 
  ShoppingBag,
  Eye,
  Calendar
} from 'lucide-react';
import { customerService } from '../../services/customerService';
import { formatINR } from '../../utils/formatters';

export default function CustomersTable({
  customers = [],
  loading = false,
  selectedIds = [],
  onSelectId,
  onSelectAll,
  onViewDossier,
  onToggleStatus,
  customerSpendMap = {}
}) {
  const isAllSelected = customers.length > 0 && selectedIds.length === customers.length;

  if (loading) {
    return (
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-8 text-center font-mono">
        <div className="animate-spin w-8 h-8 border-4 border-neutral-900 border-t-transparent mx-auto mb-3" />
        <div className="text-sm font-bold text-neutral-800">LOADING CUSTOMER DIRECTORY...</div>
        <div className="text-xs text-neutral-500 mt-1">Retrieving parent profiles and membership records.</div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white border-4 border-neutral-900 shadow-[5px_5px_0px_#000] p-12 text-center font-mono space-y-3">
        <div className="w-12 h-12 bg-neutral-100 border-2 border-neutral-900 mx-auto flex items-center justify-center text-neutral-600">
          <User className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black uppercase text-neutral-900">
          NO CUSTOMER PROFILES FOUND
        </h3>
        <p className="text-xs text-neutral-600 max-w-md mx-auto font-sans">
          No registered customer accounts match your current search or segment filters.
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
              <th className="p-3">PARENT & CONTACT</th>
              <th className="p-3">LOCATION</th>
              <th className="p-3">PLAY CLUB TIER</th>
              <th className="p-3">POINTS</th>
              <th className="p-3">LIFETIME GMV</th>
              <th className="p-3">STATUS</th>
              <th className="p-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200 text-xs text-neutral-900">
            {customers.map((c) => {
              const isSelected = selectedIds.includes(c._id);
              const defaultAddr = c.addresses?.find((a) => a.isDefault) || c.addresses?.[0] || {};
              const spend = customerSpendMap[c._id] || 0;
              const tier = customerService.getTierFromSpend(spend);
              const points = customerService.calculatePoints(spend);
              const isSuspended = c.accountStatus === 'suspended';

              return (
                <tr
                  key={c._id}
                  className={`hover:bg-[#FFF9F0] transition-colors ${
                    isSelected ? 'bg-[#FFD983]/30' : (isSuspended ? 'bg-red-50/50' : '')
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

                  {/* Parent Profile & Contact */}
                  <td className="p-3">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 border border-neutral-900 flex items-center justify-center text-[10px] font-black uppercase text-neutral-800">
                        {c.name ? c.name.charAt(0) : 'P'}
                      </div>
                      <span className="truncate max-w-[180px]" title={c.name}>
                        {c.name || 'Unnamed Parent'}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-600 flex items-center gap-1 mt-0.5 truncate max-w-[200px]" title={c.email}>
                      <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span>{c.email}</span>
                    </div>
                    {(defaultAddr.phone || c.phone) && (
                      <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5 font-mono">
                        <Phone className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span>{defaultAddr.phone || c.phone}</span>
                      </div>
                    )}
                  </td>

                  {/* Customer Location */}
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-neutral-800">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="font-bold truncate max-w-[140px]">
                        {defaultAddr.city || 'No City'}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 pl-4 font-mono truncate max-w-[140px]">
                      {[defaultAddr.state, defaultAddr.postalCode].filter(Boolean).join(', ') || 'India'}
                    </div>
                  </td>

                  {/* Loyalty Tier Badge */}
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black border border-neutral-900 shadow-[1px_1px_0px_#000] ${tier.badgeBg} ${tier.badgeText}`}>
                      {tier.shortName}
                    </span>
                    <div className="text-[9px] text-neutral-500 mt-0.5 font-mono">
                      {tier.multiplier}
                    </div>
                  </td>

                  {/* Points */}
                  <td className="p-3 font-mono">
                    <div className="font-black text-neutral-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{points} pts</span>
                    </div>
                    <div className="text-[9px] text-neutral-500">Auto-Enrolled</div>
                  </td>

                  {/* Lifetime Value (GMV) */}
                  <td className="p-3 font-mono">
                    <div className="font-black text-neutral-900">
                      {spend > 0 ? formatINR(spend) : '₹0'}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      Joined {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </div>
                  </td>

                  {/* Account Status */}
                  <td className="p-3">
                    {isSuspended ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black border border-red-600 bg-red-100 text-red-900">
                        <Ban className="w-3 h-3" />
                        SUSPENDED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black border border-emerald-600 bg-emerald-100 text-emerald-900">
                        <CheckCircle2 className="w-3 h-3" />
                        ACTIVE
                      </span>
                    )}
                  </td>

                  {/* Row Actions */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDossier(c)}
                        className="px-2.5 py-1 border border-neutral-900 bg-white hover:bg-neutral-100 text-[10px] font-bold text-neutral-900 shadow-[1px_1px_0px_#000] flex items-center gap-1 active:translate-x-0.5 active:translate-y-0.5"
                        title="View Customer Dossier"
                      >
                        <Eye className="w-3 h-3" />
                        <span>DOSSIER</span>
                      </button>

                      <button
                        onClick={() => onToggleStatus(c)}
                        className={`px-2 py-1 border border-neutral-900 text-[10px] font-bold shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                          isSuspended
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                            : 'bg-red-50 hover:bg-red-100 text-red-700'
                        }`}
                        title={isSuspended ? 'Reactivate Parent Account' : 'Suspend Account'}
                      >
                        {isSuspended ? 'ACTIVATE' : 'SUSPEND'}
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
