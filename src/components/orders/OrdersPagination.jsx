import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const OrdersPagination = ({
  pagination = { total: 0, page: 1, limit: 20, pages: 1 },
  onPageChange,
  onLimitChange
}) => {
  const { total = 0, page = 1, limit = 20, pages = 1 } = pagination;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);

  // Calculate page number buttons to show
  const getPageNumbers = () => {
    const list = [];
    const maxButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = Math.min(pages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      list.push(i);
    }
    return list;
  };

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-3 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
      {/* Left: Visible range & Rows per page */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-gray-700">
          Showing <span className="font-bold text-[#171717]">{start}</span> -{' '}
          <span className="font-bold text-[#171717]">{end}</span> of{' '}
          <span className="font-bold text-[#171717]">{total}</span> orders
        </span>

        <span className="text-gray-400 hidden sm:inline">|</span>

        <div className="flex items-center gap-1.5 text-gray-700">
          <span>Rows:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-[#FAF8F5] border border-[#171717] px-2 py-1 font-bold text-[#171717] focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Right: Previous, Next, and Page Numbers */}
      <div className="flex items-center gap-1 self-end sm:self-center">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 bg-[#FAF8F5] hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-[#FAF8F5] border border-[#171717] text-[#171717] font-bold"
          title="Previous Page"
        >
          <ChevronLeft size={14} />
        </button>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onPageChange(num)}
            className={`min-w-[28px] h-7 px-1.5 text-xs font-bold border transition-colors ${
              num === page
                ? 'bg-[#315FE8] text-white border-[#171717]'
                : 'bg-white hover:bg-gray-100 text-[#171717] border-gray-300'
            }`}
          >
            {num}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-1.5 bg-[#FAF8F5] hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-[#FAF8F5] border border-[#171717] text-[#171717] font-bold"
          title="Next Page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default OrdersPagination;
