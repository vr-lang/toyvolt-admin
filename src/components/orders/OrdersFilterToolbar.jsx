import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Filter, Calendar, CreditCard, Banknote, X } from 'lucide-react';

export const OrdersFilterToolbar = ({
  search = '',
  paymentStatus = 'all',
  paymentMethod = 'all',
  dateRange = 'all',
  onSearchChange,
  onPaymentStatusChange,
  onPaymentMethodChange,
  onDateRangeChange,
  onResetFilters
}) => {
  const [searchInput, setSearchInput] = useState(search);

  // Sync internal search state if parent resets it
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce search input
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
    paymentStatus !== 'all' ||
    paymentMethod !== 'all' ||
    dateRange !== 'all';

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-3 md:p-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search input (col-span-4 on desktop) */}
        <div className="lg:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Order ID, Customer, Phone..."
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

        {/* Payment Status Dropdown (col-span-2) */}
        <div className="lg:col-span-2">
          <select
            value={paymentStatus}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-2.5 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">PAID</option>
            <option value="pending">PENDING</option>
            <option value="failed">FAILED</option>
            <option value="refunded">REFUNDED</option>
          </select>
        </div>

        {/* Payment Method Dropdown (col-span-2) */}
        <div className="lg:col-span-2">
          <select
            value={paymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-2.5 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
          >
            <option value="all">All Payment Methods</option>
            <option value="razorpay">Prepaid (Razorpay)</option>
            <option value="cod">Cash on Delivery (COD)</option>
          </select>
        </div>

        {/* Date Range Dropdown (col-span-2) */}
        <div className="lg:col-span-2">
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full bg-[#FAF8F5] border-2 border-[#171717] px-2.5 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="thismonth">This Month</option>
          </select>
        </div>

        {/* Reset button (col-span-2) */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            className={`w-full py-2 px-3 text-xs font-mono font-bold uppercase border-2 flex items-center justify-center gap-1.5 transition-all ${
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

export default OrdersFilterToolbar;
