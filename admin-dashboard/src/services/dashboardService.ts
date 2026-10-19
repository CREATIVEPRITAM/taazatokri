import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  Query,
  CollectionReference,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS, getISTComponents } from '@taazatokri/shared';

export interface DashboardSummaryMetrics {
  todayOrders: number;
  pendingOrders: number;
  outForDeliveryOrders: number;
  deliveredToday: number;
  failedOrders: number;
  todayCodCollection: number;
  totalCustomers: number;
  activeDeliveryPartners: number;
  totalProducts: number;
  activeCategories: number;
}

export interface DashboardSummaryResult {
  metrics: DashboardSummaryMetrics;
  errors: string[];
}

/**
 * Safely fetches the document count of a collection or query,
 * attempting server-side aggregation first with fallback to getDocs snapshot size.
 */
async function getCollectionCount(q: Query | CollectionReference): Promise<number> {
  try {
    const countSnap = await getCountFromServer(q);
    return countSnap.data().count;
  } catch (err) {
    const docsSnap = await getDocs(q);
    return docsSnap.size;
  }
}

/**
 * Fetches all delivery & order operational metrics scoped strictly to the selected deliveryDate.
 * Computes:
 * - Today's Orders / Selected Date Orders: deliveryDate == selectedDate
 * - Pending: deliveryDate == selectedDate AND orderStatus in ['order_placed', 'confirmed']
 * - Out for Delivery: deliveryDate == selectedDate AND orderStatus == 'out_for_delivery'
 * - Delivered: deliveryDate == selectedDate AND orderStatus == 'delivered'
 * - Failed Delivery: deliveryDate == selectedDate AND orderStatus == 'failed'
 * - COD Collection: deliveryDate == selectedDate AND orderStatus == 'delivered' AND codCollected == true
 */
export async function fetchDeliveryDateMetrics(selectedDate: string) {
  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  const q = query(ordersRef, where('deliveryDate', '==', selectedDate));
  const snap = await getDocs(q);

  let todayOrders = snap.size;
  let pendingOrders = 0;
  let outForDeliveryOrders = 0;
  let deliveredToday = 0;
  let failedOrders = 0;
  let todayCodCollection = 0;

  snap.forEach((docSnap) => {
    const data = docSnap.data();
    const status = data.orderStatus;

    if (status === 'order_placed' || status === 'confirmed') {
      pendingOrders += 1;
    } else if (status === 'out_for_delivery') {
      outForDeliveryOrders += 1;
    } else if (status === 'delivered') {
      deliveredToday += 1;
      if (data.codCollected === true) {
        const amount = data.billSummary?.grandTotal ?? data.grandTotal ?? 0;
        todayCodCollection += Number(amount || 0);
      }
    } else if (status === 'failed') {
      failedOrders += 1;
    }
  });

  return {
    todayOrders,
    pendingOrders,
    outForDeliveryOrders,
    deliveredToday,
    failedOrders,
    todayCodCollection,
  };
}

/**
 * Individual query helper for Pending orders for a specific deliveryDate.
 */
export async function fetchPendingOrdersCount(selectedDate: string): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('deliveryDate', '==', selectedDate),
    where('orderStatus', 'in', ['order_placed', 'confirmed'])
  );
  return getCollectionCount(q);
}

/**
 * Individual query helper for Out for Delivery orders for a specific deliveryDate.
 */
export async function fetchOutForDeliveryOrdersCount(selectedDate: string): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('deliveryDate', '==', selectedDate),
    where('orderStatus', '==', 'out_for_delivery')
  );
  return getCollectionCount(q);
}

/**
 * Individual query helper for Delivered orders for a specific deliveryDate.
 */
export async function fetchDeliveredOrdersCount(selectedDate: string): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('deliveryDate', '==', selectedDate),
    where('orderStatus', '==', 'delivered')
  );
  return getCollectionCount(q);
}

/**
 * Individual query helper for Failed Delivery orders for a specific deliveryDate.
 */
export async function fetchFailedOrdersCount(selectedDate: string): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('deliveryDate', '==', selectedDate),
    where('orderStatus', '==', 'failed')
  );
  return getCollectionCount(q);
}

/**
 * Individual query helper for COD Collection for a specific deliveryDate.
 */
export async function fetchCodCollection(selectedDate: string): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('deliveryDate', '==', selectedDate),
    where('orderStatus', '==', 'delivered'),
    where('codCollected', '==', true)
  );
  const snap = await getDocs(q);
  let total = 0;
  snap.forEach((doc) => {
    const data = doc.data();
    const amount = data.billSummary?.grandTotal ?? data.grandTotal ?? 0;
    total += Number(amount || 0);
  });
  return total;
}

/**
 * Global card query: Count of total customers in the 'users' collection.
 */
export async function fetchTotalCustomersCount(): Promise<number> {
  return getCollectionCount(collection(db, COLLECTIONS.USERS));
}

/**
 * Global card query: Count of delivery partners where status == 'active'.
 */
export async function fetchActiveDeliveryPartnersCount(): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.DELIVERY_PARTNERS),
    where('status', '==', 'active')
  );
  return getCollectionCount(q);
}

/**
 * Global card query: Count of all products in the 'products' collection.
 */
export async function fetchTotalProductsCount(): Promise<number> {
  return getCollectionCount(collection(db, COLLECTIONS.PRODUCTS));
}

/**
 * Global card query: Count of categories where active == true.
 */
export async function fetchActiveCategoriesCount(): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.CATEGORIES),
    where('active', '==', true)
  );
  return getCollectionCount(q);
}

/**
 * Authoritative orchestrator for all 10 summary cards.
 * Scopes the 6 operational delivery/order metrics to `selectedDate`,
 * while keeping the 4 global catalog/user cards global.
 */
export async function fetchDashboardSummary(
  targetDate?: string
): Promise<DashboardSummaryResult> {
  const selectedDate = targetDate || getISTComponents().dateString;
  const errors: string[] = [];

  const initialMetrics: DashboardSummaryMetrics = {
    todayOrders: 0,
    pendingOrders: 0,
    outForDeliveryOrders: 0,
    deliveredToday: 0,
    failedOrders: 0,
    todayCodCollection: 0,
    totalCustomers: 0,
    activeDeliveryPartners: 0,
    totalProducts: 0,
    activeCategories: 0,
  };

  const results = await Promise.allSettled([
    // 0: Operational batch query scoped to selected deliveryDate
    fetchDeliveryDateMetrics(selectedDate),
    // 1: Global: Total Customers
    fetchTotalCustomersCount(),
    // 2: Global: Active Delivery Partners
    fetchActiveDeliveryPartnersCount(),
    // 3: Global: Total Products
    fetchTotalProductsCount(),
    // 4: Global: Active Categories
    fetchActiveCategoriesCount(),
  ]);

  // Operational metrics for selectedDate
  if (results[0].status === 'fulfilled') {
    const op = results[0].value;
    initialMetrics.todayOrders = op.todayOrders;
    initialMetrics.pendingOrders = op.pendingOrders;
    initialMetrics.outForDeliveryOrders = op.outForDeliveryOrders;
    initialMetrics.deliveredToday = op.deliveredToday;
    initialMetrics.failedOrders = op.failedOrders;
    initialMetrics.todayCodCollection = op.todayCodCollection;
  } else {
    console.error('[DashboardService] Error fetching operational metrics for date:', selectedDate, results[0].reason);
    errors.push('Failed to load operational delivery metrics for the selected date.');
  }

  // Global: Total Customers
  if (results[1].status === 'fulfilled') {
    initialMetrics.totalCustomers = results[1].value;
  } else {
    console.error('[DashboardService] Error fetching total customers:', results[1].reason);
    errors.push('Failed to load Total Customers count.');
  }

  // Global: Active Delivery Partners
  if (results[2].status === 'fulfilled') {
    initialMetrics.activeDeliveryPartners = results[2].value;
  } else {
    console.error('[DashboardService] Error fetching active partners:', results[2].reason);
    errors.push('Failed to load Active Delivery Partners count.');
  }

  // Global: Total Products
  if (results[3].status === 'fulfilled') {
    initialMetrics.totalProducts = results[3].value;
  } else {
    console.error('[DashboardService] Error fetching total products:', results[3].reason);
    errors.push('Failed to load Total Products count.');
  }

  // Global: Active Categories
  if (results[4].status === 'fulfilled') {
    initialMetrics.activeCategories = results[4].value;
  } else {
    console.error('[DashboardService] Error fetching active categories:', results[4].reason);
    errors.push('Failed to load Active Categories count.');
  }

  return {
    metrics: initialMetrics,
    errors,
  };
}
