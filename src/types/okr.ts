
export type OKRCycleStatus = 'active' | 'upcoming' | 'completed' | 'archived';

export interface OKRCycle {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: OKRCycleStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateOKRCycleInput {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateOKRCycleInput extends Partial<CreateOKRCycleInput> {
  status?: OKRCycleStatus;
}

export type ObjectiveStatus = 'draft' | 'in_progress' | 'at_risk' | 'on_track' | 'completed';
export type ObjectiveVisibility = 'personal' | 'team' | 'organization';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Objective {
  id: string;
  title: string;
  description?: string;
  cycleId: string;
  ownerId: string;
  status: ObjectiveStatus;
  progress: number;
  visibility: ObjectiveVisibility;
  parentObjectiveId?: string;
  sbuId?: string;
  approvalStatus: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateObjectiveInput {
  title: string;
  description?: string;
  cycleId: string;
  visibility: ObjectiveVisibility;
  parentObjectiveId?: string;
  sbuId?: string;
}

export interface UpdateObjectiveInput extends Partial<CreateObjectiveInput> {
  status?: ObjectiveStatus;
  progress?: number;
  approvalStatus?: ApprovalStatus;
}
