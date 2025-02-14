
import { Database } from "@/integrations/supabase/types";

export type ResponseStatus = "assigned" | "in_progress" | "submitted" | "expired";

export type SurveyAssignment = {
  id: string;
  survey_id: string;
  user_id: string;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_recurring: boolean | null;
  recurring_frequency: Database["public"]["Enums"]["recurring_frequency"] | null;
  recurring_ends_at: string | null;
  recurring_days: number[] | null;
};

export type Assignment = {
  id: string;
  status: ResponseStatus;
  due_date: string | null;
  user: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    user_sbus?: {
      sbu: {
        id: string;
        name: string;
      };
      is_primary: boolean;
    }[];
  };
};

export type AssignmentWithStatus = {
  id: string;
  due_date: string | null;
  status: ResponseStatus;
  user: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    user_sbus?: {
      is_primary: boolean;
      sbu: {
        id: string;
        name: string;
      };
    }[];
  };
};
