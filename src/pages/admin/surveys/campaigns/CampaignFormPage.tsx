
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CampaignForm, CampaignFormData } from "./components/CampaignForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { CampaignSteps } from "./components/CampaignSteps";
import type { Database } from "@/integrations/supabase/types";

type Campaign = Database['public']['Tables']['survey_campaigns']['Row'];
type CampaignInsert = Database['public']['Tables']['survey_campaigns']['Insert'];

export default function CampaignFormPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('survey_campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        try {
          return {
            ...data,
            starts_at: new Date(data.starts_at),
            ends_at: data.ends_at ? new Date(data.ends_at) : undefined,
          };
        } catch (error) {
          console.error("Error converting campaign dates:", error);
          // Return data with fallback dates if conversion fails
          const now = new Date();
          const oneWeekLater = new Date();
          oneWeekLater.setDate(now.getDate() + 7);
          
          return {
            ...data,
            starts_at: now,
            ends_at: oneWeekLater,
          };
        }
      }
      return null;
    },
    enabled: isEditMode,
  });

  const { data: surveys } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('id, name')
        .eq('status', 'published')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (formData: CampaignFormData) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to create a campaign",
        });
        navigate('/login');
        return;
      }

      // For recurring campaigns, create a proper timestamptz preserving local timezone
      let instanceEndTime: string | null = null;
      
      if (formData.is_recurring && formData.instance_end_time) {
        try {
          // Safely parse time parts with fallbacks
          const timeParts = formData.instance_end_time.split(':');
          let hours = 0;
          let minutes = 0;
          
          // Handle potential 12-hour format (with AM/PM)
          if (formData.instance_end_time.includes('AM') || formData.instance_end_time.includes('PM')) {
            const isPM = formData.instance_end_time.includes('PM');
            const timeWithoutAMPM = formData.instance_end_time.replace(/\s?(AM|PM)/i, '');
            const [hourStr, minuteStr] = timeWithoutAMPM.split(':');
            
            hours = parseInt(hourStr, 10) || 0;
            if (isPM && hours < 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
            
            minutes = parseInt(minuteStr, 10) || 0;
          } else {
            // 24-hour format
            hours = parseInt(timeParts[0], 10) || 0;
            minutes = parseInt(timeParts[1], 10) || 0;
          }
          
          // Create a new date object with just the time portion
          const endTimeDate = new Date();
          endTimeDate.setHours(hours, minutes, 0, 0);
          instanceEndTime = endTimeDate.toISOString();
        } catch (error) {
          console.error("Error parsing instance end time:", error);
          instanceEndTime = null;
        }
      }

      const dataToSubmit: CampaignInsert = {
        name: formData.name,
        description: formData.description,
        survey_id: formData.survey_id,
        starts_at: formData.starts_at.toISOString(),
        is_recurring: formData.is_recurring,
        recurring_frequency: formData.recurring_frequency,
        ends_at: formData.ends_at.toISOString(),
        instance_duration_days: formData.is_recurring ? formData.instance_duration_days : null,
        instance_end_time: formData.is_recurring ? instanceEndTime : null,
        campaign_type: formData.is_recurring ? 'recurring' : 'one_time',
        status: 'draft',
        created_by: session.user.id,
        anonymous: formData.anonymous,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('survey_campaigns')
          .update(dataToSubmit)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Campaign updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('survey_campaigns')
          .insert(dataToSubmit);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Campaign created successfully",
        });
      }
      
      navigate("/admin/surveys/campaigns");
    } catch (error: any) {
      console.error('Campaign submission error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to ${isEditMode ? 'update' : 'create'} campaign`,
      });
    }
  };

  if (isEditMode && isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => navigate("/admin/surveys/campaigns")}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Campaigns
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit' : 'Create'} Campaign
        </h1>
      </div>

      <CampaignSteps
        currentStep={currentStep}
        completedSteps={completedSteps}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CampaignForm 
            onSubmit={handleSubmit}
            surveys={surveys || []}
            defaultValues={campaign}
            currentStep={currentStep}
            onStepComplete={(step: number) => {
              setCompletedSteps((prev) => [...new Set([...prev, step])]);
              if (step < 3) {
                setCurrentStep(step + 1);
              }
            }}
            onStepBack={(step: number) => {
              if (step > 1) {
                setCurrentStep(step - 1);
              }
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Preview panel will be rendered here */}
          </div>
        </div>
      </div>
    </div>
  );
}
