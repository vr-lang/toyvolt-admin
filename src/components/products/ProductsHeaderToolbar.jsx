import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Tag, FileSpreadsheet, RefreshCw, Layers } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const ProductsHeaderToolbar = ({
  totalCount = 0,
  onOpenBulkPrice,
  onOpenImportExport,
  isRefreshing = false,
  onRefresh
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 pb-2 border-b-2 border-ink">
      {/* Top Row: Breadcrumb & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-ink">
          <span className="text-[#6E6E6E]">ADMIN</span>
          <span className="text-[#6E6E6E]">/</span>
          <span className="text-[#315FE8]">CATALOG</span>
          <span className="text-[#6E6E6E]">/</span>
          <span className="bg-[#DCE5FF] px-1.5 py-0.5 border border-ink">
            PRODUCTS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge variant="info" size="sm">
            <Layers className="w-3 h-3 text-[#315FE8] mr-1" />
            {totalCount} MASTER SKU{totalCount === 1 ? '' : 'S'}
          </StatusBadge>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="brutal-btn bg-white hover:bg-[#FFF9F0] text-ink text-xs px-2.5 py-1 flex items-center gap-1 shadow-[2px_2px_0px_#171717]"
            title="Refresh product catalog from backend database"
          >
            <RefreshCw
              className={`w-3 h-3 text-[#315FE8] ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span className="font-mono text-[10px] font-bold">
              {isRefreshing ? 'SYNCING...' : 'SYNC'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tighter text-ink leading-tight">
            PRODUCTS INVENTORY &amp; CATALOG
          </h1>
          <p className="font-mono text-xs text-[#6E6E6E] mt-1 max-w-2xl">
            Manage toy listings, SKU variants, Indian BIS certification records, pricing, and inventory.
          </p>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Action 1: Bulk Price Update */}
          <button
            type="button"
            onClick={onOpenBulkPrice}
            className="brutal-btn bg-[#FFF9F0] hover:bg-white text-ink text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-[2.5px_2.5px_0px_#171717]"
            title="Adjust prices across multiple selected products by % or flat amount"
          >
            <Tag className="w-3.5 h-3.5 text-[#315FE8]" />
            <span className="font-mono font-bold text-[11px]">BULK PRICE UPDATE</span>
          </button>

          {/* Action 2: Import / Export CSV */}
          <button
            type="button"
            onClick={onOpenImportExport}
            className="brutal-btn bg-white hover:bg-[#F0EEEE] text-ink text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-[2.5px_2.5px_0px_#171717]"
            title="Import or export product catalog data via CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-ink" />
            <span className="font-mono font-bold text-[11px]">IMPORT / EXPORT CSV</span>
          </button>

          {/* Action 3: + Add New Product */}
          <button
            type="button"
            onClick={() => navigate('/products/new')}
            className="brutal-btn brutal-btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 shadow-[2.5px_2.5px_0px_#171717]"
            title="Create a new toy listing"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span className="font-mono font-bold text-[11px]">+ ADD NEW PRODUCT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsHeaderToolbar;
