import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import analyticsService from '../../services/analyticsService';
import { getErrorMessage } from '../../services/api';
import AnalyticsHeaderToolbar from '../../components/analytics/AnalyticsHeaderToolbar';
import AnalyticsKpiCards from '../../components/analytics/AnalyticsKpiCards';
import WeeklyRevenueVelocityChart from '../../components/analytics/WeeklyRevenueVelocityChart';
import CategoriesMarginsPanel from '../../components/analytics/CategoriesMarginsPanel';
import StateRevenueShareCard from '../../components/analytics/StateRevenueShareCard';
import CarrierSlaSpeedCard from '../../components/analytics/CarrierSlaSpeedCard';
import PrepaidCodSplitCard from '../../components/analytics/PrepaidCodSplitCard';
import SkuVelocityTable from '../../components/analytics/SkuVelocityTable';
import BisSafetyAuditPanel from '../../components/analytics/BisSafetyAuditPanel';
import GstExportModal from '../../components/analytics/GstExportModal';
import ExecutiveDigestModal from '../../components/analytics/ExecutiveDigestModal';

export const AnalyticsPage = () => {
  const { systemStatus, setBadges } = useOutletContext() || {};

  const [timeframe, setTimeframe] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [gstModalOpen, setGstModalOpen] = useState(false);
  const [digestModalOpen, setDigestModalOpen] = useState(false);

  // Fetch executive analytics telemetry
  const loadAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const overview = await analyticsService.getExecutiveOverview(timeframe);
      setData(overview);

      // Keep layout badge counters updated
      if (overview?.kpis && setBadges) {
        setBadges((prev) => ({
          ...prev,
          pendingOrders: overview.kpis.pendingOrdersCount || prev?.pendingOrders || 0
        }));
      }
    } catch (err) {
      console.error('Failed to load analytics telemetry:', err);
      setError(
        getErrorMessage(
          err,
          'Could not synchronize executive analytics data. The backend server may be waking up.'
        )
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeframe, setBadges]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Full CSV Export Handler
  const handleExportFullCsv = () => {
    if (!data) return;
    try {
      const exportResult = analyticsService.generateFullReportCSV(data);
      const blob = new Blob([exportResult.data], { type: `${exportResult.mimeType};charset=utf-8;` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', exportResult.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err.message || 'Failed to export full analytics CSV.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header & Action Toolbar */}
      <AnalyticsHeaderToolbar
        timeframe={timeframe}
        onTimeframeChange={(tf) => setTimeframe(tf)}
        isRefreshing={refreshing}
        onRefresh={() => loadAnalytics(true)}
        lastUpdated={data?.lastUpdated}
        isRealTime={data?.isRealTime ?? true}
        onOpenGstModal={() => setGstModalOpen(true)}
        onExportFullCsv={handleExportFullCsv}
        onOpenDigestModal={() => setDigestModalOpen(true)}
      />

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-[#FF5638] text-white border-2 border-ink shadow-[3px_3px_0px_#171717] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadAnalytics(true)}
            className="self-start sm:self-auto brutal-btn bg-white text-ink text-xs px-3 py-1 font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            RETRY SYNC
          </button>
        </div>
      )}

      {/* 2. Five KPI Cards Row */}
      <AnalyticsKpiCards kpis={data?.kpis} isLoading={loading} />

      {/* 3. Main Row: Weekly Revenue Chart (2 cols) & Categories Panel (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="lg:col-span-2">
          <WeeklyRevenueVelocityChart
            weeklyData={data?.weeklyChart || []}
            timeframe={timeframe}
            isLoading={loading}
          />
        </div>
        <div>
          <CategoriesMarginsPanel
            categories={data?.categories || []}
            overallMarginPercent={data?.kpis?.overallMarginPercent}
            isLoading={loading}
          />
        </div>
      </div>

      {/* 4. Three Secondary Cards: State Share, Carrier SLA, Prepaid/COD Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        <StateRevenueShareCard states={data?.states || []} isLoading={loading} />
        <CarrierSlaSpeedCard
          carrierMetrics={data?.carrierMetrics || {}}
          isLoading={loading}
        />
        <PrepaidCodSplitCard
          paymentSplit={data?.paymentSplit || {}}
          isLoading={loading}
        />
      </div>

      {/* 5. Full-Width SKU Velocity & Catalog Table */}
      <SkuVelocityTable skuList={data?.skuVelocity || []} isLoading={loading} />

      {/* 6. BIS IS-9873 Indian Toy Safety & Quality Audit Panel */}
      <BisSafetyAuditPanel bisCompliance={data?.bisCompliance || {}} />

      {/* Modals */}
      <GstExportModal
        isOpen={gstModalOpen}
        onClose={() => setGstModalOpen(false)}
        data={data || {}}
      />

      <ExecutiveDigestModal
        isOpen={digestModalOpen}
        onClose={() => setDigestModalOpen(false)}
        data={data || {}}
      />
    </div>
  );
};

export default AnalyticsPage;
