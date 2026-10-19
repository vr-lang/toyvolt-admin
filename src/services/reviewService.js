import api from './api';

const LOCAL_STORAGE_REVIEWS_CONFIG_KEY = 'toyvolt_review_display_config';

export const reviewService = {
  /**
   * Fetch reviews from backend if mounted, otherwise return empty list and report availability
   */
  async getReviews(params = {}) {
    try {
      const res = await api.get('/admin/reviews', { params });
      return {
        reviews: res.data?.data?.reviews || [],
        pagination: res.data?.data?.pagination || { total: 0, page: 1, limit: 20, pages: 1 },
        isBackendImplemented: true
      };
    } catch (err) {
      // Endpoint 404 indicates backend does not yet provide review management
      if (err.response?.status === 404) {
        return {
          reviews: [],
          pagination: { total: 0, page: 1, limit: 20, pages: 1 },
          isBackendImplemented: false,
          message: 'Review moderation API (/api/v1/admin/reviews) is not yet implemented on the backend.'
        };
      }
      throw err;
    }
  },

  /**
   * Update review status: 'PUBLISHED' | 'FLAGGED' | 'ARCHIVED' | 'PENDING'
   */
  async updateReviewStatus(id, status) {
    try {
      const res = await api.patch(`/admin/reviews/${id}/status`, { status });
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        throw new Error('Backend review endpoint (/admin/reviews/:id/status) is not yet available.');
      }
      if (!err.response || err.message === 'Network Error') {
        const res = await api.put(`/admin/reviews/${id}/status`, { status });
        return res.data;
      }
      throw err;
    }
  },

  /**
   * Post store reply to review
   */
  async replyToReview(id, replyText) {
    try {
      const res = await api.post(`/admin/reviews/${id}/reply`, { reply: replyText });
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        throw new Error('Backend review reply endpoint is not yet mounted.');
      }
      throw err;
    }
  },

  /**
   * Retrieve Display Engine Configuration (with persistent local storage fallback)
   */
  getDisplayConfig() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_REVIEWS_CONFIG_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return {
      prioritizeVisualProofs: true,
      autoPublishVerified5Star: false,
      whatsapp48hDeliveryTrigger: false,
      lowStarGuardrail: true
    };
  },

  /**
   * Save Display Engine Configuration
   */
  saveDisplayConfig(config) {
    try {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      // ignore
    }
    return config;
  },

  /**
   * Export reviews list to CSV
   */
  exportReviewsCSV(reviews = []) {
    if (!reviews || reviews.length === 0) return;

    const headers = [
      'Review ID',
      'Parent Name',
      'Product Name',
      'Rating',
      'Title',
      'Comment',
      'Verified Buyer',
      'Has Photos',
      'Status',
      'Date'
    ];

    const rows = reviews.map((r) => [
      r._id || '',
      `"${(r.parentName || r.user?.name || 'Anonymous').replace(/"/g, '""')}"`,
      `"${(r.productName || r.product?.name || 'Toyvolt Item').replace(/"/g, '""')}"`,
      r.rating || 5,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${(r.comment || r.body || '').replace(/"/g, '""')}"`,
      r.isVerified ? 'YES' : 'NO',
      r.photos && r.photos.length > 0 ? 'YES' : 'NO',
      r.status || 'PENDING',
      r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `toyvolt_parent_reviews_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default reviewService;
