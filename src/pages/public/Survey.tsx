
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Model } from "survey-core";
import { LayeredDarkPanelless } from "survey-core/themes";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { SurveyNotFound } from "./components/SurveyNotFound";
import { SurveyAlert } from "./components/SurveyAlert";
import { SurveyContent } from "./components/SurveyContent";
import { useSurveyData } from "./hooks/useSurveyData";
import { getThemeInstance } from "./hooks/useSurveyTheme";

import "survey-core/defaultV2.min.css";

export default function PublicSurveyPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<Model | null>(null);
  const { data: assignmentData, isLoading } = useSurveyData(token);

  useEffect(() => {
    if (assignmentData?.assignment?.survey?.json_data && !assignmentData.existingResponse) {
      const surveyModel = new Model(assignmentData.assignment.survey.json_data);
      
      if (assignmentData.assignment.survey.theme_settings) {
        const theme = getThemeInstance(assignmentData.assignment.survey.theme_settings);
        if (theme) {
          surveyModel.applyTheme(theme);
        }
      } else {
        surveyModel.applyTheme(LayeredDarkPanelless);
      }
      
      surveyModel.onComplete.add(async (sender) => {
        try {
          const responseData = {
            assignment_id: assignmentData.assignment.id,
            user_id: assignmentData.assignment.user_id,
            response_data: sender.data,
            status: 'submitted' as const,
            campaign_instance_id: assignmentData.activeInstance?.id || null,
            submitted_at: new Date().toISOString(),
          };

          const { error: responseError } = await supabase
            .from("survey_responses")
            .insert(responseData);

          if (responseError) throw responseError;

          toast({
            title: "Survey completed",
            description: "Your response has been submitted successfully. Thank you!",
          });

          navigate(`/public/survey/${token}/thank-you`);
        } catch (error) {
          console.error("Error submitting response:", error);
          toast({
            title: "Error submitting response",
            description: "Your response could not be submitted. Please try again.",
            variant: "destructive",
          });
        }
      });

      setSurvey(surveyModel);
    }
  }, [assignmentData, navigate, toast, token]);

  const handleThemeChange = (theme: any) => {
    if (survey) {
      survey.applyTheme(theme);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!assignmentData?.assignment) {
    return <SurveyNotFound />;
  }

  if (assignmentData.assignment.campaign && assignmentData.assignment.campaign.status !== 'active') {
    return (
      <SurveyAlert 
        title="Survey Not Available"
        description="This survey is not currently active. Please try again later or contact the survey administrator."
      />
    );
  }

  if (assignmentData.assignment.campaign && !assignmentData.activeInstance) {
    return (
      <SurveyAlert 
        title="Survey Not Available"
        description="There is no active survey period at the moment. Please try again later."
      />
    );
  }

  if (assignmentData.existingResponse) {
    return (
      <SurveyAlert 
        title="Already Submitted"
        description={
          <>
            You have already submitted your response to this survey on{" "}
            {new Date(assignmentData.existingResponse.submitted_at).toLocaleDateString()}{" "}
            at{" "}
            {new Date(assignmentData.existingResponse.submitted_at).toLocaleTimeString()}.
            <br />
            <br />
            Thank you for your participation!
          </>
        }
      />
    );
  }

  return (
    <SurveyContent
      name={assignmentData.assignment.survey.name}
      description={assignmentData.assignment.survey.description}
      survey={survey}
      onThemeChange={handleThemeChange}
    />
  );
}
