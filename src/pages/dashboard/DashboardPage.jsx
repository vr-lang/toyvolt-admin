import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Download,
  Plus,
  RefreshCw,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { dashboardService } from '../../services/adminService';
import { getErrorMessage } from '../../services/api';
import { downloadCSV, formatDateIST } from '../../utils/formatters';
import OperationalAlertBanner from '../../components/dashboard/OperationalAlertBanner';
import KpiCardsGrid from '../../components/dashboard/KpiCardsGrid';
import RevenueVelocityChart from '../../components/dashboard/RevenueVelocityChart';
import WarehouseFastActions from '../../components/dashboard/WarehouseFastActions';
import OrderFeedTable from '../../components/dashboard/OrderFeedTable';
import TopProductsPanel from '../../components/dashboard/TopProductsPanel';
import SystemAlertsPanel from '../../components/dashboard/SystemAlertsPanel';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { systemStatus, setBadges } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [metrics, setMetrics] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedDateRange, setSelectedDateRange] = useState('30d');

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [dashData, prodsData] = await Promise.all([
        dashboardService.getDashboardMetrics(),
        dashboardService.getProducts({ limit: 10 }).catch(() => null)
      ]);

      if (dashData) {
        setMetrics(dashData.metrics || null);
        setLowStockProducts(dashData.lowStockProducts || []);
        setRecentOrders(dashData.recentOrders || []);
        setDailySales(dashData.dailySales || []);

        // Update layout badges
        setBadges?.({
          lowStock: dashData.lowStockProducts?.length || dashData.metrics?.lowStockCount || 0,
          pendingOrders: dashData.metrics?.pendingOrders || 0
        });
      }

      if (prodsData?.products) {
        setProducts(prodsData.products);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Could not fetch dashboard operational data.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setBadges]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Export report of actual verified orders and catalog
  const handleExportReport = () => {
    if (!recentOrders || recentOrders.length === 0) {
      alert('No verified order transactions available to export yet.');
      return;
    }

    const headers = ['Order Number', 'Date', 'Customer Name', 'City', 'Amount (Paise)', 'Payment Status', 'Order Status'];
    const rows = recentOrders.map((ord) => [
      ord.orderNumber || ord._id,
      formatDateIST(ord.createdAt),
      `"${ord.shippingAddress?.fullName || 'Customer'}"`,
      `"${ord.shippingAddress?.city || 'India'}"`,
      ord.finalAmount || 0,
      ord.paymentStatus || 'pending',
      ord.orderStatus || 'placed'
    ]);

    const csvData = [headers, ...rows];
    downloadCSV(`toyvolt-orders-report-${new Date().toISOString().slice(0, 10)}.csv`, csvData);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 4.A Operational Alert Banner */}
      <OperationalAlertBanner
        healthData={systemStatus?.healthData}
        isOnline={systemStatus?.isOnline}
        isChecking={systemStatus?.isChecking}
      />

      {/* 4.B Dashboard Heading & Top Operational Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b-2 border-ink">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#315FE8] tracking-widest">
              MISSION CONTROL // OPERATIONAL DISPATCH
            </span>
            {refreshing && (
              <span className="font-mono text-[10px] text-[#6E6E6E] uppercase animate-pulse">
                [SYNCING...]
              </span>
            )}
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tighter text-ink leading-none">
            STORE CONTROL <span className="text-[#6E6E6E] font-normal">//</span> COMMAND CENTER
          </h1>
          <p className="font-mono text-xs text-[#6E6E6E] mt-1.5 max-w-2xl">
            Monitor store performance, orders, fulfillment, and inventory from one place.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          {/* Refresh sync button */}
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="brutal-btn bg-white hover:bg-[#FFF9F0] text-ink text-xs px-3 py-2 flex items-center gap-1.5"
            title="Refresh dashboard metrics from backend API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#315FE8]' : ''}`} />
            <span className="hidden sm:inline">SYNC</span>
          </button>

          {/* Date Range Selector */}
          <div className="flex items-center border-2 border-ink bg-white shadow-[2.5px_2.5px_0px_#171717] px-2 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-ink mr-1.5 shrink-0" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-transparent font-mono text-xs font-bold text-ink uppercase focus:outline-none cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Export Report Action */}
          <button
            type="button"
            onClick={handleExportReport}
            className="brutal-btn bg-white hover:bg-[#FFF9F0] text-ink text-xs px-3 py-2 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-ink" />
            <span className="hidden sm:inline">EXPORT REPORT</span>
          </button>

          {/* Primary Action: Add New Product */}
          <button
            type="button"
            onClick={() => navigate('/products/new')}
            className="brutal-btn brutal-btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD PRODUCT</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner if API connection fails */}
      {error && (
        <div className="p-3.5 bg-[#FF5638] text-white border-2 border-ink shadow-[3px_3px_0px_#171717] font-mono text-xs flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            className="underline font-bold uppercase ml-4"
          >
            RETRY
          </button>
        </div>
      )}

      {/* 4.C KPI Cards Grid */}
      <KpiCardsGrid
        metrics={metrics}
        lowStockCount={lowStockProducts.length || metrics?.lowStockCount || 0}
        isLoading={loading}
      />

      {/* 4.D Revenue Velocity Chart */}
      <RevenueVelocityChart
        dailySales={dailySales}
        isLoading={loading}
      />

      {/* Mid Split: Fast Actions & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4.E Warehouse Fast Actions */}
        <WarehouseFastActions
          lowStockCount={lowStockProducts.length || metrics?.lowStockCount || 0}
        />

        {/* 4.H Urgent System Alerts */}
        <SystemAlertsPanel
          lowStockProducts={lowStockProducts}
          pendingOrdersCount={metrics?.pendingOrders || 0}
          healthData={systemStatus?.healthData}
        />
      </div>

      {/* 4.F Real-Time Order Feed Table */}
      <OrderFeedTable
        orders={recentOrders}
        isLoading={loading}
      />

      {/* 4.G Top Products Panel */}
      <TopProductsPanel
        products={products.length > 0 ? products : lowStockProducts}
        isLoading={loading}
      />
    </div>
  );
};

export default DashboardPage;
