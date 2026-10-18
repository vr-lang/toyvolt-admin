import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { dashboardService } from '../services/adminService';

export const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badges, setBadges] = useState({});
  const systemStatus = useSystemStatus();

  // Load live counts for sidebar badges
  useEffect(() => {
    let isMounted = true;
    dashboardService
      .getDashboardMetrics()
      .then((data) => {
        if (!isMounted || !data) return;
        setBadges({
          lowStock: data.lowStockProducts?.length || data.metrics?.lowStockCount || 0,
          pendingOrders: data.metrics?.pendingOrders || 0
        });
      })
      .catch(() => {
        // Keep badges empty on unauthorized or cold-start error
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-canvas overflow-hidden">
      {/* Desktop Fixed-Width Sidebar (240px) */}
      <div className="hidden lg:block shrink-0 h-full">
        <AdminSidebar badges={badges} />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[260px] h-full shadow-2xl">
            <AdminSidebar
              badges={badges}
              isMobile
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Utility Bar */}
        <AdminTopBar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          systemStatus={systemStatus}
        />

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <Outlet context={{ systemStatus, badges, setBadges }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
