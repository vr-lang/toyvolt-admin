import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  PlusCircle,
  ShoppingBag,
  Truck,
  Users,
  TicketPercent,
  Star,
  X
} from 'lucide-react';
import ToyvoltLogo from '../components/common/ToyvoltLogo';

export const navigationGroups = [
  {
    title: 'CORE',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 }
    ]
  },
  {
    title: 'CATALOG & INVENTORY',
    items: [
      { name: 'Products', path: '/products', icon: Package },
      { name: 'Add New Product', path: '/products/new', icon: PlusCircle }
    ]
  },
  {
    title: 'FULFILLMENT',
    items: [
      {
        name: 'Orders',
        path: '/orders',
        icon: ShoppingBag,
        badgeKey: 'pendingOrders'
      },
      {
        name: 'Shipments & Carrier Dispatch',
        path: '/shipments',
        icon: Truck,
        badgeKey: 'shipments'
      }
    ]
  },
  {
    title: 'CUSTOMERS & GROWTH',
    items: [
      { name: 'Customer Directory', path: '/customers', icon: Users },
      { name: 'Coupons & Promos', path: '/promotions', icon: TicketPercent },
      { name: 'Parent Reviews', path: '/reviews', icon: Star }
    ]
  },
  {
    title: 'SYSTEM',
    // Unimplemented pages (Settings, Integrations) are excluded; empty group is hidden automatically
    items: []
  }
];

export const AdminSidebar = ({
  badges = {},
  onCloseMobile,
  isMobile = false
}) => {
  const location = useLocation();

  return (
    <aside className="w-[240px] shrink-0 bg-panel border-r-2 border-ink flex flex-col justify-between h-full select-none">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Brand Header */}
        <div className="p-4 border-b-2 border-ink bg-[#FFF9F0] flex items-center justify-between">
          <ToyvoltLogo />
          {isMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 border border-ink bg-white shadow-[1px_1px_0px_#171717] hover:bg-[#F0EEEE]"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-ink" />
            </button>
          )}
        </div>

        {/* Navigation Groups - Automatically hides groups with 0 implemented items */}
        <nav className="p-3 space-y-4 flex-1">
          {navigationGroups
            .filter((group) => group.items && group.items.length > 0)
            .map((group) => (
              <div key={group.title}>
                <div className="px-2 mb-1.5 font-mono text-[9px] uppercase font-bold text-[#6E6E6E] tracking-widest">
                  {group.title}
                </div>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const badgeValue = item.badgeKey ? badges[item.badgeKey] : null;
                    const isAliasActive =
                      (item.path === '/promotions' && location.pathname === '/coupons') ||
                      (item.path === '/reviews' && location.pathname === '/parent-reviews');

                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          end={item.path === '/products'}
                          onClick={isMobile ? onCloseMobile : undefined}
                          className={({ isActive: navActive }) => {
                            const isActive = navActive || isAliasActive;
                            return `group flex items-center justify-between px-2.5 py-1.5 text-xs font-display font-bold uppercase transition-all duration-100 ${
                              isActive
                                ? 'bg-[#315FE8] text-white border-2 border-ink shadow-[2.5px_2.5px_0px_#171717]'
                                : 'text-ink hover:bg-[#FFF9F0] hover:translate-x-0.5 border border-transparent'
                            }`;
                          }}
                        >
                          {({ isActive: navActive }) => {
                            const isActive = navActive || isAliasActive;
                            return (
                              <>
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <Icon
                                    className={`w-4 h-4 shrink-0 ${
                                      isActive ? 'text-white' : 'text-ink/80 group-hover:text-ink'
                                    }`}
                                  />
                                  <span className="truncate">{item.name}</span>
                                </div>

                                {/* Optional badge when actual backend count exists */}
                                {badgeValue !== null && badgeValue !== undefined && badgeValue > 0 && (
                                  <span
                                    className={`ml-2 px-1.5 py-0.2 font-mono text-[9px] font-bold border border-ink shadow-[1px_1px_0px_#171717] ${
                                      isActive
                                        ? 'bg-[#FF5638] text-white'
                                        : 'bg-[#FFD983] text-ink'
                                    }`}
                                  >
                                    {badgeValue}
                                  </span>
                                )}
                              </>
                            );
                          }}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </nav>

        {/* Footer info strip */}
        <div className="p-3 border-t-2 border-ink bg-[#F0EEEE] font-mono text-[10px] text-[#6E6E6E] flex items-center justify-between">
          <span className="uppercase">IND REGION // DEL</span>
          <span className="font-bold text-ink">NODE: ACTIVE</span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
