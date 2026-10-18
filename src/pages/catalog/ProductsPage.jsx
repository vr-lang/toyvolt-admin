import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import productService, { paiseToRupees } from '../../services/productService';
import { getErrorMessage } from '../../services/api';

// Components
import ProductsHeaderToolbar from '../../components/products/ProductsHeaderToolbar';
import ProductsKpiCards from '../../components/products/ProductsKpiCards';
import ProductsFilterToolbar from '../../components/products/ProductsFilterToolbar';
import ProductsTable from '../../components/products/ProductsTable';
import ProductsGridView from '../../components/products/ProductsGridView';
import ProductsPagination from '../../components/products/ProductsPagination';
import FulfillmentStatusPanel from '../../components/products/FulfillmentStatusPanel';

// Modals
import BulkPriceModal from '../../components/products/BulkPriceModal';
import QuickStockModal from '../../components/products/QuickStockModal';
import EditProductModal from '../../components/products/EditProductModal';
import ProductDetailsModal from '../../components/products/ProductDetailsModal';
import ImportExportModal from '../../components/products/ImportExportModal';
import ConfirmDeleteModal from '../../components/products/ConfirmDeleteModal';

export const ProductsPage = () => {
  const { setBadges } = useOutletContext() || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('ALL');
  const [stockStatus, setStockStatus] = useState('ALL');
  const [ageGroup, setAgeGroup] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Selection
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [bulkPriceModalOpen, setBulkPriceModalOpen] = useState(false);
  const [importExportModalOpen, setImportExportModalOpen] = useState(false);

  const [activeStockProduct, setActiveStockProduct] = useState(null);
  const [quickStockModalOpen, setQuickStockModalOpen] = useState(false);

  const [activeEditProduct, setActiveEditProduct] = useState(null);
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);

  const [activeDetailsProduct, setActiveDetailsProduct] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [activeDeleteProduct, setActiveDeleteProduct] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load products from backend
  const loadProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Fetch up to 100 products for complete client catalog management
      const data = await productService.getProducts({
        limit: 100,
        includeArchived: true
      });

      const list = data.products || [];
      setProducts(list);

      // Update layout badge for low stock
      if (setBadges) {
        const lowStock = list.filter((p) => p.availableStock > 0 && p.availableStock <= 10).length;
        setBadges((prev) => ({
          ...prev,
          lowStock
        }));
      }
    } catch (err) {
      console.error('Failed to load products from API:', err);
      setError(
        getErrorMessage(
          err,
          'Could not retrieve product catalog. Please verify backend status or retry.'
        )
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setBadges]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Extract distinct categories
  const categoriesList = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filter products locally for instantaneous responsiveness
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search (Title, SKU, Age Group, Barcode)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const specs = p.specifications || {};
        const specStr = Object.values(specs).join(' ').toLowerCase();
        const matchesSearch =
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.sku && p.sku.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query)) ||
          specStr.includes(query);
        if (!matchesSearch) return false;
      }

      // 2. Category
      if (category !== 'ALL' && p.category !== category) {
        return false;
      }

      // 3. Stock Status
      const stock = p.availableStock ?? 0;
      if (stockStatus === 'IN_STOCK' && stock <= 0) return false;
      if (stockStatus === 'LOW_STOCK' && (stock <= 0 || stock > 10)) return false;
      if (stockStatus === 'OUT_OF_STOCK' && stock !== 0) return false;
      if (stockStatus === 'ARCHIVED' && !p.isArchived) return false;
      if (stockStatus !== 'ARCHIVED' && p.isArchived) return false;

      // 4. Age Group
      if (ageGroup !== 'ALL') {
        const specs = p.specifications || {};
        const pAge = specs['Age Group'] || specs['Age'] || (p.category?.includes('RC') ? '8+' : '');
        if (!pAge.includes(ageGroup)) return false;
      }

      return true;
    });
  }, [products, searchTerm, category, stockStatus, ageGroup]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // KPI calculations
  const totalMasterCount = products.length;
  const activeCount = products.filter((p) => p.isActive && !p.isArchived).length;
  const archivedCount = products.filter((p) => p.isArchived).length;
  const lowStockCount = products.filter((p) => (p.availableStock ?? 0) > 0 && (p.availableStock ?? 0) <= 10).length;
  const outOfStockCount = products.filter((p) => (p.availableStock ?? 0) === 0).length;
  const bisTestedCount = products.filter((p) => {
    const specs = p.specifications || {};
    return specs['BIS Verified'] === 'true' || specs['BIS License'] || p.bisCertification?.verified;
  }).length;

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isAllVisibleSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedIds.has(p._id));

  const handleToggleSelectAll = () => {
    if (isAllVisibleSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedProducts.forEach((p) => next.delete(p._id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedProducts.forEach((p) => next.add(p._id));
        return next;
      });
    }
  };

  const selectedProductList = useMemo(() => {
    return products.filter((p) => selectedIds.has(p._id));
  }, [products, selectedIds]);

  // Quick Action handlers
  const handleOpenQuickStock = (prod) => {
    setActiveStockProduct(prod);
    setQuickStockModalOpen(true);
  };

  const handleSaveStock = async (id, newStock) => {
    const updated = await productService.updateStock(id, newStock);
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, availableStock: updated.availableStock } : p))
    );
  };

  const handleOpenEditProduct = (prod) => {
    setActiveEditProduct(prod);
    setEditProductModalOpen(true);
  };

  const handleSaveProduct = async (id, payload) => {
    const updated = await productService.updateProduct(id, payload);
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...updated } : p))
    );
  };

  const handleOpenDetails = (prod) => {
    setActiveDetailsProduct(prod);
    setDetailsModalOpen(true);
  };

  const handleOpenDelete = (prod) => {
    setActiveDeleteProduct(prod);
    setIsBulkDelete(false);
    setDeleteModalOpen(true);
  };

  const handleOpenBulkDelete = () => {
    setActiveDeleteProduct(null);
    setIsBulkDelete(true);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      if (isBulkDelete) {
        await productService.bulkArchiveProducts(selectedProductList);
        setSelectedIds(new Set());
      } else if (activeDeleteProduct) {
        await productService.deleteProduct(activeDeleteProduct._id);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(activeDeleteProduct._id);
          return next;
        });
      }
      setDeleteModalOpen(false);
      await loadProducts(true);
    } catch (err) {
      alert(err.message || 'Failed to archive product.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Bulk Price Update Handler
  const handleApplyBulkPrice = async ({ productList, type, value }) => {
    const res = await productService.bulkPriceUpdate({
      productList,
      type,
      value
    });
    await loadProducts(true);
    setSelectedIds(new Set());
    if (res.failedCount > 0) {
      alert(`Updated ${res.successCount} products. Errors on ${res.failedCount} items: \n${res.errors.join('\n')}`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('ALL');
    setStockStatus('ALL');
    setAgeGroup('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Toolbar */}
      <ProductsHeaderToolbar
        totalCount={totalMasterCount}
        onOpenBulkPrice={() => {
          if (selectedProductList.length === 0) {
            alert('Please select at least one product using the checkboxes to apply bulk price updates.');
            return;
          }
          setBulkPriceModalOpen(true);
        }}
        onOpenImportExport={() => setImportExportModalOpen(true)}
        isRefreshing={refreshing}
        onRefresh={() => loadProducts(true)}
      />

      {/* Global Error Notice */}
      {error && (
        <div className="p-4 bg-[#FF5638] text-white border-2 border-ink shadow-[3px_3px_0px_#171717] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadProducts(true)}
            className="brutal-btn bg-white text-ink text-xs px-3 py-1 font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            RETRY API
          </button>
        </div>
      )}

      {/* 2. Four KPI Cards */}
      <ProductsKpiCards
        totalCount={totalMasterCount}
        activeCount={activeCount}
        archivedCount={archivedCount}
        lowStockCount={lowStockCount}
        outOfStockCount={outOfStockCount}
        bisTestedCount={bisTestedCount}
        onFilterLowStock={() => {
          setStockStatus('LOW_STOCK');
          setCurrentPage(1);
        }}
        onFilterOutOfStock={() => {
          setStockStatus('OUT_OF_STOCK');
          setCurrentPage(1);
        }}
        isLoading={loading}
      />

      {/* 3. Search and Filters Toolbar */}
      <ProductsFilterToolbar
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setCurrentPage(1);
        }}
        category={category}
        onCategoryChange={(v) => {
          setCategory(v);
          setCurrentPage(1);
        }}
        categoriesList={categoriesList}
        stockStatus={stockStatus}
        onStockStatusChange={(v) => {
          setStockStatus(v);
          setCurrentPage(1);
        }}
        ageGroup={ageGroup}
        onAgeGroupChange={(v) => {
          setAgeGroup(v);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={(m) => setViewMode(m)}
        // Selection
        isAllSelected={isAllVisibleSelected}
        selectedCount={selectedIds.size}
        visibleCount={paginatedProducts.length}
        onToggleSelectAll={handleToggleSelectAll}
        // Bulk Actions
        onBulkPriceUpdate={() => setBulkPriceModalOpen(true)}
        onBulkStockUpdate={() => {
          if (selectedProductList.length === 1) {
            handleOpenQuickStock(selectedProductList[0]);
          } else {
            alert('Select a single product to quickly update inventory units, or edit the product directly.');
          }
        }}
        onBulkArchive={handleOpenBulkDelete}
      />

      {/* 4. Products Table OR Grid View */}
      {viewMode === 'table' ? (
        <ProductsTable
          products={paginatedProducts}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onViewProduct={handleOpenDetails}
          onEditProduct={handleOpenEditProduct}
          onQuickStock={handleOpenQuickStock}
          onDeleteProduct={handleOpenDelete}
          isLoading={loading}
        />
      ) : (
        <ProductsGridView
          products={paginatedProducts}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onViewProduct={handleOpenDetails}
          onEditProduct={handleOpenEditProduct}
          onQuickStock={handleOpenQuickStock}
          onDeleteProduct={handleOpenDelete}
          isLoading={loading}
        />
      )}

      {/* 5. Pagination Controls */}
      <ProductsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredProducts.length}
        pageSize={pageSize}
        onPageChange={(p) => setCurrentPage(p)}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setCurrentPage(1);
        }}
      />

      {/* 6. Fulfillment Status Panel */}
      <FulfillmentStatusPanel
        warehouseName="Primary Noida Hub (NCR)"
        dispatchCutoff="16:00 IST"
        activeCouriers={['Delhivery', 'Blue Dart', 'DTDC', 'Ecom Express']}
        pendingOrdersCount={1}
        isIntegrated={true}
      />

      {/* Modals */}
      <BulkPriceModal
        isOpen={bulkPriceModalOpen}
        onClose={() => setBulkPriceModalOpen(false)}
        selectedProducts={selectedProductList}
        onApplyBulkPrice={handleApplyBulkPrice}
      />

      <QuickStockModal
        isOpen={quickStockModalOpen}
        onClose={() => {
          setQuickStockModalOpen(false);
          setActiveStockProduct(null);
        }}
        product={activeStockProduct}
        onSaveStock={handleSaveStock}
      />

      <EditProductModal
        isOpen={editProductModalOpen}
        onClose={() => {
          setEditProductModalOpen(false);
          setActiveEditProduct(null);
        }}
        product={activeEditProduct}
        categoriesList={categoriesList}
        onSaveProduct={handleSaveProduct}
      />

      <ProductDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setActiveDetailsProduct(null);
        }}
        product={activeDetailsProduct}
      />

      <ImportExportModal
        isOpen={importExportModalOpen}
        onClose={() => setImportExportModalOpen(false)}
        products={products}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setActiveDeleteProduct(null);
        }}
        product={activeDeleteProduct}
        isBulk={isBulkDelete}
        bulkCount={selectedIds.size}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ProductsPage;
