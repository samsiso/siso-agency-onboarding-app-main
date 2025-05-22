import { useState, useEffect } from 'react';
import { CycleStep, CycleStatus, AutoPrompt } from '@/types/auto-prompts';
import { CyclePromptTemplate, FRONTEND_CYCLE_TEMPLATES } from '@/types/cycle-prompts';
import {
  createCyclePrompt,
  initializePageCycle,
  advancePageCycle,
  getPageCyclePrompts,
  getPageCycleStatus
} from '@/api/cycle-prompts';
import { supabase } from '@/integrations/supabase';

interface UseCyclePromptsParams {
  projectName: string;
  pageName: string;
  pageRoute: string;
  domain?: string;
  autoInit?: boolean;
}

interface CyclePromptsState {
  isLoading: boolean;
  error: string | null;
  cyclePrompts: AutoPrompt[];
  currentStep: CycleStep;
  cycleNumber: number;
  cycleStatus: CycleStatus;
  completedSteps: CycleStep[];
  isInitialized: boolean;
}

export function useCyclePrompts({
  projectName,
  pageName,
  pageRoute,
  domain = 'frontend',
  autoInit = false
}: UseCyclePromptsParams) {
  const [state, setState] = useState<CyclePromptsState>({
    isLoading: true,
    error: null,
    cyclePrompts: [],
    currentStep: CycleStep.Review,
    cycleNumber: 1,
    cycleStatus: CycleStatus.InProgress,
    completedSteps: [],
    isInitialized: false
  });

  const fetchCycleData = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('Fetching cycle data for:', { projectName, pageName, pageRoute, domain });
      
      // Get the current prompts for the page
      const { data: existingPrompts, error: promptsError } = await supabase
        .from('project_prompts')
        .select('*')
        .eq('page', pageName)
        .eq('project', projectName)
        .order('prompt_cycle_number');

      if (promptsError) {
        throw promptsError;
      }

      if (existingPrompts.length === 0 && autoInit) {
        console.log('No existing prompts found, initializing new cycle');
        
        // Create initial prompts for the cycle
        const initialPrompts = [
          {
            project: projectName,
            page: pageName,
            prompt_cycle_number: 1,
            prompt_type: 'review',
            description: 'Initial page review',
            is_done: false,
            times_used: 0
          },
          {
            project: projectName,
            page: pageName,
            prompt_cycle_number: 1,
            prompt_type: 'plan',
            description: 'Plan page improvements',
            is_done: false,
            times_used: 0
          },
          {
            project: projectName,
            page: pageName,
            prompt_cycle_number: 1,
            prompt_type: 'implement',
            description: 'Implement planned changes',
            is_done: false,
            times_used: 0
          }
        ];

        // Insert the initial prompts
        const { data: newPrompts, error: insertError } = await supabase
          .from('project_prompts')
          .insert(initialPrompts)
          .select();

        if (insertError) {
          throw insertError;
        }

        setState({
          isLoading: false,
          error: null,
          cyclePrompts: newPrompts,
          currentStep: CycleStep.Review,
          cycleNumber: 1,
          cycleStatus: CycleStatus.InProgress,
          completedSteps: [],
          isInitialized: true
        });
      } else {
        console.log('Found existing prompts:', existingPrompts);
        
        // Calculate current step and status
        const lastPrompt = existingPrompts[existingPrompts.length - 1];
        const cycleNumber = lastPrompt?.prompt_cycle_number || 1;
        const completedPrompts = existingPrompts.filter(p => p.is_done);
        const cycleStatus = completedPrompts.length === existingPrompts.length 
          ? CycleStatus.Completed 
          : CycleStatus.InProgress;

        setState({
          isLoading: false,
          error: null,
          cyclePrompts: existingPrompts,
          currentStep: lastPrompt?.prompt_type || CycleStep.Review,
          cycleNumber,
          cycleStatus,
          completedSteps: completedPrompts.map(p => p.prompt_type),
          isInitialized: true
        });
      }
    } catch (error) {
      console.error('Error in fetchCycleData:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isInitialized: false
      }));
    }
  };

  const initializeCycle = async () => {
    if (state.isInitialized) {
      console.log('Cycle already initialized');
      return;
    }

    await fetchCycleData();
  };

  const advanceToNextStep = async (promptId: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Mark the current prompt as completed
      const { error: updateError } = await supabase
        .from('project_prompts')
        .update({ is_done: true })
        .eq('id', promptId);

      if (updateError) {
        throw updateError;
      }

      // Refresh the cycle data
      await fetchCycleData();
    } catch (error) {
      console.error('Error in advanceToNextStep:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  const createNewPrompt = async (notes: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const newPrompt = {
        project: projectName,
        page: pageName,
        prompt_cycle_number: state.cycleNumber,
        prompt_type: 'custom',
        description: notes,
        is_done: false,
        times_used: 0
      };

      const { data: insertedPrompt, error: insertError } = await supabase
        .from('project_prompts')
        .insert(newPrompt)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh the cycle data
      await fetchCycleData();
    } catch (error) {
      console.error('Error in createNewPrompt:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  // Load initial data
  useEffect(() => {
    fetchCycleData();
  }, [projectName, pageName, pageRoute, domain]);

  return {
    ...state,
    initializeCycle,
    advanceToNextStep,
    createNewPrompt
  };
} 