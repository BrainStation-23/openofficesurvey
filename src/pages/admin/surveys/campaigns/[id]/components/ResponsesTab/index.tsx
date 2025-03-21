
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Response, FilterOptions } from "./types";
import { ResponsesList } from "./ResponsesList";
import { ResponsesFilters } from "./ResponsesFilters";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportResponses } from "./utils/export";
import { useToast } from "@/components/ui/use-toast";

interface ResponsesTabProps {
  campaignId: string;
  instanceId?: string;
}

export function ResponsesTab({ campaignId, instanceId }: ResponsesTabProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    sortBy: "date",
    sortDirection: "desc",
  });

  const { data: responses, isLoading } = useQuery({
    queryKey: ["responses", campaignId, instanceId, filters],
    queryFn: async () => {
      // If no instanceId is provided, return empty array
      if (!instanceId) return [];

      const query = supabase
        .from("survey_responses")
        .select(`
          id,
          status,
          created_at,
          updated_at,
          submitted_at,
          response_data,
          campaign_instance_id,
          assignment:survey_assignments!inner(
            id,
            campaign_id,
            campaign:survey_campaigns!survey_assignments_campaign_id_fkey(
              id,
              name,
              anonymous
            )
          ),
          user:profiles!inner(
            id,
            first_name,
            last_name,
            email,
            user_sbus(
              is_primary,
              sbu:sbus(
                id,
                name
              )
            ),
            user_supervisors!user_supervisors_user_id_fkey(
              is_primary,
              supervisor:profiles!user_supervisors_supervisor_id_fkey(
                id,
                first_name,
                last_name,
                email
              )
            )
          )`)
        .eq('assignment.campaign_id', campaignId)
        .eq('campaign_instance_id', instanceId)
        .order('created_at', { ascending: filters.sortDirection === "asc" });

      const { data, error } = await query;
      if (error) throw error;

      return data as Response[];
    },
  });

  const handleExport = async () => {
    if (responses) {
      try {
        setIsExporting(true);
        await exportResponses(responses);
        toast({
          title: "Export successful",
          description: "Your survey responses have been exported to CSV.",
        });
      } catch (error) {
        console.error('Export error:', error);
        toast({
          title: "Export failed",
          description: "There was an error exporting the survey responses.",
          variant: "destructive",
        });
      } finally {
        setIsExporting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-full animate-pulse bg-muted rounded" />
        <div className="h-32 w-full animate-pulse bg-muted rounded" />
      </div>
    );
  }

  if (!instanceId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please select a period to view responses.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ResponsesFilters filters={filters} onFiltersChange={setFilters} />
        <Button 
          variant="outline" 
          onClick={handleExport} 
          disabled={!responses?.length || isExporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>

      <ResponsesList responses={responses || []} />
    </div>
  );
}
