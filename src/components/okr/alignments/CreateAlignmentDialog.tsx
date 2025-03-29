
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Objective, AlignmentType, CreateAlignmentInput } from '@/types/okr';
import { useAlignments } from '@/hooks/okr/useAlignments';
import { ObjectiveSelection } from './create-alignment/ObjectiveSelection';
import { AlignmentForm, alignmentFormSchema } from './create-alignment/AlignmentForm';
import * as z from "zod";

interface CreateAlignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceObjectiveId: string;
  onSuccess?: () => void;
}

export const CreateAlignmentDialog: React.FC<CreateAlignmentDialogProps> = ({
  open,
  onOpenChange,
  sourceObjectiveId,
  onSuccess
}) => {
  const { createAlignment } = useAlignments(sourceObjectiveId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [relationDirection, setRelationDirection] = useState<'parent' | 'child'>('parent');
  
  const toggleRelationDirection = () => {
    setRelationDirection(prev => prev === 'parent' ? 'child' : 'parent');
  };

  const onSubmit = async (values: z.infer<typeof alignmentFormSchema>) => {
    if (!sourceObjectiveId || !selectedObjective) return;
    
    setIsSubmitting(true);
    
    try {
      let alignmentData: CreateAlignmentInput;
      
      if (relationDirection === 'parent') {
        // Current objective will be the child, selected objective will be the parent
        alignmentData = {
          sourceObjectiveId: selectedObjective.id,
          alignedObjectiveId: sourceObjectiveId,
          alignmentType: 'parent_child',
          weight: values.weight,
        };
      } else {
        // Current objective will be the parent, selected objective will be the child
        alignmentData = {
          sourceObjectiveId: sourceObjectiveId,
          alignedObjectiveId: selectedObjective.id,
          alignmentType: 'parent_child',
          weight: values.weight,
        };
      }
      
      await createAlignment.mutateAsync(alignmentData);
      
      setSelectedObjective(null);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating alignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create Alignment</DialogTitle>
          <DialogDescription>
            Connect this objective with another to establish a parent-child relationship.
          </DialogDescription>
        </DialogHeader>
        
        <ObjectiveSelection
          relationDirection={relationDirection}
          toggleRelationDirection={toggleRelationDirection}
          selectedObjective={selectedObjective}
          setSelectedObjective={setSelectedObjective}
          sourceObjectiveId={sourceObjectiveId}
        />
        
        <Form>
          <AlignmentForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            selectedObjective={selectedObjective}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
};
