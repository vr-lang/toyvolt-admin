import React, { useState } from 'react';
import {
  X,
  Package,
  Truck,
  IndianRupee,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { formatINR } from '../../services/orderService';

export const OrderDetailsModal = ({
  order = null,
  onClose,
  onUpdateStatus,
  onCreateShipment
}) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!order) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const printPackingSlip = () => {
    window.print();
  };

  const dateFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'N/A';

  const items = order.items || [];
  const address = order.shippingAddress || {};
  const shipment = order.shipmentId || null;
  const payment = order.paymentId || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#F7F3EB] border-4 border-[#171717] shadow-[8px_8px_0px_#171717] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#171717] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#171717]">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#315FE8] border border-white" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-sm tracking-wider uppercase text-white">
                  ORDER // {order.orderNumber || order._id}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#315FE8] text-white border border-white">
                  {(order.orderStatus || 'PLACED').toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] font-mono text-gray-400">
                Created: {dateFormatted}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={printPackingSlip}
              className="px-2.5 py-1 bg-white hover:bg-gray-200 text-[#171717] text-xs font-mono font-bold uppercase border border-white flex items-center gap-1"
              title="Print Packing Slip"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Slip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 font-mono flex-1">
          {/* Top Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border-2 border-[#171717] p-3 shadow-[2px_2px_0px_#171717]">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Payment Method</span>
              <p className="font-bold text-xs text-[#171717] uppercase">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid (Razorpay)'}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Payment Status</span>
              <p className="font-bold text-xs uppercase">
                <span
                  className={`px-1.5 py-0.2 border text-[9px] ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                      : 'bg-amber-100 text-amber-800 border-amber-400'
                  }`}
                >
                  {order.paymentStatus || 'PENDING'}
                </span>
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Fulfillment Status</span>
              <p className="font-bold text-xs text-[#171717] uppercase">
                {shipment?.status || (order.orderStatus === 'shipped' ? 'DISPATCHED' : 'PENDING DISPATCH')}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Grand Total (INR)</span>
              <p className="font-bold text-sm text-[#315FE8]">
                {formatINR(order.finalAmount, true)}
              </p>
            </div>
          </div>

          {/* Two-Column Grid: Customer & Delivery vs Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer & Shipping Address */}
            <div className="bg-white border-2 border-[#171717] p-4 shadow-[2px_2px_0px_#171717]">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
                <h4 className="font-bold text-xs uppercase text-[#171717] flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#315FE8]" />
                  <span>Delivery Destination</span>
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `${address.fullName}, ${address.addressLine1}, ${address.city}, ${address.state} - ${address.postalCode}, Phone: ${address.phone}`,
                      'address'
                    )
                  }
                  className="text-[10px] text-[#315FE8] hover:underline uppercase flex items-center gap-0.5"
                >
                  {copiedField === 'address' ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedField === 'address' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-[#171717] text-sm">
                  {address.fullName || order.userId?.name || 'Customer'}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                </p>
                <p className="text-gray-700">
                  {address.city}, {address.state} — <span className="font-bold">{address.postalCode}</span>
                </p>
                <p className="text-gray-500">{address.country || 'India'}</p>

                <div className="pt-2 border-t border-gray-200 mt-2 space-y-0.5 text-[11px]">
                  <p>
                    <span className="text-gray-500">Phone:</span>{' '}
                    <span className="font-bold text-[#171717]">{address.phone || 'N/A'}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Account:</span>{' '}
                    <span className="text-gray-700">{order.userId?.email || 'Guest User'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Courier & Logistics Information */}
            <div className="bg-white border-2 border-[#171717] p-4 shadow-[2px_2px_0px_#171717]">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
                <h4 className="font-bold text-xs uppercase text-[#171717] flex items-center gap-1.5">
                  <Truck size={13} className="text-[#315FE8]" />
                  <span>Carrier & Logistics</span>
                </h4>
                {shipment?.awbCode && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-400">
                    AWB ASSIGNED
                  </span>
                )}
              </div>

              {shipment ? (
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase">Assigned Courier</span>
                    <p className="font-bold text-[#171717]">
                      {shipment.courierName || 'Shiprocket Standard Courier'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase">AWB Tracking Code</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-sm text-[#315FE8] bg-[#DCE5FF] px-2 py-0.5 border border-[#315FE8]">
                        {shipment.awbCode || 'Generating...'}
                      </span>
                      {shipment.awbCode && (
                        <button
                          type="button"
                          onClick={() => handleCopy(shipment.awbCode, 'awb')}
                          className="hover:text-[#315FE8]"
                        >
                          {copiedField === 'awb' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-600">
                    <p>
                      <span className="text-gray-500">Pickup Hub:</span> Noida Central Fulfillment (UP)
                    </p>
                    <p>
                      <span className="text-gray-500">Shiprocket Order ID:</span>{' '}
                      {shipment.shiprocketOrderId || 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-2 text-center sm:text-left">
                  <p className="text-xs text-gray-600">
                    No courier or AWB label has been generated for this order yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => onCreateShipment(order)}
                    className="w-full py-2 bg-[#315FE8] hover:bg-[#254bc0] text-white text-xs font-bold uppercase border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Truck size={13} />
                    <span>Generate Shipping Label via Shiprocket</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] overflow-hidden">
            <div className="bg-[#FAF8F5] border-b-2 border-[#171717] p-3 flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-[#171717] flex items-center gap-1.5">
                <Package size={13} />
                <span>Order Items ({items.length})</span>
              </span>
              <span className="text-[10px] text-gray-500 font-bold">HSN 9503 COMPLIANT</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#171717] text-white text-[10px] uppercase border-b border-gray-700">
                    <th className="p-2.5">Product & SKU</th>
                    <th className="p-2.5 text-right">Price</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2.5 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FAF8F5] border border-[#171717] shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                          {it.imageUrl ? (
                            <img
                              src={it.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=100&q=80';
                              }}
                            />
                          ) : (
                            <Package size={14} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#171717] text-xs">{it.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">SKU: {it.sku}</p>
                        </div>
                      </td>
                      <td className="p-2.5 text-right font-mono">{formatINR(it.unitPrice, true)}</td>
                      <td className="p-2.5 text-center font-bold font-mono">{it.quantity}</td>
                      <td className="p-2.5 text-right font-bold font-mono">{formatINR(it.total, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price Calculations Breakdown */}
            <div className="p-4 bg-[#FAF8F5] border-t-2 border-[#171717] flex justify-end">
              <div className="w-full sm:w-72 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">{formatINR(order.subtotal, true)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
                    <span className="font-bold">-{formatINR(order.discountAmount, true)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee:</span>
                  <span>{order.shippingFee > 0 ? formatINR(order.shippingFee, true) : 'FREE'}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[10px]">
                  <span>18% GST (Included):</span>
                  <span>{formatINR(order.taxAmount || 0, true)}</span>
                </div>
                <div className="pt-2 border-t-2 border-[#171717] flex justify-between font-bold text-sm text-[#171717]">
                  <span>Total Amount:</span>
                  <span className="text-[#315FE8]">{formatINR(order.finalAmount, true)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#FAF8F5] px-5 py-3 border-t-2 border-[#171717] flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateStatus(order)}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#171717] text-xs font-bold uppercase border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-1.5 transition-all"
            >
              <Tag size={12} />
              <span>Change Lifecycle Status</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171717] text-white hover:bg-gray-800 text-xs font-bold uppercase border border-[#171717]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
