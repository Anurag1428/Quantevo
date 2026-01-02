'use server';

/**
 * Server actions for Strategy Marketplace CRUD operations
 * Includes publishing, fetching, subscribing, and rating strategies
 */

// Mock database - replace with real DB (Supabase, Prisma, etc.)
const mockStrategies: Record<string, Strategy> = {
  'strat-001': {
    id: 'strat-001',
    userId: 'user-demo',
    author: {
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    title: 'Tech Momentum Reversal',
    description: 'A trend-following strategy that identifies momentum reversals in tech stocks using RSI and moving average crosses.',
    conditions: [
      {
        type: 'rsi',
        symbol: 'AAPL',
        operator: '<',
        value: 30,
        period: 14,
        description: 'RSI drops below 30 (oversold)'
      },
      {
        type: 'ma_cross',
        symbol: 'AAPL',
        operator: 'cross_above',
        value: 0,
        period: 20,
        description: 'Price crosses above 20-day MA'
      }
    ],
    performance: {
      totalTrades: 45,
      winRate: 62.5,
      avgReturn: 3.2,
      maxDrawdown: 8.5,
      sharpeRatio: 1.8,
      profitFactor: 2.1,
      bestTrade: 12.5,
      worstTrade: -6.3,
      backtestedFrom: new Date('2023-01-01'),
      backtestedTo: new Date('2024-12-31'),
    },
    isPublic: true,
    subscribers: 342,
    reputation: 87,
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-12-01'),
    tags: ['tech', 'momentum', 'rsi', 'mean-reversion'],
    riskLevel: 'medium'
  },
  'strat-002': {
    id: 'strat-002',
    userId: 'user-demo-2',
    author: {
      name: 'James Rivera',
      email: 'james@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
    },
    title: 'Dividend Growth Value Play',
    description: 'Conservative strategy targeting dividend-paying stocks with low P/E ratios in stable industries.',
    conditions: [
      {
        type: 'price',
        symbol: 'JNJ',
        operator: '<',
        value: 0,
        description: 'P/E ratio below sector average'
      },
      {
        type: 'sentiment',
        symbol: 'JNJ',
        operator: '>',
        value: 0,
        description: 'Positive market sentiment'
      }
    ],
    performance: {
      totalTrades: 28,
      winRate: 75.0,
      avgReturn: 8.9,
      maxDrawdown: 12.2,
      sharpeRatio: 2.3,
      profitFactor: 3.2,
      bestTrade: 28.5,
      worstTrade: -9.1,
      backtestedFrom: new Date('2022-01-01'),
      backtestedTo: new Date('2024-12-31'),
    },
    isPublic: true,
    subscribers: 521,
    reputation: 94,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-11-20'),
    tags: ['dividend', 'value', 'conservative', 'long-term'],
    riskLevel: 'low'
  },
  'strat-003': {
    id: 'strat-003',
    userId: 'user-demo-3',
    author: {
      name: 'Alex Kim',
      email: 'alex@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    },
    title: 'Crypto Volume Spike',
    description: 'High-risk strategy capitalizing on sudden volume spikes in major cryptocurrencies.',
    conditions: [
      {
        type: 'volume',
        symbol: 'BTC',
        operator: '>',
        value: 2,
        description: 'Volume above 2x average'
      }
    ],
    performance: {
      totalTrades: 156,
      winRate: 48.7,
      avgReturn: 5.1,
      maxDrawdown: 35.8,
      sharpeRatio: 0.9,
      profitFactor: 1.4,
      bestTrade: 89.2,
      worstTrade: -42.5,
      backtestedFrom: new Date('2023-06-01'),
      backtestedTo: new Date('2024-12-31'),
    },
    isPublic: true,
    subscribers: 187,
    reputation: 71,
    createdAt: new Date('2024-08-22'),
    updatedAt: new Date('2024-12-10'),
    tags: ['crypto', 'volatility', 'high-risk', 'volume'],
    riskLevel: 'high'
  }
};

const mockSubscriptions: Record<string, StrategySubscription> = {};
const mockReviews: Record<string, StrategyReview[]> = {};

/**
 * Fetch all public strategies with optional filtering
 */
export async function getPublicStrategies(
  filters?: {
    riskLevel?: 'low' | 'medium' | 'high';
    tag?: string;
    sortBy?: 'reputation' | 'subscribers' | 'recent';
  }
): Promise<{ success: boolean; data?: Strategy[]; error?: string }> {
  try {
    let strategies = Object.values(mockStrategies).filter(s => s.isPublic);

    if (filters?.riskLevel) {
      strategies = strategies.filter(s => s.riskLevel === filters.riskLevel);
    }

    if (filters?.tag) {
      strategies = strategies.filter(s => s.tags.includes(filters.tag!));
    }

    if (filters?.sortBy === 'reputation') {
      strategies.sort((a, b) => b.reputation - a.reputation);
    } else if (filters?.sortBy === 'subscribers') {
      strategies.sort((a, b) => b.subscribers - a.subscribers);
    } else if (filters?.sortBy === 'recent') {
      strategies.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return { success: true, data: strategies };
  } catch (e) {
    console.error('Failed to fetch strategies', e);
    return { success: false, error: 'Failed to fetch strategies' };
  }
}

/**
 * Get a single strategy by ID
 */
export async function getStrategyById(strategyId: string): Promise<{ success: boolean; data?: Strategy; error?: string }> {
  try {
    const strategy = mockStrategies[strategyId];
    if (!strategy) {
      return { success: false, error: 'Strategy not found' };
    }
    return { success: true, data: strategy };
  } catch (e) {
    console.error('Failed to fetch strategy', e);
    return { success: false, error: 'Failed to fetch strategy' };
  }
}

/**
 * Publish a new strategy
 */
export async function publishStrategy(
  userId: string,
  input: CreateStrategyInput
): Promise<{ success: boolean; data?: Strategy; error?: string }> {
  try {
    if (!input.title || input.title.trim().length < 3) {
      return { success: false, error: 'Title must be at least 3 characters' };
    }

    if (!input.conditions || input.conditions.length === 0) {
      return { success: false, error: 'Strategy must have at least one condition' };
    }

    const id = `strat-${Date.now()}`;
    const now = new Date();

    // Simulate backtesting performance (in production, call actual backtesting engine)
    const performance: StrategyPerformance = {
      totalTrades: Math.floor(Math.random() * 100) + 10,
      winRate: Math.floor(Math.random() * 70) + 40,
      avgReturn: (Math.random() * 10) + 1,
      maxDrawdown: (Math.random() * 20) + 5,
      sharpeRatio: (Math.random() * 2) + 0.5,
      profitFactor: (Math.random() * 2) + 1,
      bestTrade: Math.random() * 50,
      worstTrade: -(Math.random() * 30),
      backtestedFrom: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      backtestedTo: now,
    };

    const strategy: Strategy = {
      id,
      userId,
      author: {
        name: 'Anonymous User', // Replace with actual user name from auth
        email: undefined,
      },
      ...input,
      performance,
      subscribers: 0,
      reputation: 50, // Start at neutral
      createdAt: now,
      updatedAt: now,
    };

    mockStrategies[id] = strategy;
    return { success: true, data: strategy };
  } catch (e) {
    console.error('Failed to publish strategy', e);
    return { success: false, error: 'Failed to publish strategy' };
  }
}

/**
 * Subscribe to a strategy
 */
export async function subscribeToStrategy(
  userId: string,
  strategyId: string
): Promise<{ success: boolean; data?: StrategySubscription; error?: string }> {
  try {
    const strategy = mockStrategies[strategyId];
    if (!strategy) {
      return { success: false, error: 'Strategy not found' };
    }

    const subscriptionId = `sub-${userId}-${strategyId}`;
    const subscription: StrategySubscription = {
      id: subscriptionId,
      userId,
      strategyId,
      subscribedAt: new Date(),
      status: 'active'
    };

    mockSubscriptions[subscriptionId] = subscription;
    strategy.subscribers += 1;

    return { success: true, data: subscription };
  } catch (e) {
    console.error('Failed to subscribe', e);
    return { success: false, error: 'Failed to subscribe' };
  }
}

/**
 * Leave a review on a strategy
 */
export async function leaveReview(
  userId: string,
  strategyId: string,
  rating: number,
  comment: string
): Promise<{ success: boolean; data?: StrategyReview; error?: string }> {
  try {
    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    if (comment.trim().length < 5) {
      return { success: false, error: 'Comment must be at least 5 characters' };
    }

    const strategy = mockStrategies[strategyId];
    if (!strategy) {
      return { success: false, error: 'Strategy not found' };
    }

    const reviewId = `review-${Date.now()}`;
    const review: StrategyReview = {
      id: reviewId,
      strategyId,
      userId,
      rating,
      comment,
      createdAt: new Date(),
    };

    if (!mockReviews[strategyId]) {
      mockReviews[strategyId] = [];
    }
    mockReviews[strategyId].push(review);

    // Update strategy reputation based on average rating
    const allReviews = mockReviews[strategyId];
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    strategy.reputation = Math.round((avgRating / 5) * 100);

    return { success: true, data: review };
  } catch (e) {
    console.error('Failed to leave review', e);
    return { success: false, error: 'Failed to leave review' };
  }
}

/**
 * Get reviews for a strategy
 */
export async function getStrategyReviews(strategyId: string): Promise<{ success: boolean; data?: StrategyReview[]; error?: string }> {
  try {
    const reviews = mockReviews[strategyId] || [];
    return { success: true, data: reviews };
  } catch (e) {
    console.error('Failed to fetch reviews', e);
    return { success: false, error: 'Failed to fetch reviews' };
  }
}

/**
 * Get user's subscriptions
 */
export async function getUserSubscriptions(userId: string): Promise<{ success: boolean; data?: StrategySubscription[]; error?: string }> {
  try {
    const subs = Object.values(mockSubscriptions).filter(s => s.userId === userId);
    return { success: true, data: subs };
  } catch (e) {
    console.error('Failed to fetch subscriptions', e);
    return { success: false, error: 'Failed to fetch subscriptions' };
  }
}
