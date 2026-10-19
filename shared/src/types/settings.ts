export interface BusinessSettings {
  openingTime: string; // "06:00" in 24hr format
  orderCutoffTime: string; // "23:00" in 24hr format
  cancellationCutoffTime: string; // "23:00" in 24hr format
  deliveryWindow: string; // "7:00 AM–9:30 AM"
  minOrderAmount: number; // ₹50
  deliveryChargeBelowThreshold: number; // ₹20
  freeDeliveryThreshold: number; // ₹100
  defaultPerDeliveryRate: number; // ₹30 default partner rate
  supportPhone: string;
  supportWhatsapp: string;
  supportHours: string;
  codEnabled: boolean; // Always true in V1
  onlinePaymentsEnabled: boolean; // Always false in V1
  updatedAt: string;
}
