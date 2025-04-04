
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyResult, CreateKeyResultInput, UpdateKeyResultInput } from '@/types/okr';
import { useKeyResult } from '@/hooks/okr/useKeyResult';
import { supabase } from '@/integrations/supabase/client';

interface UseKeyResultFormProps {
  objectiveId: string;
  keyResult?: KeyResult;
  onClose: (success?: boolean) => void;
  mode: 'create' | 'edit';
}

export const useKeyResultForm = ({
  objectiveId,
  keyResult,
  onClose,
  mode
}: UseKeyResultFormProps) => {
  const { createKeyResult, updateKeyResult } = useKeyResult(keyResult?.id);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Get current user on mount
  useState(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getUser();
  });

  // Create form values based on mode and existing data
  const formValues = mode === 'edit' && keyResult ? {
    ...keyResult,
    dueDate: keyResult.dueDate ? new Date(keyResult.dueDate) : undefined
  } : {
    title: '',
    description: '',
    krType: 'standard',
    measurementType: 'numeric',
    unit: '',
    startValue: 0,
    currentValue: 0,
    targetValue: 100,
    booleanValue: false,
    weight: 1,
    status: 'not_started',
    dueDate: undefined,
  };

  const form = useForm<any>({
    defaultValues: formValues
  });

  const measurementType = form.watch('measurementType');

  const handleSubmit = (data: any) => {
    if (mode === 'create' && currentUserId) {
      const newKeyResult: CreateKeyResultInput = {
        title: data.title,
        description: data.description,
        objectiveId,
        ownerId: currentUserId,
        krType: data.krType,
        measurementType: data.measurementType,
        unit: data.unit,
        startValue: data.measurementType === 'boolean' ? 0 : data.startValue,
        currentValue: data.measurementType === 'boolean' ? 0 : data.currentValue,
        targetValue: data.measurementType === 'boolean' ? 1 : data.targetValue,
        booleanValue: data.measurementType === 'boolean' ? data.booleanValue : undefined,
        weight: data.weight,
        status: data.status,
        dueDate: data.dueDate,
      };
      
      createKeyResult.mutate(newKeyResult, {
        onSuccess: () => {
          onClose(true);
        },
        onError: () => {
          onClose(false);
        }
      });
    } else if (mode === 'edit' && keyResult) {
      const updatedKeyResult: UpdateKeyResultInput = {
        id: keyResult.id,
        title: data.title,
        description: data.description,
        krType: data.krType,
        measurementType: data.measurementType,
        unit: data.unit,
        startValue: data.measurementType === 'boolean' ? 0 : data.startValue,
        currentValue: data.measurementType === 'boolean' ? 0 : data.currentValue,
        targetValue: data.measurementType === 'boolean' ? 1 : data.targetValue,
        booleanValue: data.measurementType === 'boolean' ? data.booleanValue : undefined,
        weight: data.weight,
        status: data.status,
        dueDate: data.dueDate,
      };
      
      updateKeyResult.mutate(updatedKeyResult, {
        onSuccess: () => {
          onClose(true);
        },
        onError: () => {
          onClose(false);
        }
      });
    }
  };

  return {
    form,
    measurementType,
    handleSubmit,
    isPending: createKeyResult.isPending || updateKeyResult.isPending
  };
};
