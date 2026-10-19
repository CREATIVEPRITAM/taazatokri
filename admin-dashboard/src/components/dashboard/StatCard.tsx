import React from 'react';
import { LucideIcon } from 'lucide-react';

export type StatCardVariant = 'primary' | 'warning' | 'info' | 'success' | 'danger' | 'neutral';

export interface StatCardProps {
  id: string;
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: StatCardVariant;
  subtitle?: string;
  badge?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  variant = 'neutral',
  subtitle,
  badge,
  loading = false,
}) => {
  return (
    <div className={`stat-card variant-${variant}`}>
      <div className="stat-card-header">
        <div className="stat-card-icon">
          <Icon size={18} />
        </div>
        {badge && <span className="stat-card-badge">{badge}</span>}
      </div>

      <div className="stat-card-body">
        {loading ? (
          <div className="stat-card-skeleton" aria-label="Loading metric value" />
        ) : (
          <span className="stat-card-value">{value}</span>
        )}
        <span className="stat-card-label">{label}</span>
      </div>

      {subtitle && (
        <div className="stat-card-footer">
          <span>{loading ? 'Refreshing data...' : subtitle}</span>
          <span>•</span>
        </div>
      )}
    </div>
  );
};
