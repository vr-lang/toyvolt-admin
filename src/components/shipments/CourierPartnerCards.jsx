import React from 'react';
import { Truck, ExternalLink, ShieldCheck, Clock, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export const CourierPartnerCards = ({
  couriers = [],
  pickupLocation = 'Fatehabad Hub (work)',
  onFilterCourier
}) => {
  // Find real courier data if returned by Shiprocket / backend
  const bluedartData = couriers.find((c) => /bluedart|blue dart/i.test(c.courierName));
  const delhiveryData = couriers.find((c) => /delhivery/i.test(c.courierName));
  // Other couriers
  const otherCouriers = couriers.filter(
    (c) => !/bluedart|blue dart|delhivery/i.test(c.courierName)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 font-mono text-xs">
      {/* CARD A: BLUEDART APEX EXPRESS (or Primary Carrier) */}
      <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#171717] pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#315FE8] text-white border border-[#171717] flex items-center justify-center font-bold text-xs shadow-[1px_1px_0px_#171717]">
                <Truck size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm uppercase text-[#171717]">
                    {bluedartData?.courierName || 'BLUEDART APEX EXPRESS'}
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#315FE8] text-white border border-[#171717]">
                    AIR EXPEDITED
                  </span>
                </div>
                <p className="text-[10px] text-gray-600">
                  Tier-1 Metros & Express Cargo • Shiprocket Integrated
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-[#171717]">
              {bluedartData ? `${bluedartData.count} ASSIGNED` : 'NO ACTIVE LOADS'}
            </span>
          </div>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 py-1 mb-3">
            <div className="bg-white border border-[#171717] p-2">
              <span className="text-[9px] text-gray-500 uppercase block">Active In-Transit</span>
              <span className="font-bold text-base text-[#171717]">
                {bluedartData?.activeCount ?? 0}
              </span>
            </div>

            <div className="bg-white border border-[#171717] p-2">
              <span className="text-[9px] text-gray-500 uppercase block">Delivery Success</span>
              <span className="font-bold text-base text-emerald-700">
                {bluedartData?.successRate !== null && bluedartData?.successRate !== undefined
                  ? `${bluedartData.successRate}%`
                  : 'N/A'}
              </span>
            </div>

            <div className="bg-white border border-[#171717] p-2">
              <span className="text-[9px] text-gray-500 uppercase block">Avg Transit SLA</span>
              <span className="font-bold text-base text-[#315FE8]">
                {bluedartData?.avgTransitDays ? `${bluedartData.avgTransitDays}d` : 'Awaiting data'}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-gray-600 mb-3">
            {bluedartData
              ? `Operational tracking active for ${bluedartData.count} parcels routed via BlueDart hubs.`
              : 'Carrier profile ready. Active parcels will populate when BlueDart is assigned by Shiprocket.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-gray-300 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">
            Pickup Hub: {pickupLocation}
          </span>

          <button
            type="button"
            onClick={() => onFilterCourier && onFilterCourier('bluedart')}
            className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#171717] text-xs font-bold uppercase border border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-1 transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <span>Filter BlueDart</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* CARD B: DELHIVERY SURFACE TIER-2 (or Secondary Carrier) */}
      <div className="bg-[#FFF9F0] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#171717] pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#FF5638] text-white border border-[#171717] flex items-center justify-center font-bold text-xs shadow-[1px_1px_0px_#171717]">
                <Truck size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm uppercase text-[#171717]">
                    {delhiveryData?.courierName || 'DELHIVERY SURFACE TIER-2'}
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#FF5638] text-white border border-[#171717]">
                    GROUND SURFACE
                  </span>
                </div>
                <p className="text-[10px] text-gray-600">
                  Pan-India Tier 2/3 Heavy Cargo • Shiprocket Integrated
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-[#171717]">
              {delhiveryData ? `${delhiveryData.count} ASSIGNED` : 'NO ACTIVE LOADS'}
            </span>
          </div>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 py-1 mb-3">
            <div className="bg-white border border-[#171717] p-2">
              <span className="text-[9px] text-gray-500 uppercase block">Active In-Transit</span>
              <span className="font-bold text-base text-[#171717]">
                {delhiveryData?.activeCount ?? 0}
              </span>
            </div>

            <div className="bg-white border border-[#171717] p-2">
              <span className="text-[9px] text-gray-500 uppercase block">Delivery Success</span>
              <span className="font-bold text-base text-emerald-700">
                {delhiveryData?.successRate !== null && delhiveryData?.successRate !== undefined
                  ? `${delhiveryData.successRate}%`
                  : 'N/A'}
              </span>
            </div>

            <div className="bg-white border border-[#171717] p-2">
              <span className="text-[9px] text-gray-500 uppercase block">Avg Transit SLA</span>
              <span className="font-bold text-base text-[#315FE8]">
                {delhiveryData?.avgTransitDays ? `${delhiveryData.avgTransitDays}d` : 'Awaiting data'}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-gray-600 mb-3">
            {delhiveryData
              ? `Operational tracking active for ${delhiveryData.count} parcels routed via Delhivery surface.`
              : 'Carrier profile ready. Active parcels will populate when Delhivery is assigned by Shiprocket.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-gray-300 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">
            Pickup Hub: {pickupLocation}
          </span>

          <button
            type="button"
            onClick={() => onFilterCourier && onFilterCourier('delhivery')}
            className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#171717] text-xs font-bold uppercase border border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-1 transition-transform active:translate-x-0.5 active:translate-y-0.5"
          >
            <span>Filter Delhivery</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourierPartnerCards;
