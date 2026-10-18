import api from './api';

export const formatStatusLabel = (status) => {
  switch (status) {
    case 'PENDING_BOOKING':
    case 'UNBOOKED':
      return 'AWAITING DISPATCH BOOKING';
    case 'CREATED':
      return 'MANIFEST PENDING';
    case 'AWB_ASSIGNED':
      return 'AWB ASSIGNED';
    case 'PICKUP_SCHEDULED':
      return 'PICKUP SCHEDULED';
    case 'PICKED_UP':
      return 'PICKED UP';
    case 'IN_TRANSIT':
      return 'IN TRANSIT';
    case 'OUT_FOR_DELIVERY':
      return 'OUT FOR DELIVERY';
    case 'DELIVERED':
      return 'DELIVERED';
    case 'NDR':
      return 'NDR EXCEPTION';
    case 'RTO_INITIATED':
      return 'RTO INITIATED';
    case 'RTO_DELIVERED':
      return 'RTO RETURNED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return (status || 'UNKNOWN').replace(/_/g, ' ');
  }
};

export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'PENDING_BOOKING':
    case 'UNBOOKED':
      return 'bg-[#FFF3D6] text-[#B45309] border-[#B45309] font-bold';
    case 'IN_TRANSIT':
    case 'OUT_FOR_DELIVERY':
    case 'PICKED_UP':
      return 'bg-[#DCE5FF] text-[#315FE8] border-[#315FE8]';
    case 'CREATED':
    case 'AWB_ASSIGNED':
    case 'PICKUP_SCHEDULED':
      return 'bg-[#FFD983] text-[#171717] border-[#171717]';
    case 'NDR':
    case 'RTO_INITIATED':
      return 'bg-red-100 text-red-900 border-red-500';
    case 'DELIVERED':
      return 'bg-emerald-100 text-emerald-900 border-emerald-500';
    case 'CANCELLED':
    case 'RTO_DELIVERED':
      return 'bg-gray-200 text-gray-800 border-gray-400';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

export const shipmentService = {
  getStatusBadge: getStatusBadgeStyle,
  formatStatusLabel,

  /**
   * Fetch shipments with server-side pagination, search, status, courier, and hub filters
   */
  async getShipments(params = {}) {
    const cleanParams = {};

    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    if (params.status && params.status !== 'all') cleanParams.status = params.status;
    if (params.bookingState && params.bookingState !== 'all') cleanParams.bookingState = params.bookingState;
    if (params.courier && params.courier !== 'all') cleanParams.courier = params.courier;
    if (params.hub && params.hub !== 'all') cleanParams.hub = params.hub;
    if (params.startDate) cleanParams.startDate = params.startDate;
    if (params.endDate) cleanParams.endDate = params.endDate;
    if (params.ndrOnly) cleanParams.ndrOnly = true;

    const res = await api.get('/admin/shipments', { params: cleanParams });
    return res.data?.data || {
      shipments: [],
      pagination: { total: 0, page: 1, limit: 20, pages: 1 },
      metrics: {
        activeInTransit: { count: 0, courierDistribution: {} },
        onTimeSla: { percent: null, label: 'Not enough data', avgTransitDays: null },
        ndrCases: { count: 0, actionRequired: 0 },
        manifestedForPickup: { count: 0, scheduledPickupTime: null },
        deliveredCount: 0,
        totalShipments: 0
      },
      couriers: [],
      hubs: [],
      operationalAlerts: [],
      shippingIntegration: {
        isShiprocketConfigured: false,
        connectionStatus: 'unconfigured',
        lastSyncedAt: null
      }
    };
  },

  /**
   * Fetch single shipment details by MongoDB ID
   */
  async getShipmentById(id) {
    const res = await api.get(`/admin/shipments/${id}`);
    return res.data?.data?.shipment || res.data?.data;
  },

  /**
   * Sync telemetry for active shipments from Shiprocket
   */
  async syncTelemetry() {
    const res = await api.post('/admin/shipments/sync');
    return res.data?.data || res.data;
  },

  /**
   * Resolve an NDR case for a shipment
   */
  async resolveNdr(id, { action, reason, instructions, customerResponse }) {
    const res = await api.post(`/admin/shipments/${id}/ndr/resolve`, {
      action,
      reason,
      instructions,
      customerResponse
    });
    return res.data?.data?.shipment || res.data?.data;
  },

  /**
   * Bulk request NDR re-attempt across selected shipments
   */
  async bulkNdrReattempt(shipmentIds = []) {
    const res = await api.post('/admin/shipments/bulk/ndr-reattempt', { shipmentIds });
    return res.data?.data?.results || res.data?.data;
  },

  /**
   * Fetch shipment shipping label URL
   */
  async getLabel(id) {
    const res = await api.get(`/admin/shipments/${id}/label`);
    return res.data?.data;
  },

  /**
   * Fetch shipment manifest URL
   */
  async getManifest(id) {
    const res = await api.get(`/admin/shipments/${id}/manifest`);
    return res.data?.data;
  },

  /**
   * Create shipment for order if not already booked
   */
  async createShipmentForOrder(orderId) {
    const res = await api.post(`/admin/shipments/${orderId}/create`);
    return res.data?.data?.shipment || res.data?.data;
  },

  /**
   * Generate CSV string for export
   */
  generateExportCSV(shipments = []) {
    const headers = [
      'Shipment ID',
      'AWB Code',
      'Order Number',
      'Courier Name',
      'Pickup Location / Hub',
      'Recipient Name',
      'Recipient Phone',
      'Destination City',
      'Destination State',
      'PIN Code',
      'Status',
      'NDR Status',
      'NDR Reason',
      'Weight (kg)',
      'Dimensions (cm)',
      'Created Date',
      'Estimated Delivery'
    ];

    const rows = shipments.map((s) => {
      const order = s.orderId || {};
      const addr = order.shippingAddress || {};
      const createdStr = s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : '';
      const estStr = s.estimatedDeliveryDate ? new Date(s.estimatedDeliveryDate).toISOString().slice(0, 10) : 'N/A';
      const dimStr = s.dimensions ? `${s.dimensions.length}x${s.dimensions.breadth}x${s.dimensions.height}` : '15x10x10';

      return [
        `"${s._id}"`,
        `"${s.awbCode || 'PENDING'}"`,
        `"${order.orderNumber || ''}"`,
        `"${(s.courierName || 'Unassigned').replace(/"/g, '""')}"`,
        `"${(s.pickupLocation || 'Primary Hub').replace(/"/g, '""')}"`,
        `"${(addr.fullName || '').replace(/"/g, '""')}"`,
        `"${addr.phone || ''}"`,
        `"${(addr.city || '').replace(/"/g, '""')}"`,
        `"${(addr.state || '').replace(/"/g, '""')}"`,
        `"${addr.postalCode || ''}"`,
        `"${s.status || ''}"`,
        `"${s.ndrStatus || 'NONE'}"`,
        `"${(s.ndrReason || '').replace(/"/g, '""')}"`,
        s.weightKg || 0.85,
        `"${dimStr}"`,
        `"${createdStr}"`,
        `"${estStr}"`
      ];
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
};

export default shipmentService;
