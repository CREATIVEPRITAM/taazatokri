export type AccountStatus = 'active' | 'blocked' | 'inactive';

/**
 * Customer profile stored strictly in the 'users' collection.
 * Document ID: Firebase Auth UID.
 */
export interface CustomerUser {
  uid: string; // Firebase Auth UID
  name: string;
  mobile: string;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Delivery partner profile stored strictly in the 'deliveryPartners' collection.
 * Document ID: Firebase Auth UID (authUid).
 * authUid is used for authorization & Firestore security rules.
 * partnerId (e.g. "DP001") is used solely for human-readable business display.
 */
export interface DeliveryPartnerUser {
  authUid: string; // Firebase Auth UID (used for authorization)
  partnerId: string; // Human-readable business reference ID (e.g. "DP001")
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

/**
 * Admin profile stored strictly in the dedicated 'admins' collection.
 * Document ID: Firebase Auth UID.
 * Validated via admins/{uid} document existence and/or custom claims.
 */
export interface AdminUser {
  uid: string; // Firebase Auth UID
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
