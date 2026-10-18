import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ShoppingBag,
  Plus,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  Filter,
  Check,
  PackageCheck,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { orderService, formatINR } from '../../services/orderService';

// Child components
import { FulfillmentAlertBanner } from '../../components/orders/FulfillmentAlertBanner';
import { OrdersKpiCards } from '../../components/orders/OrdersKpiCards';
import { OrdersStatusTabs } from '../../components/orders/OrdersStatusTabs';
import { OrdersFilterToolbar } from '../../components/orders/OrdersFilterToolbar';
import { OrdersBulkToolbar } from '../../components/orders/OrdersBulkToolbar';
import { OrdersTable } from '../../components/orders/OrdersTable';
import { OrdersPagination } from '../../components/orders/OrdersPagination';
import { StickyBulkActionBar } from '../../components/orders/StickyBulkActionBar';

// Modals
import { OrderDetailsModal } from '../../components/orders/OrderDetailsModal';
import { UpdateOrderStatusModal } from '../../components/orders/UpdateOrderStatusModal';
import { CreateManualOrderModal } from '../../components/orders/CreateManualOrderModal';
import { BulkFulfillmentModal } from '../../components/orders/BulkFulfillmentModal';
import { CustomerWhatsAppModal } from '../../components/orders/CustomerWhatsAppModal';

export const OrdersPage = () => {
  const { setBadges } = useOutletContext() || {};

  // Server state
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });
  const [statusCounts, setStatusCounts] = useState({});
  const [metrics, setMetrics] = useState({});
  const [shippingIntegration, setShippingIntegration] = useState({ isShiprocketConfigured: false });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters state
  const [activeStatus, setActiveStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Multi-select state
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Modals state
  const [inspectingOrder, setInspectingOrder] = useState(null);
  const [updatingStatusOrder, setUpdatingStatusOrder] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [whatsAppOrder, setWhatsAppOrder] = useState(null);

  // Operational Toast / Status feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Convert dateRange preset to ISO date strings for query
  const getDateRangeQuery = useCallback(() => {
    if (dateRange === 'all') return { startDate: undefined, endDate: undefined };
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dateRange === 'today') {
      return { startDate: todayStart.toISOString() };
    }
    if (dateRange === 'yesterday') {
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      return {
        startDate: yesterdayStart.toISOString(),
        endDate: todayStart.toISOString()
      };
    }
    if (dateRange === '7d') {
      const sevenDaysAgo = new Date(todayStart);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return { startDate: sevenDaysAgo.toISOString() };
    }
    if (dateRange === '30d') {
      const thirtyDaysAgo = new Date(todayStart);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return { startDate: thirtyDaysAgo.toISOString() };
    }
    return {};
  }, [dateRange]);

  // Load orders from API
  const loadOrders = useCallback(
    async (pageToLoad = 1, isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const { startDate, endDate } = getDateRangeQuery();

        const data = await orderService.getOrders({
          page: pageToLoad,
          limit: pagination.limit || 20,
          search,
          status: activeStatus,
          paymentStatus,
          paymentMethod,
          startDate,
          endDate
        });

        const fetchedOrders = data.orders || [];
        setOrders(fetchedOrders);
        setPagination(data.pagination || { total: fetchedOrders.length, page: pageToLoad, limit: 20, pages: 1 });
        setStatusCounts(data.statusCounts || {});
        setMetrics(data.metrics || {});
        setShippingIntegration(data.shippingIntegration || { isShiprocketConfigured: false });

        // Update layout pending orders badge
        if (setBadges) {
          const pendingCount = data.metrics?.pendingBooking?.count ?? data.statusCounts?.placed ?? 0;
          setBadges((prev) => ({
            ...prev,
            pendingOrders: pendingCount
          }));
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
        setError(err.response?.data?.message || err.message || 'Could not retrieve orders. Please check backend status.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pagination.limit, search, activeStatus, paymentStatus, paymentMethod, getDateRangeQuery, setBadges]
  );

  // Trigger load on filter or status change
  useEffect(() => {
    loadOrders(1);
    setSelectedOrderIds([]); // Clear selection on filter change
  }, [activeStatus, search, paymentStatus, paymentMethod, dateRange]);

  // Handle single order row selection
  const handleToggleSelectOrder = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Handle toggle select all visible
  const handleToggleSelectAll = (selectAll) => {
    if (selectAll) {
      setSelectedOrderIds(orders.map((o) => o._id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  // Get array of selected order objects
  const selectedOrders = useMemo(() => {
    return orders.filter((o) => selectedOrderIds.includes(o._id));
  }, [orders, selectedOrderIds]);

  // Filter KPI card click
  const handleSelectKpiFilter = (targetStatus) => {
    setActiveStatus(targetStatus);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setPaymentStatus('all');
    setPaymentMethod('all');
    setDateRange('all');
    setActiveStatus('all');
  };

  // Lifecycle status update handler
  const handleConfirmStatusUpdate = async (orderId, newStatus, reason) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, {
        orderStatus: newStatus,
        cancellationReason: reason
      });
      showToast(`Order status successfully updated to "${newStatus.toUpperCase()}".`);
      loadOrders(pagination.page, true);
    } catch (err) {
      console.error('Failed to update order status:', err);
      showToast(err.response?.data?.message || err.message || 'Failed to update order status.', 'error');
      throw err;
    }
  };

  // Shipment booking handler (Shiprocket integration)
  const handleCreateShipment = async (orderId) => {
    try {
      const shipment = await orderService.createShipment(orderId);
      const awb = shipment.awbCode || 'Scheduled';
      const courier = shipment.courierName || 'Courier';
      showToast(`Shipment successfully booked! ${courier} AWB: ${awb}`);
      loadOrders(pagination.page, true);
    } catch (err) {
      console.error('Shipment creation error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to book shipment. Check logistics settings.';
      showToast(msg, 'error');
    }
  };

  // Cancellation handler
  const handleCancelOrder = async (orderId, reason) => {
    try {
      await orderService.cancelOrder(orderId, reason || 'Customer requested cancellation via admin');
      showToast('Order cancelled and reserved stock restored.', 'info');
      loadOrders(pagination.page, true);
    } catch (err) {
      console.error('Cancellation error:', err);
      showToast(err.response?.data?.message || err.message || 'Failed to cancel order.', 'error');
    }
  };

  // Manual order creation handler
  const handleOrderCreated = async (payload) => {
    try {
      const newOrder = await orderService.createManualOrder(payload);
      showToast(`Manual order #${newOrder.orderNumber || newOrder._id} created successfully!`);
      loadOrders(1, true);
    } catch (err) {
      console.error('Error creating manual order:', err);
      throw err;
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const listToExport = selectedOrders.length > 0 ? selectedOrders : orders;
    if (listToExport.length === 0) {
      showToast('No orders available to export.', 'error');
      return;
    }

    const csvContent = orderService.generateExportCSV(listToExport);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.href = url;
    link.setAttribute('download', `toyvolt-orders-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${listToExport.length} order records to CSV.`);
  };

  // Batch Print Packing Slips
  const handleBatchPrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 bg-[#F7F3EB] min-h-screen overflow-y-auto">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`sticky top-0 z-40 px-4 py-2.5 border-b-2 border-[#171717] font-mono text-xs font-bold flex items-center justify-between shadow-[0px_4px_0px_#171717] ${
            toast.type === 'error'
              ? 'bg-[#FF5638] text-white'
              : toast.type === 'info'
              ? 'bg-[#FFD983] text-[#171717]'
              : 'bg-emerald-500 text-white'
          }`}
        >
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            {toast.type === 'error' ? (
              <AlertCircle size={16} />
            ) : toast.type === 'info' ? (
              <ShieldAlert size={16} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-current underline text-[10px] uppercase ml-3 font-bold"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* Top Header Command Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-[#171717] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#315FE8] border border-[#171717]" />
              <p className="font-mono text-xs font-bold tracking-widest uppercase text-gray-600">
                CONSOLE / FULFILLMENT // ORDERS
              </p>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono font-black text-2xl md:text-3xl tracking-tight uppercase text-[#171717]">
                ORDERS & FULFILLMENT QUEUE
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-mono text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                LIVE QUEUE
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => loadOrders(pagination.page, true)}
              disabled={refreshing || loading}
              className="px-3 py-2 bg-white hover:bg-gray-100 text-[#171717] font-mono font-bold text-xs border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
              title="Refresh order queue"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">REFRESH</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={orders.length === 0}
              className="px-3.5 py-2 bg-white hover:bg-[#FFF9F0] text-[#171717] font-mono font-bold text-xs border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              <Download size={14} />
              <span>EXPORT CSV {selectedOrders.length > 0 ? `(${selectedOrders.length})` : ''}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-[#315FE8] hover:bg-[#254bc4] text-white font-mono font-bold text-xs border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus size={16} />
              <span>CREATE MANUAL ORDER</span>
            </button>
          </div>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div className="bg-red-50 border-2 border-red-500 shadow-[3px_3px_0px_#171717] p-4 flex items-start gap-3 text-xs font-mono text-red-900">
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">OPERATIONAL ERROR:</span> {error}
            </div>
            <button
              type="button"
              onClick={() => loadOrders(pagination.page, true)}
              className="px-2.5 py-1 bg-red-600 text-white font-bold text-[10px] border border-[#171717]"
            >
              RETRY
            </button>
          </div>
        )}

        {/* Operational Banner: Live Courier Status & Radar */}
        <FulfillmentAlertBanner
          shippingIntegration={shippingIntegration}
          pendingBookingCount={metrics?.pendingBooking?.count ?? statusCounts.placed ?? 0}
          onFilterPendingBooking={() => setActiveStatus('placed')}
        />

        {/* 4 Metric KPI Command Cards */}
        <OrdersKpiCards
          metrics={metrics}
          loading={loading && orders.length === 0}
          onSelectFilter={handleSelectKpiFilter}
        />

        {/* Status Lifecycle Tabs */}
        <OrdersStatusTabs
          activeStatus={activeStatus}
          onSelectStatus={(st) => setActiveStatus(st)}
          statusCounts={statusCounts}
        />

        {/* Search & Filter Toolbar */}
        <OrdersFilterToolbar
          search={search}
          paymentStatus={paymentStatus}
          paymentMethod={paymentMethod}
          dateRange={dateRange}
          onSearchChange={(val) => setSearch(val)}
          onPaymentStatusChange={(val) => setPaymentStatus(val)}
          onPaymentMethodChange={(val) => setPaymentMethod(val)}
          onDateRangeChange={(val) => setDateRange(val)}
          onResetFilters={handleResetFilters}
        />

        {/* Bulk Action Controls Bar (visible when items selected) */}
        <OrdersBulkToolbar
          selectedCount={selectedOrderIds.length}
          totalVisible={orders.length}
          isAllSelected={orders.length > 0 && selectedOrderIds.length === orders.length}
          onToggleSelectAll={handleToggleSelectAll}
          onClearSelection={() => setSelectedOrderIds([])}
          onBatchPrint={handleBatchPrint}
          onBatchShip={() => setIsBulkModalOpen(true)}
          onOpenWhatsApp={() => {
            if (selectedOrders[0]) setWhatsAppOrder(selectedOrders[0]);
          }}
        />

        {/* Orders Data Table */}
        <OrdersTable
          orders={orders}
          loading={loading}
          selectedOrderIds={selectedOrderIds}
          onToggleSelectOrder={handleToggleSelectOrder}
          onViewOrderDetails={(order) => setInspectingOrder(order)}
          onUpdateStatus={(order) => setUpdatingStatusOrder(order)}
          onCreateShipment={(orderId) => handleCreateShipment(orderId)}
          onCancelOrder={(orderId, reason) => handleCancelOrder(orderId, reason)}
          onOpenWhatsApp={(order) => setWhatsAppOrder(order)}
          shippingIntegration={shippingIntegration}
        />

        {/* Server-Side Pagination Bar */}
        <OrdersPagination
          pagination={pagination}
          onPageChange={(nextPage) => loadOrders(nextPage)}
          onLimitChange={(newLimit) => {
            setPagination((prev) => ({ ...prev, limit: newLimit }));
            loadOrders(1);
          }}
        />
      </div>

      {/* Floating Sticky Bulk Action Bar */}
      <StickyBulkActionBar
        selectedOrders={selectedOrders}
        onClearSelection={() => setSelectedOrderIds([])}
        onBatchPrint={handleBatchPrint}
        onBatchShip={() => setIsBulkModalOpen(true)}
      />

      {/* MODAL 1: Full Order Details Inspection & Packing Slip */}
      {inspectingOrder && (
        <OrderDetailsModal
          order={inspectingOrder}
          onClose={() => setInspectingOrder(null)}
          onUpdateStatus={(order) => {
            setInspectingOrder(null);
            setUpdatingStatusOrder(order);
          }}
          onCreateShipment={(orderId) => {
            handleCreateShipment(orderId);
            setInspectingOrder(null);
          }}
        />
      )}

      {/* MODAL 2: Lifecycle Status Transition */}
      {updatingStatusOrder && (
        <UpdateOrderStatusModal
          order={updatingStatusOrder}
          isOpen={Boolean(updatingStatusOrder)}
          onClose={() => setUpdatingStatusOrder(null)}
          onConfirmUpdate={handleConfirmStatusUpdate}
        />
      )}

      {/* MODAL 3: Create Manual Phone / In-Store Order */}
      <CreateManualOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      {/* MODAL 4: Bulk Fulfillment & Batch Lifecycle Update */}
      <BulkFulfillmentModal
        isOpen={isBulkModalOpen}
        selectedOrders={selectedOrders}
        onClose={() => setIsBulkModalOpen(false)}
        onCompleted={() => {
          setSelectedOrderIds([]);
          loadOrders(pagination.page, true);
        }}
      />

      {/* MODAL 5: WhatsApp Customer Dispatch Notifier */}
      {whatsAppOrder && (
        <CustomerWhatsAppModal
          order={whatsAppOrder}
          isOpen={Boolean(whatsAppOrder)}
          onClose={() => setWhatsAppOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;
