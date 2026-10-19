import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle, ChevronRight } from 'lucide-react';

interface AttentionItemData {
  id: string;
  title: string;
  count: number;
  description: string;
  path: string;
  type: 'warning' | 'danger';
}

const STATIC_ATTENTION_ITEMS: AttentionItemData[] = [
  {
    id: 'att-unassigned',
    title: 'Unassigned Orders',
    count: 2,
    description:
      '2 orders in Sector 4 Block C currently have no primary active delivery partner mapped.',
    path: '/orders',
    type: 'warning',
  },
  {
    id: 'att-failed',
    title: 'Failed Deliveries',
    count: 3,
    description:
      '3 morning orders marked failed due to customer unreachable or unlocated address.',
    path: '/orders',
    type: 'danger',
  },
];

export const AttentionRequired: React.FC = () => {
  return (
    <div className="dashboard-card" aria-label="Attention Required Action Items">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ color: 'var(--danger-600)' }} />
            <h3 className="dashboard-card-title">Attention Required</h3>
          </div>
          <span className="dashboard-card-subtitle">
            Urgent operational flags requiring Admin intervention
          </span>
        </div>
        <span className="attention-badge-count">5 Items Flagged</span>
      </div>

      <div className="dashboard-card-body">
        <div className="attention-items-list">
          {STATIC_ATTENTION_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`attention-item ${item.type}`}
              title={`Inspect ${item.title}`}
            >
              <div className="attention-item-icon-wrapper">
                {item.type === 'warning' ? (
                  <AlertTriangle size={17} />
                ) : (
                  <AlertCircle size={17} />
                )}
              </div>

              <div className="attention-item-content">
                <div className="attention-item-header">
                  <span className="attention-item-title">{item.title}</span>
                  <span className="attention-item-count-badge">
                    {item.count} Orders
                  </span>
                </div>
                <p className="attention-item-desc">{item.description}</p>
              </div>

              <ChevronRight size={16} style={{ color: 'var(--slate-400)', alignSelf: 'center' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
