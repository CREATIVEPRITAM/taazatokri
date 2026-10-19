import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Users,
  Package,
  FolderTree,
  AlertTriangle,
} from 'lucide-react';
import {
  StatCard,
  StatCardProps,
  DateSelector,
  DateRangeOption,
  PurchaseRequirementPreview,
  DeliveryOverview,
  AttentionRequired,
  QuickActions,
} from '../../components/dashboard';
import { useDashboardSummary } from '../../hooks/useDashboardSummary';
import { getISTComponents, getNextDeliveryDate } from '@taazatokri/shared';
import '../../styles/dashboard.css';

export const DashboardPage: React.FC = () => {
  const [dateOption, setDateOption] = useState<DateRangeOption>('today');

  // Compute selected delivery date string (YYYY-MM-DD in IST)
  const selectedDeliveryDate = useMemo(() => {
    if (dateOption === 'tomorrow') {
      return getNextDeliveryDate();
    }
    if (dateOption === 'yesterday') {
      const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return getISTComponents(yesterdayDate).dateString;
    }
    return getISTComponents().dateString;
  }, [dateOption]);

  const { metrics, loading, errors, refetch } = useDashboardSummary(selectedDeliveryDate);

  // Format currency in Indian locale (₹)
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // 10 Approved V1 Summary Cards
  // Operational cards 1-6 are scoped strictly to selectedDeliveryDate
  // Global cards 7-10 remain global across the catalog/database
  const summaryCards: StatCardProps[] = [
    {
      id: 'stat-today-orders',
      label: dateOption === 'today' ? "Today's Orders" : 'Selected Date Orders',
      value: metrics.todayOrders,
      icon: ShoppingBag,
      variant: 'primary',
      subtitle: `Delivery date: ${selectedDeliveryDate}`,
      badge: dateOption === 'today' ? 'Today' : dateOption,
      loading,
    },
    {
      id: 'stat-pending',
      label: 'Pending',
      value: metrics.pendingOrders,
      icon: Clock,
      variant: 'neutral',
      subtitle: 'Awaiting fulfillment',
      loading,
    },
    {
      id: 'stat-out-for-delivery',
      label: 'Out for Delivery',
      value: metrics.outForDeliveryOrders,
      icon: Truck,
      variant: 'info',
      subtitle: 'In transit to customers',
      loading,
    },
    {
      id: 'stat-delivered',
      label: dateOption === 'today' ? 'Delivered Today' : 'Delivered',
      value: metrics.deliveredToday,
      icon: CheckCircle2,
      variant: 'success',
      subtitle: 'Completed deliveries',
      loading,
    },
    {
      id: 'stat-failed',
      label: 'Failed Delivery',
      value: metrics.failedOrders,
      icon: AlertCircle,
      variant: 'danger',
      subtitle: 'Exceptions flagged',
      badge: metrics.failedOrders > 0 ? `${metrics.failedOrders} Flagged` : undefined,
      loading,
    },
    {
      id: 'stat-cod-collection',
      label: dateOption === 'today' ? "Today's COD Collection" : 'COD Collection',
      value: formatCurrency(metrics.todayCodCollection),
      icon: IndianRupee,
      variant: 'success',
      subtitle: 'Confirmed cash collected',
      loading,
    },
    {
      id: 'stat-customers',
      label: 'Total Customers',
      value: metrics.totalCustomers,
      icon: Users,
      variant: 'info',
      subtitle: 'All-time registered users',
      loading,
    },
    {
      id: 'stat-active-partners',
      label: 'Active Delivery Partners',
      value: metrics.activeDeliveryPartners,
      icon: Truck,
      variant: 'primary',
      subtitle: 'Active partner accounts',
      loading,
    },
    {
      id: 'stat-total-products',
      label: 'Total Products',
      value: metrics.totalProducts,
      icon: Package,
      variant: 'neutral',
      subtitle: 'Catalog inventory items',
      loading,
    },
    {
      id: 'stat-active-categories',
      label: 'Active Categories',
      value: metrics.activeCategories,
      icon: FolderTree,
      variant: 'neutral',
      subtitle: 'Active produce groupings',
      loading,
    },
  ];

  return (
    <div className="dashboard-container" aria-label="TaazaTokari Admin Dashboard Home">
      {/* Top Bar: Operational Context & Date Range Selector */}
      <div className="dashboard-topbar">
        <div className="dashboard-topbar-left">
          <h2 className="dashboard-greeting-title">Operational Control Center</h2>
          <div className="dashboard-subtitle">
            <span>Delivery Window: 7:00 AM – 9:30 AM IST</span>
            <span>•</span>
            <span
              className="static-dev-badge"
              style={{ color: 'var(--primary-800)', borderColor: 'var(--primary-300)' }}
            >
              Snapshot: {selectedDeliveryDate}
            </span>
          </div>
        </div>

        {/* Date Selector */}
        <DateSelector selectedRange={dateOption} onChangeRange={setDateOption} />
      </div>

      {/* Non-blocking Error Banner if any partial queries fail */}
      {errors.length > 0 && (
        <div className="dashboard-error-banner" role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>
              Some live metrics could not be loaded ({errors.join(' ')}). Showing available data.
            </span>
          </div>
          <button
            type="button"
            className="dashboard-error-retry-btn"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {/* 1. Summary Cards Section (6 Scoped Operational Metrics + 4 Global Cards) */}
      <section aria-label="Key Operational Metrics">
        <div className="summary-cards-grid">
          {summaryCards.map((card) => (
            <StatCard key={card.id} {...card} />
          ))}
        </div>
      </section>

      {/* 2 & 3 & 4 & 5. Operational Main Grid (Locked Static Lower Sections) */}
      <div className="dashboard-main-grid">
        {/* Left Operational Column */}
        <div className="dashboard-column">
          {/* Today's Purchase Requirement Preview */}
          <PurchaseRequirementPreview selectedDate={selectedDeliveryDate} />

          {/* Delivery Overview (Zero Chart Libs) */}
          <DeliveryOverview />
        </div>

        {/* Right Operational Column */}
        <div className="dashboard-column">
          {/* Attention Required */}
          <AttentionRequired selectedDate={selectedDeliveryDate} />

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
};
