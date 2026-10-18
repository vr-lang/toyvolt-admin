import React, { useState } from 'react';
import {
  Eye,
  Truck,
  Copy,
  Check,
  Download,
  AlertTriangle,
  RotateCcw,
  Package,
  Calendar,
  ExternalLink,
  MapPin,
  FileText
} from 'lucide-react';
import { formatStatusLabel, getStatusBadgeStyle } from '../../services/shipmentService';

export const ShipmentsTable = ({
  shipments = [],
  loading = false,
  selectedShipmentIds = [],
  selectedIds = [],
  onToggleSelectShipment,
  onSelectId,
  onSelectAll,
  onViewShipmentDetails,
  onViewDossier,
  onDownloadLabel,
  onPrintLabel,
  onDownloadManifest,
  onResolveNdr,
  onResetFilters,
  onBookShipment,
  onTrack
}) => {
  const [copiedId, setCopiedId] = useState(null);

  // Normalize props for backwards compatibility
  const selected = selectedShipmentIds.length > 0 ? selectedShipmentIds : selectedIds;
  const toggleSelect = onToggleSelectShipment || onSelectId;
  const viewDetails = onViewShipmentDetails || onViewDossier;
  const downloadLabel = onDownloadLabel || onPrintLabel;

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-8 text-center font-mono">
        <div className="inline-block w-8 h-8 border-4 border-[#315FE8] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider text-[#171717]">
          Loading carrier telemetry & dispatch queue...
        </p>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-10 text-center font-mono space-y-3">
        <div className="w-12 h-12 mx-auto bg-[#FAF8F5] border-2 border-[#171717] flex items-center justify-center text-gray-400">
          <Truck size={24} />
        </div>
        <h3 className="text-sm font-bold uppercase text-[#171717]">
          No matching consignments found
        </h3>
        <p className="text-xs text-gray-600 max-w-sm mx-auto">
          No parcels or pending orders match the current filter criteria. Check your search terms or reset filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-1.5 bg-[#171717] hover:bg-[#315FE8] text-white text-xs font-bold uppercase border border-[#171717] shadow-[2px_2px_0px_#171717] transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  const isAllSelected = shipments.length > 0 && selected.length === shipments.length;

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] overflow-x-auto mb-4">
      <table className="w-full text-left border-collapse min-w-[1100px]">
        <thead>
          <tr className="bg-[#171717] text-white font-mono text-[10px] uppercase tracking-wider border-b-2 border-[#171717]">
            <th className="p-3 w-10 text-center border-r border-gray-700">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onSelectAll}
                className="w-4 h-4 accent-[#315FE8] border-2 border-[#171717] rounded-none cursor-pointer"
                title={isAllSelected ? "Deselect All" : "Select All"}
              />
            </th>
            <th className="p-3 border-r border-gray-700 w-48">AWB / Courier</th>
            <th className="p-3 border-r border-gray-700 w-56">Order & Parcel Specs</th>
            <th className="p-3 border-r border-gray-700 w-44">Destination PIN & City</th>
            <th className="p-3 border-r border-gray-700 w-52">Hub & Dispatch History</th>
            <th className="p-3 border-r border-gray-700 w-40">Live Status Telemetry</th>
            <th className="p-3 border-r border-gray-700 w-32">Estimated Delivery</th>
            <th className="p-3 w-32 text-center">Quick Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-[#171717] font-mono text-xs">
          {shipments.map((s) => {
            const isSelected = selected.includes(s._id);
            const isNdr = s.status === 'NDR' || s.ndrStatus === 'ACTION_REQUIRED';
            const isUnbooked = s.isBooked === false || s.status === 'PENDING_BOOKING';
            const order = (typeof s.orderId === 'object' && s.orderId) ? s.orderId : (s.order || {});
            const address = order.shippingAddress || s.shippingAddress || {};
            const items = order.items || [];
            const firstItem = items[0] || {};
            const itemsCount = items.reduce((acc, it) => acc + (it.quantity || 1), 0);
            const statusLabel = formatStatusLabel(s.status);
            const badgeClass = getStatusBadgeStyle(s.status);

            const lastScan = s.trackingHistory?.[s.trackingHistory.length - 1];
            const createdDateStr = s.createdAt
              ? new Date(s.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short'
                })
              : 'N/A';
            const estDateStr = s.estimatedDeliveryDate
              ? new Date(s.estimatedDeliveryDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : isUnbooked
              ? 'On Booking'
              : 'Not available';

            const dimStr = s.dimensions
              ? `${s.dimensions.length}×${s.dimensions.breadth}×${s.dimensions.height} cm`
              : '24×18×12 cm';

            return (
              <tr
                key={s._id}
                className={`transition-colors ${
                  isNdr
                    ? 'bg-red-50/70 hover:bg-red-100/60'
                    : isUnbooked
                    ? 'bg-[#FFFDF7] hover:bg-[#FFF9EC]'
                    : isSelected
                    ? 'bg-[#DCE5FF]/40'
                    : 'bg-white hover:bg-[#FFF9F0]'
                }`}
              >
                {/* 1. Selection Checkbox */}
                <td className="p-3 text-center border-r-2 border-[#171717]">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect && toggleSelect(s._id)}
                    className="w-4 h-4 accent-[#315FE8] border-2 border-[#171717] rounded-none cursor-pointer"
                  />
                </td>

                {/* 2. AWB / Courier */}
                <td className="p-3 border-r-2 border-[#171717]">
                  {isUnbooked ? (
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-black px-1.5 py-0.5 bg-[#FFF3D6] text-[#B45309] border border-[#B45309]">
                        AWAITING BOOKING
                      </span>
                      <p className="text-[10px] text-gray-500 font-mono">
                        Shiprocket Multi-Carrier
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-bold text-[#171717] text-xs">
                          {s.awbCode || 'PENDING AWB'}
                        </span>
                        {s.awbCode && (
                          <button
                            type="button"
                            onClick={() => handleCopy(s.awbCode, `awb_${s._id}`)}
                            className="text-gray-400 hover:text-[#315FE8]"
                            title="Copy AWB Code"
                          >
                            {copiedId === `awb_${s._id}` ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[10px] font-bold text-gray-700 uppercase">
                          {s.courierName || 'Shiprocket Standard'}
                        </span>
                      </div>

                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#FAF8F5] text-gray-600 border border-gray-400 uppercase">
                        {s.courierName?.toLowerCase().includes('blue') ? 'AIR EXPEDITED' : 'SURFACE CARGO'}
                      </span>
                    </>
                  )}
                </td>

                {/* 3. Order & Parcel Specs */}
                <td className="p-3 border-r-2 border-[#171717]">
                  <p className="font-bold text-[#171717] text-xs mb-0.5">
                    {order.orderNumber || (order._id ? `ORD#${order._id.slice(-8)}` : 'Manual Booking')}
                  </p>
                  <p className="text-[11px] text-gray-700 truncate max-w-[200px] mb-1">
                    {firstItem.name || 'RC Vehicle & Spares'}
                    {itemsCount > 1 ? ` (+${itemsCount - 1} more)` : ''}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                    <span className="bg-[#FAF8F5] px-1 border border-gray-300 font-bold">
                      {s.weightKg || 0.85} kg
                    </span>
                    <span>•</span>
                    <span>{dimStr}</span>
                  </div>
                </td>

                {/* 4. Destination PIN & City */}
                <td className="p-3 border-r-2 border-[#171717]">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-sm font-black text-[#171717]">
                      {address.postalCode || address.pinCode || '110001'}
                    </span>
                  </div>
                  <p className="font-bold text-xs text-gray-800 truncate">
                    {address.city ? `${address.city}, ${address.state || ''}` : 'Domestic Hub'}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">
                    {address.fullName || address.name || 'Consignee'}
                  </p>
                </td>

                {/* 5. Hub & Dispatch History */}
                <td className="p-3 border-r-2 border-[#171717]">
                  <p className="font-bold text-xs text-[#171717] mb-0.5">
                    {s.pickupLocation || 'Fatehabad Hub (work)'}
                  </p>
                  <p className="text-[10px] text-gray-500 mb-1">
                    {isUnbooked ? `Order Placed: ${createdDateStr}` : `Manifested: ${createdDateStr}`}
                  </p>
                  {isUnbooked ? (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1 py-0.5 border border-amber-200">
                      Ready for Shiprocket booking
                    </span>
                  ) : lastScan ? (
                    <div className="text-[10px] text-gray-700 bg-white/80 p-1 border border-gray-300 truncate">
                      <span className="font-bold text-[#315FE8]">{lastScan.status}:</span> {lastScan.activity}
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400">Awaiting carrier transit scans</span>
                  )}
                </td>

                {/* 6. Live Status Telemetry */}
                <td className="p-3 border-r-2 border-[#171717]">
                  <span
                    className={`inline-block text-[9px] font-bold px-1.5 py-0.5 border uppercase mb-1 ${badgeClass}`}
                  >
                    {statusLabel}
                  </span>

                  {isNdr && (
                    <div className="text-[10px] text-red-900 bg-red-100 border border-red-400 p-1 font-bold mt-1">
                      <span>NDR: {s.ndrReason || 'Customer unavailable'}</span>
                    </div>
                  )}
                </td>

                {/* 7. Estimated Delivery */}
                <td className="p-3 border-r-2 border-[#171717]">
                  <span className="text-xs font-bold text-[#171717] block">
                    {estDateStr}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {isUnbooked ? 'Calculated on booking' : s.status === 'DELIVERED' ? 'Delivery Completed' : 'SLA Target'}
                  </span>
                </td>

                {/* 8. Quick Actions */}
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {isUnbooked ? (
                      <button
                        type="button"
                        onClick={() => onBookShipment && onBookShipment(s)}
                        title="Book Dispatch with Shiprocket"
                        className="px-2 py-1 bg-[#315FE8] hover:bg-blue-700 text-white font-mono font-bold text-[10px] uppercase border border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-1 transition-transform active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <Truck size={12} />
                        <span>BOOK</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => downloadLabel && downloadLabel(s)}
                        title="Download Shipping Label"
                        className="p-1.5 bg-[#FAF8F5] hover:bg-[#DCE5FF] text-[#315FE8] border border-[#171717] shadow-[1px_1px_0px_#171717] transition-all"
                      >
                        <Download size={13} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => viewDetails && viewDetails(s)}
                      title="Inspect Shipment Dossier"
                      className="p-1.5 bg-white hover:bg-gray-100 text-[#171717] border border-[#171717] shadow-[1px_1px_0px_#171717] transition-all"
                    >
                      <Eye size={13} />
                    </button>

                    {isNdr && onResolveNdr && (
                      <button
                        type="button"
                        onClick={() => onResolveNdr(s)}
                        title="Resolve NDR Exception"
                        className="p-1.5 bg-[#FF5638] hover:bg-red-700 text-white border border-[#171717] shadow-[1px_1px_0px_#171717] transition-all"
                      >
                        <RotateCcw size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ShipmentsTable;
