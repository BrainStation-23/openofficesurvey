import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { LayeredDarkPanelless } from "survey-core/themes";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SurveyStateData, isSurveyStateData } from "@/types/survey";

import "survey-core/defaultV2.min.css";

export default function UserSurveyResponsePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<Model | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ["survey-assignment", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("survey_assignments")
        .select(`
          *,
          survey:surveys (
            id,
            name,
            description,
            json_data,
            status
          ),
          campaign:survey_campaigns (
            id,
            name
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Survey assignment not found");
      return data;
    },
  });

  const { data: activeInstance } = useQuery({
    queryKey: ["active-campaign-instance", assignment?.campaign_id],
    enabled: !!assignment?.campaign_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaign_instances")
        .select("*")
        .eq("campaign_id", assignment.campaign_id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: existingResponse } = useQuery({
    queryKey: ["survey-response", id, activeInstance?.id],
    enabled: !!id,
    queryFn: async () => {
      const query = supabase
        .from("survey_responses")
        .select("*")
        .eq("assignment_id", id);

      if (activeInstance?.id) {
        query.eq("campaign_instance_id", activeInstance.id);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (assignment?.survey?.json_data) {
      const surveyModel = new Model(assignment.survey.json_data);
      
      surveyModel.applyTheme(LayeredDarkPanelless);
      
      if (existingResponse?.response_data) {
        surveyModel.data = existingResponse.response_data;
        surveyModel.start();
        
        // Restore last page from state_data if available
        const stateData = existingResponse.state_data;
        if (stateData && isSurveyStateData(stateData)) {
          surveyModel.currentPageNo = stateData.lastPageNo;
        } else {
          surveyModel.currentPageNo = surveyModel.maxValidPageNo;
        }
      }

      if (assignment.status === 'completed') {
        surveyModel.mode = 'display';
      } else {
        // Save state when page changes
        surveyModel.onCurrentPageChanged.add(async (sender) => {
          try {
            const userId = (await supabase.auth.getUser()).data.user?.id;
            if (!userId) throw new Error("User not authenticated");

            const stateData = {
              lastPageNo: sender.currentPageNo,
              lastUpdated: new Date().toISOString()
            } as SurveyStateData;

            const { error } = await supabase
              .from("survey_responses")
              .upsert({
                assignment_id: id,
                user_id: userId,
                response_data: existingResponse?.response_data || {},
                state_data: stateData,
                campaign_instance_id: activeInstance?.id || null,
              }, {
                onConflict: activeInstance?.id 
                  ? 'assignment_id,user_id,campaign_instance_id' 
                  : 'assignment_id,user_id'
              });

            if (error) throw error;
          } catch (error) {
            console.error("Error saving page state:", error);
          }
        });

        surveyModel.onValueChanged.add(async (sender, options) => {
          try {
            const userId = (await supabase.auth.getUser()).data.user?.id;
            if (!userId) throw new Error("User not authenticated");

            const responseData = {
              assignment_id: id,
              user_id: userId,
              response_data: sender.data,
              updated_at: new Date().toISOString(),
              campaign_instance_id: activeInstance?.id || null,
            };

            const { error } = await supabase
              .from("survey_responses")
              .upsert(responseData, {
                onConflict: activeInstance?.id 
                  ? 'assignment_id,user_id,campaign_instance_id' 
                  : 'assignment_id,user_id'
              });

            if (error) throw error;
            setLastSaved(new Date());
          } catch (error) {
            console.error("Error saving response:", error);
            toast({
              title: "Error saving response",
              description: "Your progress could not be saved. Please try again.",
              variant: "destructive",
            });
          }
        });

        surveyModel.onComplete.add(async (sender) => {
          try {
            const userId = (await supabase.auth.getUser()).data.user?.id;
            if (!userId) throw new Error("User not authenticated");

            const responseData = {
              assignment_id: id,
              user_id: userId,
              response_data: sender.data,
              submitted_at: new Date().toISOString(),
              campaign_instance_id: activeInstance?.id || null,
            };

            const { error: responseError } = await supabase
              .from("survey_responses")
              .upsert(responseData, {
                onConflict: activeInstance?.id 
                  ? 'assignment_id,user_id,campaign_instance_id' 
                  : 'assignment_id,user_id'
              });

            if (responseError) throw responseError;

            // Update assignment status
            const { error: assignmentError } = await supabase
              .from("survey_assignments")
              .update({ status: "completed" })
              .eq("id", id);

            if (assignmentError) throw assignmentError;

            toast({
              title: "Survey completed",
              description: "Your response has been submitted successfully.",
            });

            navigate("/user/my-surveys");
          } catch (error) {
            console.error("Error submitting response:", error);
            toast({
              title: "Error submitting response",
              description: "Your response could not be submitted. Please try again.",
              variant: "destructive",
            });
          }
        });
      }

      setSurvey(surveyModel);
    }
  }, [assignment, existingResponse, id, navigate, toast, activeInstance]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !assignment) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Survey not found or you don't have access to it.</p>
        <Button
          variant="ghost"
          onClick={() => navigate("/user/my-surveys")}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Surveys
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/user/my-surveys")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {assignment.campaign?.name || assignment.survey.name}
          </h1>
        </div>
        {lastSaved && (
          <p className="text-sm text-muted-foreground">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>
      
      <div className="bg-card rounded-lg border p-6">
        {survey ? (
          <Survey model={survey} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Unable to load survey. Please try again later.
          </div>
        )}
      </div>
    </div>
  );
}
