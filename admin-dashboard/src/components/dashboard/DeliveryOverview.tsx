import React from 'react';
import { Truck, Clock, RotateCcw } from 'lucide-react';
import { useDeliveryOverview, UseDeliveryOverviewOptions } from '../../hooks/useDeliveryOverview';

export type DeliveryOverviewProps = UseDeliveryOverviewOptions;

export const DeliveryOverview: React.FC<DeliveryOverviewProps> = (props) => {
  const { selectedDate } = props;
  const { data, loading, error, refetch } = useDeliveryOverview(props);

  const {
    delivered,
    inTransit,
    pending,
    failed,
    totalRelevantOrders,
    completionPercentage,
    deliveredPct,
    inTransitPct,
    pendingPct,
    failedPct,
  } = data;

  return (
    <div className="dashboard-card" aria-label="Delivery Overview Summary">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} style={{ color: 'var(--primary-700)' }} />
            <h3 className="dashboard-card-title">Delivery Overview</h3>
          </div>
          <span className="dashboard-card-subtitle">
            Morning fulfillment progress for {selectedDate} (7:00 AM – 9:30 AM IST window)
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
          title="Morning fulfillment window: 7:00 AM – 9:30 AM IST"
        >
          <Clock size={12} />
          {/* Locked window label: 7:00 AM – 9:30 AM IST (7:00 - 9:30 AM IST) */}
          <span>7:00 AM – 9:30 AM IST</span>
        </div>
      </div>

      <div className="dashboard-card-body">
        {/* Non-blocking error banner */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: 'var(--danger-50)',
              border: '1px solid var(--danger-100)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              color: 'var(--danger-700)',
              marginBottom: '16px',
            }}
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => refetch()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
                color: 'var(--danger-700)',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="delivery-metrics-grid">
          <div className="delivery-mini-stat">
            <span className="delivery-mini-stat-label">Delivered</span>
            {loading ? (
              <div className="delivery-stat-skeleton" />
            ) : (
              <span className="delivery-mini-stat-value" style={{ color: 'var(--success-700)' }}>
                {delivered}
              </span>
            )}
          </div>
          <div className="delivery-mini-stat">
            <span className="delivery-mini-stat-label">In Transit</span>
            {loading ? (
              <div className="delivery-stat-skeleton" />
            ) : (
              <span className="delivery-mini-stat-value" style={{ color: '#0284c7' }}>
                {inTransit}
              </span>
            )}
          </div>
          <div className="delivery-mini-stat">
            <span className="delivery-mini-stat-label">Pending</span>
            {loading ? (
              <div className="delivery-stat-skeleton" />
            ) : (
              <span className="delivery-mini-stat-value" style={{ color: 'var(--slate-600)' }}>
                {pending}
              </span>
            )}
          </div>
          <div className="delivery-mini-stat">
            <span className="delivery-mini-stat-label">Failed</span>
            {loading ? (
              <div className="delivery-stat-skeleton" />
            ) : (
              <span className="delivery-mini-stat-value" style={{ color: 'var(--danger-600)' }}>
                {failed}
              </span>
            )}
          </div>
        </div>

        {/* Pure CSS Progress Bar (Zero Chart Libraries) */}
        <div className="delivery-progress-section">
          <div className="delivery-progress-header">
            <span>Morning Fulfillment Distribution</span>
            <span>
              {loading ? 'Calculating...' : `${completionPercentage}% Completed`}
            </span>
          </div>

          <div
            className="delivery-progress-bar"
            title={
              totalRelevantOrders > 0
                ? `${completionPercentage}% Completed (${delivered} of ${totalRelevantOrders} active orders delivered)`
                : `0% Completed (0 active orders for ${selectedDate})`
            }
          >
            {totalRelevantOrders === 0 ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'var(--slate-200)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            ) : (
              <>
                {deliveredPct > 0 && (
                  <div
                    className="progress-segment-delivered"
                    style={{ width: `${deliveredPct}%` }}
                    title={`Delivered: ${delivered} (${Math.round(deliveredPct)}%)`}
                  />
                )}
                {inTransitPct > 0 && (
                  <div
                    className="progress-segment-out"
                    style={{ width: `${inTransitPct}%` }}
                    title={`In Transit: ${inTransit} (${Math.round(inTransitPct)}%)`}
                  />
                )}
                {pendingPct > 0 && (
                  <div
                    className="progress-segment-pending"
                    style={{ width: `${pendingPct}%` }}
                    title={`Pending: ${pending} (${Math.round(pendingPct)}%)`}
                  />
                )}
                {failedPct > 0 && (
                  <div
                    className="progress-segment-failed"
                    style={{ width: `${failedPct}%` }}
                    title={`Failed: ${failed} (${Math.round(failedPct)}%)`}
                  />
                )}
              </>
            )}
          </div>

          {/* Legend */}
          <div className="delivery-legend">
            <div className="legend-item">
              <span className="legend-dot delivered" />
              <span>Delivered ({delivered})</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot out" />
              <span>In Transit ({inTransit})</span>
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
