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
    completedSteps: []
  });

  const fetchCycleData = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Get the current status of the page cycle
      const status = await getPageCycleStatus(projectName, pageName, pageRoute, domain);
      
      if (!status && autoInit) {
        // Initialize a new cycle if there isn't one and autoInit is true
        const success = await initializePageCycle(
          projectName,
          pageName,
          pageRoute,
          domain,
          Object.values(FRONTEND_CYCLE_TEMPLATES)
        );
        
        if (!success) {
          throw new Error('Failed to initialize page cycle');
        }
        
        // Fetch the newly created cycle
        const prompts = await getPageCyclePrompts(
          projectName,
          pageName,
          pageRoute,
          domain,
          1
        );
        
        setState({
          isLoading: false,
          error: null,
          cyclePrompts: prompts,
          currentStep: CycleStep.Review,
          cycleNumber: 1,
          cycleStatus: CycleStatus.InProgress,
          completedSteps: []
        });
        
        return;
      } else if (!status) {
        // No cycle exists and autoInit is false
        setState({
          isLoading: false,
          error: null,
          cyclePrompts: [],
          currentStep: CycleStep.Review,
          cycleNumber: 1,
          cycleStatus: CycleStatus.InProgress,
          completedSteps: []
        });
        
        return;
      }
      
      // Fetch the prompts for the current cycle
      const prompts = await getPageCyclePrompts(
        projectName,
        pageName,
        pageRoute,
        domain,
        status.cycleNumber
      );
      
      setState({
        isLoading: false,
        error: null,
        cyclePrompts: prompts,
        currentStep: status.currentStep,
        cycleNumber: status.cycleNumber,
        cycleStatus: status.status,
        completedSteps: status.completedSteps
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  // Initialize the cycle
  const initializeCycle = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await initializePageCycle(
        projectName,
        pageName,
        pageRoute,
        domain,
        Object.values(FRONTEND_CYCLE_TEMPLATES)
      );
      
      if (!success) {
        throw new Error('Failed to initialize page cycle');
      }
      
      // Refresh the data
      fetchCycleData();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  // Advance to the next step
  const advanceToNextStep = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await advancePageCycle(
        projectName,
        pageName,
        pageRoute,
        domain,
        state.currentStep,
        state.cycleNumber,
        Object.values(FRONTEND_CYCLE_TEMPLATES)
      );
      
      if (!success) {
        throw new Error('Failed to advance to next step');
      }
      
      // Refresh the data
      fetchCycleData();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  // Create a new prompt for the current step
  const createNewPrompt = async (notes?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const template = FRONTEND_CYCLE_TEMPLATES[state.currentStep];
      
      if (!template) {
        throw new Error('No template found for current step');
      }
      
      await createCyclePrompt({
        projectName,
        pageName,
        pageRoute,
        domain,
        cycleStep: state.currentStep,
        cycleNumber: state.cycleNumber,
        promptTemplate: template,
        userNotes: notes
      });
      
      // Refresh the data
      fetchCycleData();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  // Load cycle data on mount
  useEffect(() => {
    fetchCycleData();
  }, [projectName, pageName, pageRoute, domain]);

  return {
    ...state,
    refresh: fetchCycleData,
    initializeCycle,
    advanceToNextStep,
    createNewPrompt,
    isInitialized: state.cyclePrompts.length > 0
  };
} 