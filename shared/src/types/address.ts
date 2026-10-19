export type AddressLabel = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  userId: string;
  label: AddressLabel;
  contactMobile: string;
  houseFlat: string;
  city: string;
  pincode: string;
  sectorId: string;
  sectorName: string;
  blockId: string;
  blockName: string;
  landmark: string;
  landmarkPhotoUrl?: string; // Optional delivery aid uploaded by customer
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AddressSnapshot = Omit<Address, 'id' | 'userId' | 'isDefault' | 'createdAt' | 'updatedAt'>;
