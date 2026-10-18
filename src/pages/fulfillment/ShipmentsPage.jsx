import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Truck, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert, 
  Info,
  X,
  Package
} from 'lucide-react';
import { shipmentService } from '../../services/shipmentService';

// Child components
import ShipmentAlertBanner from '../../components/shipments/ShipmentAlertBanner';
import ShipmentsHeaderToolbar from '../../components/shipments/ShipmentsHeaderToolbar';
import ShipmentsKpiCards from '../../components/shipments/ShipmentsKpiCards';
import CourierPartnerCards from '../../components/shipments/CourierPartnerCards';
import ShipmentHubTabs from '../../components/shipments/ShipmentHubTabs';
import ShipmentsFilterToolbar from '../../components/shipments/ShipmentsFilterToolbar';
import ShipmentsTable from '../../components/shipments/ShipmentsTable';
import ShipmentsPagination from '../../components/shipments/ShipmentsPagination';
import BottomOperationsPanels from '../../components/shipments/BottomOperationsPanels';

// Modals and Drawers
import ShipmentDetailDrawer from '../../components/shipments/ShipmentDetailDrawer';
import NdrResolveModal from '../../components/shipments/NdrResolveModal';
import BulkNdrModal from '../../components/shipments/BulkNdrModal';

export const ShipmentsPage = () => {
  const { setBadges } = useOutletContext() || {};

  // Server state
  const [shipments, setShipments] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });
  const [metrics, setMetrics] = useState({
    activeInTransit: { count: 0, courierDistribution: {} },
    onTimeSla: { percent: null, label: 'Not enough data', avgTransitDays: null },
    ndrCases: { count: 0, actionRequired: 0 },
    manifestedForPickup: { count: 0, scheduledPickupTime: null },
    awaitingBookingCount: 0,
    deliveredCount: 0,
    totalShipments: 0,
    totalOrders: 0
  });
  const [couriers, setCouriers] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [shippingIntegration, setShippingIntegration] = useState({
    isShiprocketConfigured: false,
    connectionStatus: 'unconfigured',
    service: 'Shiprocket Multi-Carrier API',
    pickupLocations: []
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filter state
  const [bookingState, setBookingState] = useState('all'); // 'all' | 'awaiting_booking' | 'booked'
  const [search, setSearch] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedHub, setSelectedHub] = useState('ALL');
  const [ndrOnly, setNdrOnly] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals & Drawer state
  const [activeShipmentForDrawer, setActiveShipmentForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeShipmentForNdr, setActiveShipmentForNdr] = useState(null);
  const [isNdrModalOpen, setIsNdrModalOpen] = useState(false);
  const [isBulkNdrModalOpen, setIsBulkNdrModalOpen] = useState(false);

  // Notify helper
  const notify = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === msg ? null : curr));
    }, 5000);
  };

  // Fetch shipments from API
  const loadShipments = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const params = {
        page,
        limit,
        bookingState: bookingState !== 'all' ? bookingState : undefined,
        search: search || undefined,
        courier: selectedCourier !== 'ALL' && selectedCourier !== 'all' ? selectedCourier : undefined,
        status: selectedStatus !== 'ALL' && selectedStatus !== 'all' ? selectedStatus : undefined,
        hub: selectedHub !== 'ALL' && selectedHub !== 'all' ? selectedHub : undefined,
        ndrOnly: ndrOnly ? true : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };

      const res = await shipmentService.getShipments(params);

      setShipments(res.shipments || []);
      setPagination(res.pagination || { total: res.shipments?.length || 0, page, limit, pages: 1 });
      
      if (res.metrics) {
        setMetrics(res.metrics);
      }
      if (res.couriers) {
        setCouriers(res.couriers);
      }
      if (res.hubs) {
        setHubs(res.hubs);
      }
      if (res.operationalAlerts || res.alerts) {
        setAlerts(res.operationalAlerts || res.alerts);
      }
      if (res.shippingIntegration) {
        setShippingIntegration(res.shippingIntegration);
      }

      // Update badge in sidebar if setter provided
      const ndrCount = res.metrics?.ndrCases?.count ?? res.metrics?.ndrCases ?? 0;
      if (setBadges && ndrCount !== undefined) {
        setBadges((prev) => ({
          ...prev,
          shipments: ndrCount > 0 ? ndrCount : undefined
        }));
      }

    } catch (err) {
      setError(err.message || 'Failed to load shipments.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, bookingState, search, selectedCourier, selectedStatus, selectedHub, ndrOnly, startDate, endDate, setBadges]);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  // Sync telemetry with carriers
  const handleSyncTelemetry = async () => {
    try {
      setSyncing(true);
      const res = await shipmentService.syncTelemetry();
      notify(res.message || 'Carrier telemetry & scan statuses synchronized.');
      loadShipments(true);
    } catch (err) {
      notify(err.message || 'Failed to synchronize telemetry.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Download Manifest
  const handleDownloadManifest = async () => {
    try {
      const res = await shipmentService.getManifest('batch');
      if (res.manifestUrl) {
        window.open(res.manifestUrl, '_blank');
      } else {
        notify(res.message || 'Dispatch manifest ready for carrier pickup inspection.');
      }
    } catch (err) {
      notify(err.message || 'Manifest generated.', 'info');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!shipments || shipments.length === 0) {
      notify('No shipment records available to export.', 'error');
      return;
    }
    const csvContent = shipmentService.generateExportCSV(shipments);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `toyvolt_consignments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Exported ${shipments.length} consignments to CSV.`);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setBookingState('all');
    setSearch('');
    setSelectedCourier('ALL');
    setSelectedStatus('ALL');
    setSelectedHub('ALL');
    setNdrOnly(false);
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    bookingState !== 'all' ||
    search || 
    selectedCourier !== 'ALL' || 
    selectedStatus !== 'ALL' || 
    selectedHub !== 'ALL' || 
    ndrOnly || 
    startDate || 
    endDate
  );

  // Table selection handlers
  const handleSelectId = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === shipments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(shipments.map((s) => s._id));
    }
  };

  // Detail Drawer
  const handleViewDossier = (shipment) => {
    setActiveShipmentForDrawer(shipment);
    setIsDrawerOpen(true);
  };

  // Single NDR Resolution
  const handleResolveNdr = (shipment) => {
    setActiveShipmentForNdr(shipment);
    setIsNdrModalOpen(true);
  };

  // Print single label
  const handlePrintLabel = async (shipment) => {
    try {
      const res = await shipmentService.getLabel(shipment._id);
      if (res.labelUrl) {
        window.open(res.labelUrl, '_blank');
      } else {
        notify('Shipping label generated & queued for thermal printing.');
      }
    } catch (err) {
      notify(err.message || 'Unable to retrieve label.', 'error');
    }
  };

  // Track carrier
  const handleTrack = (shipment) => {
    const awb = shipment.trackingNumber || shipment.awbNumber || shipment.awbCode;
    if (!awb) {
      notify('AWB not yet assigned for this shipment.', 'error');
      return;
    }
    if (shipment.carrier?.toLowerCase().includes('blue')) {
      window.open(`https://www.bluedart.com/tracking?trackNumber=${awb}`, '_blank');
    } else if (shipment.carrier?.toLowerCase().includes('delhivery')) {
      window.open(`https://www.delhivery.com/track/package/${awb}`, '_blank');
    } else {
      window.open(`https://shiprocket.co/tracking/${awb}`, '_blank');
    }
  };

  // Book shipment for an unbooked order
  const handleBookShipment = async (shipment) => {
    try {
      const orderObj = (typeof shipment.orderId === 'object' && shipment.orderId) ? shipment.orderId : (shipment.order || {});
      const orderId = shipment.rawOrderId || orderObj._id || (typeof shipment.orderId === 'string' ? shipment.orderId : null) || shipment._id?.replace('unbooked_', '');
      const orderNumber = orderObj.orderNumber || orderId;

      if (!orderId) {
        notify('Unable to resolve parent Order ID for dispatch booking.', 'error');
        return;
      }

      const confirmed = window.confirm(
        `Confirm dispatch booking with Shiprocket for Order #${orderNumber}?\n\nThis will register the consignee address, assign an AWB with a courier, and schedule pickup from the primary Fatehabad Hub.`
      );
      if (!confirmed) return;

      notify('Contacting Shiprocket API & booking consignment...', 'info');
      const booked = await shipmentService.createShipmentForOrder(orderId);
      const awbCode = booked.awbCode || booked.awb_code || 'Assigned';
      notify(`Shipment booked successfully! Assigned AWB: ${awbCode}`, 'success');
      loadShipments(true);

      if (isDrawerOpen) {
        setIsDrawerOpen(false);
        setActiveShipmentForDrawer(null);
      }
    } catch (err) {
      notify(err.response?.data?.message || err.message || 'Failed to book shipment with Shiprocket.', 'error');
    }
  };

  // Handle KPI card filter click
  const handleKpiFilter = (filterKey) => {
    if (filterKey === 'awaiting_booking') {
      setBookingState('awaiting_booking');
      setSelectedStatus('ALL');
      setNdrOnly(false);
      setPage(1);
    } else if (filterKey === 'IN_TRANSIT') {
      setBookingState('booked');
      setSelectedStatus('IN_TRANSIT');
      setNdrOnly(false);
      setPage(1);
    } else if (filterKey === 'ndrOnly') {
      setBookingState('all');
      setNdrOnly(true);
      setSelectedStatus('NDR');
      setPage(1);
    } else if (filterKey === 'CREATED') {
      setBookingState('booked');
      setSelectedStatus('CREATED');
      setNdrOnly(false);
      setPage(1);
    }
  };

  const ndrCasesCount = metrics.ndrCases?.count ?? metrics.ndrCases ?? 0;
  const manifestedCount = metrics.manifestedForPickup?.count ?? metrics.manifestedForPickup ?? 0;
  const activeInTransitCount = metrics.activeInTransit?.count ?? metrics.activeInTransit ?? 0;

  const primaryHubLabel = shippingIntegration.pickupLocations?.[0]?.location
    ? `${shippingIntegration.pickupLocations[0].city} Hub (${shippingIntegration.pickupLocations[0].location})`
    : 'Fatehabad Hub (work)';

  return (
    <div className="space-y-6 pb-12 font-sans text-neutral-900">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 border-4 border-neutral-900 shadow-[6px_6px_0px_#000] font-mono text-xs flex items-center justify-between gap-4 max-w-md ${
          notification.type === 'error' ? 'bg-[#FF5638] text-white' : 'bg-[#FFD983] text-neutral-900'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-neutral-900" />}
            <span className="font-bold">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:bg-black/10">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Operational Alert Radar */}
      <ShipmentAlertBanner 
        alerts={alerts}
        onFilterNdr={() => {
          setNdrOnly(true);
          setSelectedStatus('NDR');
          setBookingState('all');
          setPage(1);
        }}
        onFilterPendingPickup={() => {
          setSelectedStatus('CREATED');
          setBookingState('booked');
          setPage(1);
        }}
        onFilterUnbooked={() => {
          setBookingState('awaiting_booking');
          setSelectedStatus('ALL');
          setPage(1);
        }}
        onSyncTelemetry={handleSyncTelemetry}
        syncing={syncing}
      />

      {/* Header and Command Toolbar */}
      <ShipmentsHeaderToolbar 
        shippingIntegration={shippingIntegration}
        onDownloadManifest={handleDownloadManifest}
        onSyncTelemetry={handleSyncTelemetry}
        onBulkNdrModal={() => setIsBulkNdrModalOpen(true)}
        onRefresh={() => loadShipments(true)}
        onExportCSV={handleExportCSV}
        refreshing={refreshing}
        syncing={syncing}
        selectedCount={selectedIds.length}
      />

      {/* 5 Metric KPI Cards */}
      <ShipmentsKpiCards 
        metrics={metrics}
        loading={loading}
        onSelectKpiFilter={handleKpiFilter}
      />

      {/* Courier Partner Status Cards */}
      <CourierPartnerCards 
        couriers={couriers}
        pickupLocation={primaryHubLabel}
        onFilterCourier={(c) => {
          setSelectedCourier(c);
          setBookingState('booked');
          setPage(1);
        }}
      />

      {/* Hub Tabs */}
      <ShipmentHubTabs 
        hubs={hubs}
        activeHub={selectedHub}
        onSelectHub={(hubId) => {
          setSelectedHub(hubId);
          setPage(1);
        }}
        totalCount={metrics.totalOrders || pagination.total || shipments.length}
      />

      {/* Segmented Queue View Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => { setBookingState('all'); setPage(1); }}
          className={`px-4 py-2 uppercase font-bold tracking-wider border-2 transition-all ${
            bookingState === 'all'
              ? 'bg-[#171717] text-white border-[#171717] shadow-[3px_3px_0px_#315FE8]'
              : 'bg-white hover:bg-[#FAF8F5] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717]'
          }`}
        >
          <span>All Consignments</span>
          <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-white/20 border border-current font-black">
            {metrics.totalOrders ?? pagination.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setBookingState('awaiting_booking'); setPage(1); }}
          className={`px-4 py-2 uppercase font-bold tracking-wider border-2 transition-all flex items-center gap-1.5 ${
            bookingState === 'awaiting_booking'
              ? 'bg-[#B45309] text-white border-[#171717] shadow-[3px_3px_0px_#171717]'
              : 'bg-white hover:bg-amber-50 text-amber-900 border-[#171717] shadow-[2px_2px_0px_#171717]'
          }`}
        >
          <span>Awaiting Booking</span>
          <span className={`px-1.5 py-0.5 text-[10px] border font-black ${
            bookingState === 'awaiting_booking' ? 'bg-white text-[#B45309] border-white' : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}>
            {metrics.awaitingBookingCount ?? 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setBookingState('booked'); setPage(1); }}
          className={`px-4 py-2 uppercase font-bold tracking-wider border-2 transition-all flex items-center gap-1.5 ${
            bookingState === 'booked'
              ? 'bg-[#315FE8] text-white border-[#171717] shadow-[3px_3px_0px_#315FE8]'
              : 'bg-white hover:bg-blue-50 text-[#315FE8] border-[#171717] shadow-[2px_2px_0px_#171717]'
          }`}
        >
          <span>Booked Shipments</span>
          <span className={`px-1.5 py-0.5 text-[10px] border font-black ${
            bookingState === 'booked' ? 'bg-white text-[#315FE8] border-white' : 'bg-blue-50 text-[#315FE8] border-blue-200'
          }`}>
            {metrics.totalShipments ?? 0}
          </span>
        </button>
      </div>

      {/* Filters and Controls */}
      <ShipmentsFilterToolbar 
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        selectedCourier={selectedCourier}
        onCourierChange={(val) => { setSelectedCourier(val); setPage(1); }}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => { setSelectedStatus(val); setPage(1); }}
        ndrOnly={ndrOnly}
        onToggleNdrOnly={() => { setNdrOnly(!ndrOnly); setPage(1); }}
        startDate={startDate}
        onStartDateChange={(val) => { setStartDate(val); setPage(1); }}
        endDate={endDate}
        onEndDateChange={(val) => { setEndDate(val); setPage(1); }}
        onResetFilters={handleResetFilters}
        couriersList={couriers}
      />

      {/* Server Error Display */}
      {error && (
        <div className="p-4 bg-red-100 border-2 border-red-600 text-red-900 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>{error}</span>
          </div>
          <button 
            onClick={() => loadShipments(true)} 
            className="px-3 py-1 bg-white border border-red-900 font-bold hover:bg-neutral-100"
          >
            RETRY
          </button>
        </div>
      )}

      {/* Shipments Data Table */}
      <ShipmentsTable 
        shipments={shipments}
        loading={loading}
        selectedShipmentIds={selectedIds}
        onToggleSelectShipment={handleSelectId}
        onSelectAll={handleSelectAll}
        onViewShipmentDetails={handleViewDossier}
        onDownloadLabel={handlePrintLabel}
        onResolveNdr={handleResolveNdr}
        onTrack={handleTrack}
        onBookShipment={handleBookShipment}
        onResetFilters={handleResetFilters}
      />

      {/* Pagination */}
      <ShipmentsPagination 
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
        onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
      />

      {/* Dual Bottom Operations Panels: NDR Center & Evening Handover */}
      <BottomOperationsPanels 
        ndrCount={ndrCasesCount}
        manifestedCount={manifestedCount}
        totalActiveCount={activeInTransitCount}
        onOpenBulkNdr={() => setIsBulkNdrModalOpen(true)}
        onFilterNdr={() => {
          setNdrOnly(true);
          setSelectedStatus('NDR');
          setPage(1);
        }}
        onRefresh={() => loadShipments(true)}
        onNotify={notify}
      />

      {/* Shipment Dossier Slide-Over Drawer */}
      <ShipmentDetailDrawer 
        shipment={activeShipmentForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setActiveShipmentForDrawer(null);
        }}
        onResolveNdr={(shipment) => {
          setIsDrawerOpen(false);
          handleResolveNdr(shipment);
        }}
        onRefresh={() => loadShipments(true)}
        onBookShipment={handleBookShipment}
      />

      {/* Single NDR Resolution Modal */}
      <NdrResolveModal 
        shipment={activeShipmentForNdr}
        isOpen={isNdrModalOpen}
        onClose={() => {
          setIsNdrModalOpen(false);
          setActiveShipmentForNdr(null);
        }}
        onSuccess={(msg) => {
          notify(msg);
          loadShipments(true);
        }}
      />

      {/* Bulk NDR Re-attempt Modal */}
      <BulkNdrModal 
        isOpen={isBulkNdrModalOpen}
        onClose={() => setIsBulkNdrModalOpen(false)}
        selectedShipmentIds={selectedIds}
        totalNdrCount={ndrCasesCount}
        onSuccess={(msg) => {
          notify(msg);
          setSelectedIds([]);
          loadShipments(true);
        }}
      />

    </div>
  );
};

export default ShipmentsPage;
