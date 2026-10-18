import React from 'react';
import {
  Eye,
  Truck,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Tag,
  AlertCircle,
  Check,
  Package,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { formatINR } from '../../services/orderService';

export const OrdersTable = ({
  orders = [],
  loading = false,
  selectedOrderIds = [],
  onToggleSelectOrder,
  onViewOrderDetails,
  onUpdateStatus,
  onCreateShipment,
  onCancelOrder,
  onOpenWhatsApp,
  onResetFilters
}) => {
  const [copiedId, setCopiedId] = React.useState(null);

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Helper for Order Status Badge
  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return {
          label: 'PLACED // PENDING',
          color: 'bg-amber-100 text-amber-900 border-amber-400'
        };
      case 'confirmed':
        return {
          label: 'CONFIRMED',
          color: 'bg-blue-100 text-blue-900 border-blue-400'
        };
      case 'processing':
        return {
          label: 'PROCESSING',
          color: 'bg-[#DCE5FF] text-[#315FE8] border-[#315FE8]'
        };
      case 'shipped':
        return {
          label: 'DISPATCHED',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-400'
        };
      case 'delivered':
        return {
          label: 'DELIVERED',
          color: 'bg-green-100 text-green-900 border-green-400'
        };
      case 'cancelled':
        return {
          label: 'CANCELLED',
          color: 'bg-red-100 text-red-900 border-red-400'
        };
      default:
        return {
          label: (status || 'UNKNOWN').toUpperCase(),
          color: 'bg-gray-100 text-gray-800 border-gray-300'
        };
    }
  };

  // Helper for Payment Status Badge
  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-400';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-400';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-400';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-8 text-center font-mono">
        <div className="inline-block w-8 h-8 border-4 border-[#315FE8] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider text-[#171717]">
          Loading fulfillment queue & orders...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-10 text-center font-mono space-y-3">
        <div className="w-12 h-12 mx-auto bg-[#FAF8F5] border-2 border-[#171717] flex items-center justify-center text-gray-400">
          <Package size={24} />
        </div>
        <h3 className="text-sm font-bold uppercase text-[#171717]">
          No matching orders found
        </h3>
        <p className="text-xs text-gray-600 max-w-sm mx-auto">
          No orders match the current status tab or search filters. Try adjusting your parameters.
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

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[980px]">
        <thead>
          <tr className="bg-[#171717] text-white font-mono text-[10px] uppercase tracking-wider border-b-2 border-[#171717]">
            <th className="p-3 w-10 text-center border-r border-gray-700">
              #
            </th>
            <th className="p-3 border-r border-gray-700 w-44">Order ID & Date</th>
            <th className="p-3 border-r border-gray-700 w-52">Customer & Destination</th>
            <th className="p-3 border-r border-gray-700">Catalog Items</th>
            <th className="p-3 border-r border-gray-700 w-36">Total & Payment</th>
            <th className="p-3 border-r border-gray-700 w-48">Logistics & Courier</th>
            <th className="p-3 w-32 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-[#171717] font-mono text-xs">
          {orders.map((order) => {
            const isSelected = selectedOrderIds.includes(order._id);
            const statusBadge = getOrderStatusBadge(order.orderStatus);
            const firstItem = order.items?.[0] || {};
            const totalItems = (order.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : 'N/A';
            const timeStr = order.createdAt
              ? new Date(order.createdAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '';

            return (
              <tr
                key={order._id}
                className={`hover:bg-[#FFF9F0] transition-colors ${
                  isSelected ? 'bg-[#DCE5FF]/40' : 'bg-white'
                }`}
              >
                {/* 1. Selection Checkbox */}
                <td className="p-3 text-center border-r-2 border-[#171717]">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectOrder(order._id)}
                    className="w-4 h-4 accent-[#315FE8] border-2 border-[#171717] rounded-none cursor-pointer"
                  />
                </td>

                {/* 2. Order ID & Date */}
                <td className="p-3 border-r-2 border-[#171717]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-bold text-[#171717] text-xs">
                      {order.orderNumber || order._id.slice(-8)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(order.orderNumber || order._id, order._id)}
                      title="Copy Order ID"
                      className="text-gray-400 hover:text-[#315FE8]"
                    >
                      {copiedId === order._id ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                  <div className="text-[10px] text-gray-500 mb-1.5">
                    {dateStr} • {timeStr}
                  </div>
                  <span
                    className={`inline-block text-[9px] font-bold px-1.5 py-0.2 border ${statusBadge.color}`}
                  >
                    {statusBadge.label}
                  </span>
                </td>

                {/* 3. Customer & Address */}
                <td className="p-3 border-r-2 border-[#171717]">
                  <p className="font-bold text-[#171717] truncate mb-0.5">
                    {order.shippingAddress?.fullName || order.userId?.name || 'Customer'}
                  </p>
                  <p className="text-[11px] text-gray-600 truncate">
                    {order.shippingAddress?.city
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.state || ''}`
                      : 'Address on file'}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">
                    {order.shippingAddress?.phone || order.userId?.email || ''}
                  </p>
                </td>

                {/* 4. Catalog Items */}
                <td className="p-3 border-r-2 border-[#171717]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-[#FAF8F5] border border-[#171717] shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                      {firstItem.imageUrl ? (
                        <img
                          src={firstItem.imageUrl}
                          alt={firstItem.name || 'Toy'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                      ) : (
                        <Package size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#171717] text-xs truncate">
                        {firstItem.name || 'RC Vehicle'}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                        <span className="font-mono">{firstItem.sku || 'SKU'}</span>
                        <span>•</span>
                        <span>Qty: {firstItem.quantity || 1}</span>
                        {totalItems > (firstItem.quantity || 1) && (
                          <span className="bg-[#FAF8F5] text-gray-700 px-1 border border-gray-300 font-bold">
                            +{totalItems - (firstItem.quantity || 1)} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 5. Total & Payment */}
                <td className="p-3 border-r-2 border-[#171717]">
                  <p className="font-bold text-sm text-[#171717] mb-1">
                    {formatINR(order.finalAmount, true)}
                  </p>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-600 uppercase">
                      {order.paymentMethod === 'cod' ? 'CASH ON DELIVERY' : 'ONLINE PREPAID'}
                    </div>
                    <span
                      className={`inline-block text-[9px] font-bold px-1.5 py-0.2 border uppercase ${getPaymentStatusBadge(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </td>

                {/* 6. Carrier & Logistics */}
                <td className="p-3 border-r-2 border-[#171717]">
                  {order.shipmentId?.awbCode ? (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-[#171717]">
                        <Truck size={13} className="text-[#315FE8]" />
                        <span>{order.shipmentId.courierName || 'Shiprocket Courier'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-gray-600 mb-1">
                        <span>AWB: {order.shipmentId.awbCode}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.shipmentId.awbCode, `awb_${order._id}`)}
                          className="hover:text-[#315FE8]"
                        >
                          {copiedId === `awb_${order._id}` ? (
                            <Check size={11} className="text-emerald-600" />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-300">
                        {order.shipmentId.status || 'SHIPPED'}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 mb-1">
                        Unassigned Courier
                      </p>
                      <button
                        type="button"
                        onClick={() => onCreateShipment(order._id || order)}
                        className="text-[9px] font-bold text-[#315FE8] hover:underline uppercase flex items-center gap-0.5"
                      >
                        + Generate Label
                      </button>
                    </div>
                  )}
                </td>

                {/* 7. Actions */}
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewOrderDetails(order)}
                      title="View Order Details"
                      className="p-1.5 bg-white hover:bg-gray-100 text-[#171717] border border-[#171717] shadow-[1px_1px_0px_#171717] transition-all"
                    >
                      <Eye size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateStatus(order)}
                      title="Update Lifecycle Status"
                      className="p-1.5 bg-[#FAF8F5] hover:bg-[#DCE5FF] text-[#315FE8] border border-[#171717] shadow-[1px_1px_0px_#171717] transition-all"
                    >
                      <Tag size={13} />
                    </button>

                    {onOpenWhatsApp && (
                      <button
                        type="button"
                        onClick={() => onOpenWhatsApp(order)}
                        title="Send WhatsApp Update"
                        className="p-1.5 bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-500 shadow-[1px_1px_0px_#171717] transition-all"
                      >
                        <MessageSquare size={13} />
                      </button>
                    )}

                    {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                      <button
                        type="button"
                        onClick={() => onCancelOrder(order._id || order)}
                        title="Cancel Order"
                        className="p-1.5 bg-white hover:bg-red-50 text-gray-500 hover:text-[#FF5638] border border-gray-300 transition-all"
                      >
                        <XCircle size={13} />
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

export default OrdersTable;
