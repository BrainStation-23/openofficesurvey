
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ComparisonDimension } from "../types/comparison";
import { ComparisonDataItem } from "../types/rpc";

type ComparisonParams = {
  campaignId: string;
  instanceId?: string; 
  questionName: string;
  dimension: ComparisonDimension;
}

// Define allowed RPC function names for type safety
type ComparisonRpcFunction = 
  | "get_gender_comparison_data"
  | "get_sbu_comparison_data"
  | "get_location_comparison_data"
  | "get_employment_type_comparison_data"
  | "get_level_comparison_data"
  | "get_employee_type_comparison_data"
  | "get_employee_role_comparison_data";

export function useComparisonData(
  params: ComparisonParams | null
) {
  return useQuery<ComparisonDataItem[]>({
    queryKey: params ? ["comparison", params.campaignId, params.instanceId, params.questionName, params.dimension] : [],
    queryFn: async () => {
      if (!params || params.dimension === 'none') {
        return [];
      }
      
      // Map dimension to the appropriate RPC function
      let functionName: ComparisonRpcFunction;
      
      switch (params.dimension) {
        case 'gender':
          functionName = "get_gender_comparison_data";
          break;
        case 'sbu':
          functionName = "get_sbu_comparison_data";
          break;
        case 'location':
          functionName = "get_location_comparison_data";
          break;
        case 'employment_type':
          functionName = "get_employment_type_comparison_data";
          break;
        case 'level':
          functionName = "get_level_comparison_data";
          break;
        case 'employee_type':
          functionName = "get_employee_type_comparison_data";
          break;
        case 'employee_role':
          functionName = "get_employee_role_comparison_data";
          break;
        default:
          return [];
      }
      
      // Fix 1: Properly type the RPC call with the correct generic parameters
      const { data, error } = await supabase.rpc<ComparisonDataItem[], { 
        p_campaign_id: string;
        p_instance_id: string | null;
        p_question_name: string;
      }>(
        functionName,
        {
          p_campaign_id: params.campaignId,
          p_instance_id: params.instanceId || null,
          p_question_name: params.questionName
        }
      );

      if (error) throw error;
      
      // Fix 2: Ensure data is an array before trying to map it
      if (!data || !Array.isArray(data)) return [];
      
      // Transform the raw data to match our expected interface
      return data.map(item => ({
        dimension: item.dimension,
        yes_count: item.yes_count,
        no_count: item.no_count,
        avg_rating: item.avg_rating,
        detractors: item.detractors,
        passives: item.passives,
        promoters: item.promoters,
        text_response_count: item.text_response_count,
        total: item.total,
        text_samples: item.text_samples
      }));
    },
    enabled: !!params && params.dimension !== 'none',
  });
}
