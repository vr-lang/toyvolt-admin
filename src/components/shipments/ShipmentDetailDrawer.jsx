import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Phone, 
  User, 
  ArrowRight,
  ShieldAlert,
  Download,
  Building2,
  Scale,
  Maximize2
} from 'lucide-react';
import { shipmentService } from '../../services/shipmentService';

export default function ShipmentDetailDrawer({ 
  shipment, 
  isOpen, 
  onClose, 
  onResolveNdr,
  onRefresh,
  onBookShipment
}) {
  const [downloadingLabel, setDownloadingLabel] = useState(false);
  const [downloadingManifest, setDownloadingManifest] = useState(false);

  if (!isOpen || !shipment) return null;

  const orderObj = (typeof shipment.orderId === 'object' && shipment.orderId) ? shipment.orderId : (shipment.order || {});
  const awb = shipment.awbCode || shipment.trackingNumber || shipment.awbNumber || (shipment.isBooked === false ? 'AWAITING BOOKING' : 'PENDING AWB');
  const orderNumber = orderObj.orderNumber || (typeof orderObj === 'string' ? orderObj : 'N/A');
  const recipient = orderObj.shippingAddress || shipment.shippingAddress || {};
  const recipientName = recipient.fullName || recipient.name || orderObj.userId?.name || orderObj.user?.name || 'Customer';
  const recipientPhone = recipient.phone || orderObj.userId?.phone || orderObj.user?.phone || 'N/A';
  const destination = [recipient.addressLine1, recipient.city, recipient.state, recipient.postalCode || recipient.pinCode]
    .filter(Boolean)
    .join(', ') || 'N/A';

  const statusStyle = shipmentService.getStatusBadge(shipment.status);
  const isNdr = shipment.status === 'NDR' || shipment.ndrStatus === 'ACTION_REQUIRED' || shipment.hasNdr;

  const handleDownloadLabel = async () => {
    try {
      setDownloadingLabel(true);
      const res = await shipmentService.getLabel(shipment._id);
      if (res.labelUrl) {
        window.open(res.labelUrl, '_blank');
      } else {
        alert('Shipping label URL not available yet for this shipment.');
      }
    } catch (err) {
      alert(err.message || 'Failed to download shipping label');
    } finally {
      setDownloadingLabel(false);
    }
  };

  const handleDownloadManifest = async () => {
    try {
      setDownloadingManifest(true);
      const res = await shipmentService.getManifest(shipment._id);
      if (res.manifestUrl) {
        window.open(res.manifestUrl, '_blank');
      } else {
        alert('Manifest document URL not available yet for this shipment.');
      }
    } catch (err) {
      alert(err.message || 'Failed to download manifest');
    } finally {
      setDownloadingManifest(false);
    }
  };

  const trackingEvents = shipment.trackingHistory || shipment.activities || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#FFF9F0] border-l-4 border-neutral-900 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 bg-[#F7F3EB] border-b-2 border-neutral-900 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-neutral-900 font-bold bg-[#FFD983]">
                  SHIPMENT DOSSIER
                </span>
                <span className="text-xs font-mono text-neutral-500">ID: {shipment._id?.slice(-8)}</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-neutral-900 font-mono">
                AWB: {awb}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 border-2 border-neutral-900 bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Status & Carrier Banner */}
            <div className="p-4 bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_#000] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#315FE8]/10 border-2 border-neutral-900 text-[#315FE8]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-neutral-500 font-bold">CARRIER / SERVICE</div>
                  <div className="text-base font-black text-neutral-900">
                    {shipment.isBooked === false ? 'Shiprocket Multi-Carrier Network' : (shipment.carrier || shipment.courier || 'Shiprocket Standard')} 
                    <span className="ml-2 text-xs font-mono font-medium text-neutral-600">
                      ({shipment.isBooked === false ? 'Auto-routed on booking' : (shipment.serviceType || 'Standard Ground')})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-xs font-mono font-black border-2 border-neutral-900 ${statusStyle.bg} ${statusStyle.text} shadow-[2px_2px_0px_#000]`}>
                  {statusStyle.label}
                </span>
              </div>
            </div>

            {/* NDR Urgent Notice if applicable */}
            {isNdr && (
              <div className="p-4 bg-[#FF5638]/10 border-2 border-[#FF5638] shadow-[3px_3px_0px_#FF5638] space-y-3">
                <div className="flex items-center gap-2 text-[#FF5638] font-black text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  <span>NON-DELIVERY REPORT (NDR) ACTIVE</span>
                </div>
                <div className="text-xs text-neutral-800 space-y-1">
                  <p><span className="font-bold">Failure Reason:</span> {shipment.ndrReason || 'Customer unavailable / Door locked'}</p>
                  <p><span className="font-bold">Attempts Count:</span> {shipment.ndrAttempts || 1} / 3 maximum attempts</p>
                  <p><span className="font-bold">NDR Workflow Status:</span> <span className="font-mono bg-white px-1.5 py-0.5 border border-neutral-900">{shipment.ndrStatus || 'ACTION_REQUIRED'}</span></p>
                </div>
                <button
                  onClick={() => onResolveNdr(shipment)}
                  className="w-full py-2.5 bg-[#FF5638] hover:bg-[#e04529] text-white border-2 border-neutral-900 shadow-[2px_2px_0px_#000] font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  RESOLVE NDR / INSTRUCT COURIER
                </button>
              </div>
            )}

            {/* Parcel Telemetry & Specifications */}
            <div className="bg-white border-2 border-neutral-900 p-4 shadow-[3px_3px_0px_#000] space-y-3">
              <div className="text-xs font-black uppercase font-mono tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#315FE8]" />
                PARCEL TELEMETRY & PHYSICAL METRICS
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-2.5 bg-[#F7F3EB] border border-neutral-900">
                  <div className="text-[10px] font-mono text-neutral-500 font-bold uppercase flex items-center gap-1">
                    <Scale className="w-3 h-3" /> CHARGEABLE WEIGHT
                  </div>
                  <div className="text-sm font-black font-mono text-neutral-900 mt-1">
                    {shipment.weightKg ? `${shipment.weightKg} kg` : (shipment.weight ? `${shipment.weight} g` : '0.85 kg')}
                  </div>
                </div>

                <div className="p-2.5 bg-[#F7F3EB] border border-neutral-900">
                  <div className="text-[10px] font-mono text-neutral-500 font-bold uppercase flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> DIMENSIONS
                  </div>
                  <div className="text-xs font-black font-mono text-neutral-900 mt-1">
                    {shipment.dimensions ? 
                      `${shipment.dimensions.length || 0}×${shipment.dimensions.breadth || 0}×${shipment.dimensions.height || 0} cm` : 
                      '24 × 18 × 12 cm'}
                  </div>
                </div>

                <div className="p-2.5 bg-[#F7F3EB] border border-neutral-900">
                  <div className="text-[10px] font-mono text-neutral-500 font-bold uppercase flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> PICKUP HUB
                  </div>
                  <div className="text-xs font-black text-neutral-900 mt-1 truncate" title={shipment.hub || 'Delhi Central Hub'}>
                    {shipment.hub || 'Delhi Hub (HUB-DEL)'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 bg-[#F7F3EB] border border-neutral-900">
                  <div className="text-[10px] font-mono text-neutral-500 font-bold uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> EST. DELIVERY
                  </div>
                  <div className="text-xs font-black font-mono text-neutral-900 mt-1">
                    {shipment.estimatedDeliveryDate ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Standard 3-5 Days'}
                  </div>
                </div>

                <div className="p-2.5 bg-[#F7F3EB] border border-neutral-900">
                  <div className="text-[10px] font-mono text-neutral-500 font-bold uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> LAST SYNCED
                  </div>
                  <div className="text-xs font-mono text-neutral-700 mt-1">
                    {shipment.lastSyncedAt ? new Date(shipment.lastSyncedAt).toLocaleTimeString('en-IN') : 'Live Telemetry'}
                  </div>
                </div>
              </div>
            </div>

            {/* Destination & Customer Details */}
            <div className="bg-white border-2 border-neutral-900 p-4 shadow-[3px_3px_0px_#000] space-y-3">
              <div className="text-xs font-black uppercase font-mono tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#315FE8]" />
                  CONSIGNEE & ROUTING DESTINATION
                </span>
                <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 border border-neutral-300">
                  PIN: {recipient.postalCode || recipient.pinCode || 'N/A'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span>{recipientName}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700 font-mono">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  <span>{recipientPhone}</span>
                </div>
                <div className="p-2.5 bg-[#F7F3EB] border border-neutral-900 font-mono text-[11px] text-neutral-800 leading-relaxed">
                  {recipient.street || recipient.addressLine1 || recipient.address || 'Full address not detailed'}
                  {recipient.addressLine2 ? `, ${recipient.addressLine2}` : ''}
                  <br />
                  <strong className="text-neutral-900">{destination}</strong>
                </div>
              </div>

              {/* Order Reference */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-200">
                <div className="text-xs">
                  <span className="font-mono text-neutral-500">PARENT ORDER: </span>
                  <span className="font-mono font-bold text-neutral-900">#{orderNumber}</span>
                </div>
                <a
                  href={`/orders?search=${encodeURIComponent(orderNumber)}`}
                  className="text-xs font-mono text-[#315FE8] font-bold hover:underline flex items-center gap-1"
                >
                  View Order File <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Carrier Scan History / Tracking Events */}
            <div className="bg-white border-2 border-neutral-900 p-4 shadow-[3px_3px_0px_#000] space-y-4">
              <div className="text-xs font-black uppercase font-mono tracking-wider text-neutral-900 border-b border-neutral-200 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#315FE8]" />
                  CARRIER SCAN TIMELINE ({trackingEvents.length} SCANS)
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  REAL-TIME API FEED
                </span>
              </div>

              {shipment.isBooked === false ? (
                <div className="p-4 bg-[#FAF8F5] border-2 border-dashed border-neutral-900 text-center text-xs font-mono text-neutral-800 space-y-2">
                  <p className="font-bold text-amber-800 uppercase">ORDER CONFIRMED &bull; AWAITING CARRIER BOOKING</p>
                  <p className="text-[11px] text-neutral-600">
                    This order is verified in Toyvolt database. Booking this shipment will automatically send order details to Shiprocket, assign an AWB, and schedule pickup from Fatehabad Hub.
                  </p>
                </div>
              ) : trackingEvents.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-neutral-300">
                  {trackingEvents.map((event, idx) => (
                    <div key={idx} className="relative pl-7 text-xs">
                      <div className="absolute left-1.5 top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center">
                        <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-[#315FE8]' : 'bg-neutral-400'}`} />
                      </div>
                      <div className="font-bold text-neutral-900 flex items-center justify-between">
                        <span>{event.activity || event.status || 'Carrier Scan'}</span>
                        <span className="text-[10px] font-mono font-normal text-neutral-500">
                          {event.date ? new Date(event.date).toLocaleString('en-IN') : (event.timestamp || 'Recent')}
                        </span>
                      </div>
                      <div className="text-neutral-600 font-mono text-[11px] mt-0.5">
                        {event.location ? `Location: ${event.location}` : 'In Network'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-[#F7F3EB] border border-dashed border-neutral-400 text-center text-xs font-mono text-neutral-600 space-y-1">
                  <p className="font-bold">AWB CREATED / AWAITING FIRST HUB SCAN</p>
                  <p className="text-[11px] text-neutral-500">
                    Carrier telemetry scans will automatically append once physical package is scanned at origin sorting facility.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions / Booking */}
            {shipment.isBooked === false ? (
              <div className="p-4 bg-[#DCE5FF]/40 border-2 border-[#315FE8] shadow-[3px_3px_0px_#315FE8] space-y-3">
                <div className="flex items-center gap-2 text-[#315FE8] font-black text-xs font-mono uppercase">
                  <Truck className="w-5 h-5" />
                  <span>DISPATCH BOOKING READY</span>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed font-mono">
                  Ready to book this consignment on Shiprocket? The destination address and parcel specs will be registered with the carrier network.
                </p>
                <button
                  type="button"
                  onClick={() => onBookShipment && onBookShipment(shipment)}
                  className="w-full py-3 bg-[#315FE8] hover:bg-blue-700 text-white border-2 border-neutral-900 shadow-[3px_3px_0px_#000] font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Truck className="w-4 h-4" />
                  BOOK SHIPMENT WITH SHIPROCKET
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDownloadLabel}
                  disabled={downloadingLabel}
                  className="p-3 bg-white hover:bg-neutral-100 border-2 border-neutral-900 shadow-[3px_3px_0px_#000] font-mono text-xs font-bold text-neutral-900 flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Download className="w-4 h-4 text-[#315FE8]" />
                  {downloadingLabel ? 'FETCHING...' : 'PRINT SHIPPING LABEL'}
                </button>

                <button
                  onClick={handleDownloadManifest}
                  disabled={downloadingManifest}
                  className="p-3 bg-white hover:bg-neutral-100 border-2 border-neutral-900 shadow-[3px_3px_0px_#000] font-mono text-xs font-bold text-neutral-900 flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <FileText className="w-4 h-4 text-neutral-700" />
                  {downloadingManifest ? 'FETCHING...' : 'DISPATCH MANIFEST'}
                </button>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#F7F3EB] border-t-2 border-neutral-900 flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-600">
              Courier Network: {shipment.carrier || 'Delhivery / BlueDart'}
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-neutral-900 text-white font-mono text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              CLOSE DOSSIER
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
