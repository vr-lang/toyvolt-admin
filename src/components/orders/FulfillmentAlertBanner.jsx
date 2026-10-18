import React from 'react';
import { AlertTriangle, Info, Truck, CheckCircle2, ChevronRight, PlugZap } from 'lucide-react';

export const FulfillmentAlertBanner = ({
  shippingIntegration = {},
  pendingBookingCount = 0,
  onFilterPendingBooking
}) => {
  const isShiprocketConfigured = Boolean(shippingIntegration?.isShiprocketConfigured);

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-3 md:p-3.5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left icon & message */}
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-7 h-7 shrink-0 border border-[#171717] flex items-center justify-center font-bold text-xs ${
              pendingBookingCount > 0
                ? 'bg-[#FF5638] text-white'
                : isShiprocketConfigured
                ? 'bg-emerald-500 text-white'
                : 'bg-[#FFD983] text-[#171717]'
            }`}
          >
            {pendingBookingCount > 0 ? (
              <AlertTriangle size={15} />
            ) : isShiprocketConfigured ? (
              <CheckCircle2 size={15} />
            ) : (
              <Info size={15} />
            )}
          </div>

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-[#171717]">
                OPERATIONS DISPATCH RADAR
              </span>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 border ${
                  isShiprocketConfigured
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                    : 'bg-amber-100 text-amber-800 border-amber-400'
                }`}
              >
                {isShiprocketConfigured ? 'SHIPROCKET API: CONNECTED' : 'LOGISTICS SERVICE: STANDBY'}
              </span>
            </div>

            {pendingBookingCount > 0 ? (
              <p className="text-xs font-mono text-gray-700">
                <span className="font-bold text-[#FF5638]">{pendingBookingCount} order{pendingBookingCount === 1 ? '' : 's'}</span> require shipping label generation before dispatch cutoff.
              </p>
            ) : (
              <p className="text-xs font-mono text-gray-600">
                {isShiprocketConfigured
                  ? 'All pending orders have shipping labels assigned. Ready for scheduled courier pickups.'
                  : 'Fulfillment queue ready. Connect shipping services to load live operational alerts.'}
              </p>
            )}
          </div>
        </div>

        {/* Right CTA / Action */}
        <div className="flex items-center gap-2 shrink-0 sm:self-center">
          {pendingBookingCount > 0 && onFilterPendingBooking && (
            <button
              type="button"
              onClick={onFilterPendingBooking}
              className="px-3 py-1 bg-[#171717] hover:bg-[#315FE8] text-white text-xs font-mono font-bold uppercase border border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-1 transition-colors"
            >
              <span>View Pending ({pendingBookingCount})</span>
              <ChevronRight size={12} />
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-[#FAF8F5] border border-gray-300 text-[10px] font-mono text-gray-600">
            <Truck size={12} className="text-[#315FE8]" />
            <span>Noida Central Hub (UP)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FulfillmentAlertBanner;
