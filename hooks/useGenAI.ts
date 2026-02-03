import { useState, useCallback } from 'react';

export interface GenAIRequest {
  prompt: string;
  type: 'code' | 'strategy' | 'analysis' | 'insight';
  context?: {
    symbols?: string[];
    timeframe?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };
}

export interface GenAIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
  model: string;
  timestamp: Date;
}

export const useGenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (request: GenAIRequest): Promise<GenAIResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/genai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: GenAIResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      console.error('GenAI Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateCode = useCallback(
    async (prompt: string, context?: GenAIRequest['context']) => {
      return generate({
        prompt,
        type: 'code',
        context,
      });
    },
    [generate]
  );

  const generateStrategy = useCallback(
    async (prompt: string, context?: GenAIRequest['context']) => {
      return generate({
        prompt,
        type: 'strategy',
        context,
      });
    },
    [generate]
  );

  const analyzeMarket = useCallback(
    async (prompt: string, context?: GenAIRequest['context']) => {
      return generate({
        prompt,
        type: 'analysis',
        context,
      });
    },
    [generate]
  );

  const getInsight = useCallback(
    async (prompt: string, context?: GenAIRequest['context']) => {
      return generate({
        prompt,
        type: 'insight',
        context,
      });
    },
    [generate]
  );

  return {
    generate,
    generateCode,
    generateStrategy,
    analyzeMarket,
    getInsight,
    isLoading,
    error,
  };
};

export default useGenAI;
