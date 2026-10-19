/**
 * Canonical Firestore Collection Names for TaazaTokari.
 */
export const COLLECTIONS = {
  USERS: 'users',
  ADDRESSES: 'addresses', // subcollection under users/{userId}/addresses
  DELIVERY_PARTNERS: 'deliveryPartners',
  ADMINS: 'admins',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  SECTORS: 'sectors',
  BLOCKS: 'blocks',
  COD_SETTLEMENTS: 'codSettlements',
  PARTNER_PAYMENTS: 'partnerPayments',
  BANNERS: 'banners',
  NOTIFICATIONS: 'notifications',
  SYSTEM_SETTINGS: 'systemSettings',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

/**
 * Standard document keys within systemSettings collection.
 */
export const SETTINGS_DOCUMENTS = {
  BUSINESS_CONFIG: 'business_config',
} as const;
