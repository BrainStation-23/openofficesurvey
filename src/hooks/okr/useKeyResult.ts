
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KeyResult, UpdateKeyResultInput, KeyResultStatus } from '@/types/okr';
import { useToast } from '@/hooks/use-toast';

export const useKeyResult = (id?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch key result
  const {
    data: keyResult,
    isLoading,
    error
  } = useQuery({
    queryKey: ['key-result', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('key_results')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        objectiveId: data.objective_id,
        ownerId: data.owner_id,
        krType: data.kr_type,
        measurementType: data.measurement_type,
        unit: data.unit,
        startValue: data.start_value,
        currentValue: data.current_value,
        targetValue: data.target_value,
        booleanValue: data.boolean_value,
        weight: data.weight,
        status: data.status,
        progress: data.progress,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } as KeyResult;
    },
    enabled: !!id
  });

  // Update key result status
  const updateStatus = useMutation({
    mutationFn: async (status: KeyResultStatus) => {
      if (!id) throw new Error('Key Result ID is required');
      
      const { data, error } = await supabase
        .from('key_results')
        .update({ 
          status, 
          updated_at: new Date() 
        })
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['key-result', id] });
      queryClient.invalidateQueries({ queryKey: ['key-results'] });
      queryClient.invalidateQueries({ queryKey: ['objective'] });
      
      toast({
        title: 'Status updated',
        description: 'The key result status has been updated.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating status',
        description: error.message,
      });
    }
  });

  // Update key result
  const updateKeyResult = useMutation({
    mutationFn: async (data: UpdateKeyResultInput) => {
      if (!id) throw new Error('Key Result ID is required');
      
      const { error } = await supabase
        .from('key_results')
        .update({
          title: data.title,
          description: data.description,
          owner_id: data.ownerId,
          kr_type: data.krType,
          measurement_type: data.measurementType,
          unit: data.unit,
          start_value: data.startValue,
          current_value: data.currentValue,
          target_value: data.targetValue,
          boolean_value: data.booleanValue,
          weight: data.weight || 1,
          status: data.status,
          updated_at: new Date()
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['key-result', id] });
      queryClient.invalidateQueries({ queryKey: ['key-results'] });
      queryClient.invalidateQueries({ queryKey: ['objective'] });
      
      toast({
        title: 'Key result updated',
        description: 'The key result has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating key result',
        description: error.message,
      });
    }
  });

  // Delete key result
  const deleteKeyResult = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Key Result ID is required');
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('key_results')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['key-results'] });
      queryClient.invalidateQueries({ queryKey: ['objective'] });
      
      toast({
        title: 'Key result deleted',
        description: 'The key result has been deleted successfully.',
      });
      setIsDeleting(false);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error deleting key result',
        description: error.message,
      });
      setIsDeleting(false);
    }
  });

  return {
    keyResult,
    isLoading,
    error,
    updateStatus,
    updateKeyResult,
    deleteKeyResult,
    isDeleting
  };
};
