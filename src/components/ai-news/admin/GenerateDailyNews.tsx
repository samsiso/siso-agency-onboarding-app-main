
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type GenerationStep = {
  id: string;
  label: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

const GenerateDailyNews = () => {
  const [date, setDate] = useState<Date | undefined>(new Date('2024-02-25'));
  const [isGenerating, setIsGenerating] = useState(false);
  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: 'sync', label: 'Sync YouTube Channels', status: 'idle', message: '' },
    { id: 'process', label: 'Process Videos', status: 'idle', message: '' },
    { id: 'generate', label: 'Generate Daily Brief', status: 'idle', message: '' },
  ]);
  const { toast } = useToast();

  // [Analysis] Helper to update a specific step's status
  const updateStepStatus = (stepId: string, status: GenerationStep['status'], message: string = '') => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status, message } : step
      )
    );
  };

  // [Analysis] Function to run all steps in sequence
  const generateNewsForDate = async () => {
    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date to generate news for.",
        variant: "destructive"
      });
      return;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');
    setIsGenerating(true);

    try {
      // Step 1: Sync YouTube channels
      updateStepStatus('sync', 'loading', 'Syncing YouTube channels...');
      const { data: syncData, error: syncError } = await supabase.functions.invoke('sync-youtube-channels', {
        body: { date: formattedDate },
      });

      if (syncError) throw new Error(`Channel sync failed: ${syncError.message}`);
      updateStepStatus('sync', 'success', syncData?.message || 'Channels synced successfully');

      // Step 2: Process videos
      updateStepStatus('process', 'loading', 'Processing videos...');
      // Wait a moment to ensure videos are ready to process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { data: processData, error: processError } = await supabase.functions.invoke('process-youtube-videos', {
        body: { date: formattedDate },
      });

      if (processError) throw new Error(`Video processing failed: ${processError.message}`);
      updateStepStatus('process', 'success', processData?.message || 'Videos processed successfully');

      // Step 3: Generate daily brief
      updateStepStatus('generate', 'loading', 'Generating daily brief...');
      // Wait a moment to ensure all processing is complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const { data: generateData, error: generateError } = await supabase.functions.invoke('generate-daily-news', {
        body: { date: formattedDate },
      });

      if (generateError) throw new Error(`Daily brief generation failed: ${generateError.message}`);
      updateStepStatus('generate', 'success', generateData?.message || 'Daily brief generated successfully');

      toast({
        title: "Success!",
        description: `Daily news generated for ${formattedDate}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating news:', error);
      
      // Find which step was in loading state when the error occurred
      const loadingStepId = steps.find(step => step.status === 'loading')?.id;
      if (loadingStepId) {
        updateStepStatus(loadingStepId, 'error', error.message);
      }
      
      toast({
        title: "Error",
        description: error.message || "Something went wrong during news generation.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 bg-siso-bg-alt p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-siso-text-bold">Generate Daily News</h2>
      
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={isGenerating}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "MMMM d, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button 
          onClick={generateNewsForDate} 
          disabled={isGenerating || !date}
          className="space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Generate News</span>
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-medium">Generation Process</h3>
        
        <ul className="space-y-3">
          {steps.map((step) => (
            <li key={step.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {step.status === 'loading' && (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                )}
                {step.status === 'success' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {step.status === 'error' && (
                  <span className="h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">!</span>
                )}
                {step.status === 'idle' && (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "font-medium",
                  step.status === 'success' && "text-green-600",
                  step.status === 'error' && "text-red-600",
                  step.status === 'loading' && "text-blue-600"
                )}>
                  {step.label}
                </p>
                {step.message && (
                  <p className="text-sm text-gray-500 mt-1">{step.message}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenerateDailyNews;
