'use client';

import { useForm } from 'react-hook-form';
import { AlertFormData } from '@/types/alerts';
import InputField from './forms/InputField';
import SelectField from './forms/SelectField';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

interface AlertFormProps {
  onSubmit: (data: AlertFormData) => Promise<void> | void;
  isLoading?: boolean;
  initialData?: Partial<AlertFormData>;
  onSuccess?: (message?: string) => void;
}

const alertTypeOptions = [
  { value: 'price', label: 'Price Alert' },
  { value: 'portfolio', label: 'Portfolio Alert' },
  { value: 'strategy', label: 'Strategy Alert' },
  { value: 'system', label: 'System Alert' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const AlertForm = ({
  onSubmit,
  isLoading = false,
  initialData,
  onSuccess,
}: AlertFormProps) => {
  const { control, register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm<AlertFormData>({
    defaultValues: {
      type: initialData?.type || 'price',
      priority: initialData?.priority || 'medium',
      title: initialData?.title || '',
      description: initialData?.description || '',
      condition: initialData?.condition || '',
      targetValue: initialData?.targetValue,
      strategyId: initialData?.strategyId,
    },
    mode: 'onBlur',
  });

  const handleFormSubmit = async (data: AlertFormData) => {
    try {
      await onSubmit(data);
      reset();
      onSuccess?.('Alert created successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const alertType = watch('type');

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          name="type"
          label="Alert Type"
          placeholder="Select alert type"
          options={alertTypeOptions}
          control={control}
          error={errors.type}
          required
        />

        <SelectField
          name="priority"
          label="Priority"
          placeholder="Select priority"
          options={priorityOptions}
          control={control}
          error={errors.priority}
          required
        />
      </div>

      <InputField
        name="title"
        label="Alert Title"
        placeholder="Enter alert title"
        register={register}
        error={errors.title}
        validation={{ required: 'Title is required' }}
      />

      <InputField
        name="description"
        label="Description"
        placeholder="Describe what this alert is for"
        register={register}
        error={errors.description}
        validation={{ required: 'Description is required' }}
      />

      {(alertType === 'price' || alertType === 'portfolio') && (
        <>
          <InputField
            name="condition"
            label="Condition"
            placeholder="e.g., Price above, Portfolio drops below"
            register={register}
            error={errors.condition}
          />

          <InputField
            name="targetValue"
            label="Target Value"
            placeholder="Enter target value"
            type="number"
            register={register}
            error={errors.targetValue}
          />
        </>
      )}

      {alertType === 'strategy' && (
        <InputField
          name="strategyId"
          label="Strategy ID"
          placeholder="Select or enter strategy ID"
          register={register}
          error={errors.strategyId}
        />
      )}

      {(() => {
        const hasErrors = Object.keys(errors).length > 0;
        return hasErrors ? (
          <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400 mb-1">Please fix the following errors:</p>
              <ul className="text-xs text-red-300 space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error?.message || `${field} is required`}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null;
      })()}

      <Button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
      >
        {isSubmitting || isLoading ? 'Creating Alert...' : 'Create Alert'}
      </Button>
    </form>
  );
};
