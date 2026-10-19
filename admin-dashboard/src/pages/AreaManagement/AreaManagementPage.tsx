import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { AreaHierarchyNav, HierarchyLevel } from '../../components/areaManagement/AreaHierarchyNav';
import { CityTable, CityItem } from '../../components/areaManagement/CityTable';
import { SectorTable, SectorItem } from '../../components/areaManagement/SectorTable';
import { BlockTable, BlockItem } from '../../components/areaManagement/BlockTable';
import { AreaModal, ModalType, ModalMode } from '../../components/areaManagement/AreaModal';
import '../../styles/areaManagement.css';

// Initial Approved V1 Static Hierarchy Data
const INITIAL_CITIES: CityItem[] = [
  {
    id: 'city-indore',
    name: 'Indore',
    totalSectors: 2,
    status: 'active',
  },
  {
    id: 'city-bhopal',
    name: 'Bhopal',
    totalSectors: 0,
    status: 'inactive',
  },
];

const INITIAL_SECTORS: SectorItem[] = [
  {
    id: 'sec-vijay-nagar',
    name: 'Vijay Nagar',
    cityId: 'city-indore',
    cityName: 'Indore',
    totalBlocks: 2,
    status: 'active',
  },
  {
    id: 'sec-palasia',
    name: 'Palasia',
    cityId: 'city-indore',
    cityName: 'Indore',
    totalBlocks: 2,
    status: 'active',
  },
];

const INITIAL_BLOCKS: BlockItem[] = [
  {
    id: 'blk-scheme-54',
    name: 'Scheme 54',
    sectorId: 'sec-vijay-nagar',
    sectorName: 'Vijay Nagar',
    cityName: 'Indore',
    primaryPartner: 'Not Assigned',
    status: 'active',
  },
  {
    id: 'blk-scheme-74',
    name: 'Scheme 74',
    sectorId: 'sec-vijay-nagar',
    sectorName: 'Vijay Nagar',
    cityName: 'Indore',
    primaryPartner: 'Not Assigned',
    status: 'active',
  },
  {
    id: 'blk-old-palasia',
    name: 'Old Palasia',
    sectorId: 'sec-palasia',
    sectorName: 'Palasia',
    cityName: 'Indore',
    primaryPartner: 'Not Assigned',
    status: 'active',
  },
  {
    id: 'blk-new-palasia',
    name: 'New Palasia',
    sectorId: 'sec-palasia',
    sectorName: 'Palasia',
    cityName: 'Indore',
    primaryPartner: 'Not Assigned',
    status: 'inactive',
  },
];

export const AreaManagementPage: React.FC = () => {
  // Navigation hierarchy level filter
  const [currentLevel, setCurrentLevel] = useState<HierarchyLevel>('all');

  // Static Local State
  const [cities, setCities] = useState<CityItem[]>(INITIAL_CITIES);
  const [sectors, setSectors] = useState<SectorItem[]>(INITIAL_SECTORS);
  const [blocks, setBlocks] = useState<BlockItem[]>(INITIAL_BLOCKS);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Modal Handlers
  const handleOpenAdd = (type: ModalType) => {
    setModalType(type);
    setModalMode('add');
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (type: ModalType, item: any) => {
    setModalType(type);
    setModalMode('edit');
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    setEditingItem(null);
  };

  // Static Save Handler (Local UI state update only, zero Firestore)
  const handleSaveModal = (type: ModalType, data: any) => {
    if (modalMode === 'add') {
      const newId = `${type}-${Date.now()}`;
      if (type === 'city') {
        setCities((prev) => [...prev, { ...data, id: newId, totalSectors: 0 }]);
      } else if (type === 'sector') {
        setSectors((prev) => [...prev, { ...data, id: newId, totalBlocks: 0 }]);
        // Increment parent city sector count
        setCities((prev) =>
          prev.map((c) =>
            c.id === data.cityId ? { ...c, totalSectors: c.totalSectors + 1 } : c
          )
        );
      } else if (type === 'block') {
        setBlocks((prev) => [
          ...prev,
          { ...data, id: newId, primaryPartner: 'Not Assigned' },
        ]);
        // Increment parent sector block count
        setSectors((prev) =>
          prev.map((s) =>
            s.id === data.sectorId ? { ...s, totalBlocks: s.totalBlocks + 1 } : s
          )
        );
      }
    } else {
      // Edit mode
      if (type === 'city') {
        setCities((prev) =>
          prev.map((c) => (c.id === data.id ? { ...c, ...data } : c))
        );
      } else if (type === 'sector') {
        setSectors((prev) =>
          prev.map((s) => (s.id === data.id ? { ...s, ...data } : s))
        );
      } else if (type === 'block') {
        setBlocks((prev) =>
          prev.map((b) => (b.id === data.id ? { ...b, ...data } : b))
        );
      }
    }
    handleCloseModal();
  };

  // Block Activate / Deactivate Toggle (Static UI Shell)
  const handleToggleBlockStatus = (block: BlockItem) => {
    const nextStatus = block.status === 'active' ? 'inactive' : 'active';
    setBlocks((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, status: nextStatus } : b))
    );
  };

  return (
    <div className="area-management-page">
      {/* 1. Area Management Header */}
      <div className="area-header">
        <div className="area-header-top">
          <div className="area-title-group">
            <div className="area-title-icon">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="area-page-title">Area Management</h2>
              <p className="area-page-subtitle">
                Manage City, Sector/Area, and Block hierarchy for order assignment and delivery coverage.
              </p>
            </div>
          </div>

          {/* Hierarchy Level Tabs */}
          <AreaHierarchyNav
            currentLevel={currentLevel}
            onChangeLevel={setCurrentLevel}
            cityCount={cities.length}
            sectorCount={sectors.length}
            blockCount={blocks.length}
          />
        </div>
      </div>

      {/* 2. City Section / Table */}
      {(currentLevel === 'all' || currentLevel === 'cities') && (
        <CityTable
          cities={cities}
          onAddCity={() => handleOpenAdd('city')}
          onEditCity={(city) => handleOpenEdit('city', city)}
        />
      )}

      {/* 3. Sector / Area Section / Table */}
      {(currentLevel === 'all' || currentLevel === 'sectors') && (
        <SectorTable
          sectors={sectors}
          onAddSector={() => handleOpenAdd('sector')}
          onEditSector={(sector) => handleOpenEdit('sector', sector)}
        />
      )}

      {/* 4. Block Section / Table */}
      {(currentLevel === 'all' || currentLevel === 'blocks') && (
        <BlockTable
          blocks={blocks}
          onAddBlock={() => handleOpenAdd('block')}
          onEditBlock={(block) => handleOpenEdit('block', block)}
          onToggleStatus={handleToggleBlockStatus}
        />
      )}

      {/* 5. Static Add / Edit Modal Shell */}
      <AreaModal
        isOpen={modalOpen}
        type={modalType}
        mode={modalMode}
        initialData={editingItem}
        cities={cities}
        sectors={sectors}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
      />
    </div>
  );
};
