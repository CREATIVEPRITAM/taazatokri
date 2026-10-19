import React from 'react';
import { Layers, MapPin, Building, Grid } from 'lucide-react';

export type HierarchyLevel = 'all' | 'cities' | 'sectors' | 'blocks';

export interface AreaHierarchyNavProps {
  currentLevel: HierarchyLevel;
  onChangeLevel: (level: HierarchyLevel) => void;
  cityCount: number;
  sectorCount: number;
  blockCount: number;
}

export const AreaHierarchyNav: React.FC<AreaHierarchyNavProps> = ({
  currentLevel,
  onChangeLevel,
  cityCount,
  sectorCount,
  blockCount,
}) => {
  return (
    <nav className="area-hierarchy-nav" aria-label="Hierarchy level navigation">
      <button
        type="button"
        className={`area-nav-tab ${currentLevel === 'all' ? 'active' : ''}`}
        onClick={() => onChangeLevel('all')}
        title="View complete operational hierarchy"
      >
        <Layers size={14} />
        <span>All Hierarchy</span>
      </button>

      <button
        type="button"
        className={`area-nav-tab ${currentLevel === 'cities' ? 'active' : ''}`}
        onClick={() => onChangeLevel('cities')}
        title="View Cities"
      >
        <Building size={14} />
        <span>Cities</span>
        <span className="area-nav-count-badge">{cityCount}</span>
      </button>

      <button
        type="button"
        className={`area-nav-tab ${currentLevel === 'sectors' ? 'active' : ''}`}
        onClick={() => onChangeLevel('sectors')}
        title="View Sectors and Areas"
      >
        <MapPin size={14} />
        <span>Sectors / Areas</span>
        <span className="area-nav-count-badge">{sectorCount}</span>
      </button>

      <button
        type="button"
        className={`area-nav-tab ${currentLevel === 'blocks' ? 'active' : ''}`}
        onClick={() => onChangeLevel('blocks')}
        title="View Blocks"
      >
        <Grid size={14} />
        <span>Blocks</span>
        <span className="area-nav-count-badge">{blockCount}</span>
      </button>
    </nav>
  );
};
