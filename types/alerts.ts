export type AlertType = 'price' | 'portfolio' | 'strategy' | 'system';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'triggered' | 'dismissed';

export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  title: string;
  description: string;
  condition?: string;
  targetValue?: number;
  currentValue?: number;
  strategyId?: string;
  createdAt: Date;
  triggeredAt?: Date;
  dismissedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  alertId: string;
  title: string;
  message: string;
  type: AlertType;
  priority: AlertPriority;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
}

export interface AlertFormData {
  type: AlertType;
  priority: AlertPriority;
  title: string;
  description: string;
  condition?: string;
  targetValue?: number;
  strategyId?: string;
}
