import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ShipmentsPagination({
  pagination = { total: 0, page: 1, limit: 20, pages: 1 },
  onPageChange,
  onLimitChange
}) {
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
    <div className="bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_#000] p-3 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
      {/* Left: Visible range & Rows per page */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-neutral-700">
          Showing <span className="font-bold text-neutral-900">{start}</span> -{' '}
          <span className="font-bold text-neutral-900">{end}</span> of{' '}
          <span className="font-bold text-neutral-900">{total}</span> shipments
        </span>

        <span className="text-neutral-400 hidden sm:inline">|</span>

        <div className="flex items-center gap-1.5 text-neutral-700">
          <span>Rows:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-[#F7F3EB] border border-neutral-900 px-2 py-1 font-bold text-neutral-900 focus:outline-none"
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
          className="p-1.5 bg-[#F7F3EB] hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-[#F7F3EB] border border-neutral-900 text-neutral-900 font-bold transition-colors"
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
                ? 'bg-[#315FE8] text-white border-neutral-900 shadow-[1px_1px_0px_#000]'
                : 'bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300'
            }`}
          >
            {num}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-1.5 bg-[#F7F3EB] hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-[#F7F3EB] border border-neutral-900 text-neutral-900 font-bold transition-colors"
          title="Next Page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
