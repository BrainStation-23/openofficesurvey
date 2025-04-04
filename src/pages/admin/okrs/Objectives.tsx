
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOKRCycles } from '@/hooks/okr/useOKRCycles';
import { CreateObjectiveForm } from '@/components/okr/objectives/CreateObjectiveForm';
import { CreateObjectiveInput } from '@/types/okr';
import { useToast } from '@/hooks/use-toast';
import { useObjectives } from '@/hooks/okr/useObjectives';
import { ObjectivesFilterPanel, ObjectivesFilter } from '@/components/okr/objectives/filters/ObjectivesFilterPanel';
import { PaginatedObjectivesGrid } from '@/components/okr/objectives/PaginatedObjectivesGrid';
import { useFilteredObjectives } from '@/hooks/okr/useFilteredObjectives';
import { useSBUs } from '@/hooks/okr/useSBUs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from "@/components/ui/input";

const AdminAllObjectives = () => {
  const { toast } = useToast();
  const { cycles, isLoading: cyclesLoading } = useOKRCycles();
  const { sbus, isLoading: sbusLoading } = useSBUs();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get the most recent active cycle, or the first cycle if none are active
  const defaultCycleId = React.useMemo(() => {
    if (!cycles || cycles.length === 0) return "";
    const activeCycle = cycles.find(c => c.status === 'active');
    return activeCycle?.id || cycles[0].id;
  }, [cycles]);

  // Use the filtered objectives hook
  const {
    objectives,
    filters,
    isLoading,
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    handleFilterChange,
    handleSearchChange,
    refetch
  } = useFilteredObjectives(true); // true for admin view

  // Use the regular objectives hook for the createObjective mutation
  const { createObjective, objectiveChildCounts } = useObjectives();

  // Handle search input changes with debounce
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearchChange(e.target.value);
  };

  const handleCreateObjective = (data: CreateObjectiveInput) => {
    createObjective.mutate(data, {
      onSuccess: () => {
        setCreateDialogOpen(false);
        // Immediately refetch objectives to show the newly created one
        refetch();
        toast({
          title: 'Success',
          description: 'Objective created successfully',
        });
      }
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Objectives</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Objective
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a new objective for any OKR cycle</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, or owner name..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={handleSearchInput}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <ObjectivesFilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            cycles={cycles || []}
            sbus={sbus || []}
            cyclesLoading={cyclesLoading}
            sbusLoading={sbusLoading}
          />
        </div>
        
        {/* Main content */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Organization Objectives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PaginatedObjectivesGrid 
              objectives={objectives || []}
              isLoading={isLoading}
              isAdmin={true}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              objectiveChildCounts={objectiveChildCounts}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Objective</DialogTitle>
            <DialogDescription>
              Create a new objective in an active OKR cycle
            </DialogDescription>
          </DialogHeader>
          <CreateObjectiveForm 
            onSubmit={handleCreateObjective} 
            isSubmitting={createObjective.isPending} 
            cycleId={defaultCycleId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAllObjectives;
