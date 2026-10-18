import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Ban, 
  CheckCircle2, 
  ShoppingBag, 
  ExternalLink,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { customerService } from '../../services/customerService';
import { formatINR } from '../../utils/formatters';

export default function CustomerDetailDrawer({
  customer,
  isOpen,
  onClose,
  onToggleStatus,
  spendRupees = 0
}) {
  if (!isOpen || !customer) return null;

  const defaultAddr = customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0] || {};
  const isSuspended = customer.accountStatus === 'suspended';
  const tier = customerService.getTierFromSpend(spendRupees);
  const points = customerService.calculatePoints(spendRupees);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#FFF9F0] border-l-4 border-neutral-900 shadow-2xl flex flex-col font-mono">
          
          {/* Header */}
          <div className="p-5 bg-[#F7F3EB] border-b-2 border-neutral-900 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase px-2 py-0.5 border border-neutral-900 font-bold bg-[#FFD983]">
                  PARENT PROFILE DOSSIER
                </span>
                <span className="text-xs text-neutral-500 font-bold">
                  ID: {customer._id?.slice(-8)}
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-neutral-900">
                {customer.name || 'Parent Profile'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 border-2 border-neutral-900 bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_#000]"
            >
              <X className="w-5 h-5 text-neutral-900" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* Account Status Strip */}
            <div className="p-3 bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_#000] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isSuspended ? (
                  <span className="px-2 py-0.5 text-xs font-black bg-red-100 text-red-800 border border-red-600 flex items-center gap-1">
                    <Ban className="w-3.5 h-3.5" /> ACCOUNT SUSPENDED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE ACCOUNT
                  </span>
                )}
                <span className="text-[11px] text-neutral-500">
                  Role: <strong className="text-neutral-900">{customer.role || 'customer'}</strong>
                </span>
              </div>

              <button
                onClick={() => onToggleStatus(customer)}
                className={`px-3 py-1 border border-neutral-900 text-xs font-bold shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                  isSuspended
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isSuspended ? 'REACTIVATE' : 'SUSPEND'}
              </button>
            </div>

            {/* Play Club Loyalty Card */}
            <div className="p-4 bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_#000] space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  TOYBOX PLAY CLUB DOSSIER
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-black border border-neutral-900 ${tier.badgeBg} ${tier.badgeText}`}>
                  {tier.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 bg-[#F7F3EB] border border-neutral-900">
                  <div className="text-[10px] text-neutral-500 font-bold uppercase">AVAILABLE POINTS</div>
                  <div className="text-lg font-black text-neutral-900 mt-0.5">
                    {points} pts
                  </div>
                </div>

                <div className="p-2.5 bg-[#F7F3EB] border border-neutral-900">
                  <div className="text-[10px] text-neutral-500 font-bold uppercase">LIFETIME SPEND</div>
                  <div className="text-lg font-black text-neutral-900 mt-0.5">
                    {formatINR(spendRupees)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-neutral-700 font-sans p-2.5 bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="font-bold text-neutral-900 font-mono text-[11px]">ACTIVE PRIVILEGES:</div>
                <div className="text-[11px]">{tier.perks}</div>
              </div>
            </div>

            {/* Primary Contact Details */}
            <div className="p-4 bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_#000] space-y-2.5">
              <div className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#315FE8]" />
                COMMUNICATION PROFILE
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-neutral-800">
                  <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="font-bold">{customer.email}</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-800">
                  <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span>{defaultAddr.phone || customer.phone || 'Phone not on file'}</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-600">
                  <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span>Registered: {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Address Book */}
            <div className="p-4 bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_#000] space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#315FE8]" />
                  SAVED ADDRESS BOOK ({customer.addresses?.length || 0})
                </span>
                <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 border border-neutral-300">
                  INDIA REGION
                </span>
              </div>

              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-2">
                  {customer.addresses.map((addr, idx) => (
                    <div key={idx} className="p-2.5 bg-[#F7F3EB] border border-neutral-900 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span>{addr.fullName || customer.name}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-[#FFD983] px-1 py-0.2 border border-neutral-900">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-700 leading-relaxed font-sans">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        <br />
                        <strong>{addr.city}, {addr.state} - {addr.postalCode}</strong>
                        <br />
                        Phone: {addr.phone || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-[#F7F3EB] border border-dashed border-neutral-400 text-center text-xs text-neutral-500">
                  No delivery addresses saved yet. Addresses are recorded when orders are placed on storefront.
                </div>
              )}
            </div>

            {/* Quick Link to Orders */}
            <div className="p-3 bg-white border-2 border-neutral-900 flex items-center justify-between text-xs">
              <span className="text-neutral-700">Explore full order history for this parent:</span>
              <a
                href={`/orders?search=${encodeURIComponent(customer.email || '')}`}
                className="px-3 py-1.5 bg-[#315FE8] text-white font-bold flex items-center gap-1 hover:bg-[#254bc4]"
              >
                <span>OPEN ORDERS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-[#F7F3EB] border-t-2 border-neutral-900 flex items-center justify-between">
            <span className="text-xs text-neutral-600">
              Verified Parent ID: {customer._id}
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800"
            >
              CLOSE
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
