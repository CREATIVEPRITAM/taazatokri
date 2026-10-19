import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../config/firebase';
import {
  COLLECTIONS,
  SETTINGS_DOCUMENTS,
  BUSINESS_RULES,
  MESSAGES,
  isCancellationAllowed,
  Order,
  BusinessSettings,
} from '@taazatokri/shared';

interface CancelOrderRequest {
  orderId: string;
  reason?: string;
}

interface CancelOrderResponse {
  success: boolean;
  orderId: string;
  message: string;
}

export const cancelOrder = onCall<CancelOrderRequest>(
  { region: 'asia-south1' },
  async (request): Promise<CancelOrderResponse> => {
    // 1. Verify user authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be logged in to cancel an order.');
    }
    const customerId = request.auth.uid;
    const { orderId, reason } = request.data;

    if (!orderId) {
      throw new HttpsError('invalid-argument', 'Valid Order ID is required.');
    }

    const orderRef = db.collection(COLLECTIONS.ORDERS).doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      throw new HttpsError('not-found', `Order ${orderId} does not exist.`);
    }

    const order = orderDoc.data() as Order;

    // 2. Ownership verification
    if (order.customerId !== customerId) {
      throw new HttpsError('permission-denied', 'You do not have permission to cancel this order.');
    }

    // 3. Status verification (can only self-cancel while in 'order_placed')
    if (order.orderStatus !== 'order_placed') {
      throw new HttpsError(
        'failed-precondition',
        `Order is currently "${order.orderStatus}" and can no longer be self-cancelled.`
      );
    }

    // 4. Fetch business settings for cancellation cutoff time
    let cutoffTime: string = BUSINESS_RULES.CANCELLATION_CUTOFF_TIME;
    try {
      const settingsDoc = await db
        .collection(COLLECTIONS.SYSTEM_SETTINGS)
        .doc(SETTINGS_DOCUMENTS.BUSINESS_CONFIG)
        .get();

      if (settingsDoc.exists) {
        const settings = settingsDoc.data() as Partial<BusinessSettings>;
        if (settings.cancellationCutoffTime) {
          cutoffTime = settings.cancellationCutoffTime;
        }
      }
    } catch (err) {
      console.warn('[CancelOrder] Failed to read settings, using defaults:', err);
    }

    // 5. Strict 11:00 PM cutoff validation in Asia/Kolkata
    const now = new Date();
    const allowed = isCancellationAllowed(order.createdAt, now, cutoffTime);
    if (!allowed) {
      throw new HttpsError('failed-precondition', MESSAGES.CANCELLATION_CLOSED);
    }

    // 6. Atomic status transition
    const nowIso = now.toISOString();
    const cancellationNote = reason || 'Customer self-cancelled before 11:00 PM cutoff';

    await orderRef.update({
      orderStatus: 'cancelled',
      cancellationReason: cancellationNote,
      updatedAt: nowIso,
      timeline: [
        ...order.timeline,
        {
          status: 'cancelled',
          timestamp: nowIso,
          updatedBy: 'customer',
          note: cancellationNote,
        },
      ],
    });

    return {
      success: true,
      orderId,
      message: 'Order was successfully cancelled.',
    };
  }
);
