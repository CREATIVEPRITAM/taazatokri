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
  ShieldAlert,
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
import '../../styles/dashboard.css';

// 10 Approved V1 Summary Cards with strictly static/dev placeholder values
const STATIC_SUMMARY_CARDS: StatCardProps[] = [
  {
    id: 'stat-today-orders',
    label: "Today's Orders",
    value: 142,
    icon: ShoppingBag,
    variant: 'primary',
    subtitle: '11:00 PM cutoff',
    badge: 'Today',
  },
  {
    id: 'stat-pending',
    label: 'Pending',
    value: 18,
    icon: Clock,
    variant: 'neutral',
    subtitle: 'Awaiting dispatch',
  },
  {
    id: 'stat-out-for-delivery',
    label: 'Out for Delivery',
    value: 45,
    icon: Truck,
    variant: 'info',
    subtitle: 'Active transit',
  },
  {
    id: 'stat-delivered',
    label: 'Delivered Today',
    value: 76,
    icon: CheckCircle2,
    variant: 'success',
    subtitle: '53.5% fulfillment',
  },
  {
    id: 'stat-failed',
    label: 'Failed Delivery',
    value: 3,
    icon: AlertCircle,
    variant: 'danger',
    subtitle: 'Requires follow-up',
    badge: 'Flagged',
  },
  {
    id: 'stat-cod-collection',
    label: "Today's COD Collection",
    value: '₹18,450',
    icon: IndianRupee,
    variant: 'success',
    subtitle: 'Cash pending deposit',
  },
  {
    id: 'stat-customers',
    label: 'Total Customers',
    value: 840,
    icon: Users,
    variant: 'info',
    subtitle: 'Registered accounts',
  },
  {
    id: 'stat-active-partners',
    label: 'Active Delivery Partners',
    value: 12,
    icon: Truck,
    variant: 'primary',
    subtitle: '12 active blocks',
  },
  {
    id: 'stat-total-products',
    label: 'Total Products',
    value: 64,
    icon: Package,
    variant: 'neutral',
    subtitle: 'Fresh & Packaged',
  },
  {
    id: 'stat-active-categories',
    label: 'Active Categories',
    value: 8,
    icon: FolderTree,
    variant: 'neutral',
    subtitle: 'Produce taxonomies',
  },
];

export const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-container" aria-label="TaazaTokari Admin Dashboard Home">
      {/* Top Bar: Operational Context & Date Range Selector */}
      <div className="dashboard-topbar">
        <div className="dashboard-topbar-left">
          <h2 className="dashboard-greeting-title">Operational Control Center</h2>
          <div className="dashboard-subtitle">
            <span>Next Morning Delivery Window: 7:00 AM – 9:30 AM IST</span>
            <span>•</span>
            <span className="static-dev-badge">Static V1 Structure</span>
          </div>
        </div>

        {/* Date Selector (UI Only) */}
        <DateSelector />
      </div>

      {/* 1. Summary Cards Section (10 Approved V1 Metrics) */}
      <section aria-label="Key Operational Metrics">
        <div className="summary-cards-grid">
          {STATIC_SUMMARY_CARDS.map((card) => (
            <StatCard key={card.id} {...card} />
          ))}
        </div>
      </section>

      {/* 2 & 3 & 4 & 5. Operational Main Grid */}
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
