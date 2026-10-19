export type CodSettlementStatus = 'pending' | 'settled';
export type PartnerPaymentStatus = 'pending' | 'paid';

export interface CodSettlement {
  id: string;
  partnerUid: string; // Auth UID for authorization
  partnerId: string; // Display reference (e.g. "DP001")
  partnerName: string;
  date: string; // YYYY-MM-DD
  codCollected: number; // Cash received from delivered orders
  codSubmitted: number; // Cash handed over to Admin
  codPending: number; // codCollected - codSubmitted
  status: CodSettlementStatus;
  settledAt?: string;
  settledBy?: string;
  updatedAt: string;
}

export interface PartnerPayment {
  id: string;
  partnerUid: string; // Auth UID for authorization
  partnerId: string; // Display reference (e.g. "DP001")
  partnerName: string;
  date: string; // YYYY-MM-DD
  payableDeliveries: number; // Successful deliveries count
  perDeliveryRate: number; // Rate per delivery in ₹
  totalAmount: number; // payableDeliveries * perDeliveryRate
  status: PartnerPaymentStatus;
  paidAt?: string;
  paidBy?: string;
  updatedAt: string;
}
