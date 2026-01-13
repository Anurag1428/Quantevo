'use client';

import { useState } from 'react';
import { Alert, AlertPriority } from '@/types/alerts';
import { Trash2, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

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
}: AlertCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(alert.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDismiss = async () => {
    if (!onDismiss) return;
    setIsDismissing(true);
    try {
      await onDismiss(alert.id);
    } finally {
      setIsDismissing(false);
    }
  };
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={isDismissing}
                  className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 text-xs"
                >
                  {isDismissing ? 'Dismissing...' : 'Dismiss'}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Dismiss Alert</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Are you sure you want to dismiss this alert? You can re-enable it later.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
                    Keep it
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    disabled={isDismissing}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    {isDismissing ? 'Dismissing...' : 'Dismiss'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {onDelete && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={isDeleting}
                  className="bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Delete Alert</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Are you sure you want to permanently delete this alert? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};
