'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStrategyById, subscribeToStrategy, leaveReview, getStrategyReviews } from '@/lib/actions/strategies';
import { toast } from 'sonner';
import { ArrowLeft, Star, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const StrategyDetailPage = () => {
  const params = useParams();
  const strategyId = params.id as string;

  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [reviews, setReviews] = useState<StrategyReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [stratResult, reviewResult] = await Promise.all([
        getStrategyById(strategyId),
        getStrategyReviews(strategyId),
      ]);

      if (stratResult.success && stratResult.data) {
        setStrategy(stratResult.data);
      } else {
        toast.error('Strategy not found');
      }

      if (reviewResult.success && reviewResult.data) {
        setReviews(reviewResult.data);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [strategyId]);

  const handleSubscribe = async () => {
    const result = await subscribeToStrategy('user-demo', strategyId);
    if (result.success) {
      setIsSubscribed(true);
      setStrategy((prev) => (prev ? { ...prev, subscribers: prev.subscribers + 1 } : null));
      toast.success('Successfully subscribed to strategy');
    } else {
      toast.error(result.error || 'Failed to subscribe');
    }
  };

  const handleSubmitReview = async () => {
    if (reviewComment.trim().length < 5) {
      toast.error('Review must be at least 5 characters');
      return;
    }

    setIsReviewing(true);
    const result = await leaveReview('user-demo', strategyId, reviewRating, reviewComment);

    if (result.success) {
      setReviews([result.data!, ...reviews]);
      setReviewComment('');
      setReviewRating(5);
      toast.success('Review submitted');
    } else {
      toast.error(result.error || 'Failed to submit review');
    }
    setIsReviewing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Loading strategy...
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Strategy not found</h2>
          <Link href="/strategies">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Strategies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const isPositiveReturn = strategy.performance.avgReturn >= 0;
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-6">
          <Link href="/strategies" className="text-yellow-500 hover:text-yellow-400 mb-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Strategies
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{strategy.title}</h1>
              <p className="text-gray-400 mb-3">by {strategy.author.name}</p>
              <p className="text-gray-300">{strategy.description}</p>
            </div>
            <Button
              onClick={handleSubscribe}
              disabled={isSubscribed}
              className={cn(
                'ml-4 whitespace-nowrap',
                isSubscribed
                  ? 'bg-gray-700 text-gray-400 hover:bg-gray-700'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold'
              )}
            >
              {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Strategy Details */}
          <div className="col-span-2 space-y-6">
            {/* Tags and Risk */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Strategy Overview</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className={cn('border', getRiskColor(strategy.riskLevel))}>
                  {strategy.riskLevel.charAt(0).toUpperCase() + strategy.riskLevel.slice(1)} Risk
                </Badge>
                {strategy.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Backtested Performance</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase mb-2">Win Rate</p>
                  <p className="text-3xl font-bold text-white">{strategy.performance.winRate.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase mb-2">Average Return</p>
                  <p className={cn('text-3xl font-bold flex items-center gap-2', isPositiveReturn ? 'text-green-400' : 'text-red-400')}>
                    {isPositiveReturn ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                    {Math.abs(strategy.performance.avgReturn).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase mb-2">Sharpe Ratio</p>
                  <p className="text-3xl font-bold text-white">{strategy.performance.sharpeRatio.toFixed(2)}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase mb-2">Max Drawdown</p>
                  <p className="text-3xl font-bold text-red-400">-{strategy.performance.maxDrawdown.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase mb-2">Total Trades</p>
                  <p className="text-3xl font-bold text-white">{strategy.performance.totalTrades}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase mb-2">Profit Factor</p>
                  <p className="text-3xl font-bold text-white">{strategy.performance.profitFactor.toFixed(2)}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase mb-2">Best Trade</p>
                  <p className="text-2xl font-bold text-green-400">+{strategy.performance.bestTrade.toFixed(2)}%</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase mb-2">Worst Trade</p>
                  <p className="text-2xl font-bold text-red-400">{strategy.performance.worstTrade.toFixed(2)}%</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Backtested from{' '}
                {new Date(strategy.performance.backtestedFrom).toLocaleDateString()} to{' '}
                {new Date(strategy.performance.backtestedTo).toLocaleDateString()}
              </p>
            </div>

            {/* Conditions */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Trading Conditions</h2>
              <div className="space-y-3">
                {strategy.conditions.map((cond, idx) => (
                  <div key={idx} className="bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{cond.description}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {cond.symbol} {cond.operator} {cond.value}
                          {cond.period && ` (Period: ${cond.period})`}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {cond.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Community Reviews</h2>

              {/* Leave a Review */}
              <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-white mb-4">Leave a Review</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="form-label">Rating</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={cn('w-8 h-8 text-lg', reviewRating >= star ? 'text-yellow-400' : 'text-gray-600')}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment" className="form-label">
                      Comment
                    </Label>
                    <textarea
                      id="comment"
                      placeholder="Share your experience with this strategy..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="form-input w-full h-24 p-3 resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isReviewing}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </Button>
                </div>
              </div>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Author</h3>
              <div className="text-center">
                {strategy.author.avatar && (
                  <img src={strategy.author.avatar} alt={strategy.author.name} className="w-16 h-16 rounded-full mx-auto mb-3" />
                )}
                <p className="font-semibold text-white">{strategy.author.name}</p>
                {strategy.author.email && <p className="text-sm text-gray-400">{strategy.author.email}</p>}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <p className="text-sm text-gray-400">Reputation</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{strategy.reputation}/100</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <p className="text-sm text-gray-400">Subscribers</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{strategy.subscribers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Community Rating</p>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-600'}>
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-400">({reviews.length})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-sm text-blue-300">
              💡 Past performance does not guarantee future results. Use this strategy at your own risk.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyDetailPage;
