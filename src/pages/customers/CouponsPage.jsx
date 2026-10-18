import React, { useState, useEffect, useMemo } from 'react';
import CouponsHeaderToolbar from '../../components/coupons/CouponsHeaderToolbar';
import CouponsKpiCards from '../../components/coupons/CouponsKpiCards';
import FeaturedCampaignPanel from '../../components/coupons/FeaturedCampaignPanel';
import CouponsFilterToolbar from '../../components/coupons/CouponsFilterToolbar';
import CouponsTable from '../../components/coupons/CouponsTable';
import CreateCouponModal from '../../components/coupons/CreateCouponModal';
import FestiveCalendarModal from '../../components/coupons/FestiveCalendarModal';
import CouponsBottomPanels from '../../components/coupons/CouponsBottomPanels';
import { couponService } from '../../services/couponService';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [discountType, setDiscountType] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const fetchCoupons = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await couponService.getCoupons();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load coupons:', err);
      setError('Unable to load promotional coupons from backend. Please verify your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = { ALL: coupons.length, ACTIVE: 0, SCHEDULED: 0, EXPIRED: 0, PAUSED: 0 };
    coupons.forEach((c) => {
      const status = couponService.getCouponLifecycleStatus(c);
      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    });
    return counts;
  }, [coupons]);

  // Featured Campaign (most used or highest priority active)
  const featuredCampaign = useMemo(() => {
    if (!coupons || coupons.length === 0) return null;
    const activeOnes = coupons.filter((c) => couponService.getCouponLifecycleStatus(c) === 'ACTIVE');
    if (activeOnes.length > 0) {
      return [...activeOnes].sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0))[0];
    }
    return coupons[0];
  }, [coupons]);

  // Filtered & Sorted Coupons
  const filteredCoupons = useMemo(() => {
    return coupons
      .filter((c) => {
        // Status Tab
        if (activeTab !== 'ALL') {
          const status = couponService.getCouponLifecycleStatus(c);
          if (status !== activeTab) return false;
        }

        // Discount Type
        if (discountType !== 'ALL' && c.discountType !== discountType) {
          return false;
        }

        // Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const codeMatch = c.code?.toLowerCase().includes(q);
          const descMatch = c.description?.toLowerCase().includes(q);
          if (!codeMatch && !descMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'most_used') {
          return (b.usedCount || 0) - (a.usedCount || 0);
        }
        if (sortBy === 'expiring_soon') {
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        }
        if (sortBy === 'code_asc') {
          return (a.code || '').localeCompare(b.code || '');
        }
        return 0;
      });
  }, [coupons, activeTab, discountType, search, sortBy]);

  // Multi-select handlers
  const handleSelectId = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCoupons.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCoupons.map((c) => c._id));
    }
  };

  // Toggle active status
  const handleToggleStatus = async (coupon) => {
    try {
      await couponService.toggleCouponStatus(coupon._id, coupon.isActive);
      showToast(`Campaign ${coupon.code} ${coupon.isActive ? 'paused' : 'activated'} successfully.`);
      fetchCoupons(true);
    } catch (err) {
      console.error('Failed to toggle status:', err);
      showToast('Error changing campaign status.');
    }
  };

  // Edit Coupon
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsCreateModalOpen(true);
  };

  // Create new
  const handleCreateNew = () => {
    setEditingCoupon(null);
    setIsCreateModalOpen(true);
  };

  // Launch from Festive Playbook
  const handleLaunchTemplate = (preset) => {
    setEditingCoupon({
      code: preset.code,
      description: preset.desc,
      discountType: preset.type,
      discountValue: preset.type === 'flat' ? preset.value * 100 : preset.value,
      minOrderValue: preset.minOrder ? preset.minOrder * 100 : 0,
      maxDiscountValue: preset.maxDiscount ? preset.maxDiscount * 100 : null,
      isActive: true
    });
    setIsCreateModalOpen(true);
  };

  const handleExportCSV = () => {
    couponService.exportCouponsCSV(filteredCoupons);
  };

  const handleResetFilters = () => {
    setActiveTab('ALL');
    setSearch('');
    setDiscountType('ALL');
    setSortBy('newest');
  };

  const hasActiveFilters = activeTab !== 'ALL' || search.trim() !== '' || discountType !== 'ALL' || sortBy !== 'newest';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-neutral-900 bg-[#F7F3EB] min-h-screen">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171717] text-white border-2 border-neutral-900 p-3 shadow-[4px_4px_0px_#000] flex items-center gap-3 font-mono text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-neutral-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Toolbar */}
      <CouponsHeaderToolbar
        onExportCSV={handleExportCSV}
        onOpenFestiveCalendar={() => setIsCalendarModalOpen(true)}
        onOpenCreateCoupon={handleCreateNew}
        onRefresh={() => fetchCoupons(true)}
        refreshing={refreshing}
        totalCoupons={coupons.length}
      />

      {/* Backend / Global Error Notice */}
      {error && (
        <div className="p-4 bg-red-100 border-3 border-red-600 text-red-900 font-mono text-xs flex items-center justify-between shadow-[3px_3px_0px_#000]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-700" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchCoupons(true)}
            className="px-2.5 py-1 bg-white border border-red-900 font-bold hover:bg-red-50 text-[11px]"
          >
            RETRY
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <CouponsKpiCards coupons={coupons} />

      {/* Featured Campaign Highlight Panel */}
      {featuredCampaign && (
        <FeaturedCampaignPanel
          campaign={featuredCampaign}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Filter and Tab Strip */}
      <CouponsFilterToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabCounts={tabCounts}
        search={search}
        onSearchChange={setSearch}
        discountType={discountType}
        onDiscountTypeChange={setDiscountType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        totalFiltered={filteredCoupons.length}
      />

      {/* Table of Promotional Campaigns */}
      <CouponsTable
        coupons={filteredCoupons}
        loading={loading}
        selectedIds={selectedIds}
        onSelectId={handleSelectId}
        onSelectAll={handleSelectAll}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      {/* Bottom Architectural Panels: Cart Rules + Affiliate Attribution */}
      <CouponsBottomPanels />

      {/* Create / Edit Modal */}
      <CreateCouponModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialData={editingCoupon}
        onSuccess={(msg) => {
          showToast(msg);
          fetchCoupons(true);
        }}
      />

      {/* Indian Festive Playbook Modal */}
      <FestiveCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        onLaunchTemplate={handleLaunchTemplate}
      />

    </div>
  );
}
