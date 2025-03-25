
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, CalendarRange, Clock, AlertCircle, Plus } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOKRCycle } from '@/hooks/okr/useOKRCycle';
import { useObjectives } from '@/hooks/okr/useObjectives';
import { CycleStatusBadge } from '@/components/okr/cycles/CycleStatusBadge';
import { ObjectivesGrid } from '@/components/okr/objectives/ObjectivesGrid';
import { CreateObjectiveForm } from '@/components/okr/objectives/CreateObjectiveForm';
import { OKRCycleStatus, CreateObjectiveInput } from '@/types/okr';

const AdminOKRCycleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { cycle, isLoading, error, updateStatus } = useOKRCycle(id);
  const { 
    objectives, 
    isLoading: isLoadingObjectives, 
    createObjective 
  } = useObjectives(id);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const handleStatusChange = (status: string) => {
    updateStatus.mutate(status as OKRCycleStatus);
  };

  const handleCreateObjective = (data: CreateObjectiveInput) => {
    createObjective.mutate(data, {
      onSuccess: () => {
        setCreateDialogOpen(false);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-40 bg-muted rounded"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !cycle) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Button variant="outline" asChild className="mb-6">
          <Link to="/admin/okrs/cycles">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cycles
          </Link>.
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              {error instanceof Error ? error.message : 'Failed to load OKR cycle details'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="outline" asChild className="mb-2">
        <Link to="/admin/okrs/cycles">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cycles
        </Link>
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{cycle.name}</h1>
          <p className="text-muted-foreground">{cycle.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <CycleStatusBadge status={cycle.status} />
          <Select 
            defaultValue={cycle.status} 
            onValueChange={handleStatusChange}
            disabled={updateStatus.isPending}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cycle Information</CardTitle>
          <CardDescription>
            Details about this OKR cycle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Duration</p>
              <div className="flex items-center">
                <CalendarRange className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {format(cycle.startDate, 'MMMM d, yyyy')} - {format(cycle.endDate, 'MMMM d, yyyy')}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Created</p>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{format(cycle.createdAt, 'MMMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          
          {cycle.status === 'active' && (
            <div className="bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">This cycle is currently active</p>
                <p className="text-sm">
                  All objectives associated with this cycle are available for users to update.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Objectives</CardTitle>
            <CardDescription>
              Objectives associated with this OKR cycle
            </CardDescription>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Objective
          </Button>
        </CardHeader>
        <CardContent>
          <ObjectivesGrid 
            objectives={objectives || []} 
            isLoading={isLoadingObjectives} 
            isAdmin={true}
          />
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Objective</DialogTitle>
          </DialogHeader>
          <CreateObjectiveForm 
            onSubmit={handleCreateObjective} 
            isSubmitting={createObjective.isPending} 
            cycleId={cycle.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOKRCycleDetails;
