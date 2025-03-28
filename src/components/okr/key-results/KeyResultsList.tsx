
import React, { useState } from 'react';
import { KeyResult } from '@/types/okr';
import { KeyResultItem } from './KeyResultItem';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KeyResultForm } from './KeyResultForm';
import { Card, CardContent } from '@/components/ui/card';
import { useKeyResults } from '@/hooks/okr/useKeyResults';
import { useObjective } from '@/hooks/okr/useObjective';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface KeyResultsListProps {
  objectiveId: string;
}

export const KeyResultsList: React.FC<KeyResultsListProps> = ({ objectiveId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: keyResults, isLoading, error, refetch } = useKeyResults(objectiveId);
  const { objective } = useObjective(objectiveId);
  const { userId, isAdmin } = useCurrentUser();
  
  const isOwner = objective && objective.ownerId === userId;
  const isPublicObjective = objective && (objective.visibility === 'organization' || objective.visibility === 'team');
  const canAddKeyResult = isAdmin || isOwner || isPublicObjective;

  // Handle form close with successful submission
  const handleFormClose = (success: boolean = false) => {
    setIsAddDialogOpen(false);
    // If the form was submitted successfully, refetch key results
    if (success) {
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Key Results</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddDialogOpen(true)}
            disabled
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Key Result
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Key Results</h3>
          {canAddKeyResult && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Key Result
            </Button>
          )}
        </div>
        <Card className="border-red-200">
          <CardContent className="p-6 text-center text-red-600">
            Error loading key results. Please try again.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Key Results</h3>
        {canAddKeyResult && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Key Result
          </Button>
        )}
      </div>
      
      {keyResults && keyResults.length > 0 ? (
        <div>
          {keyResults.map((keyResult: KeyResult) => (
            <KeyResultItem 
              key={keyResult.id} 
              keyResult={keyResult} 
              onDelete={() => refetch()}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No key results associated with this objective yet.</p>
            {canAddKeyResult && (
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                className="mt-4"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Key Result
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Key Result</DialogTitle>
          </DialogHeader>
          <KeyResultForm
            objectiveId={objectiveId}
            onClose={(success) => handleFormClose(success)}
            mode="create"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
