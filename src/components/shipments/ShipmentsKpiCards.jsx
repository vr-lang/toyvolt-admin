import React from 'react';
import { Truck, CheckCircle2, AlertTriangle, Package, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const ShipmentsKpiCards = ({
  metrics = {},
  loading = false,
  onSelectKpiFilter
}) => {
  const awaitingCount = metrics?.awaitingBookingCount ?? 0;
  const activeInTransit = metrics?.activeInTransit || { count: 0, courierDistribution: {} };
  const onTimeSla = metrics?.onTimeSla || { percent: null, label: 'Not enough data', avgTransitDays: null };
  const ndrCases = metrics?.ndrCases || { count: 0, actionRequired: 0 };
  const manifested = metrics?.manifestedForPickup || { count: 0, scheduledPickupTime: null };

  const couriersSummary = Object.keys(activeInTransit.courierDistribution || {}).slice(0, 2).join(', ');

  const cards = [
    {
      id: 'awaiting-dispatch',
      title: 'Awaiting Booking',
      subtitle: 'READY FOR SHIPROCKET',
      count: awaitingCount,
      secondaryText: awaitingCount > 0 ? `${awaitingCount} orders to dispatch` : 'All orders booked',
      badgeText: awaitingCount > 0 ? 'ACTION NEEDED' : 'CLEAR',
      badgeColor: awaitingCount > 0 ? 'bg-[#FFD983] text-[#171717] border-[#171717]' : 'bg-gray-100 text-gray-600 border-gray-300',
      icon: Package,
      filterKey: 'awaiting_booking',
      accentColor: awaitingCount > 0 ? 'border-l-4 border-l-[#B45309]' : ''
    },
    {
      id: 'active-in-transit',
      title: 'Active In-Transit',
      subtitle: 'LIVE COURIER RADAR',
      count: activeInTransit.count,
      secondaryText: couriersSummary ? `Via ${couriersSummary}` : 'Tracking nationwide',
      badgeText: activeInTransit.count > 0 ? `${activeInTransit.count} PARCELS` : 'QUEUE IDLE',
      badgeColor: activeInTransit.count > 0 ? 'bg-[#DCE5FF] text-[#315FE8] border-[#315FE8]' : 'bg-gray-100 text-gray-700 border-gray-300',
      icon: Truck,
      filterKey: 'IN_TRANSIT',
      accentColor: 'border-l-4 border-l-[#315FE8]'
    },
    {
      id: 'sla-rating',
      title: 'On-Time SLA Rating',
      subtitle: 'METRIC PERFORMANCE',
      count: onTimeSla.percent !== null ? `${onTimeSla.percent}%` : 'N/A',
      secondaryText: onTimeSla.avgTransitDays ? `${onTimeSla.avgTransitDays}d avg transit` : onTimeSla.label,
      badgeText: onTimeSla.percent !== null && onTimeSla.percent >= 90 ? 'HEALTHY SLA' : 'SLA STANDBY',
      badgeColor: onTimeSla.percent !== null && onTimeSla.percent >= 90 ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-gray-100 text-gray-600 border-gray-300',
      icon: CheckCircle2,
      accentColor: 'border-l-4 border-l-emerald-600'
    },
    {
      id: 'ndr-action',
      title: 'NDR / Urgent Action',
      subtitle: 'CUSTOMER INTERVENTION',
      count: ndrCases.count,
      secondaryText: ndrCases.count > 0 ? `${ndrCases.actionRequired || ndrCases.count} require re-attempt action` : '0 delivery failures',
      badgeText: ndrCases.count > 0 ? 'HIGH PRIORITY' : 'CLEAR',
      badgeColor: ndrCases.count > 0 ? 'bg-[#FF5638] text-white border-[#171717]' : 'bg-emerald-100 text-emerald-800 border-emerald-400',
      icon: AlertTriangle,
      filterKey: 'ndrOnly',
      accentColor: ndrCases.count > 0 ? 'border-l-4 border-l-[#FF5638]' : ''
    },
    {
      id: 'manifested-pickup',
      title: 'Manifested for Pickup',
      subtitle: 'WAREHOUSE DOCK',
      count: manifested.count,
      secondaryText: 'Awaiting carrier vehicle pickup',
      badgeText: manifested.count > 0 ? 'AWAITING PICKUP' : 'DOCKED',
      badgeColor: manifested.count > 0 ? 'bg-[#FFD983] text-[#171717] border-[#171717]' : 'bg-gray-100 text-gray-600 border-gray-300',
      icon: Package,
      filterKey: 'CREATED',
      accentColor: manifested.count > 0 ? 'border-l-4 border-l-amber-500' : ''
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
        {[...Array(5)].map((_, i) => (
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6 font-mono">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            onClick={() => {
              if (onSelectKpiFilter && card.filterKey) {
                onSelectKpiFilter(card.filterKey);
              }
            }}
            className={`bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#171717] cursor-pointer ${card.accentColor}`}
          >
            {/* Header: Subtitle & Badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {card.subtitle}
                </span>
                <h3 className="font-bold text-xs uppercase text-[#171717]">
                  {card.title}
                </h3>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 border shrink-0 ${card.badgeColor}`}
              >
                {card.badgeText}
              </span>
            </div>

            {/* Middle: Count & secondary stats */}
            <div className="my-1.5 flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-black text-[#171717]">
                {card.count}
              </span>
              <span className="text-[10px] text-gray-600 truncate max-w-[130px] text-right">
                {card.secondaryText}
              </span>
            </div>

            {/* Bottom info strip */}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <Icon size={12} className="text-[#171717]" />
                <span className="uppercase">Inspect telemetries</span>
              </span>
              <span className="font-bold text-[#315FE8] uppercase flex items-center gap-0.5">
                FILTER <ArrowRight size={10} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShipmentsKpiCards;
