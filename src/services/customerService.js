import api from './api';

export const customerService = {
  /**
   * Fetch paginated customer list
   */
  async getCustomers({ page = 1, limit = 20, search = '' } = {}) {
    const params = { page, limit };
    if (search && search.trim()) {
      params.search = search.trim();
    }

    const res = await api.get('/admin/customers', { params });
    return res.data?.data || { customers: [], pagination: { total: 0, page: 1, limit: 20, pages: 1 } };
  },

  /**
   * Toggle or update customer account status ('active' | 'suspended')
   */
  async updateCustomerStatus(id, status) {
    try {
      const res = await api.patch(`/admin/customers/${id}/status`, { status });
      return res.data;
    } catch (err) {
      if (!err.response || err.message === 'Network Error') {
        const res = await api.put(`/admin/customers/${id}/status`, { status });
        return res.data;
      }
      throw err;
    }
  },

  /**
   * Derive Play Club Loyalty Tier from customer lifetime spend in paise or rupees
   * Tier 1: Toy Cadet (0 - ₹2,499)
   * Tier 2: Master Builder (₹2,500 - ₹9,999)
   * Tier 3: Playroom VIP / Legend (₹10,000+)
   */
  getTierFromSpend(spendRupees = 0) {
    if (spendRupees >= 10000) {
      return {
        id: 'tier_3',
        name: 'Playroom VIP / Legend',
        shortName: 'VIP LEGEND',
        level: 3,
        badgeBg: 'bg-[#FF5638]',
        badgeText: 'text-white',
        border: 'border-[#FF5638]',
        multiplier: '2.5x Points',
        perks: 'Free Express Linehaul, Birthday Gift Hamper, Early Access'
      };
    }
    if (spendRupees >= 2500) {
      return {
        id: 'tier_2',
        name: 'Master Builder',
        shortName: 'BUILDER',
        level: 2,
        badgeBg: 'bg-[#FFD983]',
        badgeText: 'text-neutral-900',
        border: 'border-[#171717]',
        multiplier: '1.5x Points',
        perks: 'Priority Dispatch, ₹250 Birthday Voucher, Free Battery Pack'
      };
    }
    return {
      id: 'tier_1',
      name: 'Toy Cadet',
      shortName: 'TOY CADET',
      level: 1,
      badgeBg: 'bg-white',
      badgeText: 'text-neutral-800',
      border: 'border-neutral-300',
      multiplier: '1x Points',
      perks: 'Welcome 10% Voucher, Member Only Discounts'
    };
  },

  /**
   * Calculate loyalty points (1 point per ₹10 spend)
   */
  calculatePoints(spendRupees = 0) {
    return Math.floor(spendRupees / 10);
  },

  /**
   * Export filtered customer records to CSV
   */
  exportCustomersCSV(customers = []) {
    if (!customers || customers.length === 0) return;

    const headers = [
      'Customer ID',
      'Name',
      'Email',
      'Phone',
      'Default City',
      'Default State',
      'Account Status',
      'Joined Date'
    ];

    const rows = customers.map((c) => {
      const defaultAddr = c.addresses?.find((a) => a.isDefault) || c.addresses?.[0] || {};
      return [
        c._id || '',
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(defaultAddr.phone || c.phone || 'N/A').replace(/"/g, '""')}"`,
        `"${(defaultAddr.city || 'N/A').replace(/"/g, '""')}"`,
        `"${(defaultAddr.state || 'N/A').replace(/"/g, '""')}"`,
        c.accountStatus || 'active',
        c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : 'N/A'
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `toyvolt_customers_audience_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default customerService;
