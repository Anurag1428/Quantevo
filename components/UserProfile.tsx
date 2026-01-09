'use client';

import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, Bell, Shield, Palette } from 'lucide-react';

interface UserProfileProps {
  user?: {
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-gray-400 mt-1">Manage your profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-white">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded-full">
                {user?.role || 'Member'}
              </span>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300 hover:text-white">
                <User className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300 hover:text-white">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300 hover:text-white">
                <Shield className="w-5 h-5" />
                <span>Security</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 hover:bg-red-900/20 rounded-lg transition-colors text-red-400 hover:text-red-300">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  readOnly
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Update Profile
              </Button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-400">Always use dark theme</p>
                </div>
                <input type="checkbox" checked className="w-5 h-5" readOnly />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive email alerts</p>
                </div>
                <input type="checkbox" checked className="w-5 h-5" readOnly />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-400">Enhanced security</p>
                </div>
                <input type="checkbox" className="w-5 h-5" readOnly />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Price Alerts', enabled: true },
                { label: 'Portfolio Updates', enabled: true },
                { label: 'Strategy Signals', enabled: true },
                { label: 'Market News', enabled: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">{item.label}</span>
                  <input type="checkbox" checked={item.enabled} readOnly className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
