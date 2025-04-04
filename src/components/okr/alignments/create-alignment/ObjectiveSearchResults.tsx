
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Objective, ObjectiveVisibility } from '@/types/okr';
import { useObjectives } from '@/hooks/okr/useObjectives';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAlignments } from '@/hooks/okr/useAlignments';
import { useSBUs } from '@/hooks/okr/useSBUs';
import { getVisibilityColorClass } from '../utils/visibilityUtils';

interface ObjectiveSearchResultsProps {
  currentObjectiveId: string;
  onSelect: (objective: Objective) => void;
  visibilityFilter?: ObjectiveVisibility | 'all';
  selectedSbuId?: string | null;
  searchQuery: string;
  permissions?: {
    organization: boolean;
    department: boolean;
    team: boolean;
    private: boolean;
    hasAnyPermission: boolean;
  };
}

export const ObjectiveSearchResults = ({
  currentObjectiveId,
  onSelect,
  visibilityFilter = 'all',
  selectedSbuId,
  searchQuery,
  permissions
}: ObjectiveSearchResultsProps) => {
  const { objectives, isLoading } = useObjectives();
  const { alignments } = useAlignments(currentObjectiveId);
  const { sbus } = useSBUs();
  const [filteredObjectives, setFilteredObjectives] = useState<Objective[]>([]);
  
  // Create a set of already aligned objective IDs
  const getAlreadyAlignedIds = () => {
    if (!alignments || !alignments.length) return new Set<string>();
    
    const alignedIds = new Set<string>();
    
    alignments.forEach(alignment => {
      // For alignments where this objective is the source (parent)
      if (alignment.sourceObjectiveId === currentObjectiveId && alignment.alignedObjectiveId) {
        alignedIds.add(alignment.alignedObjectiveId);
      }
      
      // For alignments where this objective is the target (child)
      if (alignment.alignedObjectiveId === currentObjectiveId && alignment.sourceObjectiveId) {
        alignedIds.add(alignment.sourceObjectiveId);
      }
    });
    
    return alignedIds;
  };

  // Get SBU name by ID
  const getSbuNameById = (sbuId: string | undefined): string => {
    if (!sbuId || !sbus) return 'N/A';
    const sbu = sbus.find(s => s.id === sbuId);
    return sbu ? sbu.name : 'Unknown';
  };
  
  // Filter objectives to prevent cyclic relationships, self-selection, already aligned objectives, and by visibility
  useEffect(() => {
    if (!objectives || !objectives.length) {
      setFilteredObjectives([]);
      return;
    }
    
    // Get already aligned objective IDs
    const alignedIds = getAlreadyAlignedIds();
    
    // Get all objectives except:
    // 1. The current objective itself
    // 2. Objectives that already have this objective as parent
    // 3. Child objectives of the current objective (to prevent cycles)
    // 4. Objectives that are already aligned with this objective
    // 5. Filter by visibility if provided
    // 6. Filter by user's permission to align with objectives
    // 7. Filter by SBU if department visibility is selected and sbuId is provided
    const childIdsToExclude = new Set<string>();
    
    // Helper function to recursively collect all child IDs
    const collectChildIds = (parentId: string) => {
      const children = objectives.filter(obj => obj.parentObjectiveId === parentId);
      children.forEach(child => {
        childIdsToExclude.add(child.id);
        collectChildIds(child.id);
      });
    };
    
    // Start collecting child IDs from the current objective
    collectChildIds(currentObjectiveId);
    
    // Filter objectives
    const filtered = objectives.filter(obj => {
      // Exclude self
      if (obj.id === currentObjectiveId) return false;
      
      // Exclude already child objectives (to prevent cycles)
      if (childIdsToExclude.has(obj.id)) return false;
      
      // Exclude already aligned objectives
      if (alignedIds.has(obj.id)) return false;
      
      // If permissions are provided, check if user can align with this objective's visibility
      if (permissions) {
        switch (obj.visibility) {
          case 'organization':
            if (!permissions.organization) return false;
            break;
          case 'department':
            if (!permissions.department) return false;
            break;
          case 'team':
            if (!permissions.team) return false;
            break;
          case 'private':
            if (!permissions.private) return false;
            break;
        }
      }

      // Filter by visibility if not "all"
      if (visibilityFilter !== 'all' && obj.visibility !== visibilityFilter) {
        return false;
      }
      
      // Filter by SBU for department visibility
      if (visibilityFilter === 'department' && selectedSbuId && obj.sbuId !== selectedSbuId) {
        return false;
      }
      
      // Apply search query
      if (searchQuery) {
        return obj.title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      return true;
    });
    
    setFilteredObjectives(filtered);
  }, [objectives, currentObjectiveId, searchQuery, alignments, visibilityFilter, selectedSbuId, permissions]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Available Objectives</h3>
      <div className="border rounded-md h-[350px]">
        {isLoading ? (
          <div className="py-8 text-center h-full flex flex-col items-center justify-center">
            <LoadingSpinner className="mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Loading objectives...</p>
          </div>
        ) : filteredObjectives.length > 0 ? (
          <ScrollArea className="h-full">
            <div className="p-2 grid gap-2">
              {filteredObjectives.map((objective) => (
                <ObjectiveCard 
                  key={objective.id} 
                  objective={objective} 
                  onSelect={onSelect}
                  sbuName={getSbuNameById(objective.sbuId)}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {visibilityFilter !== 'all' 
                ? `No matching ${visibilityFilter} objectives found.`
                : searchQuery 
                  ? "No objectives match your search query."
                  : "No matching objectives found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Extracted as a separate component for clarity
interface ObjectiveCardProps {
  objective: Objective;
  onSelect: (objective: Objective) => void;
  sbuName: string;
}

const ObjectiveCard = ({ objective, onSelect, sbuName }: ObjectiveCardProps) => {
  return (
    <Card 
      className={cn(
        "transition-colors cursor-pointer border", 
        getVisibilityColorClass(objective.visibility)
      )}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="font-medium text-sm">{objective.title}</h4>
            {objective.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                {objective.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1 pt-1">
              <Badge variant="outline" className="text-xs">
                {objective.visibility}
              </Badge>
              {objective.sbuId && (
                <Badge variant="outline" className="text-xs">
                  {sbuName}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                Progress: {objective.progress}%
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 ml-2">
            <Button size="sm" variant="secondary" onClick={() => onSelect(objective)}>
              Select
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
