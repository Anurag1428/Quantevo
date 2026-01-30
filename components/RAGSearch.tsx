'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRAG } from '@/hooks/useRAG';
import { Strategy } from '@/types/global';
import { AlertInfo } from '@/lib/rag/ragClient';
import { Loader2, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RAGSearchProps {
  strategies: Strategy[];
  portfolio?: any;
  alerts?: AlertInfo[];
  placeholder?: string;
  className?: string;
}

export const RAGSearch: React.FC<RAGSearchProps> = ({
  strategies,
  portfolio,
  alerts,
  placeholder = 'Ask about strategies, portfolio, or market insights...',
  className,
}) => {
  const { query, setQuery, response, isLoading, error, submitQuery, clearResponse } = useRAG({
    strategies,
    portfolio,
    alerts,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      submitQuery();
    }
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Input Section */}
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 flex-1"
        />
        <Button
          onClick={submitQuery}
          disabled={isLoading || !query.trim()}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-400 text-sm font-medium">Error</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2 flex-1">
              <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium mb-2">RAG Response</p>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {response.answer}
                </p>
              </div>
            </div>
            <button
              onClick={clearResponse}
              className="text-gray-500 hover:text-gray-400 text-lg ml-2"
            >
              ×
            </button>
          </div>

          {/* Source Attribution */}
          <div className="pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Sources:</p>
            <div className="flex flex-wrap gap-2">
              {response.sources.map((source) => (
                <span
                  key={source}
                  className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>

          {/* Confidence Score */}
          <div className="pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Confidence:</p>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{ width: `${response.confidence * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {(response.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Example Queries */}
      {!response && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Recommend a strategy for me',
              'Show my portfolio performance',
              'What are high-risk strategies?',
              'Best momentum strategies',
            ].map((example) => (
              <button
                key={example}
                onClick={() => setQuery(example)}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
