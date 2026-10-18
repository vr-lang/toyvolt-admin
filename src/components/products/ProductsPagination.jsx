import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductsPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}) => {
  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="bg-panel border-2 border-ink shadow-[2.5px_2.5px_0px_#171717] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
      {/* Range Info & Page Size */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[#6E6E6E] text-[11px]">
          Showing <strong className="text-ink">{startItem}</strong> to{' '}
          <strong className="text-ink">{endItem}</strong> of{' '}
          <strong className="text-ink">{totalItems}</strong> master SKU{totalItems === 1 ? '' : 's'}
        </span>

        <div className="flex items-center gap-1.5 text-[11px] text-[#6E6E6E]">
          <span>Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-ink bg-white font-mono text-xs font-bold px-1.5 py-0.5 focus:outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 border border-ink bg-white hover:bg-[#F0EEEE] disabled:opacity-40 disabled:cursor-not-allowed shadow-[1px_1px_0px_#171717]"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            if (totalPages <= 7) return true;
            return (
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1
            );
          })
          .map((page, idx, arr) => {
            const prevPage = arr[idx - 1];
            const hasGap = prevPage && page - prevPage > 1;

            return (
              <React.Fragment key={page}>
                {hasGap && <span className="px-1 text-[#6E6E6E]">...</span>}
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`min-w-[28px] h-[28px] font-mono text-xs font-bold border border-ink flex items-center justify-center transition-all ${
                    currentPage === page
                      ? 'bg-[#315FE8] text-white shadow-[1px_1px_0px_#171717]'
                      : 'bg-white text-ink hover:bg-[#F0EEEE]'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 border border-ink bg-white hover:bg-[#F0EEEE] disabled:opacity-40 disabled:cursor-not-allowed shadow-[1px_1px_0px_#171717]"
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ProductsPagination;
