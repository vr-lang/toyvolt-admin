import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Warehouse, Clock, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const FulfillmentStatusPanel = ({
  warehouseName = 'Primary Noida Hub (NCR)',
  dispatchCutoff = '16:00 IST',
  activeCouriers = ['Delhivery', 'Blue Dart', 'DTDC', 'Ecom Express'],
  pendingOrdersCount = 0,
  isIntegrated = true
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-panel border-2 border-ink shadow-[4px_4px_0px_#171717] p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-4 border-b-2 border-ink gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1.5px_1.5px_0px_#171717]">
            <Truck className="w-4 h-4 text-[#315FE8]" />
          </div>
          <div>
            <h3 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-ink">
              FULFILLMENT &amp; INVENTORY STATUS
            </h3>
            <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
              Automated logistics dispatch gateway &amp; Shiprocket integration
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isIntegrated ? (
            <StatusBadge variant="success" size="sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse mr-1" />
              SHIPROCKET LIVE
            </StatusBadge>
          ) : (
            <StatusBadge variant="neutral" size="sm">
              STANDBY
            </StatusBadge>
          )}

          <button
            type="button"
            onClick={() => navigate('/shipments')}
            className="brutal-btn brutal-btn-primary text-xs px-3 py-1 flex items-center gap-1 shadow-[2px_2px_0px_#171717]"
          >
            <span className="font-mono text-[11px] font-bold">MANAGE SHIPMENTS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of logistics parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {/* Hub */}
        <div className="p-3 bg-[#FFF9F0] border border-ink shadow-[1.5px_1.5px_0px_#171717]">
          <div className="flex items-center gap-1.5 text-[10px] text-[#6E6E6E] uppercase font-bold mb-1">
            <Warehouse className="w-3 h-3 text-[#315FE8]" />
            PRIMARY PICKUP LOCATION
          </div>
          <strong className="text-ink text-xs block truncate" title={warehouseName}>
            {warehouseName}
          </strong>
          <span className="text-[10px] text-emerald-800 font-semibold block mt-1">
            Standard NCR Dispatch Hub
          </span>
        </div>

        {/* Dispatch Cutoff */}
        <div className="p-3 bg-[#FFF9F0] border border-ink shadow-[1.5px_1.5px_0px_#171717]">
          <div className="flex items-center gap-1.5 text-[10px] text-[#6E6E6E] uppercase font-bold mb-1">
            <Clock className="w-3 h-3 text-[#315FE8]" />
            DAILY DISPATCH CUTOFF
          </div>
          <strong className="text-ink text-xs block">
            {dispatchCutoff}
          </strong>
          <span className="text-[10px] text-[#6E6E6E] block mt-1">
            Orders placed prior ship same-day
          </span>
        </div>

        {/* Integrated Couriers */}
        <div className="p-3 bg-[#FFF9F0] border border-ink shadow-[1.5px_1.5px_0px_#171717]">
          <div className="flex items-center gap-1.5 text-[10px] text-[#6E6E6E] uppercase font-bold mb-1">
            <ShieldCheck className="w-3 h-3 text-[#315FE8]" />
            ENABLED CARRIERS
          </div>
          <strong className="text-ink text-[11px] block truncate">
            {activeCouriers.slice(0, 3).join(', ')}...
          </strong>
          <span className="text-[10px] text-[#6E6E6E] block mt-1">
            29,000+ PIN code serviceability
          </span>
        </div>

        {/* Pending Fulfillment */}
        <div className="p-3 bg-white border border-ink shadow-[1.5px_1.5px_0px_#171717]">
          <div className="text-[10px] text-[#6E6E6E] uppercase font-bold mb-1">
            QUEUED FOR DISPATCH
          </div>
          <div className="flex items-baseline gap-1.5">
            <strong className="text-sm font-display font-black text-ink">
              {pendingOrdersCount} Order{pendingOrdersCount === 1 ? '' : 's'}
            </strong>
          </div>
          <span className="text-[10px] text-[#315FE8] font-bold block mt-1">
            {pendingOrdersCount > 0 ? 'Generate AWB in Shipments' : 'Queue clear'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FulfillmentStatusPanel;
