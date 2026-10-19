export interface City {
  id: string;
  name: string;
  active: boolean;
}

export interface Sector {
  id: string;
  name: string;
  cityName: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: string;
  name: string;
  sectorId: string;
  sectorName: string;
  cityName: string;
  primaryPartnerId?: string | null; // 1 primary active partner per Block in V1
  primaryPartnerName?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
