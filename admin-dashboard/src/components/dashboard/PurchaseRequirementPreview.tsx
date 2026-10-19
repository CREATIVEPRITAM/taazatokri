import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, ArrowRight, Info, CheckCircle2, RotateCcw } from 'lucide-react';
import { usePurchaseRequirementPreview } from '../../hooks/usePurchaseRequirementPreview';

export interface PurchaseRequirementPreviewProps {
  selectedDate: string;
}

/**
 * Format total quantity and unit cleanly preserving unit integrity.
 * e.g. 140 with '1 kg' -> '140 kg'
 *      3 with '500 g'  -> '3 × 500 g'
 *      45 with '1 bunch' -> '45 bunches'
 */
export function formatDemandQuantity(quantity: number, unit: string): string {
  if (!unit) return `${quantity}`;
  const trimmed = unit.trim();
  const lower = trimmed.toLowerCase();

  // If unit starts with "1 " (e.g. "1 kg", "1 packet", "1 bunch", "1 pc")
  if (lower.startsWith('1 ') && trimmed.length > 2) {
    const baseUnit = trimmed.slice(2).trim();
    if (baseUnit.toLowerCase() === 'bunch') {
      return `${quantity} ${quantity === 1 ? 'bunch' : 'bunches'}`;
    }
    return `${quantity} ${baseUnit}`;
  }

  // If unit is plain "kg", "g", "bunches", "packets"
  if (['kg', 'g', 'bunch', 'bunches', 'packet', 'packets', 'pc', 'pcs'].includes(lower)) {
    if (lower === 'bunch') {
      return `${quantity} ${quantity === 1 ? 'bunch' : 'bunches'}`;
    }
    return `${quantity} ${trimmed}`;
  }

  // Sold unit grouping preserving sold pack size (e.g. 3 × 500 g, 2 × 250 g)
  return `${quantity} × ${trimmed}`;
}

// Reference produce catalog types supported: Potato (Aloo), Onion (Pyaz), Tomato (Tamatar)
export const PurchaseRequirementPreview: React.FC<PurchaseRequirementPreviewProps> = ({
  selectedDate,
}) => {
  const { data, loading, error, refetch } = usePurchaseRequirementPreview(selectedDate);
  const { items, totalRequirementsCount } = data;

  return (
    <div className="dashboard-card" aria-label="Today's Purchase Requirement Preview">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ScrollText size={18} style={{ color: 'var(--primary-700)' }} />
            <h3 className="dashboard-card-title">Today's Purchase Requirement</h3>
          </div>
          <span className="dashboard-card-subtitle">
            Aggregated mandi procurement demand for {selectedDate}
          </span>
        </div>
        <Link
          to="/purchase-requirements"
          className="dashboard-card-action-link"
          title="Open full Purchase Requirement module"
        >
          <span>View Purchase Requirement</span>
          <ArrowRight size={14} />
        </Link>
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

        <div className="purchase-table-wrapper">
          <table className="purchase-table">
            <thead>
              <tr>
                <th>Item / Variety</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Orders</th>
                <th style={{ textAlign: 'right' }}>Total Demand</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading Skeleton Rows
                [1, 2, 3, 4, 5].map((idx) => (
                  <tr key={`skeleton-${idx}`}>
                    <td>
                      <div className="purchase-item-skeleton" style={{ width: '75%' }} />
                    </td>
                    <td>
                      <div className="purchase-item-skeleton" style={{ width: '60%' }} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div
                        className="purchase-item-skeleton"
                        style={{ width: '30px', margin: '0 auto' }}
                      />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div
                        className="purchase-item-skeleton"
                        style={{ width: '50px', marginLeft: 'auto' }}
                      />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                // Clean Zero State
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '28px 16px' }}>
                    <div className="purchase-empty-state">
                      <CheckCircle2
                        size={26}
                        style={{
                          color: 'var(--primary-600)',
                          marginBottom: '8px',
                        }}
                      />
                      <p
                        style={{
                          fontWeight: 600,
                          color: 'var(--slate-800)',
                          fontSize: '13px',
                          margin: '0 0 4px 0',
                        }}
                      >
                        No procurement requirements
                      </p>
                      <p style={{ color: 'var(--slate-500)', fontSize: '12px', margin: 0 }}>
                        No active customer orders requiring mandi purchase for {selectedDate}.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Real Aggregated Purchase Preview Rows
                items.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className="purchase-item-name">{row.productName}</span>
                    </td>
                    <td>{row.categoryName}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="purchase-order-count">{row.orderCount}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="purchase-qty-badge">
                        {formatDemandQuantity(row.totalQuantity, row.unit)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="purchase-footer-note">
          <Info size={15} style={{ flexShrink: 0, color: 'var(--primary-700)' }} />
          <span>
            {loading ? (
              'Aggregating procurement demand from active orders...'
            ) : items.length === 0 ? (
              `No active procurement orders for ${selectedDate}. Demand aggregates automatically as orders are placed.`
            ) : totalRequirementsCount > items.length ? (
              `Showing top ${items.length} of ${totalRequirementsCount} items for ${selectedDate}. Mandi procurement cutoff: 11:00 PM IST.`
            ) : (
              `Live demand aggregated from ${totalRequirementsCount} items for ${selectedDate}. Mandi procurement cutoff: 11:00 PM IST.`
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
