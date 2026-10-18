import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Filter, Calendar, Truck, AlertTriangle, X } from 'lucide-react';

export const ShipmentsFilterToolbar = ({
  search = '',
  status,
  selectedStatus,
  courier,
  selectedCourier,
  ndrOnly = false,
  dateRange = 'all',
  couriersList = [],
  onSearchChange,
  onStatusChange,
  onCourierChange,
  onNdrOnlyToggle,
  onToggleNdrOnly,
  onDateRangeChange,
  onResetFilters
}) => {
  const currentStatus = status || selectedStatus || 'all';
  const currentCourier = courier || selectedCourier || 'all';
  const toggleNdr = onNdrOnlyToggle || onToggleNdrOnly;
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== search) {
        onSearchChange(searchInput);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput, search, onSearchChange]);

  const hasActiveFilters =
    Boolean(search) ||
    (currentStatus && currentStatus.toLowerCase() !== 'all') ||
    (currentCourier && currentCourier.toLowerCase() !== 'all') ||
    Boolean(ndrOnly) ||
    dateRange !== 'all';

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-3 md:p-4 mb-4 font-mono text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search input (col-span-4) */}
        <div className="lg:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Filter AWB, Order ID, PIN, Mobile..."
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] pl-9 pr-8 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                onSearchChange('');
              }}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-[#171717]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Courier Dropdown (col-span-2) */}
        <div className="lg:col-span-2">
          <select
            value={currentCourier}
            onChange={(e) => onCourierChange(e.target.value)}
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-2.5 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
          >
            <option value="all">All Couriers</option>
            <option value="bluedart">BlueDart Express</option>
            <option value="delhivery">Delhivery Surface</option>
            <option value="xpressbees">Xpressbees</option>
            {couriersList.map((c) => (
              <option key={c.courierName} value={c.courierName}>
                {c.courierName}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown (col-span-2) */}
        <div className="lg:col-span-2">
          <select
            value={currentStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-2.5 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
          >
            <option value="all">All Telemetry Statuses</option>
            <option value="PENDING_BOOKING">AWAITING BOOKING</option>
            <option value="CREATED">CREATED / PENDING</option>
            <option value="AWB_ASSIGNED">AWB ASSIGNED</option>
            <option value="PICKUP_SCHEDULED">PICKUP SCHEDULED</option>
            <option value="PICKED_UP">PICKED UP</option>
            <option value="IN_TRANSIT">IN TRANSIT</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="NDR">NDR EXCEPTION</option>
            <option value="RTO_INITIATED">RTO INITIATED</option>
          </select>
        </div>

        {/* NDR Only Toggle Button (col-span-2) */}
        <div className="lg:col-span-2">
          <button
            type="button"
            onClick={toggleNdr}
            className={`w-full py-2 px-2.5 text-xs font-bold uppercase border-2 flex items-center justify-center gap-1.5 transition-all ${
              ndrOnly
                ? 'bg-[#FF5638] text-white border-[#171717] shadow-[2px_2px_0px_#171717]'
                : 'bg-[#FAF8F5] hover:bg-gray-200 text-[#171717] border-[#171717]'
            }`}
          >
            <AlertTriangle size={13} className={ndrOnly ? 'text-white' : 'text-[#FF5638]'} />
            <span>NDR CASES ONLY</span>
          </button>
        </div>

        {/* Reset button (col-span-2) */}
        <div className="lg:col-span-2">
          <button
            type="button"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            className={`w-full py-2 px-3 text-xs font-bold uppercase border-2 flex items-center justify-center gap-1.5 transition-all ${
              hasActiveFilters
                ? 'bg-[#FAF8F5] hover:bg-gray-200 text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] cursor-pointer'
                : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentsFilterToolbar;
