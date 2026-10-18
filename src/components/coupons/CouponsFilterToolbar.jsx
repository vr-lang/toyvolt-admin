import React from 'react';
import { Search, X, RotateCcw, Filter } from 'lucide-react';

export const COUPON_STATUS_TABS = [
  { id: 'ALL', label: 'ALL COUPONS' },
  { id: 'ACTIVE', label: 'ACTIVE' },
  { id: 'SCHEDULED', label: 'SCHEDULED' },
  { id: 'EXPIRED', label: 'EXPIRED' },
  { id: 'PAUSED', label: 'PAUSED / DRAFTS' }
];

export default function CouponsFilterToolbar({
  activeTab = 'ALL',
  onTabChange,
  tabCounts = {},
  search = '',
  onSearchChange,
  discountType = 'ALL',
  onDiscountTypeChange,
  sortBy = 'newest',
  onSortChange,
  onResetFilters,
  hasActiveFilters = false,
  totalFiltered = 0
}) {
  return (
    <div className="bg-white border-3 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 font-mono space-y-3">
      
      {/* Status Tabs Strip */}
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b-2 border-neutral-200">
        {COUPON_STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tabCounts[tab.id] ?? 0;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 border-2 text-xs font-black transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-[2px_2px_0px_#000] translate-x-0.5 translate-y-0.5'
                  : 'bg-[#F7F3EB] text-neutral-800 border-neutral-300 hover:border-neutral-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 border ${
                isActive ? 'bg-[#FFD983] text-neutral-900 border-neutral-900' : 'bg-white text-neutral-600 border-neutral-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code or campaign description..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#F7F3EB] border-2 border-neutral-900 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-bold">TYPE:</span>
            <select
              value={discountType}
              onChange={(e) => onDiscountTypeChange(e.target.value)}
              className="p-1.5 bg-[#F7F3EB] border border-neutral-900 font-bold text-neutral-900 focus:outline-none"
            >
              <option value="ALL">ALL TYPES</option>
              <option value="flat">FLAT (₹ OFF)</option>
              <option value="percentage">PERCENTAGE (% OFF)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-bold">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="p-1.5 bg-[#F7F3EB] border border-neutral-900 font-bold text-neutral-900 focus:outline-none"
            >
              <option value="newest">NEWEST FIRST</option>
              <option value="most_used">MOST CLAIMED &darr;</option>
              <option value="expiring_soon">EXPIRING SOON</option>
              <option value="code_asc">CODE (A-Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-1.5 border border-neutral-900 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold flex items-center gap-1"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          )}

          <span className="text-[11px] text-neutral-500 ml-auto lg:ml-2">
            Showing <strong className="text-neutral-900">{totalFiltered}</strong> coupons
          </span>

        </div>

      </div>

    </div>
  );
}
