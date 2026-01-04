'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimulationResult {
  initialInvestment: number;
  monthlyDeposit: number;
  annualReturn: number;
  years: number;
  finalAmount: number;
  totalContributed: number;
  gains: number;
  gainPercent: number;
}

const PortfolioSimulator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [years, setYears] = useState(10);
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Risk profile to expected return mapping
  const riskReturnMap = {
    conservative: 5,
    balanced: 10,
    aggressive: 15,
  };

  useEffect(() => {
    // Auto-update annual return based on risk profile
    setAnnualReturn(riskReturnMap[riskProfile]);
  }, [riskProfile]);

  useEffect(() => {
    // Calculate portfolio simulation
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    let balance = initialInvestment;
    let totalContributed = initialInvestment;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthlyDeposit;
      totalContributed += monthlyDeposit;
    }

    const gains = balance - totalContributed;
    const gainPercent = (gains / totalContributed) * 100;

    setResult({
      initialInvestment,
      monthlyDeposit,
      annualReturn,
      years,
      finalAmount: balance,
      totalContributed,
      gains,
      gainPercent,
    });
  }, [initialInvestment, monthlyDeposit, annualReturn, years]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Portfolio Simulator</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-5">
          <div>
            <Label className="form-label">Initial Investment</Label>
            <Input
              type="number"
              min="0"
              step="1000"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
            />
            <p className="text-xs text-gray-400 mt-1">${initialInvestment.toLocaleString()}</p>
          </div>

          <div>
            <Label className="form-label">Monthly Deposit</Label>
            <Input
              type="number"
              min="0"
              step="100"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
            />
            <p className="text-xs text-gray-400 mt-1">${monthlyDeposit.toLocaleString()} × {years * 12} months</p>
          </div>

          <div>
            <Label className="form-label">Investment Period</Label>
            <Input
              type="number"
              min="1"
              max="50"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="bg-gray-700 border-gray-600 text-white mt-2"
            />
            <p className="text-xs text-gray-400 mt-1">{years} years</p>
          </div>

          <div>
            <Label className="form-label">Risk Profile</Label>
            <Select value={riskProfile} onValueChange={(val: any) => setRiskProfile(val)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="conservative" className="text-white focus:bg-gray-700">
                  Conservative (5% avg return)
                </SelectItem>
                <SelectItem value="balanced" className="text-white focus:bg-gray-700">
                  Balanced (10% avg return)
                </SelectItem>
                <SelectItem value="aggressive" className="text-white focus:bg-gray-700">
                  Aggressive (15% avg return)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="form-label">Expected Annual Return</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                min="0"
                max="30"
                step="0.5"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white flex-1"
              />
              <span className="text-white font-semibold self-center">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Adjust manually or use risk profile presets</p>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-yellow-500/20 to-green-500/20 border border-yellow-500/50 rounded-lg p-5">
              <p className="text-gray-400 text-sm mb-1">Final Portfolio Value</p>
              <p className="text-5xl font-bold text-yellow-400">${result.finalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase mb-1">Total Invested</p>
                <p className="text-xl font-bold text-white">${result.totalContributed.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase mb-1">Investment Gains</p>
                <p className="text-xl font-bold text-green-400">${result.gains.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase mb-1">Return on Investment</p>
                <p className={cn('text-xl font-bold', result.gainPercent >= 0 ? 'text-green-400' : 'text-red-400')}>
                  {result.gainPercent >= 0 ? '+' : ''}
                  {result.gainPercent.toFixed(1)}%
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase mb-1">Annual Return Rate</p>
                <p className="text-xl font-bold text-blue-400">{result.annualReturn.toFixed(1)}%</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Initial Investment:</span>
                <span className="text-white font-semibold">${result.initialInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Monthly Contributions:</span>
                <span className="text-white font-semibold">${(result.monthlyDeposit * result.years * 12).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-gray-700 pt-2">
                <span className="text-gray-400">Total Contributions:</span>
                <span className="text-yellow-400 font-semibold">${result.totalContributed.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Investment Earnings:</span>
                <span className={cn('font-semibold', result.gains >= 0 ? 'text-green-400' : 'text-red-400')}>
                  +${result.gains.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3 text-xs text-blue-300">
              💡 This is a simplified simulation for educational purposes. Actual returns vary based on market conditions, fees, and taxes.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSimulator;
