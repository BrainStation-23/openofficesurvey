
import { Json } from "@/integrations/supabase/types";

export interface InstanceMetrics {
  avg_rating: number | null;
  unique_respondents: number | null;
  total_responses: number | null;
  ends_at: string | null;
  starts_at: string | null;
  period_number: number | null;
  campaign_instance_id: string | null;
  gender_breakdown: Json | null;
  location_breakdown: Json | null;
  completion_rate: number | null;
}

export interface QuestionComparison {
  campaign_instance_id: string | null;
  response_count: number | null;
  avg_numeric_value: number | null;
  yes_percentage: number | null;
  question_key: string | null;
  text_responses: string[] | null;
  // We'll make period_number optional to match our updated SQL function
  period_number?: number | null;
}

export interface ComparisonData {
  baseInstance: InstanceMetrics;
  comparisonInstance: InstanceMetrics;
}

export interface QuestionComparisonData {
  baseInstance: QuestionComparison[];
  comparisonInstance: QuestionComparison[];
}

export interface TopManagerPerformer {
  name: string;
  base_score: number;
  comparison_score: number;
  change: number;
  base_rank: number;
  comparison_rank: number;
  rank_change: number;
}
