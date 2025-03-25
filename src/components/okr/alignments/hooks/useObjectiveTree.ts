
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ObjectiveWithRelations, Objective, ObjectiveAlignment, AlignmentType } from '@/types/okr';
import { useAlignments } from '@/hooks/okr/useAlignments';
import { supabase } from '@/integrations/supabase/client';
import { Edge, Node } from '@xyflow/react';

export const useObjectiveTree = (objective: ObjectiveWithRelations, isAdmin: boolean, canEdit: boolean) => {
  const [rootObjective, setRootObjective] = useState<Objective | null>(null);
  const [currentObjectivePath, setCurrentObjectivePath] = useState<string[]>([]);
  const { deleteAlignment } = useAlignments(objective.id);
  const [cachedData, setCachedData] = useState<Map<string, ObjectiveWithRelations>>(new Map());

  useEffect(() => {
    const findRootAndPath = async () => {
      if (!objective) return;
      
      if (!objective.parentObjectiveId) {
        setRootObjective(objective);
        setCurrentObjectivePath([objective.id]);
        return;
      }
      
      try {
        let currentObj = { ...objective };
        const path = [currentObj.id];
        
        while (currentObj.parentObjectiveId) {
          // Check cache first before making a database call
          const cachedObj = cachedData.get(currentObj.parentObjectiveId);
          
          if (cachedObj) {
            currentObj = cachedObj;
          } else {
            const { data, error } = await supabase
              .from('objectives')
              .select('*')
              .eq('id', currentObj.parentObjectiveId)
              .single();
              
            if (error || !data) break;
            
            currentObj = {
              id: data.id,
              title: data.title,
              description: data.description,
              cycleId: data.cycle_id,
              ownerId: data.owner_id,
              status: data.status,
              progress: data.progress,
              visibility: data.visibility,
              parentObjectiveId: data.parent_objective_id,
              sbuId: data.sbu_id,
              approvalStatus: data.approval_status,
              createdAt: new Date(data.created_at),
              updatedAt: new Date(data.updated_at)
            } as Objective;
            
            // Update cache with the new object
            setCachedData(prev => new Map(prev).set(currentObj.id, currentObj as ObjectiveWithRelations));
          }
          
          path.unshift(currentObj.id);
        }
        
        setRootObjective(currentObj);
        setCurrentObjectivePath(path);
      } catch (error) {
        console.error('Error finding root objective:', error);
      }
    };
    
    findRootAndPath();
  }, [objective, cachedData]);

  const findParentAlignmentId = useCallback(() => {
    if (!objective.alignedObjectives) return null;
    
    const parentAlignment = objective.alignedObjectives.find(
      alignment => alignment.alignmentType === 'parent_child' && 
                   alignment.alignedObjectiveId === objective.id
    );
    
    return parentAlignment?.id || null;
  }, [objective]);

  const findChildAlignments = useCallback(() => {
    if (!objective.alignedObjectives) return [];
    
    return objective.alignedObjectives.filter(
      alignment => alignment.alignmentType === 'parent_child' && 
                   alignment.sourceObjectiveId === objective.id
    );
  }, [objective]);

  const handleDeleteAlignment = async (alignmentId: string) => {
    try {
      await deleteAlignment.mutateAsync(alignmentId);
    } catch (error) {
      console.error('Error deleting alignment:', error);
    }
  };

  // Fetch an objective and its related data with caching
  const fetchObjectiveWithRelations = useCallback(async (objectiveId: string) => {
    // Check cache first
    if (cachedData.has(objectiveId)) {
      return cachedData.get(objectiveId);
    }
    
    try {
      console.log(`Fetching objective with relations: ${objectiveId}`);
      // Fetch the objective
      const { data: objectiveData, error: objectiveError } = await supabase
        .from('objectives')
        .select('*')
        .eq('id', objectiveId)
        .single();
        
      if (objectiveError) throw objectiveError;
      
      // Fetch child objectives
      const { data: childObjectives, error: childrenError } = await supabase
        .from('objectives')
        .select('*')
        .eq('parent_objective_id', objectiveId);
        
      if (childrenError) throw childrenError;
      
      // Fetch alignments where this objective is the source
      const { data: sourceAlignments, error: sourceError } = await supabase
        .from('okr_alignments')
        .select(`
          id,
          source_objective_id,
          aligned_objective_id,
          alignment_type,
          weight,
          created_by,
          created_at,
          aligned_objective:objectives!aligned_objective_id (*)
        `)
        .eq('source_objective_id', objectiveId);
        
      if (sourceError) throw sourceError;

      // Transform the data
      const obj = {
        id: objectiveData.id,
        title: objectiveData.title,
        description: objectiveData.description,
        cycleId: objectiveData.cycle_id,
        ownerId: objectiveData.owner_id,
        status: objectiveData.status,
        progress: objectiveData.progress,
        visibility: objectiveData.visibility,
        parentObjectiveId: objectiveData.parent_objective_id,
        sbuId: objectiveData.sbu_id,
        approvalStatus: objectiveData.approval_status,
        createdAt: new Date(objectiveData.created_at),
        updatedAt: new Date(objectiveData.updated_at),
        childObjectives: childObjectives.map((child) => ({
          id: child.id,
          title: child.title,
          description: child.description,
          cycleId: child.cycle_id,
          ownerId: child.owner_id,
          status: child.status,
          progress: child.progress,
          visibility: child.visibility,
          parentObjectiveId: child.parent_objective_id,
          sbuId: child.sbu_id,
          approvalStatus: child.approval_status,
          createdAt: new Date(child.created_at),
          updatedAt: new Date(child.updated_at)
        })),
        alignedObjectives: sourceAlignments.map((align) => ({
          id: align.id,
          sourceObjectiveId: align.source_objective_id,
          alignedObjectiveId: align.aligned_objective_id,
          alignmentType: align.alignment_type as AlignmentType,
          weight: align.weight || 1,
          createdBy: align.created_by,
          createdAt: new Date(align.created_at),
          alignedObjective: align.aligned_objective ? {
            id: align.aligned_objective.id,
            title: align.aligned_objective.title,
            description: align.aligned_objective.description,
            cycleId: align.aligned_objective.cycle_id,
            ownerId: align.aligned_objective.owner_id,
            status: align.aligned_objective.status,
            progress: align.aligned_objective.progress,
            visibility: align.aligned_objective.visibility,
            parentObjectiveId: align.aligned_objective.parent_objective_id,
            sbuId: align.aligned_objective.sbu_id,
            approvalStatus: align.aligned_objective.approval_status,
            createdAt: new Date(align.aligned_objective.created_at),
            updatedAt: new Date(align.aligned_objective.updated_at)
          } : undefined
        })) as ObjectiveAlignment[]
      };
      
      // Cache the result
      const objWithRelations = obj as ObjectiveWithRelations;
      setCachedData(prev => new Map(prev).set(objectiveId, objWithRelations));
      
      return objWithRelations;
    } catch (error) {
      console.error('Error fetching objective with relations:', error);
      return null;
    }
  }, [cachedData]);

  // Process objective data into graph nodes and edges, with memoization
  const processHierarchyData = useCallback(async (rootObj: Objective, highlightPath: string[]) => {
    console.log('Starting to process hierarchy data');
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const processedNodes = new Set<string>();
    
    // Calculate positions in a tree-like layout
    const calculateNodePosition = (level: number, index: number, totalNodesInLevel: number) => {
      const horizontalSpacing = 300;
      const verticalSpacing = 150;
      const levelWidth = totalNodesInLevel * horizontalSpacing;
      const startX = -levelWidth / 2 + horizontalSpacing / 2;
      
      return {
        x: startX + index * horizontalSpacing,
        y: level * verticalSpacing
      };
    };
    
    // Process nodes breadth-first instead of depth-first to improve performance
    const processHierarchy = async () => {
      const queue: Array<{
        obj: Objective | ObjectiveWithRelations,
        level: number,
        index: number,
        totalNodesInLevel: number,
        parentId?: string
      }> = [{
        obj: rootObj,
        level: 0,
        index: 0,
        totalNodesInLevel: 1
      }];
      
      while (queue.length > 0) {
        const { obj, level, index, totalNodesInLevel, parentId } = queue.shift()!;
        
        if (processedNodes.has(obj.id)) continue;
        
        const isCurrentObjective = obj.id === objective.id;
        const isInPath = highlightPath.includes(obj.id);
        
        // Calculate position
        const position = calculateNodePosition(level, index, totalNodesInLevel);
        
        // Create node
        nodes.push({
          id: obj.id,
          type: 'objectiveNode',
          position,
          draggable: true, // Allow dragging for better UX
          data: {
            objective: obj,
            isAdmin,
            isCurrentObjective,
            isInPath,
            canDelete: canEdit && parentId !== undefined,
            onDelete: parentId ? () => {
              const alignment = objective.alignedObjectives?.find(
                a => (a.sourceObjectiveId === parentId && a.alignedObjectiveId === obj.id) || 
                    (a.sourceObjectiveId === obj.id && a.alignedObjectiveId === parentId)
              );
              if (alignment) handleDeleteAlignment(alignment.id);
            } : undefined
          }
        });
        
        processedNodes.add(obj.id);
        
        // Create edge if there's a parent
        if (parentId) {
          edges.push({
            id: `${parentId}-${obj.id}`,
            source: parentId,
            target: obj.id,
            type: 'smoothstep',
            animated: isInPath,
            style: { 
              stroke: isInPath ? '#9333ea' : '#64748b', 
              strokeWidth: isInPath ? 3 : 2 
            }
          });
        }
        
        // Fetch complete objective data with relations if needed
        let objWithRelations = obj as ObjectiveWithRelations;
        if (!('childObjectives' in obj) || !('alignedObjectives' in obj)) {
          const fetchedObj = await fetchObjectiveWithRelations(obj.id);
          if (fetchedObj) {
            objWithRelations = fetchedObj;
          }
        }
        
        // Process child objectives
        const childNodes: Objective[] = [];
        
        // Add direct child objectives
        if (objWithRelations.childObjectives && objWithRelations.childObjectives.length > 0) {
          childNodes.push(...objWithRelations.childObjectives);
        }
        
        // Add aligned objectives
        if (objWithRelations.alignedObjectives && objWithRelations.alignedObjectives.length > 0) {
          const alignments = objWithRelations.alignedObjectives.filter(
            alignment => alignment.alignmentType === 'parent_child' && 
                        alignment.sourceObjectiveId === obj.id
          );
          
          alignments.forEach(alignment => {
            if (alignment.alignedObjective) {
              childNodes.push(alignment.alignedObjective);
            }
          });
        }
        
        // Add child nodes to queue
        if (childNodes.length > 0) {
          childNodes.forEach((childObj, idx) => {
            queue.push({
              obj: childObj,
              level: level + 1,
              index: idx,
              totalNodesInLevel: childNodes.length,
              parentId: obj.id
            });
          });
        }
      }
    };
    
    await processHierarchy();
    console.log(`Processed ${nodes.length} nodes and ${edges.length} edges`);
    
    return { nodes, edges };
  }, [objective, isAdmin, canEdit, handleDeleteAlignment, fetchObjectiveWithRelations]);

  return {
    findParentAlignmentId,
    findChildAlignments,
    handleDeleteAlignment,
    rootObjective,
    processHierarchyData,
    currentObjectivePath
  };
};
