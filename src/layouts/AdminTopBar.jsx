import React, { useState, useRef, useEffect } from 'react';
import {
  ExternalLink,
  Bell,
  Menu,
  User,
  LogOut,
  ShieldCheck,
  Check,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { getTodayFormatted } from '../utils/formatters';
import StatusBadge from '../components/common/StatusBadge';

export const AdminTopBar = ({
  onOpenMobileMenu,
  systemStatus,
  notificationCount = null,
  notifications = []
}) => {
  const { adminUser, logout } = useAdminAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173';
  const todayDate = getTodayFormatted();

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOnline = systemStatus?.isOnline;

  return (
    <header className="h-14 bg-panel border-b-2 border-ink px-3 sm:px-5 flex items-center justify-between shrink-0 select-none">
      {/* Left: Mobile hamburger & Mission Control Label */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 border-2 border-ink bg-[#FFF9F0] shadow-[2px_2px_0px_#171717] hover:bg-[#F0EEEE]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4 text-ink" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-tight text-ink">
            TOYVOLT <span className="text-[#6E6E6E] font-normal">//</span> STORE CONTROL CENTER
          </span>

          {/* Store status indicator distinguishing verified connectivity */}
          <div className="hidden sm:inline-flex">
            <StatusBadge
              variant={isOnline === true ? 'success' : isOnline === false ? 'danger' : 'neutral'}
              dot
              size="sm"
            >
              {isOnline === true ? (
                <span className="flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5" /> API CONNECTED
                </span>
              ) : isOnline === false ? (
                <span className="flex items-center gap-1">
                  <WifiOff className="w-2.5 h-2.5" /> DISCONNECTED
                </span>
              ) : (
                'CHECKING API...'
              )}
            </StatusBadge>
          </div>
        </div>
      </div>

      {/* Right Utility Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Today's Date */}
        <div className="hidden md:flex items-center px-2 py-1 bg-[#F0EEEE] border border-ink shadow-[1px_1px_0px_#171717] font-mono text-[10px] font-bold text-ink uppercase">
          {todayDate}
        </div>

        {/* Currency Indicator */}
        <div className="hidden sm:flex items-center px-2 py-1 bg-[#FFF9F0] border border-ink shadow-[1px_1px_0px_#171717] font-mono text-[10px] font-bold text-ink uppercase">
          INR ₹
        </div>

        {/* Live Storefront Link */}
        <a
          href={storefrontUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-btn bg-white hover:bg-[#FFF9F0] text-ink text-[11px] px-2.5 py-1 flex items-center gap-1.5 font-bold"
          title="Open customer-facing Toyvolt storefront in a new window"
        >
          <span className="hidden sm:inline">LIVE STORE</span>
          <ExternalLink className="w-3 h-3 text-[#315FE8]" />
        </a>

        {/* Notifications Icon (No fabricated counts) */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-1.5 border-2 border-ink bg-white shadow-[2px_2px_0px_#171717] hover:bg-[#FFF9F0] relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-ink" />
            {notificationCount !== null && notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5638] text-white border border-ink font-mono text-[9px] font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-panel border-2 border-ink shadow-[4px_4px_0px_#171717] p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-ink">
                <span className="font-display font-bold text-xs uppercase text-ink">
                  NOTIFICATIONS
                </span>
                <span className="font-mono text-[9px] text-[#6E6E6E] uppercase">
                  OPERATIONAL
                </span>
              </div>
              {notifications.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="p-2 border border-ink bg-[#FFF9F0] font-mono text-[11px]"
                    >
                      {n.text}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center font-mono text-xs text-[#6E6E6E]">
                  No unread alerts or operational notifications.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 border-2 border-ink bg-[#315FE8] text-white shadow-[2px_2px_0px_#171717] hover:bg-[#244BC2] transition-colors"
          >
            <div className="w-5 h-5 bg-white text-ink flex items-center justify-center font-bold text-[10px] font-mono border border-ink">
              {adminUser?.name?.[0] || 'A'}
            </div>
            <span className="hidden sm:inline font-display text-xs font-bold uppercase truncate max-w-[100px]">
              {adminUser?.name || 'ADMIN'}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-panel border-2 border-ink shadow-[4px_4px_0px_#171717] z-50 divide-y-2 divide-ink">
              <div className="p-3 bg-[#FFF9F0]">
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#315FE8]" />
                  <span className="font-display font-bold text-xs uppercase text-ink">
                    SUPERADMIN ACCESS
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-ink truncate">
                  {adminUser?.name || 'Administrator'}
                </div>
                <div className="font-mono text-[11px] text-[#6E6E6E] truncate">
                  {adminUser?.email || 'admin@toyvolt.com'}
                </div>
              </div>

              <div className="p-2 font-mono text-[11px] text-[#6E6E6E] bg-white space-y-1">
                <div>Role: <strong className="text-ink uppercase">{adminUser?.role || 'admin'}</strong></div>
                <div>Status: <strong className="text-[#15803D]">VERIFIED OPERATOR</strong></div>
              </div>

              <div className="p-2 bg-[#F0EEEE]">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full brutal-btn bg-[#FF5638] text-white hover:bg-[#D9381E] text-xs py-1.5 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> SIGN OUT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
