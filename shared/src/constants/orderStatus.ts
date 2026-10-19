import { OrderStatus, DeliveryFailureReason } from '../types/order';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  order_placed: 'Order Placed',
  confirmed: 'Confirmed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  failed: 'Unable to Deliver',
} as const;

export const FAILURE_REASON_LABELS: Record<DeliveryFailureReason, string> = {
  customer_unavailable: 'Customer unavailable',
  not_reachable: 'Phone not reachable',
  address_issue: 'Address not found / incomplete',
  refused: 'Customer refused delivery',
  other: 'Other issue',
} as const;

export const CUSTOMER_ACTIVE_STATUSES: readonly OrderStatus[] = [
  'order_placed',
  'confirmed',
  'out_for_delivery',
] as const;

export const CUSTOMER_PAST_STATUSES: readonly OrderStatus[] = [
  'delivered',
  'cancelled',
  'failed',
] as const;
