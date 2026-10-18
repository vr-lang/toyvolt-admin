import React from 'react';
import { Package, Truck, Clock, AlertCircle, IndianRupee, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../services/orderService';

export const OrdersKpiCards = ({
  metrics = {},
  loading = false,
  onSelectFilter
}) => {
  const pendingBooking = metrics?.pendingBooking || { count: 0, totalAmountPaise: 0, totalAmountRupees: 0 };
  const readyForDispatch = metrics?.readyForDispatch || { count: 0, totalAmountPaise: 0, totalAmountRupees: 0 };
  const dispatchedToday = metrics?.dispatchedToday || { count: 0, totalAmountPaise: 0, totalAmountRupees: 0 };
  const paymentReview = metrics?.paymentReview || { count: 0, totalAmountPaise: 0, totalAmountRupees: 0 };

  const cards = [
    {
      id: 'pending-booking',
      title: 'Pending Booking',
      subtitle: 'AWAITING LABELS',
      count: pendingBooking.count,
      amount: pendingBooking.totalAmountPaise,
      badgeText: pendingBooking.count > 0 ? 'URGENT ATTENTION' : 'QUEUE CLEAR',
      badgeColor: pendingBooking.count > 0 ? 'bg-[#FF5638] text-white border-[#171717]' : 'bg-emerald-100 text-emerald-800 border-emerald-400',
      icon: Clock,
      filterStatus: 'placed',
      accentColor: pendingBooking.count > 0 ? 'border-l-4 border-l-[#FF5638]' : ''
    },
    {
      id: 'ready-dispatch',
      title: 'Ready for Dispatch',
      subtitle: 'PACKED & SCHEDULED',
      count: readyForDispatch.count,
      amount: readyForDispatch.totalAmountPaise,
      badgeText: `${readyForDispatch.count} READY`,
      badgeColor: 'bg-[#DCE5FF] text-[#315FE8] border-[#315FE8]',
      icon: Package,
      filterStatus: 'processing',
      accentColor: 'border-l-4 border-l-[#315FE8]'
    },
    {
      id: 'dispatched-today',
      title: 'Dispatched Today',
      subtitle: 'IN-TRANSIT COURIERS',
      count: dispatchedToday.count,
      amount: dispatchedToday.totalAmountPaise,
      badgeText: 'OUT WITH COURIER',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-400',
      icon: Truck,
      filterStatus: 'shipped',
      accentColor: 'border-l-4 border-l-emerald-600'
    },
    {
      id: 'payment-review',
      title: 'Payment / COD Review',
      subtitle: 'UNCONFIRMED / RECON',
      count: paymentReview.count,
      amount: paymentReview.totalAmountPaise,
      badgeText: paymentReview.count > 0 ? 'NEEDS AUDIT' : 'VERIFIED',
      badgeColor: paymentReview.count > 0 ? 'bg-[#FFD983] text-[#171717] border-[#171717]' : 'bg-gray-100 text-gray-700 border-gray-300',
      icon: IndianRupee,
      filterPaymentStatus: 'pending',
      accentColor: paymentReview.count > 0 ? 'border-l-4 border-l-amber-500' : ''
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4 animate-pulse h-28"
          >
            <div className="h-3 w-24 bg-gray-200 mb-3" />
            <div className="h-7 w-16 bg-gray-300 mb-2" />
            <div className="h-3 w-32 bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            onClick={() => {
              if (onSelectFilter) {
                if (card.filterStatus) onSelectFilter({ status: card.filterStatus });
                else if (card.filterPaymentStatus) onSelectFilter({ paymentStatus: card.filterPaymentStatus });
              }
            }}
            className={`bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#171717] cursor-pointer ${card.accentColor}`}
          >
            {/* Header: Title & Badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">
                  {card.subtitle}
                </span>
                <h3 className="font-mono font-bold text-xs uppercase text-[#171717]">
                  {card.title}
                </h3>
              </div>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border shrink-0 ${card.badgeColor}`}
              >
                {card.badgeText}
              </span>
            </div>

            {/* Middle: Count & Amount */}
            <div className="my-1.5 flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-mono font-bold text-[#171717]">
                {card.count.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-mono font-bold text-gray-700">
                {formatINR(card.amount, true)}
              </span>
            </div>

            {/* Bottom info strip */}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span className="flex items-center gap-1">
                <Icon size={12} className="text-[#171717]" />
                <span className="uppercase">Click to inspect</span>
              </span>
              <span className="font-bold text-[#315FE8] uppercase">FILTER &rarr;</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersKpiCards;
