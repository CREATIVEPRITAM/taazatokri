export type NotificationType =
  | 'order_status'
  | 'offer'
  | 'seasonal_alert'
  | 'service_update';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkType?: 'category' | 'product' | 'none';
  linkTargetId?: string;
  displayOrder: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId?: string; // If targeted to individual user; null for broadcast
  title: string;
  message: string;
  type: NotificationType;
  targetAudience: 'all' | 'sector' | 'individual';
  targetSectorId?: string;
  orderId?: string;
  isRead?: boolean;
  createdAt: string;
}
