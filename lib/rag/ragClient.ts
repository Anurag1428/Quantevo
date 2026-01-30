/**
 * RAG Client for Quantevo Trading Platform
 * Retrieves investment strategies, market data, and user information
 * Augments LLM responses with real trading context
 */

import { Strategy, StrategyPerformance } from '@/types/global';

export interface RAGContext {
  strategies: Strategy[];
  portfolioMetrics: {
    totalValue: number;
    dayChange: number;
    weekChange: number;
    monthChange: number;
  };
  recentAlerts: AlertInfo[];
  marketData: MarketSnapshot[];
}

export interface AlertInfo {
  id: string;
  type: string;
  symbol?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: Date;
}

export interface MarketSnapshot {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

export interface RAGQuery {
  question: string;
  context?: Partial<RAGContext>;
  maxResults?: number;
}

export interface RAGResponse {
  answer: string;
  sources: string[];
  confidence: number;
  context: RAGContext;
}

/**
 * Retrieval component - Fetch relevant data from user's portfolio and strategies
 */
export class RAGRetriever {
  /**
   * Retrieve all strategies matching query terms
   */
  static async retrieveStrategies(
    query: string,
    strategies: Strategy[]
  ): Promise<Strategy[]> {
    const lowerQuery = query.toLowerCase();
    
    return strategies.filter(strategy => {
      const strategyText = `
        ${strategy.title.toLowerCase()}
        ${strategy.description.toLowerCase()}
        ${strategy.tags.join(' ').toLowerCase()}
        ${strategy.riskLevel}
      `;
      
      return strategyText.includes(lowerQuery);
    });
  }

  /**
   * Retrieve performance metrics matching query
   */
  static async retrievePerformanceMetrics(
    query: string,
    strategies: Strategy[]
  ): Promise<Strategy[]> {
    const performanceKeywords = ['performance', 'return', 'winrate', 'sharpe', 'drawdown', 'profit'];
    const hasPerformanceQuery = performanceKeywords.some(kw => query.toLowerCase().includes(kw));

    if (!hasPerformanceQuery) return [];

    return strategies.sort((a, b) => 
      b.performance.avgReturn - a.performance.avgReturn
    );
  }

  /**
   * Retrieve risk-related information
   */
  static async retrieveRiskData(
    query: string,
    strategies: Strategy[]
  ): Promise<Strategy[]> {
    const riskKeywords = ['risk', 'conservative', 'aggressive', 'volatile', 'drawdown'];
    const hasRiskQuery = riskKeywords.some(kw => query.toLowerCase().includes(kw));

    if (!hasRiskQuery) return [];

    return strategies.filter(s => {
      if (query.toLowerCase().includes('low')) return s.riskLevel === 'low';
      if (query.toLowerCase().includes('high')) return s.riskLevel === 'high';
      return true;
    });
  }

  /**
   * Build comprehensive context for RAG queries
   */
  static async buildContext(
    strategies: Strategy[],
    portfolio?: any,
    alerts?: AlertInfo[]
  ): Promise<RAGContext> {
    return {
      strategies,
      portfolioMetrics: portfolio || {
        totalValue: 0,
        dayChange: 0,
        weekChange: 0,
        monthChange: 0,
      },
      recentAlerts: alerts || [],
      marketData: [],
    };
  }
}

/**
 * Augmentation component - Generate contextual answers
 */
export class RAGAugmenter {
  /**
   * Generate a strategic recommendation based on context
   */
  static generateStrategyRecommendation(
    query: string,
    context: RAGContext
  ): string {
    const riskLevel = this.extractRiskPreference(query);
    const matchingStrategies = context.strategies.filter(s => 
      riskLevel ? s.riskLevel === riskLevel : true
    );

    if (matchingStrategies.length === 0) {
      return 'No matching strategies found. Try adjusting your search criteria.';
    }

    const topStrategy = matchingStrategies[0];
    const avgReturn = topStrategy.performance.avgReturn.toFixed(2);
    const winRate = topStrategy.performance.winRate.toFixed(1);

    return `
Based on your query, I recommend: **${topStrategy.title}**

**Key Metrics:**
- Average Return: ${avgReturn}%
- Win Rate: ${winRate}%
- Risk Level: ${topStrategy.riskLevel}
- Subscribers: ${topStrategy.subscribers}
- Reputation: ${topStrategy.reputation}/100

**Description:** ${topStrategy.description}

This strategy is backed by ${topStrategy.subscribers} subscribers and has a solid reputation score.
    `.trim();
  }

  /**
   * Generate portfolio analysis
   */
  static generatePortfolioAnalysis(context: RAGContext): string {
    const portfolio = context.portfolioMetrics;
    
    return `
**Portfolio Performance Overview:**
- Total Value: $${portfolio.totalValue.toLocaleString()}
- Daily Change: ${portfolio.dayChange >= 0 ? '+' : ''}${portfolio.dayChange.toFixed(2)}%
- Weekly Change: ${portfolio.weekChange >= 0 ? '+' : ''}${portfolio.weekChange.toFixed(2)}%
- Monthly Change: ${portfolio.monthChange >= 0 ? '+' : ''}${portfolio.monthChange.toFixed(2)}%

You currently follow ${context.strategies.length} strategies. Your recent alerts: ${context.recentAlerts.length}
    `.trim();
  }

  /**
   * Extract risk preference from query
   */
  private static extractRiskPreference(query: string): string | null {
    if (query.toLowerCase().includes('conservative') || query.toLowerCase().includes('low risk')) {
      return 'low';
    }
    if (query.toLowerCase().includes('aggressive') || query.toLowerCase().includes('high risk')) {
      return 'high';
    }
    if (query.toLowerCase().includes('balanced') || query.toLowerCase().includes('medium')) {
      return 'medium';
    }
    return null;
  }

  /**
   * Format retrieved data into readable context
   */
  static formatContextForLLM(context: RAGContext): string {
    const strategyList = context.strategies
      .slice(0, 5)
      .map(s => `- ${s.title} (${s.riskLevel} risk, ${s.performance.winRate.toFixed(1)}% win rate)`)
      .join('\n');

    return `
## Your Investment Context

### Portfolio
Total Value: $${context.portfolioMetrics.totalValue.toLocaleString()}
Daily Performance: ${context.portfolioMetrics.dayChange >= 0 ? '+' : ''}${context.portfolioMetrics.dayChange.toFixed(2)}%

### Top Strategies
${strategyList}

### Recent Alerts
${context.recentAlerts.slice(0, 3).map(a => `- [${a.priority}] ${a.message}`).join('\n') || 'No recent alerts'}
    `.trim();
  }
}

/**
 * Main RAG Service combining retrieval and augmentation
 */
export class RAGService {
  static async query(
    input: RAGQuery,
    strategies: Strategy[],
    portfolio?: any,
    alerts?: AlertInfo[]
  ): Promise<RAGResponse> {
    try {
      // Build context
      const context = await RAGRetriever.buildContext(
        strategies,
        portfolio,
        alerts
      );

      // Retrieve relevant data
      const relevantStrategies = await Promise.all([
        RAGRetriever.retrieveStrategies(input.question, strategies),
        RAGRetriever.retrievePerformanceMetrics(input.question, strategies),
        RAGRetriever.retrieveRiskData(input.question, strategies),
      ]);

      const merged = Array.from(new Set(relevantStrategies.flat()));

      // Determine query type and generate answer
      let answer = '';
      const sources: string[] = [];

      if (input.question.toLowerCase().includes('recommend')) {
        answer = RAGAugmenter.generateStrategyRecommendation(input.question, context);
        sources.push('strategies', 'performance-metrics');
      } else if (input.question.toLowerCase().includes('portfolio')) {
        answer = RAGAugmenter.generatePortfolioAnalysis(context);
        sources.push('portfolio-metrics', 'alerts');
      } else {
        // Default: provide formatted context
        answer = RAGAugmenter.formatContextForLLM(context);
        sources.push('all-data');
      }

      return {
        answer,
        sources,
        confidence: Math.min(0.95, (merged.length / Math.max(strategies.length, 1)) * 0.8 + 0.5),
        context: {
          ...context,
          strategies: merged,
        },
      };
    } catch (error) {
      console.error('RAG Query Error:', error);
      throw error;
    }
  }
}
