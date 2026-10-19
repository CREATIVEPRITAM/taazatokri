import React from 'react';
import { Grid, Plus, Edit2, CheckCircle, XCircle } from 'lucide-react';

export interface BlockItem {
  id: string;
  name: string;
  sectorId: string;
  sectorName: string;
  cityName: string;
  primaryPartner: string; // Placeholder string only
  status: 'active' | 'inactive';
}

export interface BlockTableProps {
  blocks: BlockItem[];
  onAddBlock: () => void;
  onEditBlock: (block: BlockItem) => void;
  onToggleStatus: (block: BlockItem) => void;
}

export const BlockTable: React.FC<BlockTableProps> = ({
  blocks,
  onAddBlock,
  onEditBlock,
  onToggleStatus,
}) => {
  return (
    <div className="area-section-card" aria-label="Blocks Management Section">
      <div className="area-section-header">
        <div className="area-section-title-wrap">
          <div className="area-title-icon">
            <Grid size={16} />
          </div>
          <div>
            <h3 className="area-section-title">Blocks</h3>
            <p className="area-section-desc">
              Granular delivery assignment units mapped to a primary delivery partner.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="area-btn-primary"
          onClick={onAddBlock}
          title="Add a new block"
        >
          <Plus size={14} />
          <span>Add Block</span>
        </button>
      </div>

      <div className="area-table-wrapper">
        <table className="area-table">
          <thead>
            <tr>
              <th>Block Name</th>
              <th>Sector / Area</th>
              <th>City</th>
              <th>Primary Delivery Partner</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.id}>
                <td>
                  <span className="area-item-name">
                    <Grid size={14} style={{ color: 'var(--slate-400)' }} />
                    {block.name}
                  </span>
                </td>
                <td>
                  <span className="area-meta-text">{block.sectorName}</span>
                </td>
                <td>
                  <span className="area-meta-text">{block.cityName}</span>
                </td>
                <td>
                  <span
                    className={`area-partner-pill ${
                      block.primaryPartner !== 'Not Assigned' ? 'assigned' : ''
                    }`}
                    title="Partner mapping logic will be configured in a subsequent step"
                  >
                    {block.primaryPartner}
                  </span>
                </td>
                <td>
                  <span className={`area-status-badge ${block.status}`}>
                    <span className="area-status-dot" />
                    {block.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="area-actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="area-btn-icon-action"
                      onClick={() => onEditBlock(block)}
                      title={`Edit ${block.name}`}
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>

                    {/* Activate / Deactivate UI placeholder */}
                    <button
                      type="button"
                      className={`area-btn-toggle-status ${
                        block.status === 'active' ? 'deactivate' : 'activate'
                      }`}
                      onClick={() => onToggleStatus(block)}
                      title={`${
                        block.status === 'active' ? 'Deactivate' : 'Activate'
                      } ${block.name} (Static UI Shell)`}
                    >
                      {block.status === 'active' ? (
                        <>
                          <XCircle size={12} />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={12} />
                          <span>Activate</span>
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
