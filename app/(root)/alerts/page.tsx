'use client';

import { useState } from 'react';
import { AlertCard } from '@/components/AlertCard';
import { AlertForm } from '@/components/AlertForm';
import { Alert, AlertFormData } from '@/types/alerts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

// Mock data - replace with actual API calls
const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'price',
    priority: 'high',
    status: 'active',
    title: 'BTC Price Alert',
    description: 'Notifies when Bitcoin reaches $50,000',
    condition: 'Price above',
    targetValue: 50000,
    currentValue: 45000,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    userId: 'user1',
    type: 'portfolio',
    priority: 'critical',
    status: 'triggered',
    title: 'Portfolio Drops Below Threshold',
    description: 'Alert when portfolio value drops 20% from initial',
    condition: 'Portfolio drops below',
    targetValue: 80000,
    currentValue: 75000,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    triggeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    userId: 'user1',
    type: 'strategy',
    priority: 'medium',
    status: 'active',
    title: 'Strategy Performance Monitor',
    description: 'Monitor the daily momentum strategy performance',
    strategyId: 'strat_123',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const handleCreateAlert = async (data: AlertFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAlert: Alert = {
        id: String(Date.now()),
        userId: 'user1',
        ...data,
        status: 'active',
        createdAt: new Date(),
      };

      setAlerts([newAlert, ...alerts]);
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAlerts(alerts.filter((a) => a.id !== alertId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAlerts(
        alerts.map((a) =>
          a.id === alertId ? { ...a, status: 'dismissed' as const } : a
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAlerts =
    filter === 'all'
      ? alerts
      : alerts.filter((a) => a.status === filter);

  const activeAlerts = alerts.filter((a) => a.status === 'active').length;
  const triggeredAlerts = alerts.filter((a) => a.status === 'triggered').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Alerts & Notifications</h1>
          <p className="text-gray-400 mt-1">Manage your trading and portfolio alerts</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">Total Alerts</p>
          <p className="text-2xl font-bold text-white mt-1">{alerts.length}</p>
        </div>
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-400">Active</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{activeAlerts}</p>
        </div>
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-400">Triggered</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{triggeredAlerts}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'active', 'triggered', 'dismissed'].map((status) => (
          <Button
            key={status}
            onClick={() => setFilter(status)}
            className={`capitalize ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {status === 'all' ? 'All' : status}
          </Button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-gray-400">
              No {filter !== 'all' ? filter : ''} alerts found.{' '}
              <button
                onClick={() => setIsDialogOpen(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                Create one now
              </button>
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDelete={handleDeleteAlert}
              onDismiss={handleDismissAlert}
              isLoading={isLoading}
            />
          ))
        )}
      </div>

      {/* Create Alert Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-950 border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Alert</DialogTitle>
          </DialogHeader>
          <AlertForm
            onSubmit={handleCreateAlert}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
