import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, PlusCircle, FolderPlus, UserPlus, ShoppingBag, Sparkles } from 'lucide-react';

interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

const STATIC_QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'add-product',
    title: 'Add Product',
    description: 'Catalog items & inventory packages',
    path: '/products',
    icon: PlusCircle,
  },
  {
    id: 'add-category',
    title: 'Add Category',
    description: 'Manage vegetable & produce groups',
    path: '/categories',
    icon: FolderPlus,
  },
  {
    id: 'add-partner',
    title: 'Add Delivery Partner',
    description: 'Register partner & map primary block',
    path: '/delivery-partners',
    icon: UserPlus,
  },
  {
    id: 'view-orders',
    title: 'View Orders',
    description: 'Monitor daily queue & dispatch states',
    path: '/orders',
    icon: ShoppingBag,
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="dashboard-card" aria-label="Operational Quick Actions">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--primary-700)' }} />
            <h3 className="dashboard-card-title">Quick Actions</h3>
          </div>
          <span className="dashboard-card-subtitle">
            Direct navigation to primary administrative tasks
          </span>
        </div>
      </div>

      <div className="dashboard-card-body">
        <div className="quick-actions-grid">
          {STATIC_QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                to={action.path}
                className="quick-action-card"
                title={`Navigate to ${action.title}`}
              >
                <div className="quick-action-icon">
                  <Icon size={18} />
                </div>
                <div className="quick-action-info">
                  <span className="quick-action-title">{action.title}</span>
                  <span className="quick-action-desc">{action.description}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
