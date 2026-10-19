import React from 'react';
import { MapPin, Plus, Edit2 } from 'lucide-react';

export interface SectorItem {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  totalBlocks: number;
  status: 'active' | 'inactive';
}

export interface SectorTableProps {
  sectors: SectorItem[];
  onAddSector: () => void;
  onEditSector: (sector: SectorItem) => void;
}

export const SectorTable: React.FC<SectorTableProps> = ({
  sectors,
  onAddSector,
  onEditSector,
}) => {
  return (
    <div className="area-section-card" aria-label="Sectors and Areas Management Section">
      <div className="area-section-header">
        <div className="area-section-title-wrap">
          <div className="area-title-icon">
            <MapPin size={16} />
          </div>
          <div>
            <h3 className="area-section-title">Sectors / Areas</h3>
            <p className="area-section-desc">
              Sub-city operational zones grouping residential societies and fulfillment clusters.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="area-btn-primary"
          onClick={onAddSector}
          title="Add a new sector or area"
        >
          <Plus size={14} />
          <span>Add Sector/Area</span>
        </button>
      </div>

      <div className="area-table-wrapper">
        <table className="area-table">
          <thead>
            <tr>
              <th>Sector / Area Name</th>
              <th>City</th>
              <th>Total Blocks</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((sector) => (
              <tr key={sector.id}>
                <td>
                  <span className="area-item-name">
                    <MapPin size={14} style={{ color: 'var(--slate-400)' }} />
                    {sector.name}
                  </span>
                </td>
                <td>
                  <span className="area-meta-text">{sector.cityName}</span>
                </td>
                <td>
                  <span className="area-meta-text">
                    {sector.totalBlocks} {sector.totalBlocks === 1 ? 'Block' : 'Blocks'}
                  </span>
                </td>
                <td>
                  <span className={`area-status-badge ${sector.status}`}>
                    <span className="area-status-dot" />
                    {sector.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="area-actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="area-btn-icon-action"
                      onClick={() => onEditSector(sector)}
                      title={`Edit ${sector.name}`}
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
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
