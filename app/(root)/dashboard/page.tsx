'use client';

import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Eye, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatPercentage } from '@/lib/utils';

const performanceData = [
  { month: 'Jan', return: 5.2 },
  { month: 'Feb', return: -1.3 },
  { month: 'Mar', return: 8.5 },
  { month: 'Apr', return: 3.7 },
  { month: 'May', return: 12.1 },
  { month: 'Jun', return: 4.8 },
];

const allocationData = [
  { name: 'Stocks', value: 60, color: '#3B82F6' },
  { name: 'ETFs', value: 25, color: '#8B5CF6' },
  { name: 'Crypto', value: 10, color: '#F59E0B' },
  { name: 'Cash', value: 5, color: '#6B7280' },
];

const topStrategies = [
  { name: 'Growth Strategy', return: 18.5, allocation: 35 },
  { name: 'Dividend Strategy', return: 8.2, allocation: 25 },
  { name: 'Tech Focus', return: 22.3, allocation: 20 },
  { name: 'Index Tracking', return: 5.7, allocation: 20 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor your investments at a glance</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button className="bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-800 rounded-lg p-6">
          <p className="text-sm text-blue-400 font-semibold">Portfolio Value</p>
          <p className="text-3xl font-bold text-white mt-2">{formatCurrency(125000)}</p>
          <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {formatPercentage(15)} this month
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-800 rounded-lg p-6">
          <p className="text-sm text-green-400 font-semibold">Total Gain</p>
          <p className="text-3xl font-bold text-white mt-2">{formatCurrency(18500)}</p>
          <p className="text-sm text-gray-400 mt-2">Since inception</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-800 rounded-lg p-6">
          <p className="text-sm text-purple-400 font-semibold">Active Strategies</p>
          <p className="text-3xl font-bold text-white mt-2">4</p>
          <p className="text-sm text-gray-400 mt-2">Running</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/10 border border-orange-800 rounded-lg p-6">
          <p className="text-sm text-orange-400 font-semibold">Alerts</p>
          <p className="text-3xl font-bold text-white mt-2">3</p>
          <p className="text-sm text-orange-400 mt-2">Active alerts</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Monthly Returns
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#FFF' }}
              />
              <Bar dataKey="return" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Allocation */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#FFF' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-300">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Strategies */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Performing Strategies</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Strategy</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Return</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Allocation</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {topStrategies.map((strategy) => (
                <tr key={strategy.name} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-4 text-white font-semibold">{strategy.name}</td>
                  <td className={`py-3 px-4 font-semibold ${strategy.return >= 10 ? 'text-green-400' : 'text-blue-400'}`}>
                    {formatPercentage(strategy.return)}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{strategy.allocation}%</td>
                  <td className="py-3 px-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
