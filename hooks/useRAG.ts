'use client';

import { useState, useCallback } from 'react';
import { RAGService, RAGQuery, RAGResponse, RAGContext } from '@/lib/rag/ragClient';
import { Strategy } from '@/types/global';
import { AlertInfo } from '@/lib/rag/ragClient';

interface UseRAGOptions {
  strategies: Strategy[];
  portfolio?: any;
  alerts?: AlertInfo[];
}

interface UseRAGReturn {
  query: string;
  setQuery: (query: string) => void;
  response: RAGResponse | null;
  isLoading: boolean;
  error: string | null;
  submitQuery: () => Promise<void>;
  clearResponse: () => void;
}

/**
 * Hook for using RAG queries in components
 */
export const useRAG = (options: UseRAGOptions): UseRAGReturn => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<RAGResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitQuery = useCallback(async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ragQuery: RAGQuery = {
        question: query,
        maxResults: 5,
      };

      const result = await RAGService.query(
        ragQuery,
        options.strategies,
        options.portfolio,
        options.alerts
      );

      setResponse(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process query';
      setError(errorMessage);
      console.error('RAG Query Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [query, options.strategies, options.portfolio, options.alerts]);

  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    response,
    isLoading,
    error,
    submitQuery,
    clearResponse,
  };
};
