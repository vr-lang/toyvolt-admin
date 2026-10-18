import React from 'react';
import { Search, X, Filter, RotateCcw, ShieldAlert, CheckSquare } from 'lucide-react';

export default function CustomersFilterToolbar({
  search = '',
  onSearchChange,
  selectedTier = 'ALL',
  onTierChange,
  selectedStatus = 'ALL',
  onStatusChange,
  sortBy = 'newest',
  onSortChange,
  onResetFilters,
  totalFiltered = 0,
  hasActiveFilters = false,
  selectedCount = 0,
  onBulkAction
}) {
  return (
    <div className="bg-white border-3 border-neutral-900 shadow-[4px_4px_0px_#000] p-4 font-mono space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search parent by name, email or phone..."
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

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          
          {/* Tier Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-bold">TIER:</span>
            <select
              value={selectedTier}
              onChange={(e) => onTierChange(e.target.value)}
              className="p-1.5 bg-[#F7F3EB] border border-neutral-900 font-bold text-neutral-900 focus:outline-none"
            >
              <option value="ALL">ALL TIERS</option>
              <option value="tier_1">TOY CADET</option>
              <option value="tier_2">MASTER BUILDER</option>
              <option value="tier_3">PLAYROOM VIP</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-bold">STATUS:</span>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="p-1.5 bg-[#F7F3EB] border border-neutral-900 font-bold text-neutral-900 focus:outline-none"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="active">ACTIVE</option>
              <option value="suspended">SUSPENDED</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 font-bold">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="p-1.5 bg-[#F7F3EB] border border-neutral-900 font-bold text-neutral-900 focus:outline-none"
            >
              <option value="newest">NEWEST JOINED</option>
              <option value="spend_desc">LIFETIME SPEND &darr;</option>
              <option value="name_asc">NAME (A-Z)</option>
            </select>
          </div>

          {/* Reset Filters */}
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

        </div>

      </div>

      {/* Quick Segment Chips & Bulk Action */}
      <div className="pt-2 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Quick Segment Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-neutral-500 uppercase font-bold mr-1">QUICK VIEWS:</span>
          
          <button
            onClick={() => { onTierChange('ALL'); onStatusChange('ALL'); }}
            className={`px-2 py-0.5 border text-[11px] font-bold ${
              selectedTier === 'ALL' && selectedStatus === 'ALL'
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-[#F7F3EB] text-neutral-800 border-neutral-300 hover:border-neutral-900'
            }`}
          >
            ALL PARENTS
          </button>

          <button
            onClick={() => { onTierChange('tier_2'); onStatusChange('ALL'); }}
            className={`px-2 py-0.5 border text-[11px] font-bold ${
              selectedTier === 'tier_2'
                ? 'bg-[#FFD983] text-neutral-900 border-neutral-900'
                : 'bg-[#F7F3EB] text-neutral-800 border-neutral-300 hover:border-neutral-900'
            }`}
          >
            BUILDERS
          </button>

          <button
            onClick={() => { onTierChange('tier_3'); onStatusChange('ALL'); }}
            className={`px-2 py-0.5 border text-[11px] font-bold ${
              selectedTier === 'tier_3'
                ? 'bg-[#FF5638] text-white border-neutral-900'
                : 'bg-[#F7F3EB] text-neutral-800 border-neutral-300 hover:border-neutral-900'
            }`}
          >
            VIP LEGENDS
          </button>

          <button
            onClick={() => { onStatusChange('suspended'); }}
            className={`px-2 py-0.5 border text-[11px] font-bold ${
              selectedStatus === 'suspended'
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-[#F7F3EB] text-neutral-800 border-neutral-300 hover:border-neutral-900'
            }`}
          >
            SUSPENDED ONLY
          </button>
        </div>

        {/* Bulk Action & Results Count */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-neutral-500">
            Found <strong className="text-neutral-900">{totalFiltered}</strong> profiles
          </span>

          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-[#FFD983] px-2 py-0.5 border border-neutral-900">
                {selectedCount} SELECTED
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onBulkAction(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="p-1 bg-white border border-neutral-900 text-[11px] font-bold text-neutral-900"
              >
                <option value="">BULK ACTION...</option>
                <option value="EXPORT">EXPORT SELECTED</option>
                <option value="ACTIVATE">ACTIVATE ACCOUNTS</option>
                <option value="SUSPEND">SUSPEND ACCOUNTS</option>
              </select>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
