import api, { setStoredToken } from './api';

export const authService = {
  /**
   * Check whether the initial admin setup is required (no admin accounts exist in system)
   */
  async getSetupStatus(options = {}) {
    try {
      const res = await api.get('/auth/setup-status', {
        timeout: options.timeout || 6000,
        ...options
      });
      return res.data?.data || { hasAdmin: true, isSetupRequired: false };
    } catch (err) {
      // If 404, the backend on Render hasn't been deployed with setup-status yet
      if (err.response?.status === 404) {
        return {
          hasAdmin: null,
          isSetupRequired: null,
          endpointMissing: true,
          message: 'Backend /auth/setup-status endpoint is not yet mounted on the remote server.'
        };
      }
      // On network timeout or cold start, default to setup already completed so admin UI never blocks
      return { hasAdmin: true, isSetupRequired: false };
    }
  },

  /**
   * One-time setup to register the initial administrator.
   * Permanently disabled on the backend after the first admin is created.
   */
  async setupInitialAdmin({ adminId, name, password, confirmPassword }) {
    const res = await api.post('/auth/setup', {
      adminId,
      name,
      password,
      confirmPassword
    });

    if (res.data?.data?.accessToken) {
      setStoredToken(res.data.data.accessToken);
    }

    return res.data;
  },

  /**
   * Authenticate administrator credentials
   */
  async login({ adminId, password }) {
    const res = await api.post('/auth/login', {
      email: adminId,
      password
    });

    if (res.data?.data?.accessToken) {
      setStoredToken(res.data.data.accessToken);
    }

    return res.data;
  },

  /**
   * Fetch current authenticated administrator profile with fail-safe timeout
   */
  async getMe(options = {}) {
    const res = await api.get('/auth/me', {
      timeout: options.timeout || 8000,
      ...options
    });
    return res.data?.data?.user || null;
  },

  /**
   * Sign out and clear server-issued HttpOnly session cookies
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      setStoredToken(null);
    }
  }
};

export const healthService = {
  /**
   * Ping backend health endpoint to check database, mail, payments, and shipping connectivity
   */
  async getHealth() {
    const res = await api.get('/health');
    return res.data;
  }
};

export const dashboardService = {
  /**
   * Get operational metrics, low-stock counts, recent orders, and daily sales
   */
  async getDashboardMetrics() {
    const res = await api.get('/admin/dashboard');
    return res.data?.data;
  },

  /**
   * Sales analytics endpoint
   */
  async getSalesAnalytics(timeframe = '30d') {
    const res = await api.get('/admin/analytics/sales', { params: { timeframe } });
    return res.data?.data;
  },

  /**
   * Product catalog for inventory overview and ranking
   */
  async getProducts(params = { limit: 50 }) {
    const res = await api.get('/admin/products', { params });
    return res.data?.data;
  },

  /**
   * Order list feed
   */
  async getOrders(params = { limit: 20 }) {
    const res = await api.get('/admin/orders', { params });
    return res.data?.data;
  }
};

export default {
  auth: authService,
  health: healthService,
  dashboard: dashboardService
};
