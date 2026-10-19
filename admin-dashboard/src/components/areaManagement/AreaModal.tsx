import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { CityItem } from './CityTable';
import { SectorItem } from './SectorTable';

export type ModalType = 'city' | 'sector' | 'block';
export type ModalMode = 'add' | 'edit';

export interface AreaModalProps {
  isOpen: boolean;
  type: ModalType | null;
  mode: ModalMode;
  initialData?: any;
  cities: CityItem[];
  sectors: SectorItem[];
  onClose: () => void;
  onSave: (type: ModalType, data: any) => void;
}

export const AreaModal: React.FC<AreaModalProps> = ({
  isOpen,
  type,
  mode,
  initialData,
  cities,
  sectors,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [parentCityId, setParentCityId] = useState('');
  const [parentSectorId, setParentSectorId] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setStatus(initialData.status || 'active');
      setParentCityId(initialData.cityId || (cities[0]?.id ?? ''));
      setParentSectorId(initialData.sectorId || (sectors[0]?.id ?? ''));
    } else {
      setName('');
      setStatus('active');
      setParentCityId(cities[0]?.id ?? '');
      setParentSectorId(sectors[0]?.id ?? '');
    }
  }, [initialData, type, mode, cities, sectors, isOpen]);

  if (!isOpen || !type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(type, {
      id: initialData?.id,
      name: name.trim(),
      status,
      cityId: parentCityId,
      sectorId: parentSectorId,
      cityName: cities.find((c) => c.id === parentCityId)?.name ?? 'Indore',
      sectorName: sectors.find((s) => s.id === parentSectorId)?.name ?? 'Vijay Nagar',
    });
  };

  const getTitle = () => {
    const action = mode === 'add' ? 'Add' : 'Edit';
    if (type === 'city') return `${action} City`;
    if (type === 'sector') return `${action} Sector / Area`;
    return `${action} Block`;
  };

  return (
    <div
      className="area-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={getTitle()}
    >
      <div className="area-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="area-modal-header">
          <h3 className="area-modal-title">{getTitle()}</h3>
          <button
            type="button"
            className="area-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="area-modal-body">
            {/* 1. Name Field */}
            <div className="area-form-group">
              <label className="area-form-label" htmlFor="area-name-input">
                {type === 'city'
                  ? 'City Name'
                  : type === 'sector'
                  ? 'Sector / Area Name'
                  : 'Block Name'}
              </label>
              <input
                id="area-name-input"
                type="text"
                className="area-form-input"
                placeholder={
                  type === 'city'
                    ? 'e.g. Indore, Bhopal'
                    : type === 'sector'
                    ? 'e.g. Vijay Nagar, Palasia'
                    : 'e.g. Scheme 54, Sector B'
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* 2. Parent Hierarchy Fields */}
            {type === 'sector' && (
              <div className="area-form-group">
                <label className="area-form-label" htmlFor="parent-city-select">
                  Parent City
                </label>
                <select
                  id="parent-city-select"
                  className="area-form-select"
                  value={parentCityId}
                  onChange={(e) => setParentCityId(e.target.value)}
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {type === 'block' && (
              <>
                <div className="area-form-group">
                  <label className="area-form-label" htmlFor="parent-sector-select">
                    Parent Sector / Area
                  </label>
                  <select
                    id="parent-sector-select"
                    className="area-form-select"
                    value={parentSectorId}
                    onChange={(e) => setParentSectorId(e.target.value)}
                  >
                    {sectors.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name} ({sec.cityName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Delivery Partner Placeholder (read-only per V1 spec) */}
                <div className="area-form-group">
                  <label className="area-form-label" htmlFor="block-partner-placeholder">
                    Primary Delivery Partner
                  </label>
                  <input
                    id="block-partner-placeholder"
                    type="text"
                    className="area-form-input"
                    value="Not Assigned (Partner mapping configured in subsequent step)"
                    disabled
                  />
                  <span className="area-form-note">
                    Delivery partner mapping logic will be implemented in a subsequent step.
                  </span>
                </div>
              </>
            )}

            {/* 3. Status Field */}
            <div className="area-form-group">
              <label className="area-form-label">Status</label>
              <div className="area-radio-group">
                <label className="area-radio-label">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                  />
                  <span>Active</span>
                </label>
                <label className="area-radio-label">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={status === 'inactive'}
                    onChange={() => setStatus('inactive')}
                  />
                  <span>Inactive</span>
                </label>
              </div>
            </div>

            {/* Static Notice */}
            <div className="area-modal-shell-notice">
              <Info size={14} style={{ flexShrink: 0, color: 'var(--slate-500)' }} />
              <span>
                Step 3A Static UI Shell. Firestore persistence will be connected in Step 3B.
              </span>
            </div>
          </div>

          <div className="area-modal-footer">
            <button
              type="button"
              className="area-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="area-btn-primary"
            >
              {mode === 'add' ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
