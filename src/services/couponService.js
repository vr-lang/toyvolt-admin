import api from './api';

export const couponService = {
  /**
   * Fetch all promotional coupons and vouchers
   */
  async getCoupons() {
    const res = await api.get('/admin/coupons');
    return res.data?.data?.coupons || [];
  },

  /**
   * Create a new coupon
   */
  async createCoupon(data) {
    const res = await api.post('/admin/coupons', data);
    return res.data;
  },

  /**
   * Update an existing coupon
   */
  async updateCoupon(id, data) {
    const res = await api.patch(`/admin/coupons/${id}`, data);
    return res.data;
  },

  /**
   * Toggle active/paused status of a coupon
   */
  async toggleCouponStatus(id, currentStatus) {
    const res = await api.patch(`/admin/coupons/${id}`, { isActive: !currentStatus });
    return res.data;
  },

  /**
   * Determine exact lifecycle status: 'ACTIVE' | 'EXPIRED' | 'SCHEDULED' | 'PAUSED'
   */
  getCouponLifecycleStatus(coupon) {
    if (!coupon.isActive) return 'PAUSED';
    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) return 'SCHEDULED';
    if (coupon.expiryDate && new Date(coupon.expiryDate) < now) return 'EXPIRED';
    if (coupon.globalUsageLimit && coupon.usedCount >= coupon.globalUsageLimit) return 'DEPLETED';
    return 'ACTIVE';
  },

  /**
   * Export filtered coupons to CSV
   */
  exportCouponsCSV(coupons = []) {
    if (!coupons || coupons.length === 0) return;

    const headers = [
      'Coupon Code',
      'Description',
      'Discount Type',
      'Discount Value',
      'Min Order (₹)',
      'Max Cap (₹)',
      'Usage Count',
      'Usage Limit',
      'Start Date',
      'Expiry Date',
      'Status'
    ];

    const rows = coupons.map((c) => {
      const isFlat = c.discountType === 'flat';
      const discountDisplay = isFlat ? `₹${Math.round(c.discountValue / 100)}` : `${c.discountValue}%`;
      const minOrderRupees = c.minOrderValue ? Math.round(c.minOrderValue / 100) : 0;
      const maxCapRupees = c.maxDiscountValue ? Math.round(c.maxDiscountValue / 100) : 'None';
      const status = couponService.getCouponLifecycleStatus(c);

      return [
        `"${(c.code || '').replace(/"/g, '""')}"`,
        `"${(c.description || '').replace(/"/g, '""')}"`,
        c.discountType || 'flat',
        discountDisplay,
        minOrderRupees,
        maxCapRupees,
        c.usedCount || 0,
        c.globalUsageLimit || 'Unlimited',
        c.startDate ? new Date(c.startDate).toLocaleDateString('en-IN') : 'N/A',
        c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-IN') : 'N/A',
        status
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `toyvolt_promotions_coupons_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default couponService;
