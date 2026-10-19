/**
 * Locked business rules per TaazaTokari V1 PRD.
 */
export const BUSINESS_RULES = {
  TIMEZONE: 'Asia/Kolkata',
  ORDER_CUTOFF_TIME: '23:00', // 11:00 PM IST (locked operational order cutoff)
  CANCELLATION_CUTOFF_TIME: '23:00', // 11:00 PM IST (locked cancellation cutoff)
  MIN_ORDER_AMOUNT: 50, // ₹50 minimum order threshold
  DELIVERY_FEE_BELOW_THRESHOLD: 20, // ₹20 delivery fee for ₹50–₹99
  FREE_DELIVERY_THRESHOLD: 100, // Free delivery for ₹100+
  DELIVERY_WINDOW: '7:00 AM–9:30 AM', // Fixed morning delivery window
  DEFAULT_PER_DELIVERY_RATE: 30, // ₹30 default partner payable rate per delivery
  SUPPORT_PHONE: '+919999999999',
  SUPPORT_WHATSAPP: '+919999999999',
  SUPPORT_HOURS: '6:00 AM – 10:00 PM',
} as const;

/**
 * Provisional / default opening time for the daily ordering window.
 * This is NOT a locked business rule; the actual value is configurable
 * by Admin via system settings in Firestore.
 */
export const DEFAULT_ORDER_OPENING_TIME = '06:00'; // 06:00 AM IST provisional default

export const MESSAGES = {
  ORDERING_CLOSED: (openingTime: string = DEFAULT_ORDER_OPENING_TIME) =>
    `Ordering is currently closed. The next ordering window opens at ${openingTime}.`,
  CANCELLATION_CLOSED: 'Cancellation window closed.',
  MIN_ORDER_REQUIRED: (min = BUSINESS_RULES.MIN_ORDER_AMOUNT) =>
    `Minimum order amount is ₹${min} to proceed to checkout.`,
} as const;
