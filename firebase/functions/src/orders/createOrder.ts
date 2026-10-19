import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../config/firebase';
import {
  COLLECTIONS,
  SETTINGS_DOCUMENTS,
  BUSINESS_RULES,
  DEFAULT_ORDER_OPENING_TIME,
  MESSAGES,
  isOrderWindowOpen,
  getNextDeliveryDate,
  calculateBillSummary,
  isMinimumOrderMet,
  Order,
  OrderItem,
  AddressSnapshot,
  BusinessSettings,
  Product,
} from '@taazatokri/shared';
import { findPrimaryPartnerForBlock } from '../assignment/autoAssignPartner';

interface CreateOrderRequest {
  deliveryAddress: AddressSnapshot;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  deliveryDate: string;
  deliveryWindow: string;
  grandTotal: number;
}

/**
 * Generates a human-readable Order ID: TT-YYMMDD-XXXX
 */
function generateOrderId(deliveryDate: string): string {
  // Format: TT-YYMMDD-XXXX
  const dateCompact = deliveryDate.replace(/-/g, '').slice(2); // "261020"
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit code
  return `TT-${dateCompact}-${randomSuffix}`;
}

export const createOrder = onCall<CreateOrderRequest>(
  { region: 'asia-south1' },
  async (request): Promise<CreateOrderResponse> => {
    // 1. Verify user authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be logged in to place an order.');
    }
    const customerId = request.auth.uid;
    const customerMobile = request.auth.token.phone_number || '';
    const customerName = request.auth.token.name || 'Valued Customer';

    // 2. Fetch business settings to determine configurable opening time
    let openingTime: string = DEFAULT_ORDER_OPENING_TIME;
    let cutoffTime: string = BUSINESS_RULES.ORDER_CUTOFF_TIME;
    let minOrderAmount: number = BUSINESS_RULES.MIN_ORDER_AMOUNT;

    try {
      const settingsDoc = await db
        .collection(COLLECTIONS.SYSTEM_SETTINGS)
        .doc(SETTINGS_DOCUMENTS.BUSINESS_CONFIG)
        .get();

      if (settingsDoc.exists) {
        const settings = settingsDoc.data() as Partial<BusinessSettings>;
        if (settings.openingTime) openingTime = settings.openingTime;
        if (settings.orderCutoffTime) cutoffTime = settings.orderCutoffTime;
        if (settings.minOrderAmount) minOrderAmount = settings.minOrderAmount;
      }
    } catch (err) {
      console.warn('[CreateOrder] Failed to read settings, using defaults:', err);
    }

    // 3. Validate ordering window in Asia/Kolkata
    const now = new Date();
    const windowOpen = isOrderWindowOpen({
      openingTime,
      cutoffTime,
      now,
    });

    if (!windowOpen) {
      throw new HttpsError(
        'failed-precondition',
        MESSAGES.ORDERING_CLOSED(openingTime)
      );
    }

    // 4. Validate payload structure
    const { deliveryAddress, items } = request.data;
    if (!deliveryAddress || !deliveryAddress.sectorId || !deliveryAddress.blockId) {
      throw new HttpsError(
        'invalid-argument',
        'A valid delivery address with Sector and Block selection is required.'
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new HttpsError('invalid-argument', 'Cart must contain at least one product.');
    }

    // 5. Server-side price recalculation & product validation
    const verifiedItems: OrderItem[] = [];
    let calculatedItemsTotal = 0;

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new HttpsError('invalid-argument', 'Invalid product item in order.');
      }

      const productDoc = await db
        .collection(COLLECTIONS.PRODUCTS)
        .doc(item.productId)
        .get();

      if (!productDoc.exists) {
        throw new HttpsError('not-found', `Product ${item.productId} was not found.`);
      }

      const product = productDoc.data() as Product;
      if (!product.active || !product.isAvailable) {
        throw new HttpsError(
          'failed-precondition',
          `Product "${product.name}" is currently out of stock or unavailable.`
        );
      }

      const subtotal = product.price * item.quantity;
      calculatedItemsTotal += subtotal;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        unit: product.unit,
        price: product.price,
        quantity: item.quantity,
        subtotal,
        imageUrl: product.imageUrl || '',
        productType: product.productType,
      });
    }

    // 6. Validate minimum order requirement (₹50 in V1)
    if (!isMinimumOrderMet(calculatedItemsTotal)) {
      throw new HttpsError(
        'invalid-argument',
        MESSAGES.MIN_ORDER_REQUIRED(minOrderAmount)
      );
    }

    // 7. Calculate deterministic bill summary (₹20 for ₹50–₹99; ₹0 for ₹100+)
    const billSummary = calculateBillSummary(calculatedItemsTotal);

    // 8. Auto-assign primary delivery partner for the selected Block
    const partnerMapping = await findPrimaryPartnerForBlock(deliveryAddress.blockId);

    // 9. Delivery scheduling: Next eligible morning 7:00 AM – 9:30 AM
    const deliveryDate = getNextDeliveryDate(now);
    const deliveryWindow = BUSINESS_RULES.DELIVERY_WINDOW;

    // 10. Generate readable Order ID
    const orderId = generateOrderId(deliveryDate);
    const nowIso = now.toISOString();

    const orderData: Order = {
      id: orderId,
      customerId,
      customerName,
      customerMobile: deliveryAddress.contactMobile || customerMobile,
      deliveryAddress,
      items: verifiedItems,
      billSummary,
      deliveryDate,
      deliveryWindow,
      paymentMethod: 'COD',
      orderStatus: 'order_placed',
      assignedPartnerId: partnerMapping ? partnerMapping.partnerId : null,
      assignedPartnerName: partnerMapping ? partnerMapping.partnerName : null,
      failureReason: null,
      failureNote: null,
      cancellationReason: null,
      codCollected: false,
      timeline: [
        {
          status: 'order_placed',
          timestamp: nowIso,
          updatedBy: 'customer',
          note: partnerMapping
            ? `Order placed and auto-assigned to ${partnerMapping.partnerName}`
            : 'Order placed; pending partner mapping (Attention Required)',
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // 11. Atomic document write
    await db.collection(COLLECTIONS.ORDERS).doc(orderId).set(orderData);

    return {
      success: true,
      orderId,
      deliveryDate,
      deliveryWindow,
      grandTotal: billSummary.grandTotal,
    };
  }
);
