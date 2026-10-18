import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Boxes,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { formatCurrencyINR, formatNumber, downloadCSV } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import analyticsService from '../../services/analyticsService';

export const SkuVelocityTable = ({
  skuList = [],
  isLoading = false,
  onExportTable
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortField, setSortField] = useState('unitsSold');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Extract unique categories
  const categoriesList = useMemo(() => {
    const set = new Set();
    skuList.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [skuList]);

  // Filter & Search
  const filteredSkus = useMemo(() => {
    return skuList.filter((item) => {
      const matchSearch =
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [skuList, searchTerm, selectedCategory]);

  // Sorting
  const sortedSkus = useMemo(() => {
    return [...filteredSkus].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === null || valA === undefined) valA = -999999;
      if (valB === null || valB === undefined) valB = -999999;

      if (typeof valA === 'string') {
        return sortAsc
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [filteredSkus, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedSkus.length / pageSize));
  const paginatedSkus = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedSkus.slice(start, start + pageSize);
  }, [sortedSkus, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExport = () => {
    const exportResult = analyticsService.generateSkuTableCSV(sortedSkus);
    const blob = new Blob([exportResult.data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', exportResult.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-panel border-2 border-ink shadow-[3.5px_3.5px_0px_#171717] p-4 sm:p-5">
      {/* Title & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-4 border-b-2 border-ink gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#DCE5FF] border border-ink flex items-center justify-center shadow-[1px_1px_0px_#171717]">
            <Boxes className="w-3.5 h-3.5 text-[#315FE8]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-ink">
              TOP PERFORMING SKUS &amp; STOCK VELOCITY
            </h2>
            <span className="font-mono text-[10px] text-[#6E6E6E] uppercase">
              Unit sales, GMV contribution, gross margin &amp; runout projection
            </span>
          </div>
        </div>

        {/* Search, Filter, Export Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[160px] sm:min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6E6E6E]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="FILTER SKU / TITLE..."
              className="w-full pl-8 pr-2 py-1 brutal-input font-mono text-xs uppercase"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border-2 border-ink bg-white font-mono text-xs uppercase px-2 py-1 shadow-[2px_2px_0px_#171717] focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL CATEGORIES</option>
            {categoriesList.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Export Table CSV Button */}
          <button
            type="button"
            onClick={handleExport}
            className="brutal-btn bg-white hover:bg-[#F0EEEE] text-ink text-xs px-2.5 py-1 flex items-center gap-1.5 shadow-[2px_2px_0px_#171717]"
            title="Download SKU Velocity Table as CSV"
          >
            <Download className="w-3 h-3 text-[#315FE8]" />
            <span className="font-mono text-[11px] font-bold">EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Table Canvas with Responsive Horizontal Scrolling */}
      <div className="overflow-x-auto border-2 border-ink">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FFF9F0] border-b-2 border-ink font-mono text-[11px] font-bold text-ink uppercase tracking-wider select-none">
              <th className="py-2.5 px-3 border-r border-ink/30 cursor-pointer hover:bg-[#F0EEEE]" onClick={() => handleSort('sku')}>
                <div className="flex items-center justify-between">
                  <span>SKU / MODEL</span>
                  <ArrowUpDown className="w-3 h-3 text-[#6E6E6E]" />
                </div>
              </th>
              <th className="py-2.5 px-3 border-r border-ink/30">
                PRODUCT TITLE &amp; CATEGORY
              </th>
              <th className="py-2.5 px-3 border-r border-ink/30 cursor-pointer hover:bg-[#F0EEEE] text-right" onClick={() => handleSort('unitsSold')}>
                <div className="flex items-center justify-end gap-1">
                  <span>UNITS SOLD</span>
                  <ArrowUpDown className="w-3 h-3 text-[#6E6E6E]" />
                </div>
              </th>
              <th className="py-2.5 px-3 border-r border-ink/30 cursor-pointer hover:bg-[#F0EEEE] text-right" onClick={() => handleSort('gmvRupees')}>
                <div className="flex items-center justify-end gap-1">
                  <span>GROSS GMV</span>
                  <ArrowUpDown className="w-3 h-3 text-[#6E6E6E]" />
                </div>
              </th>
              <th className="py-2.5 px-3 border-r border-ink/30 cursor-pointer hover:bg-[#F0EEEE] text-right" onClick={() => handleSort('marginPercent')}>
                <div className="flex items-center justify-end gap-1">
                  <span>NET MARGIN</span>
                  <ArrowUpDown className="w-3 h-3 text-[#6E6E6E]" />
                </div>
              </th>
              <th className="py-2.5 px-3 border-r border-ink/30 text-right">
                RETURN RATE
              </th>
              <th className="py-2.5 px-3 text-right">
                STOCK DAYS LEFT
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/20 font-mono text-xs bg-white">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="py-4 px-3 bg-[#F7F3EB]/60">
                    <div className="h-4 bg-[#F0EEEE] w-3/4" />
                  </td>
                </tr>
              ))
            ) : paginatedSkus.length > 0 ? (
              paginatedSkus.map((item, idx) => {
                const isOutOfStock = item.availableStock === 0;
                const isLowStock = item.availableStock > 0 && item.availableStock <= 10;

                return (
                  <tr
                    key={idx}
                    className="hover:bg-[#FFF9F0]/80 transition-colors"
                  >
                    {/* 1. SKU / Model */}
                    <td className="py-2.5 px-3 border-r border-ink/20 font-bold text-ink">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#DCE5FF] text-[#171717] px-1.5 py-0.5 border border-ink text-[11px] font-black">
                          {item.sku}
                        </span>
                      </div>
                    </td>

                    {/* 2. Product Title & Category */}
                    <td className="py-2.5 px-3 border-r border-ink/20 max-w-[280px]">
                      <div className="font-sans font-bold text-xs text-ink truncate" title={item.name}>
                        {item.name}
                      </div>
                      <div className="font-mono text-[10px] text-[#6E6E6E] truncate">
                        {item.category}
                      </div>
                    </td>

                    {/* 3. Units Sold */}
                    <td className="py-2.5 px-3 border-r border-ink/20 text-right font-bold text-ink">
                      {formatNumber(item.unitsSold)}
                    </td>

                    {/* 4. Gross GMV */}
                    <td className="py-2.5 px-3 border-r border-ink/20 text-right font-black text-[#315FE8]">
                      {formatCurrencyINR(item.gmvRupees)}
                    </td>

                    {/* 5. Net Margin */}
                    <td className="py-2.5 px-3 border-r border-ink/20 text-right">
                      {item.marginPercent !== null ? (
                        <span className="text-emerald-700 font-bold bg-white px-1 py-0.5 border border-ink inline-block">
                          {item.marginPercent}%
                        </span>
                      ) : (
                        <span className="text-[#6E6E6E] italic text-[11px]">
                          Cost N/A
                        </span>
                      )}
                    </td>

                    {/* 6. Return Rate */}
                    <td className="py-2.5 px-3 border-r border-ink/20 text-right">
                      <span className="text-ink">
                        {item.returnRate !== null ? `${item.returnRate}%` : '0.0%'}
                      </span>
                    </td>

                    {/* 7. Stock Days Left */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          {isOutOfStock ? (
                            <StatusBadge variant="danger" size="sm">
                              OUT OF STOCK
                            </StatusBadge>
                          ) : isLowStock ? (
                            <StatusBadge variant="warning" size="sm">
                              LOW ({item.availableStock})
                            </StatusBadge>
                          ) : (
                            <span className="font-bold text-ink">
                              {item.availableStock} Units
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#6E6E6E] mt-0.5">
                          {item.stockDaysLeft !== null
                            ? `~${item.stockDaysLeft} Days Remaining`
                            : item.unitsSold === 0
                            ? 'Low Sales Velocity'
                            : 'Stock Sufficient'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#6E6E6E]">
                  <Package className="w-8 h-8 mx-auto mb-2 text-[#6E6E6E]" />
                  <p className="font-bold">NO SKU MATCHES FOUND</p>
                  <p className="text-[11px] mt-0.5">Try adjusting search term or category filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 mt-3 border-t border-ink/15 font-mono text-xs">
        <div className="text-[#6E6E6E] text-[11px]">
          Showing {paginatedSkus.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, sortedSkus.length)} of {sortedSkus.length} catalog SKU{sortedSkus.length === 1 ? '' : 's'}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 border border-ink bg-white hover:bg-[#F0EEEE] disabled:opacity-40 disabled:cursor-not-allowed shadow-[1px_1px_0px_#171717]"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 font-bold text-ink">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 border border-ink bg-white hover:bg-[#F0EEEE] disabled:opacity-40 disabled:cursor-not-allowed shadow-[1px_1px_0px_#171717]"
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkuVelocityTable;
