'use client';

import { useForm, Controller } from 'react-hook-form';
import { AlertFormData, AlertType, AlertPriority } from '@/types/alerts';
import { FormInputField } from './forms/InputField';
import { SelectField } from './forms/SelectField';
import { Button } from './ui/button';

interface AlertFormProps {
  onSubmit: (data: AlertFormData) => Promise<void> | void;
  isLoading?: boolean;
  initialData?: Partial<AlertFormData>;
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
}: AlertFormProps) => {
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm<AlertFormData>({
    defaultValues: {
      type: initialData?.type || 'price',
      priority: initialData?.priority || 'medium',
      title: initialData?.title || '',
      description: initialData?.description || '',
      condition: initialData?.condition || '',
      targetValue: initialData?.targetValue,
      strategyId: initialData?.strategyId,
    },
  });

  const alertType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <FormInputField
        name="title"
        label="Alert Title"
        placeholder="Enter alert title"
        register={register}
        error={errors.title}
        validation={{ required: 'Title is required' }}
      />

      <FormInputField
        name="description"
        label="Description"
        placeholder="Describe what this alert is for"
        register={register}
        error={errors.description}
        validation={{ required: 'Description is required' }}
      />

      {(alertType === 'price' || alertType === 'portfolio') && (
        <>
          <FormInputField
            name="condition"
            label="Condition"
            placeholder="e.g., Price above, Portfolio drops below"
            register={register}
            error={errors.condition}
          />

          <FormInputField
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
        <FormInputField
          name="strategyId"
          label="Strategy ID"
          placeholder="Select or enter strategy ID"
          register={register}
          error={errors.strategyId}
        />
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? 'Creating Alert...' : 'Create Alert'}
      </Button>
    </form>
  );
};
