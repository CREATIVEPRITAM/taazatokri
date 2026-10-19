import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { useAttentionRequired } from '../../hooks/useAttentionRequired';

export interface AttentionRequiredProps {
  selectedDate: string;
}

export const AttentionRequired: React.FC<AttentionRequiredProps> = ({ selectedDate }) => {
  const { data, loading, error, refetch } = useAttentionRequired(selectedDate);

  const { unassignedOrders, failedDeliveries, totalFlagged } = data;

  return (
    <div className="dashboard-card" aria-label="Attention Required Action Items">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle
              size={18}
              style={{
                color: totalFlagged > 0 ? 'var(--danger-600)' : 'var(--primary-600)',
              }}
            />
            <h3 className="dashboard-card-title">Attention Required</h3>
          </div>
          <span className="dashboard-card-subtitle">
            Operational flags for {selectedDate}
          </span>
        </div>

        {loading ? (
          <span className="attention-badge-count" style={{ opacity: 0.7 }}>
            Checking...
          </span>
        ) : totalFlagged > 0 ? (
          <span className="attention-badge-count">{totalFlagged} Items Flagged</span>
        ) : (
          <span className="attention-badge-count clear">No attention required</span>
        )}
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
              marginBottom: '12px',
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

        <div className="attention-items-list">
          {loading ? (
            <>
              <div className="attention-item-skeleton" />
              <div className="attention-item-skeleton" />
            </>
          ) : (
            <>
              {/* 1. Unassigned Orders */}
              <Link
                to="/orders"
                className={`attention-item ${unassignedOrders > 0 ? 'warning' : 'success'}`}
                title="View Unassigned Orders in Orders module"
              >
                <div className="attention-item-icon-wrapper">
                  {unassignedOrders > 0 ? (
                    <AlertTriangle size={17} />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}
                </div>

                <div className="attention-item-content">
                  <div className="attention-item-header">
                    <span className="attention-item-title">Unassigned Orders</span>
                    <span className="attention-item-count-badge">
                      {unassignedOrders > 0
                        ? `${unassignedOrders} Orders`
                        : 'No attention required'}
                    </span>
                  </div>
                  <p className="attention-item-desc">
                    {unassignedOrders > 0
                      ? `${unassignedOrders} order(s) for ${selectedDate} currently have no delivery partner assigned.`
                      : 'No attention required. All orders for this delivery date are assigned.'}
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  style={{ color: 'var(--slate-400)', alignSelf: 'center' }}
                />
              </Link>

              {/* 2. Failed Deliveries */}
              <Link
                to="/orders"
                className={`attention-item ${failedDeliveries > 0 ? 'danger' : 'success'}`}
                title="View Failed Deliveries in Orders module"
              >
                <div className="attention-item-icon-wrapper">
                  {failedDeliveries > 0 ? (
                    <AlertCircle size={17} />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}
                </div>

                <div className="attention-item-content">
                  <div className="attention-item-header">
                    <span className="attention-item-title">Failed Deliveries</span>
                    <span className="attention-item-count-badge">
                      {failedDeliveries > 0
                        ? `${failedDeliveries} Orders`
                        : 'No attention required'}
                    </span>
                  </div>
                  <p className="attention-item-desc">
                    {failedDeliveries > 0
                      ? `${failedDeliveries} order(s) for ${selectedDate} marked failed; require review or rescheduling.`
                      : 'No attention required. Zero failed delivery exceptions for this delivery date.'}
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  style={{ color: 'var(--slate-400)', alignSelf: 'center' }}
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
