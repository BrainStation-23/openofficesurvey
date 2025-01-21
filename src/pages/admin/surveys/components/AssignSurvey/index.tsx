import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserSelector } from "./UserSelector";
import { RecurringSchedule } from "./RecurringSchedule";
import { DateRangePicker } from "./RecurringSchedule/DateRangePicker";
import { SBUSelector } from "./SBUSelector";
import { assignSurveySchema, type AssignSurveyFormData } from "./types";

interface AssignSurveyDialogProps {
  surveyId: string;
  onAssigned?: () => void;
}

export function AssignSurveyDialog({ surveyId, onAssigned }: AssignSurveyDialogProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<AssignSurveyFormData>({
    resolver: zodResolver(assignSurveySchema),
    defaultValues: {
      isRecurring: false,
      recurringFrequency: "one_time",
      isOrganizationWide: false,
      selectedSBUs: [],
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, first_name, last_name")
        .order("first_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: sbus } = useQuery({
    queryKey: ["sbus"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sbus")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const onSubmit = async (data: AssignSurveyFormData) => {
    try {
      if (!session?.user?.id) {
        throw new Error("No authenticated user found");
      }

      if (!surveyId) {
        throw new Error("No survey ID provided");
      }

      // Create the survey assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from("survey_assignments")
        .insert({
          survey_id: surveyId,
          user_id: data.targetId,
          due_date: data.dueDate?.toISOString(),
          created_by: session.user.id,
          is_recurring: data.isRecurring,
          recurring_frequency: data.isRecurring ? data.recurringFrequency : null,
          recurring_ends_at: data.isRecurring ? data.recurringEndsAt?.toISOString() : null,
          recurring_days: data.isRecurring ? data.recurringDays : null,
          is_organization_wide: data.isOrganizationWide,
        })
        .select()
        .single();

      if (assignmentError) throw assignmentError;

      // If SBUs are selected, create SBU assignments
      if (data.selectedSBUs.length > 0) {
        const sbuAssignments = data.selectedSBUs.map(sbuId => ({
          assignment_id: assignment.id,
          sbu_id: sbuId,
        }));

        const { error: sbuError } = await supabase
          .from("survey_sbu_assignments")
          .insert(sbuAssignments);

        if (sbuError) throw sbuError;
      }

      toast.success("Survey assigned successfully");
      setOpen(false);
      onAssigned?.();
    } catch (error: any) {
      console.error("Error assigning survey:", error);
      toast.error("Failed to assign survey");
    }
  };

  const isOrganizationWide = form.watch("isOrganizationWide");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Assign Survey
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Survey</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="isOrganizationWide"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Organization-wide</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {!isOrganizationWide && (
              <>
                <FormField
                  control={form.control}
                  name="targetId"
                  render={({ field }) => (
                    <FormItem>
                      <UserSelector
                        users={users || []}
                        selectedUserId={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selectedSBUs"
                  render={({ field }) => (
                    <FormItem>
                      <SBUSelector
                        sbus={sbus || []}
                        selectedSBUs={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <DateRangePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    label="Due Date"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem>
                  <RecurringSchedule
                    isRecurring={field.value}
                    frequency={form.watch("recurringFrequency") || "one_time"}
                    endsAt={form.watch("recurringEndsAt")}
                    onIsRecurringChange={field.onChange}
                    onFrequencyChange={(value) => form.setValue("recurringFrequency", value as any)}
                    onEndsAtChange={(date) => form.setValue("recurringEndsAt", date)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Assign Survey
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}