
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateOKRCycleInput } from '@/types/okr';
import { calculateCycleDates, generateCycleName, CycleType } from '@/utils/cycleUtils';
import { format } from 'date-fns';

const formSchema = z.object({
  cycleType: z.enum(['monthly', 'quarterly', 'yearly']),
  startDate: z.date({ required_error: 'Start date is required' }),
  name: z.string().min(3, { message: 'Cycle name must be at least 3 characters' }),
  description: z.string().optional(),
  customEnd: z.boolean().optional(),
  endDate: z.date({ required_error: 'End date is required' })
}).refine(data => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate']
});

type FormData = z.infer<typeof formSchema>;

interface QuickCreateCycleFormProps {
  onSubmit: (data: CreateOKRCycleInput) => void;
  isSubmitting: boolean;
}

export const QuickCreateCycleForm: React.FC<QuickCreateCycleFormProps> = ({ 
  onSubmit, 
  isSubmitting 
}) => {
  const [customDateMode, setCustomDateMode] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cycleType: 'quarterly',
      startDate: new Date(),
      name: '',
      description: '',
      customEnd: false,
      endDate: new Date()
    }
  });
  
  const cycleType = form.watch('cycleType');
  const startDate = form.watch('startDate');
  
  // Update end date and name when cycle type or start date changes
  useEffect(() => {
    if (customDateMode) return;
    
    const { startDate: calculatedStart, endDate: calculatedEnd } = calculateCycleDates(
      cycleType as CycleType, 
      new Date(startDate)
    );
    
    form.setValue('endDate', calculatedEnd);
    
    // Generate a default name based on cycle type and date
    if (!form.getValues('name')) {
      const cycleName = generateCycleName(cycleType as CycleType, calculatedStart);
      form.setValue('name', cycleName);
    }
  }, [cycleType, startDate, customDateMode, form]);
  
  const handleSubmit = (data: FormData) => {
    const { name, description, startDate, endDate } = data;
    onSubmit({ 
      name, 
      description, 
      startDate, 
      endDate
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cycle Type */}
          <FormField
            control={form.control}
            name="cycleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cycle Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cycle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {cycleType === 'yearly' && "Annual strategic objectives (12 months)"}
                  {cycleType === 'quarterly' && "Quarterly tactical goals (3 months)"}
                  {cycleType === 'monthly' && "Monthly execution focus (1 month)"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Start date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} 
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Cycle Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cycle Name</FormLabel>
              <FormControl>
                <Input placeholder="Q1 2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of this OKR cycle" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* End Date - Only show in custom mode or as read-only */}
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>End Date</FormLabel>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCustomDateMode(!customDateMode)}
                  className="h-7 text-xs"
                >
                  {customDateMode ? 'Auto Calculate' : 'Custom End Date'}
                </Button>
              </div>
              <FormControl>
                <Input 
                  type="date" 
                  value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} 
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  readOnly={!customDateMode}
                  className={!customDateMode ? "bg-muted cursor-not-allowed" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create OKR Cycle'}
        </Button>
      </form>
    </Form>
  );
};
