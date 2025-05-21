import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AutoPrompt, CycleStep, CycleStatus } from '@/types/auto-prompts';

// Define PromptType enum locally to avoid conflicts
export enum PromptType {
  Analyze = 'analyze',
  Plan = 'plan',
  Code = 'code',
  Review = 'review',
  Improve = 'improve'
}

const promptFormSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  domain: z.string(),
  cycle_number: z.number().min(1),
  cycle_step: z.nativeEnum(CycleStep),
  cycle_status: z.nativeEnum(CycleStatus).default(CycleStatus.InProgress),
});

type PromptFormData = z.infer<typeof promptFormSchema>;

interface CyclePromptFormProps {
  onSubmit: (data: Partial<AutoPrompt>) => void;
  onCancel: () => void;
  initialData?: Partial<AutoPrompt>;
}

export const CyclePromptForm: React.FC<CyclePromptFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {}
}) => {
  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      prompt: '',
      domain: initialData.domain || 'frontend',
      cycle_number: initialData.cycle_number || 1,
      cycle_step: initialData.cycle_step || CycleStep.Review,
      cycle_status: initialData.cycle_status || CycleStatus.InProgress,
    },
  });

  const handleSubmit = (data: PromptFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter your prompt here..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Create Prompt
          </Button>
        </div>
      </form>
    </Form>
  );
}; 