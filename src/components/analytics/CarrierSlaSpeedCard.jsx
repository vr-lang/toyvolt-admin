import React from 'react';
import { Truck, Clock, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const CarrierSlaSpeedCard = ({ carrierMetrics = {}, isLoading = false }) => {
  const {
    isIntegrated = false,
    totalDispatched = 0,
    inTransitCount = 0,
    deliveredCount = 0,
    activeCourier = 'Shiprocket (Standby / Direct)',
    avgTransitDays = null,
    onTimeDeliveryRate = null
  } = carrierMetrics;

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
              <Truck className="w-3.5 h-3.5 text-ink" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-tight text-ink">
                CARRIER SLA &amp; SPEED
              </h3>
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
                Logistics telemetry &amp; delivery speed
              </span>
            </div>
          </div>
          <StatusBadge variant="info" size="sm">
            SHIPROCKET
          </StatusBadge>
        </div>

        {/* Carrier Info Box */}
        <div className="p-3 bg-[#FFF9F0] border-2 border-ink shadow-[2px_2px_0px_#171717] mb-3">
          <div className="flex items-center justify-between font-mono text-xs mb-1">
            <span className="font-bold text-[#6E6E6E] uppercase text-[10px]">
              PRIMARY LOGISTICS AGGREGATOR
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3 h-3" /> API Ready
            </span>
          </div>
          <div className="font-display font-black text-sm uppercase text-ink">
            {activeCourier}
          </div>
          <div className="font-mono text-[10px] text-[#6E6E6E] mt-0.5">
            Delhivery, Blue Dart, Ecom Express, DTDC routing
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          {/* Dispatch Count */}
          <div className="p-2.5 bg-white border border-ink">
            <span className="text-[10px] text-[#6E6E6E] uppercase block mb-0.5">
              TOTAL DISPATCHES
            </span>
            <span className="font-display font-bold text-lg text-ink block leading-none">
              {totalDispatched}
            </span>
            <span className="text-[10px] text-[#6E6E6E] mt-1 block">
              {inTransitCount} In Transit • {deliveredCount} Delivered
            </span>
          </div>

          {/* Average Delivery Time */}
          <div className="p-2.5 bg-white border border-ink">
            <span className="text-[10px] text-[#6E6E6E] uppercase block mb-0.5">
              AVG TRANSIT SPEED
            </span>
            <span className="font-display font-bold text-lg text-ink block leading-none">
              {avgTransitDays !== null ? `${avgTransitDays} Days` : 'N/A'}
            </span>
            <span className="text-[10px] text-[#6E6E6E] mt-1 block">
              {avgTransitDays !== null ? 'Metro: 2-3d' : 'Awaiting shipments'}
            </span>
          </div>

          {/* On-Time SLA */}
          <div className="p-2.5 bg-white border border-ink col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#6E6E6E] uppercase block">
                  ON-TIME DELIVERY SLA
                </span>
                <span className="font-display font-bold text-base text-ink block leading-tight">
                  {onTimeDeliveryRate !== null ? `${onTimeDeliveryRate}%` : 'N/A (0 Completed Deliveries)'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#6E6E6E] text-right">
                All-India PIN Serviceable
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-ink/15 flex items-center justify-between font-mono text-[10px] text-[#6E6E6E] mt-3">
        <span>Tracking: Webhook enabled</span>
        <span className="text-ink font-semibold">Zero transit claims logged</span>
      </div>
    </div>
  );
};

export default CarrierSlaSpeedCard;
