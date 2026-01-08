'use client';

import { useState } from 'react';
import { Notification, AlertPriority } from '@/types/alerts';
import { Button } from '@/components/ui/button';
import { X, Check, Archive } from 'lucide-react';

// Mock data - replace with actual API calls
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    alertId: 'alert1',
    title: 'Price Alert Triggered',
    message: 'Bitcoin has reached $50,000. Your price alert has been triggered.',
    type: 'price',
    priority: 'high',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actionUrl: '/alerts?id=alert1',
  },
  {
    id: '2',
    userId: 'user1',
    alertId: 'alert2',
    title: 'Portfolio Alert',
    message: 'Your portfolio value has dropped 20% from the initial investment.',
    type: 'portfolio',
    priority: 'critical',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    actionUrl: '/watchlist',
  },
  {
    id: '3',
    userId: 'user1',
    alertId: 'alert3',
    title: 'Strategy Performance Update',
    message: 'Your daily momentum strategy has a 3% gain today.',
    type: 'strategy',
    priority: 'medium',
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    actionUrl: '/strategies',
  },
  {
    id: '4',
    userId: 'user1',
    alertId: 'alert4',
    title: 'System Maintenance',
    message: 'System maintenance will occur on Jan 15, 2026 at 2:00 AM UTC.',
    type: 'system',
    priority: 'low',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(
    MOCK_NOTIFICATIONS
  );
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsRead = async (notificationId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId
            ? { ...n, read: true, readAt: new Date() }
            : n
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async (notificationId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setNotifications(
        notifications.map((n) =>
          !n.read ? { ...n, read: true, readAt: new Date() } : n
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.read);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPriorityColor = (priority: AlertPriority) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-900/10';
      case 'high':
        return 'border-l-orange-500 bg-orange-900/10';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-900/10';
      case 'low':
        return 'border-l-blue-500 bg-blue-900/10';
      default:
        return 'border-l-gray-500 bg-gray-900/10';
    }
  };

  const getPriorityBadge = (priority: AlertPriority) => {
    const baseClasses = 'text-xs px-2 py-1 rounded font-semibold';
    switch (priority) {
      case 'critical':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      case 'high':
        return `${baseClasses} bg-orange-500/20 text-orange-400`;
      case 'medium':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case 'low':
        return `${baseClasses} bg-blue-500/20 text-blue-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'unread', 'read'] as const).map((status) => (
          <Button
            key={status}
            onClick={() => setFilter(status)}
            className={`capitalize ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {status === 'all'
              ? `All (${notifications.length})`
              : status === 'unread'
              ? `Unread (${unreadCount})`
              : `Read (${notifications.filter((n) => n.read).length})`}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-gray-400">
              {filter === 'unread'
                ? 'No unread notifications'
                : filter === 'read'
                ? 'No read notifications'
                : 'No notifications'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-l-4 p-4 rounded-lg transition-all hover:shadow-md ${getPriorityColor(
                notification.priority
              )} ${!notification.read ? 'bg-opacity-50' : 'bg-opacity-30'}`}
            >
              <div className="flex items-start gap-4">
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-white">
                          {notification.title}
                        </h3>
                        <span className={getPriorityBadge(notification.priority)}>
                          {notification.priority}
                        </span>
                        {!notification.read && (
                          <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>
                          {new Date(notification.createdAt).toLocaleDateString()}{' '}
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </span>
                        {notification.readAt && (
                          <span>
                            Read:{' '}
                            {new Date(notification.readAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={isLoading}
                          className="p-2 hover:bg-gray-700 rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-blue-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        disabled={isLoading}
                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block"
                    >
                      View details →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
