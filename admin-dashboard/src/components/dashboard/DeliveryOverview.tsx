import React from 'react';
import { Truck, Clock } from 'lucide-react';

export const DeliveryOverview: React.FC = () => {
  // Static placeholder metrics for 142 total orders
  const delivered = 76;
  const outForDelivery = 45;
  const pending = 18;
  const failed = 3;
  const total = delivered + outForDelivery + pending + failed; // 142

  const deliveredPct = Math.round((delivered / total) * 100);
  const outPct = Math.round((outForDelivery / total) * 100);
  const pendingPct = Math.round((pending / total) * 100);
  const failedPct = 100 - (deliveredPct + outPct + pendingPct);

  return (
    <div className="dashboard-card" aria-label="Delivery Overview Summary">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} style={{ color: 'var(--primary-700)' }} />
            <h3 className="dashboard-card-title">Delivery Overview</h3>
          </div>
          <span className="dashboard-card-subtitle">
            Morning fulfillment progress (7:00 AM – 9:30 AM IST window)
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--slate-600)',
            backgroundColor: 'var(--slate-100)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--slate-200)',
          }}
        >
          <Clock size={12} />
          <span>7:00 - 9:30 AM IST</span>
        </div>
      </div>

      <div className="dashboard-card-body">
        {/* Metric Cards Grid */}
        <div className="delivery-metrics-grid">
          <div className="delivery-mini-stat">
            <span className="delivery-mini-stat-label">Delivered</span>
            <span className="delivery-mini-stat-value" style={{ color: 'var(--success-700)' }}>
              {delivered}
            </span>
          </div>
          <div className="delivery-mini-stat">
            <span className="delivery-mini-stat-label">In Transit</span>
            <span className="delivery-mini-stat-value" style={{ color: '#0284c7' }}>
              {outForDelivery}
            </span>
          </div>
          <div className="delivery-mini-stat">
            <span className="delivery-mini-stat-label">Pending</span>
            <span className="delivery-mini-stat-value" style={{ color: 'var(--slate-600)' }}>
              {pending}
            </span>
          </div>
          <div className="delivery-mini-stat">
            <span className="delivery-mini-stat-label">Failed</span>
            <span className="delivery-mini-stat-value" style={{ color: 'var(--danger-600)' }}>
              {failed}
            </span>
          </div>
        </div>

        {/* Pure CSS Progress Bar (Zero Chart Libraries) */}
        <div className="delivery-progress-section">
          <div className="delivery-progress-header">
            <span>Morning Fulfillment Distribution</span>
            <span>{deliveredPct}% Completed</span>
          </div>

          <div className="delivery-progress-bar" title="Static Delivery Distribution Progress">
            <div
              className="progress-segment-delivered"
              style={{ width: `${deliveredPct}%` }}
              title={`Delivered: ${delivered}`}
            />
            <div
              className="progress-segment-out"
              style={{ width: `${outPct}%` }}
              title={`Out for Delivery: ${outForDelivery}`}
            />
            <div
              className="progress-segment-pending"
              style={{ width: `${pendingPct}%` }}
              title={`Pending: ${pending}`}
            />
            <div
              className="progress-segment-failed"
              style={{ width: `${failedPct}%` }}
              title={`Failed: ${failed}`}
            />
          </div>

          {/* Legend */}
          <div className="delivery-legend">
            <div className="legend-item">
              <span className="legend-dot delivered" />
              <span>Delivered ({delivered})</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot out" />
              <span>In Transit ({outForDelivery})</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot pending" />
              <span>Pending ({pending})</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot failed" />
              <span>Failed ({failed})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
