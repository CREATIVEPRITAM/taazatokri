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
 * Fetches Today's Orders metrics (Total Orders, Delivered Today, Today's COD Collection)
 * for the selected date (defaulting to current IST date).
 */
export async function fetchTodayOrdersMetrics(selectedDate: string) {
  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  const todayQuery = query(ordersRef, where('deliveryDate', '==', selectedDate));
  const snap = await getDocs(todayQuery);

  let todayOrders = snap.size;
  let deliveredToday = 0;
  let todayCodCollection = 0;

  snap.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.orderStatus === 'delivered') {
      deliveredToday += 1;
      if (data.codCollected === true) {
        const amount = data.billSummary?.grandTotal ?? data.grandTotal ?? 0;
        todayCodCollection += Number(amount || 0);
      }
    }
  });

  return {
    todayOrders,
    deliveredToday,
    todayCodCollection,
  };
}

/**
 * Fetches count of current orders awaiting fulfillment (order_placed, confirmed).
 */
export async function fetchPendingOrdersCount(): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('orderStatus', 'in', ['order_placed', 'confirmed'])
  );
  return getCollectionCount(q);
}

/**
 * Fetches count of orders currently out for delivery.
 */
export async function fetchOutForDeliveryOrdersCount(): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('orderStatus', '==', 'out_for_delivery')
  );
  return getCollectionCount(q);
}

/**
 * Fetches count of orders whose current status is failed.
 */
export async function fetchFailedOrdersCount(): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where('orderStatus', '==', 'failed')
  );
  return getCollectionCount(q);
}

/**
 * Fetches count of total customers stored in the 'users' collection.
 */
export async function fetchTotalCustomersCount(): Promise<number> {
  return getCollectionCount(collection(db, COLLECTIONS.USERS));
}

/**
 * Fetches count of delivery partners where status == 'active'.
 */
export async function fetchActiveDeliveryPartnersCount(): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.DELIVERY_PARTNERS),
    where('status', '==', 'active')
  );
  return getCollectionCount(q);
}

/**
 * Fetches count of all products in the 'products' collection.
 */
export async function fetchTotalProductsCount(): Promise<number> {
  return getCollectionCount(collection(db, COLLECTIONS.PRODUCTS));
}

/**
 * Fetches count of categories where active == true.
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
 * Runs queries concurrently and returns metrics with resilient partial-error tracking.
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
    fetchTodayOrdersMetrics(selectedDate),
    fetchPendingOrdersCount(),
    fetchOutForDeliveryOrdersCount(),
    fetchFailedOrdersCount(),
    fetchTotalCustomersCount(),
    fetchActiveDeliveryPartnersCount(),
    fetchTotalProductsCount(),
    fetchActiveCategoriesCount(),
  ]);

  // 1. Today's Orders, Delivered Today, Today's COD Collection
  if (results[0].status === 'fulfilled') {
    initialMetrics.todayOrders = results[0].value.todayOrders;
    initialMetrics.deliveredToday = results[0].value.deliveredToday;
    initialMetrics.todayCodCollection = results[0].value.todayCodCollection;
  } else {
    console.error('[DashboardService] Error fetching today orders:', results[0].reason);
    errors.push('Failed to load Today’s Orders metrics.');
  }

  // 2. Pending Orders
  if (results[1].status === 'fulfilled') {
    initialMetrics.pendingOrders = results[1].value;
  } else {
    console.error('[DashboardService] Error fetching pending orders:', results[1].reason);
    errors.push('Failed to load Pending Orders count.');
  }

  // 3. Out for Delivery Orders
  if (results[2].status === 'fulfilled') {
    initialMetrics.outForDeliveryOrders = results[2].value;
  } else {
    console.error('[DashboardService] Error fetching out for delivery:', results[2].reason);
    errors.push('Failed to load Out for Delivery count.');
  }

  // 4. Failed Delivery Orders
  if (results[3].status === 'fulfilled') {
    initialMetrics.failedOrders = results[3].value;
  } else {
    console.error('[DashboardService] Error fetching failed deliveries:', results[3].reason);
    errors.push('Failed to load Failed Deliveries count.');
  }

  // 5. Total Customers
  if (results[4].status === 'fulfilled') {
    initialMetrics.totalCustomers = results[4].value;
  } else {
    console.error('[DashboardService] Error fetching total customers:', results[4].reason);
    errors.push('Failed to load Total Customers count.');
  }

  // 6. Active Delivery Partners
  if (results[5].status === 'fulfilled') {
    initialMetrics.activeDeliveryPartners = results[5].value;
  } else {
    console.error('[DashboardService] Error fetching active partners:', results[5].reason);
    errors.push('Failed to load Active Delivery Partners count.');
  }

  // 7. Total Products
  if (results[6].status === 'fulfilled') {
    initialMetrics.totalProducts = results[6].value;
  } else {
    console.error('[DashboardService] Error fetching total products:', results[6].reason);
    errors.push('Failed to load Total Products count.');
  }

  // 8. Active Categories
  if (results[7].status === 'fulfilled') {
    initialMetrics.activeCategories = results[7].value;
  } else {
    console.error('[DashboardService] Error fetching active categories:', results[7].reason);
    errors.push('Failed to load Active Categories count.');
  }

  return {
    metrics: initialMetrics,
    errors,
  };
}
