import api from './api';

// Helper for rupee <-> paise conversions
export const rupeesToPaise = (rupees) => Math.round(Number(rupees) * 100);
export const paiseToRupees = (paise) => (typeof paise === 'number' ? Math.round(paise / 100) : 0);

export const productService = {
  /**
   * Fetch catalog products with server-side pagination, search & filters
   */
  async getProducts(params = {}) {
    const cleanParams = {};

    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
    if (params.search?.trim()) cleanParams.search = params.search.trim();
    if (params.category && params.category !== 'ALL') cleanParams.category = params.category;
    if (params.inStockOnly) cleanParams.inStockOnly = true;
    if (params.includeArchived) cleanParams.includeArchived = true;
    if (params.sort) cleanParams.sort = params.sort;

    const res = await api.get('/admin/products', { params: cleanParams });
    return res.data?.data || { products: [], pagination: { total: 0, page: 1, limit: 12, pages: 1 } };
  },

  /**
   * Fetch single product details by MongoDB ID
   */
  async getProductById(id) {
    const res = await api.get(`/admin/products/${id}`);
    return res.data?.data?.product || res.data?.data || null;
  },

  /**
   * Create a new product
   */
  async createProduct(payload) {
    const res = await api.post('/admin/products', payload);
    return res.data?.data?.product || res.data?.data;
  },

  /**
   * Upload an image to Cloudinary (or fallback) via backend
   */
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data?.data; // returns { url, publicId }
  },

  /**
   * Delete uploaded image
   */
  async deleteImage(publicId) {
    const res = await api.delete('/admin/upload', { data: { publicId } });
    return res.data;
  },

  /**
   * Update an existing product
   */
  async updateProduct(id, payload) {
    const res = await api.patch(`/admin/products/${id}`, payload);
    return res.data?.data?.product || res.data?.data;
  },

  /**
   * Quick update for inventory stock quantity
   */
  async updateStock(id, newStock) {
    const stockInt = Math.max(0, parseInt(newStock, 10) || 0);
    const res = await api.patch(`/admin/products/${id}`, {
      availableStock: stockInt
    });
    return res.data?.data?.product || res.data?.data;
  },

  /**
   * Bulk price modification for multiple selected products.
   * Supports percentage adjustment (e.g., +10%, -5%) or flat rupee change (+₹100, -₹50).
   */
  async bulkPriceUpdate({ productList = [], type = 'percentage', value = 0, applyToCompareAt = false }) {
    if (!productList || productList.length === 0) {
      throw new Error('No products selected for bulk price adjustment.');
    }

    const numericVal = parseFloat(value);
    if (isNaN(numericVal) || numericVal === 0) {
      throw new Error('Please enter a valid non-zero price adjustment value.');
    }

    const results = {
      total: productList.length,
      successCount: 0,
      failedCount: 0,
      errors: []
    };

    for (const prod of productList) {
      try {
        const currentSellingPaise = prod.sellingPrice || 0;
        let newSellingPaise = currentSellingPaise;

        if (type === 'percentage') {
          const factor = 1 + numericVal / 100;
          newSellingPaise = Math.max(100, Math.round(currentSellingPaise * factor));
        } else {
          // Flat in rupees
          const deltaPaise = rupeesToPaise(numericVal);
          newSellingPaise = Math.max(100, currentSellingPaise + deltaPaise);
        }

        const updateData = {
          sellingPrice: newSellingPaise
        };

        // If compare-at price exists and new price exceeds it, adjust compare-at price
        if (prod.compareAtPrice && prod.compareAtPrice < newSellingPaise) {
          updateData.compareAtPrice = newSellingPaise;
        }

        await api.patch(`/admin/products/${prod._id}`, updateData);
        results.successCount++;
      } catch (err) {
        results.failedCount++;
        results.errors.push(`${prod.sku}: ${err.response?.data?.message || err.message}`);
      }
    }

    return results;
  },

  /**
   * Delete or archive a product.
   * If the product has orders, backend automatically soft-archives it safely.
   */
  async deleteProduct(id) {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },

  /**
   * Bulk archive multiple selected products
   */
  async bulkArchiveProducts(productList = []) {
    const results = {
      total: productList.length,
      successCount: 0,
      failedCount: 0,
      errors: []
    };

    for (const prod of productList) {
      try {
        await api.delete(`/admin/products/${prod._id}`);
        results.successCount++;
      } catch (err) {
        results.failedCount++;
        results.errors.push(`${prod.sku}: ${err.response?.data?.message || err.message}`);
      }
    }

    return results;
  },

  /**
   * Generate CSV content for exporting products
   */
  generateExportCSV(products = []) {
    const headers = [
      'SKU',
      'Title',
      'Slug',
      'Category',
      'Selling Price (INR)',
      'Compare At Price (INR)',
      'Cost Price (INR)',
      'Available Stock',
      'Reserved Stock',
      'Weight (Grams)',
      'Active Status',
      'Archived Status',
      'Created At'
    ];

    const rows = products.map((p) => [
      `"${p.sku}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.slug || ''}"`,
      `"${p.category || 'Remote Control Cars'}"`,
      paiseToRupees(p.sellingPrice),
      p.compareAtPrice ? paiseToRupees(p.compareAtPrice) : 'N/A',
      p.costPrice ? paiseToRupees(p.costPrice) : 'N/A',
      p.availableStock ?? 0,
      p.reservedStock ?? 0,
      p.weightGrams ?? 0,
      p.isActive ? 'ACTIVE' : 'INACTIVE',
      p.isArchived ? 'ARCHIVED' : 'NO',
      p.createdAt ? p.createdAt.slice(0, 10) : ''
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
};

export default productService;
