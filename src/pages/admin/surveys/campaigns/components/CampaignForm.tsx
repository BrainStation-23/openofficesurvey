import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicInfoForm } from "./BasicInfoForm";
import { ScheduleConfig } from "./ScheduleConfig";
import { CampaignReview } from "./CampaignReview";

const campaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  survey_id: z.string().min(1, "Survey is required"),
  starts_at: z.date({
    required_error: "Start date is required",
  }),
  is_recurring: z.boolean().default(false),
  recurring_frequency: z.string().optional(),
  recurring_ends_at: z.date().optional(),
  instance_duration_days: z.number().optional(),
  instance_end_time: z.string().optional(),
  ends_at: z.date().optional(),
  status: z.string().default("draft"),
});

export type CampaignFormData = z.infer<typeof campaignSchema>;

interface Survey {
  id: string;
  name: string;
}

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => void;
  surveys: Survey[];
  defaultValues?: Partial<CampaignFormData>;
  currentStep: number;
  onStepComplete: (step: number) => void;
  onStepBack: (step: number) => void;
}

export function CampaignForm({ 
  onSubmit, 
  surveys, 
  defaultValues,
  currentStep,
  onStepComplete,
  onStepBack,
}: CampaignFormProps) {
  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      survey_id: "",
      starts_at: new Date(),
      is_recurring: false,
      recurring_frequency: undefined,
      instance_duration_days: 7,
      instance_end_time: "17:00",
      status: "draft",
      ...defaultValues,
    },
  });

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      onStepComplete(currentStep);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoForm form={form} surveys={surveys} />;
      case 2:
        return <ScheduleConfig form={form} />;
      case 3:
        return <CampaignReview form={form} />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {renderStepContent()}
        
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onStepBack(currentStep)}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          {currentStep === 3 ? (
            <Button type="submit">
              Create Campaign
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}