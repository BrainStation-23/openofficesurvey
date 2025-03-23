
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ObjectiveTreeView } from './ObjectiveTreeView';
import { CreateAlignmentDialog } from './CreateAlignmentDialog';
import { ObjectiveWithRelations } from '@/types/okr';
import { Plus } from 'lucide-react';

interface ObjectiveAlignmentManagerProps {
  objective: ObjectiveWithRelations;
  isAdmin?: boolean;
  canEdit?: boolean;
}

export const ObjectiveAlignmentManager: React.FC<ObjectiveAlignmentManagerProps> = ({
  objective,
  isAdmin = false,
  canEdit = false
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Objective Hierarchy</h3>
        {canEdit && (
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            variant="outline" 
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" /> Create Alignment
          </Button>
        )}
      </div>
      
      <ObjectiveTreeView 
        objective={objective} 
        isAdmin={isAdmin} 
      />
      
      <CreateAlignmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        sourceObjectiveId={objective.id}
      />
    </div>
  );
};
