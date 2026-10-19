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
  primaryPartnerUid?: string | null; // Auth UID of primary partner (authoritative)
  primaryPartnerId?: string | null; // e.g. "DP001" (display reference)
  primaryPartnerName?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
