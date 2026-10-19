import React from 'react';
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
  PurchaseRequirementPreview,
  DeliveryOverview,
  AttentionRequired,
  QuickActions,
} from '../../components/dashboard';
import { useDashboardSummary } from '../../hooks/useDashboardSummary';
import '../../styles/dashboard.css';

export const DashboardPage: React.FC = () => {
  const { metrics, loading, errors, refetch } = useDashboardSummary();

  // Format currency in Indian locale (₹)
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // 10 Approved V1 Summary Cards connected strictly to real Firestore data
  const summaryCards: StatCardProps[] = [
    {
      id: 'stat-today-orders',
      label: "Today's Orders",
      value: metrics.todayOrders,
      icon: ShoppingBag,
      variant: 'primary',
      subtitle: 'Scheduled for delivery today',
      badge: 'Today',
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
      label: 'Delivered Today',
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
      label: "Today's COD Collection",
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
      subtitle: 'Registered users',
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
            <span>Next Morning Delivery Window: 7:00 AM – 9:30 AM IST</span>
            <span>•</span>
            <span className="static-dev-badge" style={{ color: 'var(--primary-800)', borderColor: 'var(--primary-300)' }}>
              Live Firestore Summary
            </span>
          </div>
        </div>

        {/* Date Selector (UI Only) */}
        <DateSelector />
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

      {/* 1. Summary Cards Section (10 Live Firestore Metrics) */}
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
          <PurchaseRequirementPreview />

          {/* Delivery Overview (Zero Chart Libs) */}
          <DeliveryOverview />
        </div>

        {/* Right Operational Column */}
        <div className="dashboard-column">
          {/* Attention Required */}
          <AttentionRequired />

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
};
