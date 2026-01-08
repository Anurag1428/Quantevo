'use client';

import { useState } from 'react';
import { Bell, X, Check, AlertCircle } from 'lucide-react';
import { Notification, AlertPriority } from '@/types/alerts';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface NotificationCenterProps {
  notifications?: Notification[];
  onNotificationRead?: (notificationId: string) => void;
  onNotificationDismiss?: (notificationId: string) => void;
}

export const NotificationCenter = ({
  notifications = [],
  onNotificationRead,
  onNotificationDismiss,
}: NotificationCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPriorityColor = (priority: AlertPriority) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-900/20';
      case 'high':
        return 'border-l-orange-500 bg-orange-900/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-900/20';
      case 'low':
        return 'border-l-blue-500 bg-blue-900/20';
      default:
        return 'border-l-gray-500 bg-gray-900/20';
    }
  };

  const getPriorityBadge = (priority: AlertPriority) => {
    const baseClasses = 'text-xs px-2 py-1 rounded-full font-semibold';
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read && onNotificationRead) {
      onNotificationRead(notification.id);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
          <a href="/notifications" className="text-xs text-blue-400 hover:text-blue-300">
            View All
          </a>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 border-l-4 cursor-pointer hover:bg-gray-800/50 transition-colors ${getPriorityColor(
                    notification.priority
                  )} ${!notification.read ? 'bg-gray-800/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 mt-1 flex-shrink-0 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate">
                          {notification.title}
                        </p>
                        <span className={getPriorityBadge(notification.priority)}>
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNotificationRead?.(notification.id);
                        }}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        <Check className="w-4 h-4 text-blue-400" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotificationDismiss?.(notification.id);
                      }}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-700 text-center">
            <a
              href="/notifications"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              See all notifications
            </a>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
