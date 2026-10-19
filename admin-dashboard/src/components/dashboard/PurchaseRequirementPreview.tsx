import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, ArrowRight, Info } from 'lucide-react';

interface PurchaseRow {
  id: string;
  item: string;
  hindiName: string;
  quantity: string;
  category: string;
}

const STATIC_PURCHASE_ROWS: PurchaseRow[] = [
  {
    id: 'p1',
    item: 'Potato (Aloo)',
    hindiName: 'आलू (Jyoti)',
    quantity: '140 kg',
    category: 'Root Vegetables',
  },
  {
    id: 'p2',
    item: 'Onion (Pyaz)',
    hindiName: 'प्याज़ (Nashik Red)',
    quantity: '95 kg',
    category: 'Daily Essentials',
  },
  {
    id: 'p3',
    item: 'Tomato (Tamatar)',
    hindiName: 'टमाटर (Hybrid)',
    quantity: '80 kg',
    category: 'Daily Essentials',
  },
  {
    id: 'p4',
    item: 'Coriander (Dhaniya)',
    hindiName: 'हरा धनिया',
    quantity: '45 bunches',
    category: 'Herbs & Leaves',
  },
  {
    id: 'p5',
    item: 'Green Chilli (Hari Mirch)',
    hindiName: 'हरी मिर्च (Teja)',
    quantity: '18 kg',
    category: 'Herbs & Leaves',
  },
];

export const PurchaseRequirementPreview: React.FC = () => {
  return (
    <div className="dashboard-card" aria-label="Today's Purchase Requirement Preview">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ScrollText size={18} style={{ color: 'var(--primary-700)' }} />
            <h3 className="dashboard-card-title">Today's Purchase Requirement</h3>
          </div>
          <span className="dashboard-card-subtitle">
            Aggregated mandi procurement demand for tomorrow morning
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
        <div className="purchase-table-wrapper">
          <table className="purchase-table">
            <thead>
              <tr>
                <th>Item / Variety</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Total Demand</th>
              </tr>
            </thead>
            <tbody>
              {STATIC_PURCHASE_ROWS.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="purchase-item-name">{row.item}</span>
                    <span style={{ fontSize: '11px', color: 'var(--slate-400)', marginLeft: '6px' }}>
                      ({row.hindiName})
                    </span>
                  </td>
                  <td>{row.category}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="purchase-qty-badge">{row.quantity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="purchase-footer-note">
          <Info size={15} style={{ flexShrink: 0, color: 'var(--primary-700)' }} />
          <span>
            Static procurement preview. Demand aggregates automatically at 11:00 PM IST cutoff.
          </span>
        </div>
      </div>
    </div>
  );
};
