'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, Copy, Download, Loader } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedContent {
  id: string;
  prompt: string;
  content: string;
  type: 'code' | 'strategy' | 'analysis' | 'insight';
  timestamp: Date;
}

const GenAI: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedType, setSelectedType] = useState<'code' | 'strategy' | 'analysis' | 'insight'>('code');

  const contentTypes = [
    { value: 'code', label: 'Generate Code', icon: '💻' },
    { value: 'strategy', label: 'Create Strategy', icon: '📊' },
    { value: 'analysis', label: 'Market Analysis', icon: '📈' },
    { value: 'insight', label: 'Get Insights', icon: '💡' },
  ];

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    try {
      // Simulated API call - replace with actual GenAI API
      const mockResponses = {
        code: `// Generated Trading Component
import React from 'react';

export const TradingWidget = () => {
  const [price, setPrice] = React.useState(0);

  React.useEffect(() => {
    // Fetch real-time price data
    const interval = setInterval(() => {
      setPrice(Math.random() * 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="trading-widget">
      <h3>Current Price: \${price.toFixed(2)}</h3>
    </div>
  );
};`,
        strategy: `Trading Strategy: ${prompt}

Risk Level: Medium
Time Horizon: 3-6 months
Entry Points: Support levels with volume confirmation
Exit Points: Target profit 15-20% or stop loss at 5%
Key Indicators: RSI, MACD, Bollinger Bands
Rebalance Frequency: Monthly

Setup:
1. Monitor entry signals
2. Execute on confirmation
3. Manage risk with proper position sizing
4. Review performance monthly`,
        analysis: `Market Analysis for ${prompt}

Current Sentiment: Bullish
Support Level: Previous support identified
Resistance Level: Previous resistance identified
Volume Analysis: Average volume with potential increase
Trend: Uptrend confirmed

Key Factors:
- Technical indicators suggest continued momentum
- Volume supports the current price action
- No major resistance levels in near term
- Watch for breakout confirmation`,
        insight: `AI Insight: ${prompt}

Based on market data and historical patterns:
- Correlation with similar assets: 0.85
- Probability of success: 72%
- Risk/Reward Ratio: 1:2.5
- Recommended allocation: 5-10% of portfolio

Action Items:
1. Monitor for entry signals
2. Set stop loss at calculated level
3. Take profits at 15-20% gain
4. Review position weekly`,
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        prompt,
        content: mockResponses[selectedType as keyof typeof mockResponses] || mockResponses.code,
        type: selectedType,
        timestamp: new Date(),
      };

      setGeneratedContent([newContent, ...generatedContent]);
      setPrompt('');
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const downloadContent = (content: string, filename: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded successfully!');
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Generative AI Assistant</h2>
      </div>

      {/* Type Selector */}
      <div className="flex flex-wrap gap-2">
        {contentTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value as any)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedType === type.value
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          placeholder={`Enter your ${selectedType} prompt...`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && generateContent()}
          className="flex-1"
        />
        <Button
          onClick={generateContent}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 gap-2"
        >
          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
      </div>

      {/* Generated Content */}
      <div className="space-y-4">
        {generatedContent.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Start by entering a prompt to generate content</p>
          </div>
        ) : (
          generatedContent.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {contentTypes.find((t) => t.value === item.type)?.label}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">{item.prompt}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {item.content}
                </pre>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(item.content)}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    downloadContent(
                      item.content,
                      `generated-${item.type}-${Date.now()}.txt`
                    )
                  }
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GenAI;
