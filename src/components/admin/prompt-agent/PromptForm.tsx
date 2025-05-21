import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormDescription,
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { autoPromptsService } from '@/utils/auto-prompts-service';
import { AutoPrompt, AutoPromptInsert, AutoPromptUpdate, PromptStatus, PromptPriority, PromptType, CycleStep } from '@/types/auto-prompts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Skeleton } from '@/components/ui/skeleton';

// Define the prompt types
const promptTypes = ['analyze', 'plan', 'code', 'review', 'improve', 'other'] as const;
type PromptType = typeof promptTypes[number];

// Define domain options
const domainOptions = ['Frontend', 'Backend', 'Research'] as const;
type Domain = typeof domainOptions[number];

// Define common routes for UbahCrypt MVP
const commonRoutes = [
  { label: 'Login/Signup', value: '/auth' },
  { label: 'Onboarding/Tutorial', value: '/onboarding' },
  { label: 'Dashboard', value: '/dashboard' },
  { label: 'Markets', value: '/markets' },
  { label: 'News', value: '/news' },
  { label: 'Wallet', value: '/wallet' },
  { label: 'Portfolio', value: '/portfolio' },
  { label: 'Trading', value: '/trade' },
  { label: 'Open Orders', value: '/orders' },
  { label: 'Transaction History', value: '/transactions' },
  { label: 'Fee Estimator', value: '/fee-estimator' },
  { label: 'Staking', value: '/stake' },
  { label: 'Staking Comparison', value: '/stake-compare' },
  { label: 'Security Settings', value: '/security-center' },
  { label: 'KYC Management', value: '/kyc' },
  { label: 'Security Information', value: '/security-info' },
  { label: 'Educational Content', value: '/education' },
  { label: 'Educational Search', value: '/education/search' },
  { label: 'Community Forum', value: '/community' },
  { label: 'Affiliate', value: '/affiliate' },
  { label: 'Referral Leaderboard', value: '/leaderboard' },
  { label: 'Notifications', value: '/notifications' },
  { label: 'API Management', value: '/api-management' },
  { label: 'Settings', value: '/settings' },
  { label: 'Support/Help', value: '/support' },
];

// Form schema with proper typing
const formSchema = z.object({
  client: z.string().min(1, { message: 'Client is required' }),
  project: z.string().min(1, { message: 'Project is required' }),
  domain: z.enum(['Frontend', 'Backend', 'Research'] as const),
  module: z.string().min(1, { message: 'Module is required' }),
  feature: z.string().min(1, { message: 'Feature is required' }),
  component: z.string().optional(),
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters' }),
  status: z.enum(['draft', 'in_progress', 'completed', 'archived'] as const),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const),
  notes: z.string().optional(),
  tags: z.string().optional(),
  step: z.string().optional(),
  stage: z.string().optional(),
  page_name: z.string().optional(),
  page_route: z.string().optional(),
  prompt_type: z.enum(promptTypes).optional(),
  cycle_number: z.number(),
  cycle_step: z.nativeEnum(CycleStep),
});

// Infer the form type from the schema
type FormValues = z.infer<typeof formSchema>;

interface PromptFormProps {
  projectName: string;
  promptId?: string;
  isEditing?: boolean;
  stretchId?: string;
  pageName?: string;
}

export const PromptForm = ({ projectName, promptId, isEditing = false, stretchId, pageName }: PromptFormProps) => {
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Create form with proper default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: '',
      project: projectName,
      domain: 'Frontend' as const,
      module: '',
      feature: '',
      component: '',
      prompt: '',
      status: 'draft' as const,
      priority: 'medium' as const,
      notes: '',
      tags: '',
      step: '',
      stage: '',
      page_name: pageName || '',
      page_route: '',
      prompt_type: 'other' as const,
      cycle_number: 1,
      cycle_step: CycleStep.Review,
    },
  });
  
  useEffect(() => {
    if (isEditing && promptId) {
      const fetchPromptDetails = async () => {
        try {
          setLoading(true);
          const allPrompts = await autoPromptsService.getByProject(projectName);
          const promptData = allPrompts.find(p => p.id === promptId);
          
          if (!promptData) {
            throw new Error('Prompt not found');
          }
          
          form.reset({
            client: promptData.client,
            project: promptData.project,
            domain: promptData.domain as Domain,
            module: promptData.module,
            feature: promptData.feature,
            component: promptData.component || '',
            prompt: promptData.prompt,
            status: promptData.status,
            priority: promptData.priority,
            notes: promptData.notes || '',
            tags: promptData.tags ? promptData.tags.join(', ') : '',
            step: promptData.step ? String(promptData.step) : '',
            stage: promptData.stage || '',
            page_name: promptData.page_name || '',
            page_route: promptData.page_route || '',
            prompt_type: (promptData.prompt_type as PromptType) || 'other',
            cycle_number: promptData.cycle_number || 1,
            cycle_step: promptData.cycle_step || CycleStep.Review,
          });
          
          setError(null);
        } catch (err) {
          console.error(`Error fetching prompt details for ${promptId}:`, err);
          setError('Failed to load prompt details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPromptDetails();
    } else if (!isEditing) {
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get('page');
      const domainParam = urlParams.get('domain');
      
      if (pageParam) {
        form.setValue('page_name', pageParam);
        
        // If page name matches one of our common pages, set the route
        const matchingPage = commonRoutes.find(
          route => route.label.toLowerCase().includes(pageParam.toLowerCase())
        );
        if (matchingPage) {
          form.setValue('page_route', matchingPage.value);
        }
      }
      
      if (domainParam && domainOptions.includes(domainParam as Domain)) {
        form.setValue('domain', domainParam as Domain);
      }
    }
  }, [isEditing, promptId, projectName, form]);
  
  const handleBackToPrompts = () => {
    if (stretchId) {
      navigate(`/admin/prompt-agent/${encodeURIComponent(projectName)}?stretch=${stretchId}`);
    } else {
      navigate(`/admin/prompt-agent/${encodeURIComponent(projectName)}`);
    }
  };
  
  const onSubmit = async (values: FormValues) => {
    try {
      const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined;
      const step = values.step ? parseInt(values.step, 10) : undefined;
      
      const promptData = {
        ...values,
        tags,
        step,
        stretch_id: stretchId
      };
      
      if (isEditing && promptId) {
        await autoPromptsService.update(promptId, promptData as AutoPromptUpdate);
        toast({
          title: 'Prompt updated',
          description: 'The prompt has been successfully updated.',
        });
      } else {
        if (stretchId) {
          try {
            const { promptStretchesService } = await import('@/utils/prompt-stretches-service');
            const stretchPrompts = await promptStretchesService.getPromptsByStretch(stretchId);
            
            const sameFeaturePrompts = stretchPrompts.filter(p => 
              p.feature === values.feature
            );
            
            if (sameFeaturePrompts.length > 0) {
              const maxIteration = Math.max(...sameFeaturePrompts.map(p => p.iteration || 1));
              (promptData as any).iteration = maxIteration + 1;
            } else {
              (promptData as any).iteration = 1;
            }
          } catch (err) {
            console.error('Error determining iteration:', err);
            (promptData as any).iteration = 1;
          }
        }
        
        await autoPromptsService.create(promptData as AutoPromptInsert);
        toast({
          title: 'Prompt created',
          description: 'The prompt has been successfully created.',
        });
      }
      
      if (stretchId) {
        navigate(`/admin/prompt-agent/${encodeURIComponent(projectName)}?stretch=${stretchId}`);
      } else {
        navigate(`/admin/prompt-agent/${encodeURIComponent(projectName)}`);
      }
    } catch (err) {
      console.error('Error saving prompt:', err);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} prompt. Please try again.`,
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading prompt data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-destructive">
        <AlertCircle className="h-8 w-8 mb-4" />
        <p className="mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={handleBackToPrompts}
        >
          Back to Project
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4"
          onClick={handleBackToPrompts}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit Prompt' : 'New Prompt'}
        </h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Prompt Details' : 'Create New Prompt'}</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update the details of this prompt' 
              : stretchId 
                ? 'Add a new prompt to this stretch' 
                : 'Create a new prompt for this project'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <FormControl>
                        <Input placeholder="Client name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <FormControl>
                        <Input placeholder="Project name" {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        Project name is set automatically
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Domain</SelectLabel>
                            <SelectItem value="Frontend">Frontend</SelectItem>
                            <SelectItem value="Backend">Backend</SelectItem>
                            <SelectItem value="Research">Research</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The primary domain this prompt belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="module"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Authentication, Dashboard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="feature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. User Login, Data Visualization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="component"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Component (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. LoginForm, ChartDisplay" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Priority</SelectLabel>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="step"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step Number (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 1, 2, 3" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? undefined : parseInt(value, 10));
                          }}
                          value={field.value === undefined ? '' : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Planning, Implementation, Testing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="page_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Login Page, Dashboard, Settings" {...field} />
                      </FormControl>
                      <FormDescription>
                        The page this prompt belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="page_route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Route</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select route" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Common Routes</SelectLabel>
                            {commonRoutes.map(route => (
                              <SelectItem key={route.value} value={route.value}>
                                {route.label} ({route.value})
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The route for this page in the application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="prompt_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Prompt Type</SelectLabel>
                          <SelectItem value="analyze">Analyze</SelectItem>
                          <SelectItem value="plan">Plan</SelectItem>
                          <SelectItem value="code">Code</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="improve">Improve</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type of action this prompt is requesting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the full prompt text here..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes or context for this prompt..." 
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cycle_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cycle Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cycle_step"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cycle Step</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select step" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(CycleStep).map((step) => (
                            <SelectItem key={step} value={step}>
                              {step.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Prompt' : 'Create Prompt'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}; 