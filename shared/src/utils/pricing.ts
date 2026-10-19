import { BUSINESS_RULES } from '../constants/businessRules';
import { BillSummary } from '../types/order';

/**
 * Checks whether an items total meets the minimum order requirement (₹50 in V1).
 */
export function isMinimumOrderMet(
  itemsTotal: number,
  minOrderAmount: number = BUSINESS_RULES.MIN_ORDER_AMOUNT
): boolean {
  return itemsTotal >= minOrderAmount;
}

/**
 * Calculates deterministic bill summary for TaazaTokari V1.
 * - Minimum order: ₹50
 * - Delivery fee: ₹20 if itemsTotal between ₹50 and ₹99; ₹0 if ₹100 or above
 * - Grand total: itemsTotal + deliveryCharge - discount
 */
export function calculateBillSummary(itemsTotal: number, discount = 0): BillSummary {
  const deliveryCharge =
    itemsTotal >= BUSINESS_RULES.FREE_DELIVERY_THRESHOLD
      ? 0
      : BUSINESS_RULES.DELIVERY_FEE_BELOW_THRESHOLD;

  const grandTotal = Math.max(0, itemsTotal + deliveryCharge - discount);

  return {
    itemsTotal,
    deliveryCharge,
    discount,
    grandTotal,
  };
}
