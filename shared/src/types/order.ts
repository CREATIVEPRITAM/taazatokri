import { AddressSnapshot } from './address';
import { ProductType } from './product';

export type OrderStatus =
  | 'order_placed'
  | 'confirmed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export type DeliveryFailureReason =
  | 'customer_unavailable'
  | 'not_reachable'
  | 'address_issue'
  | 'refused'
  | 'other';

export interface OrderItem {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
  productType: ProductType;
}

export interface BillSummary {
  itemsTotal: number;
  deliveryCharge: number; // ₹20 for ₹50–₹99; ₹0 for ₹100+
  discount: number; // ₹0 default in V1 unless offer applies
  grandTotal: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  updatedBy: string; // 'customer' | 'partner' | 'admin' | 'system'
  note?: string;
}

export interface Order {
  id: string; // Formatted Order ID, e.g. TT-261019-001
  customerId: string;
  customerName: string;
  customerMobile: string;
  deliveryAddress: AddressSnapshot;
  items: OrderItem[];
  billSummary: BillSummary;
  deliveryDate: string; // YYYY-MM-DD (next eligible morning)
  deliveryWindow: string; // Fixed "7:00 AM–9:30 AM"
  paymentMethod: 'COD'; // COD only in V1
  orderStatus: OrderStatus;
  assignedPartnerId?: string | null;
  assignedPartnerName?: string | null;
  failureReason?: DeliveryFailureReason | null;
  failureNote?: string | null;
  cancellationReason?: string | null;
  codCollected: boolean; // Flagged true upon delivery confirmation
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}
