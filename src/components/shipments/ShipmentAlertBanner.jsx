import React from 'react';
import { AlertTriangle, ShieldCheck, ChevronRight, RefreshCw, Truck, AlertCircle } from 'lucide-react';

export const ShipmentAlertBanner = ({
  alerts = [],
  onFilterNdr,
  onFilterPendingPickup,
  onFilterUnbooked,
  onSyncTelemetry,
  syncing = false
}) => {
  const hasAlerts = alerts && alerts.length > 0;
  const ndrAlert = alerts.find((a) => a.type === 'ndr');
  const pickupAlert = alerts.find((a) => a.type === 'pickup');
  const unbookedAlert = alerts.find((a) => a.type === 'unbooked');

  if (!hasAlerts) {
    return (
      <div className="bg-[#171717] text-white border-2 border-[#171717] shadow-[3px_3px_0px_#315FE8] p-3 md:p-3.5 mb-6 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-white">
              <ShieldCheck size={14} />
            </span>
            <div>
              <span className="font-bold uppercase tracking-wider text-white">
                ALL CARRIER DISPATCH TELEMETRY OPERATIONAL
              </span>
              <p className="text-[10px] text-gray-400">
                0 unresolved NDR disruptions. Courier API connection verified and active.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSyncTelemetry}
            disabled={syncing}
            className="px-2.5 py-1 bg-white hover:bg-gray-100 text-[#171717] text-[10px] font-bold uppercase border border-white flex items-center gap-1 self-start sm:self-center transition-colors disabled:opacity-50"
          >
            <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
            <span>Sync Live Telemetry</span>
          </button>
        </div>
      </div>
    );
  }

  const isSevere = Boolean(ndrAlert);

  return (
    <div className={`${isSevere ? 'bg-[#FF5638]' : 'bg-[#FFD983] text-[#171717]'} border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-3.5 md:p-4 mb-6 font-mono text-xs`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Icon & Alert summaries */}
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-8 h-8 ${isSevere ? 'bg-white text-[#FF5638]' : 'bg-[#171717] text-[#FFD983]'} border-2 border-[#171717] flex items-center justify-center font-bold text-xs shrink-0 shadow-[2px_2px_0px_#171717]`}>
            <AlertTriangle size={18} />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className={`font-bold uppercase tracking-wider ${isSevere ? 'text-white' : 'text-[#171717]'}`}>
                OPERATIONAL ALERT // DISPATCH ACTION REQUIRED
              </span>
              <span className="bg-[#171717] text-white text-[9px] font-bold px-1.5 py-0.2 border border-white">
                {alerts.length} NOTICE{alerts.length === 1 ? '' : 'S'}
              </span>
            </div>

            <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${isSevere ? 'text-white' : 'text-neutral-900'} text-[11px]`}>
              {unbookedAlert && (
                <span>
                  • <strong>{unbookedAlert.count} confirmed order{unbookedAlert.count === 1 ? '' : 's'}</strong> awaiting Shiprocket dispatch booking.
                </span>
              )}
              {ndrAlert && (
                <span>
                  • <strong className="underline">{ndrAlert.count} NDR parcel{ndrAlert.count === 1 ? '' : 's'}</strong> awaiting delivery address / reattempt decision.
                </span>
              )}
              {pickupAlert && (
                <span>
                  • <strong>{pickupAlert.count} shipment{pickupAlert.count === 1 ? '' : 's'}</strong> manifested for carrier vehicle pickup.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
          {unbookedAlert && onFilterUnbooked && (
            <button
              type="button"
              onClick={onFilterUnbooked}
              className="px-3 py-1.5 bg-[#171717] hover:bg-neutral-800 text-white text-xs font-bold uppercase border border-white shadow-[2px_2px_0px_#171717] flex items-center gap-1 transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>Book Shipments</span>
              <ChevronRight size={13} />
            </button>
          )}

          {ndrAlert && onFilterNdr && (
            <button
              type="button"
              onClick={onFilterNdr}
              className="px-3 py-1.5 bg-[#171717] hover:bg-black text-white text-xs font-bold uppercase border border-white shadow-[2px_2px_0px_#171717] flex items-center gap-1 transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>View NDR Cases</span>
              <ChevronRight size={13} />
            </button>
          )}

          {pickupAlert && onFilterPendingPickup && (
            <button
              type="button"
              onClick={onFilterPendingPickup}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#171717] text-xs font-bold uppercase border border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-1 transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <span>Review Pickups</span>
              <ChevronRight size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={onSyncTelemetry}
            disabled={syncing}
            className="p-1.5 bg-[#171717] text-white hover:bg-black border border-white disabled:opacity-50"
            title="Refresh courier statuses"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentAlertBanner;
