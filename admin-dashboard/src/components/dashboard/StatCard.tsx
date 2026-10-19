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
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  variant = 'neutral',
  subtitle = 'Static V1 Placeholder',
  badge,
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
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-footer">
        <span>{subtitle}</span>
        <span>•</span>
      </div>
    </div>
  );
};
