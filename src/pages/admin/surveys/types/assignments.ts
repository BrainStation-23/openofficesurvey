
import { Database } from "@/integrations/supabase/types";

export type ResponseStatus = "assigned" | "in_progress" | "submitted" | "expired";

export type SurveyAssignment = {
  id: string;
  survey_id: string;
  user_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  recurring_frequency: Database["public"]["Enums"]["recurring_frequency"] | null;
  recurring_ends_at: string | null;
  recurring_days: number[] | null;
  status?: ResponseStatus;
};

export type Assignment = {
  id: string;
  status: ResponseStatus;
  public_access_token: string;
  last_reminder_sent?: string | null;
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

