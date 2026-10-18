import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedAdminRoute } from './hooks/useAdminAuth';

// Layout
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SetupPage from './pages/auth/SetupPage';

// Fully Implemented Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

// Admin Core Pages
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ProductsPage from './pages/catalog/ProductsPage';
import NewProductPage from './pages/catalog/NewProductPage';
import CategoriesPage from './pages/catalog/CategoriesPage';
import InventoryPage from './pages/catalog/InventoryPage';
import OrdersPage from './pages/fulfillment/OrdersPage';
import ShipmentsPage from './pages/fulfillment/ShipmentsPage';
import ReturnsPage from './pages/fulfillment/ReturnsPage';

// Customers & Growth Pages
import CustomersPage from './pages/customers/CustomersPage';
import PromotionsPage from './pages/customers/PromotionsPage';
import ReviewsPage from './pages/customers/ReviewsPage';

// System Pages
import SettingsPage from './pages/system/SettingsPage';
import IntegrationsPage from './pages/system/IntegrationsPage';

export const App = () => {
  return (
    <Routes>
      {/* Public Authentication & One-Time Setup Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setup" element={<SetupPage />} />

      {/* Protected Admin Console Routes */}
      <Route
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<NewProductPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/shipments" element={<ShipmentsPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        
        {/* Customer Directory & Loyalty Club */}
        <Route path="/customers" element={<CustomersPage />} />

        {/* Coupons, Vouchers & Festive Campaigns (with alias support) */}
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/coupons" element={<PromotionsPage />} />

        {/* Parent Reviews & Community (with alias support) */}
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/parent-reviews" element={<ReviewsPage />} />

        {/* System Settings */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
