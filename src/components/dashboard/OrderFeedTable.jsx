import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrencyINR, formatDateTimeIST } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

export const OrderFeedTable = ({ orders = [], isLoading = false }) => {
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  const getPaymentVariant = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'failed':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getFulfillmentVariant = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-ink">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#FFF9F0] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
            <ShoppingBag className="w-3.5 h-3.5 text-ink" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-ink">
              REAL-TIME ORDER FEED
            </h2>
            <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
              LIVE CUSTOMER PURCHASE STREAM
            </span>
          </div>
        </div>

        <Link
          to="/orders"
          className="font-mono text-xs font-bold text-[#315FE8] hover:underline flex items-center gap-1 uppercase"
        >
          VIEW ALL ORDERS <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="h-44 flex flex-col items-center justify-center bg-[#FFF9F0] border border-dashed border-ink p-6">
          <div className="w-8 h-8 border-3 border-ink border-t-[#315FE8] animate-spin mb-3" />
          <span className="font-mono text-xs uppercase text-[#6E6E6E]">
            FETCHING LIVE ORDERS FEED...
          </span>
        </div>
      ) : hasOrders ? (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-ink bg-[#F0EEEE] text-left">
                  <th className="py-2.5 px-3 font-mono text-[10px] uppercase font-bold text-[#6E6E6E]">
                    ORDER # / DATE
                  </th>
                  <th className="py-2.5 px-3 font-mono text-[10px] uppercase font-bold text-[#6E6E6E]">
                    CUSTOMER
                  </th>
                  <th className="py-2.5 px-3 font-mono text-[10px] uppercase font-bold text-[#6E6E6E]">
                    CART CONTENTS
                  </th>
                  <th className="py-2.5 px-3 font-mono text-[10px] uppercase font-bold text-[#6E6E6E]">
                    AMOUNT
                  </th>
                  <th className="py-2.5 px-3 font-mono text-[10px] uppercase font-bold text-[#6E6E6E]">
                    PAYMENT
                  </th>
                  <th className="py-2.5 px-3 font-mono text-[10px] uppercase font-bold text-[#6E6E6E]">
                    FULFILLMENT
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/15 font-mono text-xs">
                {orders.map((ord) => {
                  const customerName =
                    ord.shippingAddress?.fullName ||
                    ord.userId?.name ||
                    ord.userId?.email ||
                    'Customer';
                  const customerLocation = ord.shippingAddress?.city
                    ? `${ord.shippingAddress.city}, ${ord.shippingAddress.state || 'IN'}`
                    : 'India';
                  const itemsCount =
                    ord.items?.reduce((sum, it) => sum + (it.quantity || 1), 0) || 1;
                  const itemTitle = ord.items?.[0]?.name || 'Toyvolt Item';

                  return (
                    <tr
                      key={ord._id || ord.orderNumber}
                      className="hover:bg-[#FFF9F0] transition-colors"
                    >
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-ink block">
                          {ord.orderNumber || ord._id?.slice(-8)}
                        </span>
                        <span className="text-[10px] text-[#6E6E6E]">
                          {formatDateTimeIST(ord.createdAt)}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-ink block">{customerName}</span>
                        <span className="text-[10px] text-[#6E6E6E] block">
                          {customerLocation}
                        </span>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <span className="font-bold text-ink truncate block" title={itemTitle}>
                          {itemTitle}
                        </span>
                        <span className="text-[10px] text-[#6E6E6E]">
                          {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                          {ord.items?.length > 1 ? ` (+${ord.items.length - 1} more)` : ''}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap font-bold text-ink">
                        {formatCurrencyINR(ord.finalAmount, { isPaise: true })}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge
                          variant={getPaymentVariant(ord.paymentStatus)}
                          size="sm"
                        >
                          {(ord.paymentStatus || 'PENDING').toUpperCase()}
                        </StatusBadge>
                        <span className="text-[10px] text-[#6E6E6E] block mt-0.5">
                          {(ord.paymentMethod || 'COD').toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge
                          variant={getFulfillmentVariant(ord.orderStatus)}
                          size="sm"
                        >
                          {(ord.orderStatus || 'PLACED').toUpperCase()}
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="NO CUSTOMER ORDERS PLACED YET"
          description="Live customer checkouts and orders processed by the backend will appear in this real-time stream. Place a test order in the storefront to verify the order flow."
          compact
        />
      )}
    </div>
  );
};

export default OrderFeedTable;
