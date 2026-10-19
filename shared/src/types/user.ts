export type UserRole = 'customer' | 'delivery_partner' | 'admin';

export type AccountStatus = 'active' | 'blocked' | 'inactive';

export interface CustomerUser {
  id: string;
  name: string;
  mobile: string;
  role: 'customer';
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryPartnerUser {
  id: string;
  partnerId: string; // e.g. "DP001"
  name: string;
  mobile: string;
  photoUrl?: string;
  city: string;
  sectorId: string;
  sectorName: string;
  blockId: string;
  blockName: string;
  status: AccountStatus;
  perDeliveryRate: number; // e.g. ₹30 per delivery
  fcmToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt: string;
  updatedAt: string;
}
