import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { customerService } from '../../services/customerService';
import api from '../../services/api';

// Components
import CustomersHeaderToolbar from '../../components/customers/CustomersHeaderToolbar';
import CustomersKpiCards from '../../components/customers/CustomersKpiCards';
import PlayClubTierArchitecture from '../../components/customers/PlayClubTierArchitecture';
import CustomersFilterToolbar from '../../components/customers/CustomersFilterToolbar';
import CustomersTable from '../../components/customers/CustomersTable';
import CustomerDetailDrawer from '../../components/customers/CustomerDetailDrawer';
import AddCustomerModal from '../../components/customers/AddCustomerModal';
import LoyaltyTierRulesModal from '../../components/customers/LoyaltyTierRulesModal';
import CustomersBottomPanels from '../../components/customers/CustomersBottomPanels';
import OrdersPagination from '../../components/orders/OrdersPagination';

export const CustomersPage = () => {
  const { setBadges } = useOutletContext() || {};

  // State
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });
  const [customerSpendMap, setCustomerSpendMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals & Drawer
  const [activeCustomerForDrawer, setActiveCustomerForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isTierRulesOpen, setIsTierRulesOpen] = useState(false);

  const notify = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === msg ? null : curr));
    }, 5000);
  };

  // Fetch customers & spend analytics
  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      // Fetch customers
      const res = await customerService.getCustomers({ page, limit, search });
      const fetchedCustomers = res.customers || [];
      setCustomers(fetchedCustomers);
      setPagination(res.pagination || { total: fetchedCustomers.length, page, limit, pages: 1 });

      // Fetch orders to calculate real customer lifetime spend
      try {
        const ordersRes = await api.get('/admin/orders', { params: { limit: 100 } });
        const orders = ordersRes.data?.data?.orders || [];
        const spendMap = {};
        orders.forEach((o) => {
          const uId = o.userId?._id || o.userId;
          if (uId && o.paymentStatus === 'paid') {
            const amountRupees = o.finalAmount ? Math.round(o.finalAmount / 100) : 0;
            spendMap[uId] = (spendMap[uId] || 0) + amountRupees;
          }
        });
        setCustomerSpendMap(spendMap);
      } catch (e) {
        // spend map remains empty if orders endpoint fails
      }

    } catch (err) {
      setError(err.message || 'Failed to load customer directory.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived filtered & sorted list
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Tier Filter
    if (selectedTier !== 'ALL') {
      result = result.filter((c) => {
        const spend = customerSpendMap[c._id] || 0;
        const tier = customerService.getTierFromSpend(spend);
        return tier.id === selectedTier;
      });
    }

    // Status Filter
    if (selectedStatus !== 'ALL') {
      result = result.filter((c) => (c.accountStatus || 'active') === selectedStatus);
    }

    // Sorting
    if (sortBy === 'spend_desc') {
      result.sort((a, b) => (customerSpendMap[b._id] || 0) - (customerSpendMap[a._id] || 0));
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else {
      // Newest
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [customers, selectedTier, selectedStatus, sortBy, customerSpendMap]);

  // Derived Metrics
  const activeCount = customers.filter((c) => (c.accountStatus || 'active') === 'active').length;
  const totalSpendRupees = Object.values(customerSpendMap).reduce((sum, val) => sum + val, 0);
  const totalPoints = Math.floor(totalSpendRupees / 10);

  const tierCounts = useMemo(() => {
    const counts = { tier_1: 0, tier_2: 0, tier_3: 0 };
    customers.forEach((c) => {
      const spend = customerSpendMap[c._id] || 0;
      const t = customerService.getTierFromSpend(spend);
      counts[t.id] = (counts[t.id] || 0) + 1;
    });
    return counts;
  }, [customers, customerSpendMap]);

  // Status Toggle
  const handleToggleStatus = async (customer) => {
    const newStatus = customer.accountStatus === 'suspended' ? 'active' : 'suspended';
    const actionVerb = newStatus === 'active' ? 'Reactivate' : 'Suspend';
    
    if (!window.confirm(`${actionVerb} account for ${customer.name || customer.email}?`)) {
      return;
    }

    try {
      await customerService.updateCustomerStatus(customer._id, newStatus);
      notify(`Customer ${customer.name || customer.email} is now ${newStatus}.`);
      loadData(true);
    } catch (err) {
      notify(err.message || 'Failed to update account status.', 'error');
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;

    if (action === 'EXPORT') {
      const selected = customers.filter((c) => selectedIds.includes(c._id));
      customerService.exportCustomersCSV(selected);
      notify(`Exported ${selected.length} customer profiles to CSV.`);
      return;
    }

    if (action === 'ACTIVATE' || action === 'SUSPEND') {
      const newStatus = action === 'ACTIVATE' ? 'active' : 'suspended';
      if (!window.confirm(`Are you sure you want to ${newStatus} ${selectedIds.length} customer accounts?`)) {
        return;
      }

      try {
        for (const id of selectedIds) {
          await customerService.updateCustomerStatus(id, newStatus);
        }
        notify(`Successfully updated ${selectedIds.length} accounts to ${newStatus}.`);
        setSelectedIds([]);
        loadData(true);
      } catch (err) {
        notify(err.message || 'Failed to execute bulk update.', 'error');
      }
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedTier('ALL');
    setSelectedStatus('ALL');
    setSortBy('newest');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || selectedTier !== 'ALL' || selectedStatus !== 'ALL' || sortBy !== 'newest');

  return (
    <div className="space-y-6 pb-12 font-sans text-neutral-900">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 border-4 border-neutral-900 shadow-[6px_6px_0px_#000] font-mono text-xs flex items-center justify-between gap-4 max-w-md ${
          notification.type === 'error' ? 'bg-[#FF5638] text-white' : 'bg-[#FFD983] text-neutral-900'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-neutral-900" />}
            <span className="font-bold">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:bg-black/10">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Command Bar */}
      <CustomersHeaderToolbar
        onExportCSV={() => customerService.exportCustomersCSV(filteredCustomers)}
        onOpenTierRules={() => setIsTierRulesOpen(true)}
        onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
        onRefresh={() => loadData(true)}
        refreshing={refreshing}
        totalCustomers={pagination.total || customers.length}
      />

      {/* 4 KPI Cards */}
      <CustomersKpiCards
        totalCustomers={pagination.total || customers.length}
        activeCustomers={activeCount}
        totalSpendRupees={totalSpendRupees}
        totalPoints={totalPoints}
        loading={loading}
      />

      {/* Play Club Loyalty Tier Architecture */}
      <PlayClubTierArchitecture
        tierCounts={tierCounts}
        totalCustomers={customers.length}
        onOpenTierRules={() => setIsTierRulesOpen(true)}
      />

      {/* Filters & Bulk Toolbar */}
      <CustomersFilterToolbar
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        selectedTier={selectedTier}
        onTierChange={(val) => { setSelectedTier(val); setPage(1); }}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => { setSelectedStatus(val); setPage(1); }}
        sortBy={sortBy}
        onSortChange={(val) => setSortBy(val)}
        onResetFilters={handleResetFilters}
        totalFiltered={filteredCustomers.length}
        hasActiveFilters={hasActiveFilters}
        selectedCount={selectedIds.length}
        onBulkAction={handleBulkAction}
      />

      {/* Error Notice */}
      {error && (
        <div className="p-4 bg-red-100 border-2 border-red-600 text-red-900 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadData(true)}
            className="px-3 py-1 bg-white border border-red-900 font-bold hover:bg-neutral-100"
          >
            RETRY
          </button>
        </div>
      )}

      {/* Customer Directory Table */}
      <CustomersTable
        customers={filteredCustomers}
        loading={loading}
        selectedIds={selectedIds}
        onSelectId={(id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))}
        onSelectAll={() => setSelectedIds(selectedIds.length === filteredCustomers.length ? [] : filteredCustomers.map((c) => c._id))}
        onViewDossier={(c) => {
          setActiveCustomerForDrawer(c);
          setIsDrawerOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        customerSpendMap={customerSpendMap}
      />

      {/* Pagination */}
      <OrdersPagination
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
        onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
      />

      {/* Bottom Operations Panels */}
      <CustomersBottomPanels />

      {/* Slide-Over Dossier Drawer */}
      <CustomerDetailDrawer
        customer={activeCustomerForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setActiveCustomerForDrawer(null);
        }}
        onToggleStatus={(c) => {
          handleToggleStatus(c);
          setIsDrawerOpen(false);
        }}
        spendRupees={activeCustomerForDrawer ? customerSpendMap[activeCustomerForDrawer._id] || 0 : 0}
      />

      {/* Add Offline Parent Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSuccess={() => loadData(true)}
      />

      {/* Loyalty Tier Rules Modal */}
      <LoyaltyTierRulesModal
        isOpen={isTierRulesOpen}
        onClose={() => setIsTierRulesOpen(false)}
      />

    </div>
  );
};

export default CustomersPage;
