
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CampaignTabs, TabPanel } from "./components/CampaignTabs";
import { CampaignHeader } from "./components/CampaignHeader";
import { AssignmentInstanceList } from "./components/AssignmentInstanceList";
import { ResponsesList } from "./components/ResponsesTab/ResponsesList";
import { OverviewTab } from "./components/OverviewTab";
import { ReportsTab } from "./components/ReportsTab";
import { InstanceSelector } from "./components/InstanceSelector";
import { useState } from "react";
import { ResponseStatus } from "@/pages/admin/surveys/types/assignments";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>();

  const { data: campaign, isLoading: isLoadingCampaign } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("survey_campaigns")
        .select(`
          *,
          survey:surveys(
            id,
            name,
            description,
            json_data
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ["campaign-assignments", id, selectedInstanceId],
    queryFn: async () => {
      const query = supabase
        .from("survey_assignments")
        .select(`
          id,
          public_access_token,
          last_reminder_sent,
          campaign_id,
          survey_id,
          due_date,
          user:profiles!survey_assignments_user_id_fkey (
            id,
            email,
            first_name,
            last_name,
            user_sbus (
              id,
              is_primary,
              sbus (
                id,
                name
              )
            )
          )
        `)
        .eq("campaign_id", id);

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to include the status with the correct type
      return data?.map(assignment => ({
        ...assignment,
        status: 'assigned' as ResponseStatus // Explicitly type the status
      })) || [];
    },
  });

  if (isLoadingCampaign) {
    return <div>Loading...</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      <CampaignHeader campaign={campaign} isLoading={isLoadingCampaign} />
      
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Campaign Details</h2>
        <InstanceSelector
          campaignId={campaign.id}
          selectedInstanceId={selectedInstanceId}
          onInstanceSelect={setSelectedInstanceId}
        />
      </div>

      <CampaignTabs isAnonymous={campaign.anonymous} status={campaign.status}>
        <TabPanel value="overview">
          <OverviewTab campaignId={campaign.id} />
        </TabPanel>

        <TabPanel value="assignments">
          <AssignmentInstanceList
            assignments={assignments || []}
            isLoading={isLoadingAssignments}
            campaignId={campaign.id}
            surveyId={campaign.survey_id}
            selectedInstanceId={selectedInstanceId}
          />
        </TabPanel>

        <TabPanel value="responses">
          <ResponsesList
            campaign={campaign.id}
            instance={selectedInstanceId}
            isAnonymous={campaign.anonymous}
          />
        </TabPanel>

        <TabPanel value="reports">
          <ReportsTab
            campaignId={campaign.id}
            instanceId={selectedInstanceId}
          />
        </TabPanel>

        <TabPanel value="analyze">
          <div>AI Analysis content will go here</div>
        </TabPanel>
      </CampaignTabs>
    </div>
  );
}
