import api from './api';

// Helper for currency conversion from paise to rupees
const toRupees = (paise) => (typeof paise === 'number' ? Math.round(paise / 100) : 0);

// Standard Indian State Codes and Names Mapping
const INDIAN_STATES = {
  UP: 'Uttar Pradesh',
  DL: 'Delhi',
  MH: 'Maharashtra',
  KA: 'Karnataka',
  HR: 'Haryana',
  TN: 'Tamil Nadu',
  GJ: 'Gujarat',
  WB: 'West Bengal',
  RJ: 'Rajasthan',
  MP: 'Madhya Pradesh',
  TG: 'Telangana',
  AP: 'Andhra Pradesh',
  KL: 'Kerala',
  PB: 'Punjab',
  UK: 'Uttarakhand',
  UT: 'Uttarakhand',
  BR: 'Bihar',
  JH: 'Jharkhand',
  CH: 'Chandigarh',
  GA: 'Goa',
  AS: 'Assam',
  OR: 'Odisha',
  OD: 'Odisha'
};

const resolveStateName = (inputState = '') => {
  if (!inputState) return 'Other / Unassigned';
  const clean = inputState.trim();
  const upper = clean.toUpperCase();
  if (INDIAN_STATES[upper]) return INDIAN_STATES[upper];
  // Check if value matches any state name
  for (const [code, name] of Object.entries(INDIAN_STATES)) {
    if (name.toLowerCase() === clean.toLowerCase()) {
      return name;
    }
  }
  return clean;
};

const resolveStateCode = (inputState = '') => {
  if (!inputState) return 'IND';
  const clean = inputState.trim().toUpperCase();
  if (INDIAN_STATES[clean]) return clean;
  for (const [code, name] of Object.entries(INDIAN_STATES)) {
    if (name.toUpperCase() === clean) return code;
  }
  return clean.slice(0, 3);
};

export const analyticsService = {
  /**
   * Fetches the complete executive analytics dataset for the chosen timeframe.
   * If the backend provides GET /admin/analytics/overview, it is used directly.
   * Otherwise, aggregates transparently from verified backend resources:
   * orders, products, shipments, and dashboard endpoints.
   */
  async getExecutiveOverview(timeframe = '30d') {
    // 1. Try dedicated backend endpoint if implemented
    try {
      const res = await api.get('/admin/analytics/overview', { params: { timeframe } });
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      // 404 means the dedicated endpoint is not yet mounted on the remote server.
      // Fall through to client-side aggregation of real backend datasets.
      if (err.response && err.response.status !== 404) {
        console.warn('Backend overview endpoint returned non-404 error, falling back:', err.message);
      }
    }

    // 2. Fetch all verified primary datasets in parallel
    const [ordersRes, productsRes, shipmentsRes, salesRes] = await Promise.all([
      api.get('/admin/orders', { params: { limit: 250 } }).catch(() => ({ data: { data: { orders: [] } } })),
      api.get('/admin/products', { params: { limit: 100 } }).catch(() => ({ data: { data: { products: [] } } })),
      api.get('/admin/shipments', { params: { limit: 100 } }).catch(() => ({ data: { data: { shipments: [] } } })),
      api.get('/admin/analytics/sales', { params: { timeframe } }).catch(() => ({ data: { data: {} } }))
    ]);

    const allOrders = ordersRes.data?.data?.orders || [];
    const allProducts = productsRes.data?.data?.products || [];
    const allShipments = shipmentsRes.data?.data?.shipments || [];
    const salesSummary = salesRes.data?.data || {};

    // 3. Filter orders based on timeframe window
    const now = new Date();
    let windowStartDate = null;
    let timeframeDays = 30;

    if (timeframe === '7d') {
      windowStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeframeDays = 7;
    } else if (timeframe === '30d') {
      windowStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeframeDays = 30;
    } else if (timeframe === '90d') {
      windowStartDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      timeframeDays = 90;
    } else {
      // 'all'
      windowStartDate = new Date(0);
      timeframeDays = 365;
    }

    const filteredOrders = allOrders.filter((order) => {
      if (!windowStartDate) return true;
      const orderDate = new Date(order.createdAt);
      return !isNaN(orderDate.getTime()) && orderDate >= windowStartDate;
    });

    // 4. Product Lookup Map (SKU & ID)
    const productMap = new Map();
    for (const p of allProducts) {
      if (p.sku) productMap.set(p.sku, p);
      if (p._id) productMap.set(String(p._id), p);
    }

    // 5. Compute KPI Metrics
    let gmvPaise = 0;
    let realizedRevenuePaise = 0;
    let totalDiscountPaise = 0;
    let paidOrdersCount = 0;
    let pendingOrdersCount = 0;
    let cancelledOrdersCount = 0;
    let deliveredOrdersCount = 0;
    let shippedOrdersCount = 0;
    const uniqueCustomerIds = new Set();

    let totalCogsPaise = 0;
    let totalRevenueWithCostPaise = 0;

    const stateMap = new Map();
    const categoryMap = new Map();
    const skuSalesMap = new Map();
    const weeklyBucketsMap = new Map();

    let prepaidOrdersCount = 0;
    let codOrdersCount = 0;
    let prepaidAmountPaise = 0;
    let codAmountPaise = 0;
    let codDeliveredOrPaidCount = 0;

    for (const order of filteredOrders) {
      const finalAmount = order.finalAmount || 0;
      gmvPaise += finalAmount;
      totalDiscountPaise += order.discountAmount || 0;

      if (order.userId?._id || order.userId) {
        uniqueCustomerIds.add(String(order.userId._id || order.userId));
      }

      const isPaid = order.paymentStatus === 'paid';
      if (isPaid) {
        realizedRevenuePaise += finalAmount;
        paidOrdersCount++;
      } else {
        pendingOrdersCount++;
      }

      if (order.orderStatus === 'delivered') deliveredOrdersCount++;
      else if (order.orderStatus === 'shipped') shippedOrdersCount++;
      else if (order.orderStatus === 'cancelled') cancelledOrdersCount++;

      // Payment Method Split
      const isCod = order.paymentMethod === 'cod';
      if (isCod) {
        codOrdersCount++;
        codAmountPaise += finalAmount;
        if (isPaid || order.orderStatus === 'delivered') {
          codDeliveredOrPaidCount++;
        }
      } else {
        prepaidOrdersCount++;
        prepaidAmountPaise += finalAmount;
      }

      // State breakdown
      const rawState = order.shippingAddress?.state || 'Other';
      const stateName = resolveStateName(rawState);
      const stateCode = resolveStateCode(rawState);
      const existingState = stateMap.get(stateName) || {
        state: stateName,
        code: stateCode,
        orders: 0,
        amountPaise: 0
      };
      existingState.orders += 1;
      existingState.amountPaise += finalAmount;
      stateMap.set(stateName, existingState);

      // Line Items breakdown (Category, SKU, Margin)
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          const itemQty = item.quantity || 1;
          const itemTotal = item.total || (item.unitPrice || 0) * itemQty;
          const prod = productMap.get(item.sku) || productMap.get(String(item.productId));

          // Category
          const category = prod?.category || 'Remote Control Cars';
          const existingCat = categoryMap.get(category) || {
            name: category,
            gmvPaise: 0,
            units: 0,
            costPaise: 0,
            hasCost: false
          };
          existingCat.gmvPaise += itemTotal;
          existingCat.units += itemQty;

          if (prod?.costPrice) {
            existingCat.costPaise += prod.costPrice * itemQty;
            existingCat.hasCost = true;
            totalCogsPaise += prod.costPrice * itemQty;
            totalRevenueWithCostPaise += itemTotal;
          }
          categoryMap.set(category, existingCat);

          // SKU Velocity
          const sku = item.sku || prod?.sku || 'UNKNOWN-SKU';
          const existingSku = skuSalesMap.get(sku) || {
            sku,
            name: item.name || prod?.name || sku,
            category,
            unitsSold: 0,
            gmvPaise: 0,
            costPricePaise: prod?.costPrice || null,
            sellingPricePaise: prod?.sellingPrice || item.unitPrice || 0,
            availableStock: prod?.availableStock ?? 0,
            returnsCount: 0
          };
          existingSku.unitsSold += itemQty;
          existingSku.gmvPaise += itemTotal;
          if (order.orderStatus === 'cancelled') {
            existingSku.returnsCount += itemQty;
          }
          skuSalesMap.set(sku, existingSku);
        }
      }

      // Weekly cadence grouping
      const orderDate = new Date(order.createdAt);
      if (!isNaN(orderDate.getTime())) {
        // Group by 7-day calendar window
        const startOfWeek = new Date(orderDate);
        startOfWeek.setHours(0, 0, 0, 0);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
        startOfWeek.setDate(diff);
        const weekKey = startOfWeek.toISOString().slice(0, 10);

        const existingWeek = weeklyBucketsMap.get(weekKey) || {
          weekStart: startOfWeek,
          dateLabel: `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('en-IN', { month: 'short' })}`,
          websiteGmvPaise: 0,
          websitePaidPaise: 0,
          orders: 0
        };
        existingWeek.websiteGmvPaise += finalAmount;
        if (isPaid) existingWeek.websitePaidPaise += finalAmount;
        existingWeek.orders += 1;
        weeklyBucketsMap.set(weekKey, existingWeek);
      }
    }

    // Include unsold products in SKU map so operator can view all catalog velocity
    for (const prod of allProducts) {
      if (prod.sku && !skuSalesMap.has(prod.sku)) {
        skuSalesMap.set(prod.sku, {
          sku: prod.sku,
          name: prod.name,
          category: prod.category || 'Remote Control Cars',
          unitsSold: 0,
          gmvPaise: 0,
          costPricePaise: prod.costPrice || null,
          sellingPricePaise: prod.sellingPrice || 0,
          availableStock: prod.availableStock ?? 0,
          returnsCount: 0
        });
      }
    }

    // Gross margin calculation
    const overallMarginPercent =
      totalRevenueWithCostPaise > 0
        ? Math.round(((totalRevenueWithCostPaise - totalCogsPaise) / totalRevenueWithCostPaise) * 1000) / 10
        : null;

    // Categories array with percentages
    const categories = Array.from(categoryMap.values()).map((c) => {
      const gmvRupees = toRupees(c.gmvPaise);
      const sharePercent = gmvPaise > 0 ? Math.round((c.gmvPaise / gmvPaise) * 1000) / 10 : 0;
      const marginPercent =
        c.hasCost && c.gmvPaise > 0
          ? Math.round(((c.gmvPaise - c.costPaise) / c.gmvPaise) * 1000) / 10
          : null;
      return {
        name: c.name,
        gmvPaise: c.gmvPaise,
        gmvRupees,
        unitsSold: c.units,
        sharePercent,
        marginPercent
      };
    });

    // State Revenue Share array sorted descending
    const states = Array.from(stateMap.values())
      .map((s) => ({
        state: s.state,
        stateCode: s.code,
        revenuePaise: s.amountPaise,
        revenueRupees: toRupees(s.amountPaise),
        ordersCount: s.orders,
        sharePercent: gmvPaise > 0 ? Math.round((s.amountPaise / gmvPaise) * 1000) / 10 : 0
      }))
      .sort((a, b) => b.revenuePaise - a.revenuePaise);

    // Weekly Revenue Chart Data
    const weeklyChart = Array.from(weeklyBucketsMap.entries())
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([key, w]) => ({
        dateKey: key,
        label: w.dateLabel,
        revenueRupees: toRupees(w.websiteGmvPaise),
        paidRupees: toRupees(w.websitePaidPaise),
        orders: w.orders,
        channel: 'Website Direct'
      }));

    // If weekly data is empty but salesSummary has daily data, use that as fallback
    if (weeklyChart.length === 0 && Array.isArray(salesSummary.dailyData) && salesSummary.dailyData.length > 0) {
      salesSummary.dailyData.forEach((d) => {
        weeklyChart.push({
          dateKey: d.date,
          label: d.date,
          revenueRupees: d.revenueInRupees || toRupees(d.revenue),
          paidRupees: d.revenueInRupees || toRupees(d.revenue),
          orders: d.orders,
          channel: 'Website Direct'
        });
      });
    }

    // SKU Velocity List
    const skuVelocity = Array.from(skuSalesMap.values()).map((item) => {
      const gmvRupees = toRupees(item.gmvPaise);
      const units = item.unitsSold;
      const dailyVelocity = units > 0 ? units / timeframeDays : 0;
      let stockDaysLeft = null;
      if (dailyVelocity > 0 && item.availableStock > 0) {
        stockDaysLeft = Math.round(item.availableStock / dailyVelocity);
      }

      let marginPercent = null;
      if (item.costPricePaise && item.sellingPricePaise > 0) {
        marginPercent =
          Math.round(((item.sellingPricePaise - item.costPricePaise) / item.sellingPricePaise) * 1000) / 10;
      }

      const returnRate = units > 0 ? Math.round((item.returnsCount / units) * 1000) / 10 : 0.0;

      return {
        sku: item.sku,
        name: item.name,
        category: item.category,
        unitsSold: units,
        gmvPaise: item.gmvPaise,
        gmvRupees,
        sellingPriceRupees: toRupees(item.sellingPricePaise),
        costPriceRupees: item.costPricePaise ? toRupees(item.costPricePaise) : null,
        marginPercent,
        returnRate,
        availableStock: item.availableStock,
        stockDaysLeft
      };
    }).sort((a, b) => b.unitsSold - a.unitsSold || b.gmvPaise - a.gmvPaise);

    // Carrier SLA & Logistics
    const carrierMetrics = {
      isIntegrated: allShipments.length > 0,
      totalDispatched: shippedOrdersCount + deliveredOrdersCount,
      inTransitCount: shippedOrdersCount,
      deliveredCount: deliveredOrdersCount,
      activeCourier: allShipments[0]?.courierName || 'Shiprocket (Standby / Direct)',
      avgTransitDays: null, // Calculated only when verified delivery timestamps exist
      onTimeDeliveryRate: null, // Calculated only when verified ETD records exist
      courierBreakdown: []
    };

    // Return final structured intelligence object
    return {
      timeframe,
      timeframeDays,
      lastUpdated: new Date().toISOString(),
      isRealTime: true,
      kpis: {
        gmvPaise,
        gmvRupees: toRupees(gmvPaise),
        gmvGrowthPercent: null, // First operating period baseline
        realizedRevenuePaise,
        realizedRevenueRupees: toRupees(realizedRevenuePaise),
        totalOrders: filteredOrders.length,
        paidOrdersCount,
        pendingOrdersCount,
        dispatchedCount: shippedOrdersCount + deliveredOrdersCount,
        inFlightCount: shippedOrdersCount,
        deliveredCount: deliveredOrdersCount,
        rtoCount: cancelledOrdersCount,
        rtoRatePercent:
          filteredOrders.length > 0
            ? Math.round((cancelledOrdersCount / filteredOrders.length) * 1000) / 10
            : 0.0,
        transitDamageRate: null, // Not flagged in courier API
        cacRupees: null, // Marketing ad accounts unlinked
        ltvRupees:
          uniqueCustomerIds.size > 0
            ? Math.round(toRupees(gmvPaise) / uniqueCustomerIds.size)
            : toRupees(gmvPaise),
        cacLtvRatio: null,
        overallMarginPercent,
        totalDeductionsRupees: toRupees(totalDiscountPaise)
      },
      channels: {
        websiteDirectGmvRupees: toRupees(gmvPaise),
        marketplacesConnected: false,
        activeChannels: ['Website Direct (Active)']
      },
      weeklyChart,
      categories,
      states,
      carrierMetrics,
      paymentSplit: {
        totalOrders: filteredOrders.length,
        prepaidOrdersCount,
        codOrdersCount,
        prepaidAmountRupees: toRupees(prepaidAmountPaise),
        codAmountRupees: toRupees(codAmountPaise),
        prepaidPercent:
          filteredOrders.length > 0
            ? Math.round((prepaidOrdersCount / filteredOrders.length) * 1000) / 10
            : 0.0,
        codPercent:
          filteredOrders.length > 0
            ? Math.round((codOrdersCount / filteredOrders.length) * 1000) / 10
            : 0.0,
        codRealizationRate:
          codOrdersCount > 0
            ? Math.round((codDeliveredOrPaidCount / codOrdersCount) * 1000) / 10
            : null
      },
      skuVelocity,
      bisCompliance: {
        isConfigured: false,
        status: 'COMPLIANCE DATA NOT CONFIGURED',
        standard: 'IS 9873 (Indian Toy Safety Standard)',
        parts: [
          {
            part: 'IS 9873 (Part 1)',
            title: 'Mechanical & Physical Properties',
            status: 'Pending Documentation'
          },
          {
            part: 'IS 9873 (Part 2)',
            title: 'Flammability Requirements',
            status: 'Pending Lab Upload'
          },
          {
            part: 'IS 9873 (Part 3)',
            title: 'Migration of Certain Elements',
            status: 'Pending Lab Upload'
          }
        ]
      },
      rawOrders: filteredOrders
    };
  },

  /**
   * Generates official GSTR-1 compliant JSON and CSV files from verified orders.
   * Format adheres to Indian GSTN B2CS (B2C Small Invoices) specification:
   * HSN Code: 9503 (Tricycles, Scooters, Pedal Cars, RC Toys)
   * GST Rate: 18% (9% CGST + 9% SGST or 18% IGST)
   */
  generateGstr1Export(data, format = 'csv') {
    const orders = data.rawOrders || [];
    if (orders.length === 0) {
      throw new Error('No verified order transactions available in selected period to export GSTR-1.');
    }

    if (format === 'json') {
      const gstr1Payload = {
        gstin: '09AABCT1234F1Z5', // Standard GSTIN placeholder for Toyvolt India Pvt Ltd
        fp: new Date().toISOString().slice(0, 7).replace('-', ''), // e.g. "202610"
        version: 'GSTR1_v3.1',
        b2cs: orders.map((ord, idx) => {
          const amountInr = toRupees(ord.finalAmount || 0);
          const taxableValue = Math.round((amountInr / 1.18) * 100) / 100;
          const taxAmount = Math.round((amountInr - taxableValue) * 100) / 100;
          const stateCode = resolveStateCode(ord.shippingAddress?.state || 'UP');

          return {
            sec_nm: 'B2CS',
            pos: stateCode,
            sply_ty: stateCode === 'UP' ? 'INTRA' : 'INTER',
            txval: taxableValue,
            rt: 18.0,
            iamt: stateCode === 'UP' ? 0 : taxAmount,
            camt: stateCode === 'UP' ? Math.round((taxAmount / 2) * 100) / 100 : 0,
            samt: stateCode === 'UP' ? Math.round((taxAmount / 2) * 100) / 100 : 0,
            csamt: 0,
            inv_typ: 'OE',
            orderNumber: ord.orderNumber || `ORD-${idx + 1}`
          };
        })
      };
      return {
        data: JSON.stringify(gstr1Payload, null, 2),
        filename: `toyvolt-gstr1-${new Date().toISOString().slice(0, 10)}.json`,
        mimeType: 'application/json'
      };
    }

    // Default: CSV format
    const headers = [
      'Type',
      'Order Number',
      'Invoice Date',
      'Place of Supply (POS)',
      'Supply Type',
      'HSN / SAC',
      'Invoice Value (INR)',
      'Taxable Value (INR)',
      'Rate (%)',
      'IGST (INR)',
      'CGST (INR)',
      'SGST (INR)',
      'Cess (INR)'
    ];

    const rows = orders.map((ord) => {
      const amountInr = toRupees(ord.finalAmount || 0);
      const taxableValue = Math.round((amountInr / 1.18) * 100) / 100;
      const taxAmount = Math.round((amountInr - taxableValue) * 100) / 100;
      const stateName = resolveStateName(ord.shippingAddress?.state || 'UP');
      const stateCode = resolveStateCode(ord.shippingAddress?.state || 'UP');
      const isIntraState = stateCode === 'UP';

      const igst = isIntraState ? 0 : taxAmount;
      const cgst = isIntraState ? Math.round((taxAmount / 2) * 100) / 100 : 0;
      const sgst = isIntraState ? Math.round((taxAmount / 2) * 100) / 100 : 0;

      return [
        'B2CS',
        `"${ord.orderNumber || ord._id}"`,
        ord.createdAt ? ord.createdAt.slice(0, 10) : '2026-10-13',
        `"${stateCode} - ${stateName}"`,
        isIntraState ? 'INTRA-STATE' : 'INTER-STATE',
        '9503', // HSN for toys
        amountInr,
        taxableValue,
        '18.00',
        igst,
        cgst,
        sgst,
        '0.00'
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return {
      data: csvContent,
      filename: `toyvolt-gstr1-b2cs-${new Date().toISOString().slice(0, 10)}.csv`,
      mimeType: 'text/csv'
    };
  },

  /**
   * Generates full executive report CSV covering all high-level operational metrics.
   */
  generateFullReportCSV(data) {
    const kpis = data.kpis || {};
    const lines = [
      'TOYVOLT EXECUTIVE FINANCIAL & ANALYTICS INTELLIGENCE REPORT',
      `Generated At,${new Date().toISOString()}`,
      `Reporting Window,${data.timeframe.toUpperCase()} (${data.timeframeDays} Days)`,
      `Synchronization Status,Real-Time Live Backend Database`,
      '',
      '--- CORE FINANCIAL KPIS ---',
      `Gross Merchandise Value (GMV),INR ${kpis.gmvRupees}`,
      `Net Realized Revenue,INR ${kpis.realizedRevenueRupees}`,
      `Total Order Volume,${kpis.totalOrders} Orders`,
      `Paid Orders,${kpis.paidOrdersCount}`,
      `Pending / COD In-Flight,${kpis.pendingOrdersCount}`,
      `Portfolio Weighted Gross Margin,${kpis.overallMarginPercent ? `${kpis.overallMarginPercent}%` : 'N/A (Cost data pending)'}`,
      `Dispatched & In-Transit Units,${kpis.dispatchedCount} Dispatched (${kpis.inFlightCount} In-Flight)`,
      `Return-To-Origin (RTO) Rate,${kpis.rtoRatePercent}%`,
      `Customer Acquisition Cost (CAC),N/A (Marketing attribution unlinked)`,
      `Estimated Customer LTV,INR ${kpis.ltvRupees}`,
      '',
      '--- STATE REVENUE BREAKDOWN ---',
      'State Code,State Name,Revenue (INR),Share (%),Orders Count',
      ...(data.states || []).map(
        (s) => `${s.stateCode},"${s.state}",${s.revenueRupees},${s.sharePercent}%,${s.ordersCount}`
      ),
      '',
      '--- PAYMENT METHOD SPLIT ---',
      `Prepaid (Razorpay) Orders,${data.paymentSplit?.prepaidOrdersCount || 0} (${data.paymentSplit?.prepaidPercent || 0}%)`,
      `Prepaid Amount,INR ${data.paymentSplit?.prepaidAmountRupees || 0}`,
      `Cash on Delivery (COD) Orders,${data.paymentSplit?.codOrdersCount || 0} (${data.paymentSplit?.codPercent || 0}%)`,
      `COD Amount,INR ${data.paymentSplit?.codAmountRupees || 0}`,
      `COD Realization Rate,${data.paymentSplit?.codRealizationRate !== null ? `${data.paymentSplit.codRealizationRate}%` : 'Pending Delivery'}`,
      '',
      '--- CATEGORY PERFORMANCE ---',
      'Category Name,GMV (INR),Share (%),Gross Margin (%),Units Sold',
      ...(data.categories || []).map(
        (c) =>
          `"${c.name}",${c.gmvRupees},${c.sharePercent}%,${c.marginPercent ? `${c.marginPercent}%` : 'N/A'},${c.unitsSold}`
      ),
      '',
      '--- SKU VELOCITY ---',
      'SKU,Product Name,Category,Units Sold,GMV (INR),Margin (%),Available Stock,Stock Days Remaining',
      ...(data.skuVelocity || []).map(
        (sku) =>
          `"${sku.sku}","${sku.name}","${sku.category}",${sku.unitsSold},${sku.gmvRupees},${sku.marginPercent ? `${sku.marginPercent}%` : 'N/A'},${sku.availableStock},${sku.stockDaysLeft ?? 'Sufficient / Low Velocity'}`
      )
    ];

    return {
      data: lines.join('\n'),
      filename: `toyvolt-executive-analytics-${new Date().toISOString().slice(0, 10)}.csv`,
      mimeType: 'text/csv'
    };
  },

  /**
   * Generates SKU Velocity Table CSV
   */
  generateSkuTableCSV(skuList = []) {
    const headers = [
      'SKU',
      'Product Name',
      'Category',
      'Units Sold',
      'Gross GMV (INR)',
      'Selling Price (INR)',
      'Cost Price (INR)',
      'Gross Margin (%)',
      'Return Rate (%)',
      'Current Stock',
      'Estimated Days of Stock Left'
    ];

    const rows = skuList.map((item) => [
      `"${item.sku}"`,
      `"${item.name}"`,
      `"${item.category}"`,
      item.unitsSold,
      item.gmvRupees,
      item.sellingPriceRupees,
      item.costPriceRupees ?? 'N/A',
      item.marginPercent !== null ? `${item.marginPercent}%` : 'N/A',
      `${item.returnRate}%`,
      item.availableStock,
      item.stockDaysLeft ?? 'Low Velocity / Sufficient'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return {
      data: csvContent,
      filename: `toyvolt-sku-velocity-${new Date().toISOString().slice(0, 10)}.csv`,
      mimeType: 'text/csv'
    };
  }
};

export default analyticsService;
