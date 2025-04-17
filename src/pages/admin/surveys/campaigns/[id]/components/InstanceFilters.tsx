
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { InstanceStatus } from "../hooks/useInstanceManagement";

const formSchema = z.object({
  startDateMin: z.string().optional(),
  startDateMax: z.string().optional(),
  endDateMin: z.string().optional(),
  endDateMax: z.string().optional(),
  status: z.enum(['active', 'upcoming', 'completed', 'inactive'] as const).optional(),
});

interface InstanceFiltersProps {
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

export function InstanceFilters({ onFilterChange, currentFilters }: InstanceFiltersProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDateMin: currentFilters.startDateMin || "",
      startDateMax: currentFilters.startDateMax || "",
      endDateMin: currentFilters.endDateMin || "",
      endDateMax: currentFilters.endDateMax || "",
      status: currentFilters.status ? currentFilters.status[0] : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Process the status to be an array for the API
    const processedFilters = {
      ...values,
      status: values.status ? [values.status] : undefined,
    };
    onFilterChange(processedFilters);
  }

  const resetFilters = () => {
    form.reset({
      startDateMin: "",
      startDateMax: "",
      endDateMin: "",
      endDateMax: "",
      status: undefined,
    });
    onFilterChange({
      startDateMin: undefined,
      startDateMax: undefined,
      endDateMin: undefined,
      endDateMax: undefined,
      status: undefined,
    });
  };

  const hasActiveFilters = () => {
    const values = form.getValues();
    return !!(values.startDateMin || values.startDateMax || values.endDateMin || values.endDateMax || values.status);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Filter Instances</h3>
          
          {hasActiveFilters() && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="flex items-center gap-1 text-muted-foreground"
            >
              <X className="h-3 w-3" /> Clear all
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Start Date Range</h4>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="startDateMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">From</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="From"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDateMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">To</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="To"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">End Date Range</h4>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="endDateMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">From</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="From"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDateMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">To</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="To"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Status</h4>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Apply Filters</Button>
        </div>
      </form>
    </Form>
  );
}
