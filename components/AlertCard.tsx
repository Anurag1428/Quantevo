'use client';

import { Alert, AlertPriority } from '@/types/alerts';
import { Trash2, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface AlertCardProps {
  alert: Alert;
  onDelete?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  isLoading?: boolean;
}

export const AlertCard = ({
  alert,
  onDelete,
  onDismiss,
  isLoading = false,
}: AlertCardProps) => {
  const getPriorityColor = (priority: AlertPriority) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 glass-dark border-white/20 backdrop-blur-xl';
      case 'high':
        return 'border-l-orange-500 glass-dark border-white/20 backdrop-blur-xl';
      case 'medium':
        return 'border-l-yellow-500 glass-dark border-white/20 backdrop-blur-xl';
      case 'low':
        return 'border-l-blue-500 glass-dark border-white/20 backdrop-blur-xl';
      default:
        return 'border-l-gray-500 glass-dark border-white/20 backdrop-blur-xl';
    }
  };

  const getPriorityBadge = (priority: AlertPriority) => {
    const baseClasses = 'text-xs px-3 py-1 rounded-full font-semibold';
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

  const getStatusBadge = (status: string) => {
    const baseClasses = 'text-xs px-3 py-1 rounded-full font-semibold';
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case 'triggered':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      case 'dismissed':
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
    }
  };

  return (
    <div
      className={`border-l-4 p-6 rounded-lg transition-all hover:shadow-lg glass-hover ${getPriorityColor(
        alert.priority
      )}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
            <span className={getPriorityBadge(alert.priority)}>
              {alert.priority}
            </span>
            <span className={getStatusBadge(alert.status)}>
              {alert.status}
            </span>
          </div>

          <p className="text-sm text-gray-300 mb-3">{alert.description}</p>

          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span className="font-semibold">Type:</span>
              <span className="capitalize">{alert.type}</span>
            </div>

            {alert.condition && (
              <div className="flex items-center gap-1">
                <span className="font-semibold">Condition:</span>
                <span>{alert.condition}</span>
              </div>
            )}

            {alert.targetValue !== undefined && (
              <div className="flex items-center gap-1">
                <span className="font-semibold">Target:</span>
                <span>${alert.targetValue.toFixed(2)}</span>
              </div>
            )}

            {alert.currentValue !== undefined && (
              <div className="flex items-center gap-1">
                <span className="font-semibold">Current:</span>
                <span>${alert.currentValue.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {new Date(alert.createdAt).toLocaleDateString()} at{' '}
                {new Date(alert.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {alert.triggeredAt && (
            <div className="mt-3 p-2 bg-red-900/30 rounded text-xs text-red-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Triggered on {new Date(alert.triggeredAt).toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          {alert.status === 'active' && onDismiss && (
            <Button
              onClick={() => onDismiss(alert.id)}
              disabled={isLoading}
              className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 text-xs"
            >
              Dismiss
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={() => onDelete(alert.id)}
              disabled={isLoading}
              className="bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs p-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
