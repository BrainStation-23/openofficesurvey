
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Survey } from "survey-react-ui";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSwitcher } from "@/components/shared/surveys/ThemeSwitcher";
import { useSurveyResponse } from "@/hooks/survey-response";
import { SubmitDialog } from "@/pages/admin/my-surveys/[id]/components/SubmitDialog";
import { Json } from "@/integrations/supabase/types";

import "survey-core/defaultV2.min.css";

interface SurveyResponsePageProps {
  viewType: 'user' | 'admin';
}

interface ThemeSettings {
  [key: string]: Json | undefined;
  baseTheme: string;
  isDark: boolean;
  isPanelless: boolean;
}

function isThemeSettings(json: Json): json is ThemeSettings {
  if (typeof json !== 'object' || json === null) return false;
  
  const obj = json as Record<string, unknown>;
  return (
    typeof obj.baseTheme === 'string' &&
    typeof obj.isDark === 'boolean' &&
    typeof obj.isPanelless === 'boolean'
  );
}

export default function SurveyResponsePage({ viewType }: SurveyResponsePageProps) {
  const { assignmentId, instanceId } = useParams();
  const navigate = useNavigate();

  const { data: assignmentData, isLoading } = useQuery({
    queryKey: ["survey-assignment-with-response", assignmentId, instanceId],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("User not authenticated");

      const { data: assignment, error: assignmentError } = await supabase
        .from("survey_assignments")
        .select(`
          *,
          survey:surveys (
            id,
            name,
            description,
            json_data,
            theme_settings,
            status
          ),
          campaign:survey_campaigns!survey_assignments_campaign_id_fkey (
            id,
            name
          )
        `)
        .eq("id", assignmentId)
        .maybeSingle();

      if (assignmentError) throw assignmentError;
      if (!assignment) throw new Error("Survey assignment not found");

      // Get the response for this specific instance
      const { data: response, error: responseError } = await supabase
        .from("survey_responses")
        .select("*")
        .eq("assignment_id", assignmentId)
        .eq("campaign_instance_id", instanceId)
        .eq("user_id", user.data.user.id)
        .order("updated_at", { ascending: false })
        .maybeSingle();

      if (responseError) throw responseError;

      return {
        assignment,
        existingResponse: response
      };
    },
  });

  // Get theme settings with type safety
  const themeSettings = assignmentData?.assignment.survey.theme_settings;
  const validThemeSettings = isThemeSettings(themeSettings) ? themeSettings : {
    baseTheme: 'Layered',
    isDark: true,
    isPanelless: true
  };

  const {
    survey,
    lastSaved,
    showSubmitDialog,
    setShowSubmitDialog,
    handleSubmitSurvey,
    handleThemeChange,
  } = useSurveyResponse({
    id: assignmentId!,
    viewType,
    surveyData: assignmentData?.assignment.survey?.json_data,
    existingResponse: assignmentData?.existingResponse,
    campaignInstanceId: instanceId || null,
    initialTheme: validThemeSettings,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!assignmentData?.assignment) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Survey not found or you don't have access to it.</p>
        <Button
          variant="ghost"
          onClick={() => navigate(`/${viewType}/my-surveys`)}
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
            onClick={() => navigate(`/${viewType}/my-surveys`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {assignmentData.assignment.campaign?.name || assignmentData.assignment.survey.name}
          </h1>
        </div>
        {lastSaved && (
          <p className="text-sm text-muted-foreground">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <ThemeSwitcher 
          onThemeChange={handleThemeChange}
          defaultBaseTheme={validThemeSettings.baseTheme}
          defaultIsDark={validThemeSettings.isDark}
          defaultIsPanelless={validThemeSettings.isPanelless}
        />
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

      <SubmitDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        onSubmit={handleSubmitSurvey}
      />
    </div>
  );
}
