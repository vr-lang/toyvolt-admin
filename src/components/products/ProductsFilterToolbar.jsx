import React from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  Tag,
  Boxes,
  Trash2,
  ChevronDown
} from 'lucide-react';

export const ProductsFilterToolbar = ({
  searchTerm = '',
  onSearchChange,
  category = 'ALL',
  onCategoryChange,
  categoriesList = [],
  stockStatus = 'ALL',
  onStockStatusChange,
  ageGroup = 'ALL',
  onAgeGroupChange,
  onResetFilters,
  viewMode = 'table',
  onViewModeChange,
  // Selection
  isAllSelected = false,
  selectedCount = 0,
  visibleCount = 0,
  onToggleSelectAll,
  // Bulk Actions
  onBulkPriceUpdate,
  onBulkStockUpdate,
  onBulkArchive
}) => {
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    category !== 'ALL' ||
    stockStatus !== 'ALL' ||
    ageGroup !== 'ALL';

  return (
    <div className="bg-panel border-2 border-ink shadow-[3px_3px_0px_#171717] p-3.5 space-y-3">
      {/* Top Row: Search and Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6E6E6E]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH TITLE, SKU, AGE GROUP..."
            className="w-full pl-8 pr-2.5 py-1.5 brutal-input font-mono text-xs uppercase"
          />
        </div>

        {/* Category Dropdown */}
        <div className="shrink-0">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="border-2 border-ink bg-white font-mono text-xs uppercase px-2.5 py-1.5 shadow-[2px_2px_0px_#171717] focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL CATEGORIES</option>
            {categoriesList.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Dropdown */}
        <div className="shrink-0">
          <select
            value={stockStatus}
            onChange={(e) => onStockStatusChange(e.target.value)}
            className="border-2 border-ink bg-white font-mono text-xs uppercase px-2.5 py-1.5 shadow-[2px_2px_0px_#171717] focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL STOCK LEVELS</option>
            <option value="IN_STOCK">IN STOCK (&gt; 0)</option>
            <option value="LOW_STOCK">LOW STOCK (&le; 10)</option>
            <option value="OUT_OF_STOCK">OUT OF STOCK (0)</option>
            <option value="ARCHIVED">ARCHIVED PRODUCTS</option>
          </select>
        </div>

        {/* Age Group Dropdown */}
        <div className="shrink-0">
          <select
            value={ageGroup}
            onChange={(e) => onAgeGroupChange(e.target.value)}
            className="border-2 border-ink bg-white font-mono text-xs uppercase px-2.5 py-1.5 shadow-[2px_2px_0px_#171717] focus:outline-none cursor-pointer"
          >
            <option value="ALL">ALL AGE GROUPS</option>
            <option value="0-3">0-3 YEARS (TODDLER)</option>
            <option value="3-5">3-5 YEARS (PRESCHOOL)</option>
            <option value="6-8">6-8 YEARS (EARLY RC)</option>
            <option value="8+">8+ YEARS (HIGH-SPEED)</option>
            <option value="14+">14+ YEARS (HOBBY GRADE)</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="brutal-btn bg-white hover:bg-[#F0EEEE] text-ink text-xs px-2.5 py-1.5 flex items-center gap-1 shadow-[2px_2px_0px_#171717]"
            title="Clear all active search and filter constraints"
          >
            <RotateCcw className="w-3 h-3 text-[#FF5638]" />
            <span className="font-mono text-[11px] font-bold">RESET</span>
          </button>
        )}
      </div>

      {/* Bottom Row: Selection controls, Bulk Actions, View Switcher */}
      <div className="pt-2 border-t border-ink/15 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Select-All and Selection Stats */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onToggleSelectAll}
            className="flex items-center gap-1.5 font-bold text-ink hover:text-[#315FE8] cursor-pointer select-none"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-[#315FE8]" />
            ) : (
              <Square className="w-4 h-4 text-[#6E6E6E]" />
            )}
            <span>
              SELECT ALL ({visibleCount})
            </span>
          </button>

          {selectedCount > 0 && (
            <span className="bg-[#171717] text-white px-2 py-0.5 text-[11px] font-bold shadow-[1px_1px_0px_#315FE8]">
              {selectedCount} SELECTED
            </span>
          )}

          {/* Bulk Action Controls */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={onBulkPriceUpdate}
                className="brutal-btn bg-[#FFF9F0] hover:bg-white text-ink text-[11px] px-2 py-1 flex items-center gap-1 shadow-[1.5px_1.5px_0px_#171717]"
              >
                <Tag className="w-3 h-3 text-[#315FE8]" />
                PRICE ({selectedCount})
              </button>

              <button
                type="button"
                onClick={onBulkStockUpdate}
                className="brutal-btn bg-[#FFF9F0] hover:bg-white text-ink text-[11px] px-2 py-1 flex items-center gap-1 shadow-[1.5px_1.5px_0px_#171717]"
              >
                <Boxes className="w-3 h-3 text-amber-600" />
                STOCK ({selectedCount})
              </button>

              <button
                type="button"
                onClick={onBulkArchive}
                className="brutal-btn bg-white hover:bg-[#FF5638] hover:text-white text-ink text-[11px] px-2 py-1 flex items-center gap-1 shadow-[1.5px_1.5px_0px_#171717]"
              >
                <Trash2 className="w-3 h-3 text-[#FF5638]" />
                ARCHIVE ({selectedCount})
              </button>
            </div>
          )}
        </div>

        {/* Right: Table vs Grid View Switcher */}
        <div className="flex items-center border-2 border-ink bg-white shadow-[2px_2px_0px_#171717]">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 transition-colors ${
              viewMode === 'table'
                ? 'bg-[#315FE8] text-white'
                : 'text-ink hover:bg-[#F0EEEE]'
            }`}
            title="Dense Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-ink" />
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 transition-colors ${
              viewMode === 'grid'
                ? 'bg-[#315FE8] text-white'
                : 'text-ink hover:bg-[#F0EEEE]'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilterToolbar;
