import api from './api';

// Currency conversion helpers
export const rupeesToPaise = (rupees) => Math.round(Number(rupees) * 100);
export const paiseToRupees = (paise) => (typeof paise === 'number' ? Math.round(paise / 100) : 0);

export const formatINR = (paiseOrRupees, isPaise = true) => {
  const rupees = isPaise ? paiseToRupees(paiseOrRupees) : Number(paiseOrRupees) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rupees);
};

export const orderService = {
  /**
   * Fetch orders with server-side pagination, search, status, and date filters
   */
  async getOrders(params = {}) {
    const cleanParams = {};

    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    if (params.status && params.status !== 'all') cleanParams.status = params.status;
    if (params.paymentStatus && params.paymentStatus !== 'all') cleanParams.paymentStatus = params.paymentStatus;
    if (params.paymentMethod && params.paymentMethod !== 'all') cleanParams.paymentMethod = params.paymentMethod;
    if (params.startDate) cleanParams.startDate = params.startDate;
    if (params.endDate) cleanParams.endDate = params.endDate;

    const res = await api.get('/admin/orders', { params: cleanParams });
    return res.data?.data || {
      orders: [],
      pagination: { total: 0, page: 1, limit: 20, pages: 1 },
      statusCounts: {},
      metrics: {},
      shippingIntegration: { isShiprocketConfigured: false }
    };
  },

  /**
   * Fetch single order details by MongoDB ID
   */
  async getOrderById(id) {
    const res = await api.get(`/admin/orders/${id}`);
    return res.data?.data?.order || res.data?.data;
  },

  /**
   * Update an order's lifecycle status (e.g. placed -> confirmed -> processing -> shipped -> delivered -> cancelled)
   */
  async updateOrderStatus(id, { orderStatus, cancellationReason }) {
    const payload = { orderStatus };
    if (cancellationReason) {
      payload.cancellationReason = cancellationReason;
    }
    const res = await api.patch(`/admin/orders/${id}/status`, payload);
    return res.data?.data?.order || res.data?.data;
  },

  /**
   * Cancel an order (customer or admin route)
   */
  async cancelOrder(id, reason = 'Cancelled by administrator') {
    const res = await api.post(`/orders/${id}/cancel`, { reason });
    return res.data?.data?.order || res.data?.data;
  },

  /**
   * Create shipment and assign courier for an order via Shiprocket
   */
  async createShipment(orderId) {
    const res = await api.post(`/admin/shipments/${orderId}/create`);
    return res.data?.data?.shipment || res.data?.data;
  },

  /**
   * Retrieve shipment tracking details for an order
   */
  async getShipmentByOrderId(orderId) {
    try {
      const res = await api.get(`/admin/shipments/${orderId}`);
      return res.data?.data?.shipment || null;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Create a manual phone or in-store order
   */
  async createManualOrder(orderData) {
    // Attempt admin order route first
    try {
      const res = await api.post('/admin/orders', orderData);
      return res.data?.data?.order || res.data?.data;
    } catch (err) {
      // Fallback to standard order endpoint if admin-specific route is not present
      if (err.response?.status === 404) {
        const res = await api.post('/orders', orderData);
        return res.data?.data?.order || res.data?.data;
      }
      throw err;
    }
  },

  /**
   * Bulk update status for multiple selected orders
   */
  async bulkUpdateStatus(orderIds = [], newStatus) {
    const results = {
      total: orderIds.length,
      successCount: 0,
      failedCount: 0,
      errors: []
    };

    for (const id of orderIds) {
      try {
        await api.patch(`/admin/orders/${id}/status`, { orderStatus: newStatus });
        results.successCount++;
      } catch (err) {
        results.failedCount++;
        results.errors.push(`Order ID ${id}: ${err.response?.data?.message || err.message}`);
      }
    }

    return results;
  },

  /**
   * Bulk generate shipping labels / shipments via Shiprocket
   */
  async bulkCreateShipments(orderIds = []) {
    const results = {
      total: orderIds.length,
      successCount: 0,
      failedCount: 0,
      errors: []
    };

    for (const id of orderIds) {
      try {
        await api.post(`/admin/shipments/${id}/create`);
        results.successCount++;
      } catch (err) {
        results.failedCount++;
        results.errors.push(`Order ID ${id}: ${err.response?.data?.message || err.message}`);
      }
    }

    return results;
  },

  /**
   * Generate CSV export string for given order records
   */
  generateExportCSV(orders = []) {
    const headers = [
      'Order ID',
      'Date (UTC)',
      'Customer Name',
      'Customer Email',
      'Phone',
      'City',
      'State',
      'Postal Code',
      'Order Status',
      'Payment Status',
      'Payment Method',
      'Subtotal (INR)',
      'Discount (INR)',
      'Tax / GST (INR)',
      'Shipping Fee (INR)',
      'Final Amount (INR)',
      'Total Items',
      'SKUs Ordered',
      'AWB Code',
      'Courier Name'
    ];

    const rows = orders.map((o) => {
      const date = o.createdAt ? new Date(o.createdAt).toISOString().replace('T', ' ').slice(0, 19) : '';
      const itemsCount = (o.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0);
      const skus = (o.items || []).map((i) => i.sku).join('; ');
      const subtotalINR = paiseToRupees(o.subtotal);
      const discountINR = paiseToRupees(o.discountAmount || 0);
      const taxINR = paiseToRupees(o.taxAmount || 0);
      const shippingINR = paiseToRupees(o.shippingFee || 0);
      const finalINR = paiseToRupees(o.finalAmount);
      const awb = o.shipmentId?.awbCode || 'N/A';
      const courier = o.shipmentId?.courierName || 'Unassigned';

      return [
        `"${o.orderNumber || o._id}"`,
        `"${date}"`,
        `"${(o.shippingAddress?.fullName || o.userId?.name || '').replace(/"/g, '""')}"`,
        `"${(o.userId?.email || '').replace(/"/g, '""')}"`,
        `"${o.shippingAddress?.phone || ''}"`,
        `"${(o.shippingAddress?.city || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.state || '').replace(/"/g, '""')}"`,
        `"${o.shippingAddress?.postalCode || ''}"`,
        `"${(o.orderStatus || '').toUpperCase()}"`,
        `"${(o.paymentStatus || '').toUpperCase()}"`,
        `"${(o.paymentMethod || '').toUpperCase()}"`,
        subtotalINR,
        discountINR,
        taxINR,
        shippingINR,
        finalINR,
        itemsCount,
        `"${skus.replace(/"/g, '""')}"`,
        `"${awb}"`,
        `"${courier.replace(/"/g, '""')}"`
      ];
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
};

export default orderService;
