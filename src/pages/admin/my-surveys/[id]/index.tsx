
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
import { ThemeSwitcher } from "@/components/shared/surveys/ThemeSwitcher";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import "survey-core/defaultV2.min.css";

export default function SurveyResponsePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<Model | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const { data: assignment, isLoading } = useQuery({
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
        .single();

      if (error) throw error;
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
    enabled: !!id,
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

      if (existingResponse?.status === 'submitted' || assignment.status === 'completed') {
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
                response_data: sender.data,
                state_data: stateData,
                status: 'in_progress',
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
              status: 'in_progress',
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

        surveyModel.onComplete.add(() => {
          // Instead of submitting directly, show confirmation dialog
          setShowSubmitDialog(true);
        });
      }

      setSurvey(surveyModel);
    }
  }, [assignment, existingResponse, id, navigate, toast, activeInstance]);

  const handleSubmitSurvey = async () => {
    if (!survey) return;
    
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("User not authenticated");

      const responseData = {
        assignment_id: id,
        user_id: userId,
        response_data: survey.data,
        status: 'submitted',
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

      navigate("/admin/my-surveys");
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error submitting response",
        description: "Your response could not be submitted. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !survey) {
    return <div>Loading...</div>;
  }

  const handleThemeChange = (theme: any) => {
    if (survey) {
      survey.applyTheme(theme);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/my-surveys")}
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

      <div className="flex justify-end">
        <ThemeSwitcher onThemeChange={handleThemeChange} />
      </div>
      
      <div className="bg-card rounded-lg border p-6">
        <Survey model={survey} />
      </div>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Survey Response</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this survey? Once submitted, you won't be able to make any changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitSurvey}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
