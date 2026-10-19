import React from 'react';
import { Building, Plus, Edit2 } from 'lucide-react';

export interface CityItem {
  id: string;
  name: string;
  totalSectors: number;
  status: 'active' | 'inactive';
}

export interface CityTableProps {
  cities: CityItem[];
  onAddCity: () => void;
  onEditCity: (city: CityItem) => void;
}

export const CityTable: React.FC<CityTableProps> = ({
  cities,
  onAddCity,
  onEditCity,
}) => {
  return (
    <div className="area-section-card" aria-label="Cities Management Section">
      <div className="area-section-header">
        <div className="area-section-title-wrap">
          <div className="area-title-icon">
            <Building size={16} />
          </div>
          <div>
            <h3 className="area-section-title">Cities</h3>
            <p className="area-section-desc">
              Primary geographic boundary for procurement and regional delivery operations.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="area-btn-primary"
          onClick={onAddCity}
          title="Add a new city"
        >
          <Plus size={14} />
          <span>Add City</span>
        </button>
      </div>

      <div className="area-table-wrapper">
        <table className="area-table">
          <thead>
            <tr>
              <th>City Name</th>
              <th>Total Sectors</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.id}>
                <td>
                  <span className="area-item-name">
                    <Building size={14} style={{ color: 'var(--slate-400)' }} />
                    {city.name}
                  </span>
                </td>
                <td>
                  <span className="area-meta-text">
                    {city.totalSectors} {city.totalSectors === 1 ? 'Sector' : 'Sectors'}
                  </span>
                </td>
                <td>
                  <span className={`area-status-badge ${city.status}`}>
                    <span className="area-status-dot" />
                    {city.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="area-actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="area-btn-icon-action"
                      onClick={() => onEditCity(city)}
                      title={`Edit ${city.name}`}
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
