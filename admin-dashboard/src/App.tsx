import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/Login/LoginPage';

// Module placeholder pages
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { OrdersPage } from './pages/Orders/OrdersPage';
import { PurchaseRequirementsPage } from './pages/PurchaseRequirements/PurchaseRequirementsPage';
import { ProductsPage } from './pages/Products/ProductsPage';
import { CategoriesPage } from './pages/Categories/CategoriesPage';
import { CustomersPage } from './pages/Customers/CustomersPage';
import { DeliveryPartnersPage } from './pages/DeliveryPartners/DeliveryPartnersPage';
import { CodPartnerPaymentsPage } from './pages/CodPartnerPayments/CodPartnerPaymentsPage';
import { NotificationsOffersPage } from './pages/NotificationsOffers/NotificationsOffersPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Shell & Module Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/purchase-requirements" element={<PurchaseRequirementsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/delivery-partners" element={<DeliveryPartnersPage />} />
            <Route path="/cod-partner-payments" element={<CodPartnerPaymentsPage />} />
            <Route path="/notifications-offers" element={<NotificationsOffersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/area-management" element={<SettingsPage />} />

            {/* URL Aliases for consistency */}
            <Route path="/area-management" element={<Navigate to="/settings" replace />} />
            <Route path="/settlements" element={<Navigate to="/cod-partner-payments" replace />} />
            <Route path="/notifications" element={<Navigate to="/notifications-offers" replace />} />
          </Route>

          {/* Root and Fallback Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
