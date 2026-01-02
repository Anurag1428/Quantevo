'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import { publishStrategy } from '@/lib/actions/strategies';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const CONDITION_TYPES = [
  { value: 'price', label: 'Price Level' },
  { value: 'ma_cross', label: 'Moving Average Cross' },
  { value: 'rsi', label: 'RSI Indicator' },
  { value: 'volume', label: 'Volume Spike' },
  { value: 'sentiment', label: 'Market Sentiment' },
];

const OPERATORS = [
  { value: '>', label: 'Greater than (>)' },
  { value: '<', label: 'Less than (<)' },
  { value: '==', label: 'Equal to (==)' },
  { value: 'cross_above', label: 'Cross Above' },
  { value: 'cross_below', label: 'Cross Below' },
];

const RISK_LEVELS = [
  { value: 'low', label: 'Low Risk (Conservative)' },
  { value: 'medium', label: 'Medium Risk (Balanced)' },
  { value: 'high', label: 'High Risk (Aggressive)' },
];

interface CreateStrategyFormData {
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  tags: string;
  isPublic: boolean;
  conditions: Array<{
    type: string;
    symbol: string;
    operator: string;
    value: number;
    period?: number;
    description: string;
  }>;
}

const CreateStrategyPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateStrategyFormData>({
    defaultValues: {
      title: '',
      description: '',
      riskLevel: 'medium',
      tags: '',
      isPublic: true,
      conditions: [
        {
          type: 'price',
          symbol: 'AAPL',
          operator: '>',
          value: 150,
          description: 'Price above $150',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'conditions',
  });

  const riskLevel = watch('riskLevel');

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateStrategyFormData) => {
    if (tags.length === 0) {
      toast.error('Please add at least one tag');
      return;
    }

    setIsSubmitting(true);
    const result = await publishStrategy('user-demo', {
      title: data.title,
      description: data.description,
      riskLevel: data.riskLevel,
      tags,
      isPublic: data.isPublic,
      conditions: data.conditions.map((c) => ({
        ...c,
        type: c.type as 'price' | 'ma_cross' | 'rsi' | 'volume' | 'sentiment',
        operator: c.operator as '>' | '<' | '==' | 'cross_above' | 'cross_below',
      })),
    });

    if (result.success) {
      toast.success('Strategy published successfully!');
      router.push(`/strategies/${result.data?.id}`);
    } else {
      toast.error(result.error || 'Failed to publish strategy');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">Publish Your Strategy</h1>
          <p className="text-gray-400">Share your trading strategy with the community and earn reputation</p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>

            <InputField
              name="title"
              label="Strategy Title"
              placeholder="Tech Momentum Reversal"
              register={register}
              error={errors.title}
              validation={{
                required: 'Title is required',
                minLength: { value: 5, message: 'Title must be at least 5 characters' },
                maxLength: { value: 100, message: 'Title must be less than 100 characters' },
              }}
            />

            <div className="mt-5">
              <Label htmlFor="description" className="form-label">
                Description
              </Label>
              <textarea
                id="description"
                placeholder="Describe your strategy, including the logic and expected outcomes..."
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Description must be at least 20 characters' },
                })}
                className="form-input w-full h-32 p-3 resize-none"
              />
              {errors.description && <p className="text-sm text-red-500 mt-2">{errors.description.message}</p>}
            </div>

            <SelectField
              name="riskLevel"
              label="Risk Level"
              placeholder="Select risk level"
              options={RISK_LEVELS}
              control={control}
              error={errors.riskLevel}
              required
            />

            {/* Tags Input */}
            <div className="mt-5">
              <Label className="form-label">Tags (max 5)</Label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add a tag (e.g., momentum, rsi, tech)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="form-input flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
                  disabled={tags.length >= 5}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <div key={idx} className="bg-yellow-500/20 border border-yellow-500/50 rounded px-3 py-1 flex items-center gap-2">
                    <span className="text-yellow-300 text-sm">{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="text-yellow-300 hover:text-yellow-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {tags.length === 0 && <p className="text-sm text-red-500 mt-2">Add at least one tag</p>}
            </div>

            {/* Public Toggle */}
            <div className="mt-5">
              <Label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register('isPublic')}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <span className="form-label">Make this strategy public (visible to all users)</span>
              </Label>
            </div>
          </div>

          {/* Conditions Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Trading Conditions</h2>
              <Button
                type="button"
                onClick={() =>
                  append({
                    type: 'price',
                    symbol: 'AAPL',
                    operator: '>',
                    value: 0,
                    description: '',
                  })
                }
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Condition
              </Button>
            </div>

            <p className="text-gray-400 text-sm mb-4">Define the conditions that trigger your strategy signals</p>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-300">Condition {index + 1}</h3>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Condition Type */}
                    <Controller
                      name={`conditions.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Label className="form-label text-xs">Type</Label>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {CONDITION_TYPES.map((opt) => (
                                <SelectItem
                                  key={opt.value}
                                  value={opt.value}
                                  className="text-white focus:bg-gray-700"
                                >
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />

                    {/* Symbol */}
                    <input
                      {...register(`conditions.${index}.symbol`)}
                      placeholder="Symbol (e.g., AAPL)"
                      className="form-input h-9 text-sm"
                    />

                    {/* Operator */}
                    <Controller
                      name={`conditions.${index}.operator`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Label className="form-label text-xs">Operator</Label>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {OPERATORS.map((opt) => (
                                <SelectItem
                                  key={opt.value}
                                  value={opt.value}
                                  className="text-white focus:bg-gray-700"
                                >
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />

                    {/* Value */}
                    <input
                      {...register(`conditions.${index}.value`, { valueAsNumber: true })}
                      type="number"
                      placeholder="Value"
                      className="form-input h-9 text-sm"
                      step="0.01"
                    />

                    {/* Period (for MA/RSI) */}
                    <input
                      {...register(`conditions.${index}.period`, { valueAsNumber: true })}
                      type="number"
                      placeholder="Period (optional)"
                      className="form-input h-9 text-sm"
                    />

                    {/* Description */}
                    <input
                      {...register(`conditions.${index}.description`)}
                      placeholder="Description (e.g., RSI below 30)"
                      className="form-input h-9 text-sm col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              💡 <strong>Tip:</strong> Your strategy will be backtested against historical data. Performance metrics help
              other traders evaluate its effectiveness.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Strategy'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStrategyPage;
