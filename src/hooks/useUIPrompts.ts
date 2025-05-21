import { useState, useEffect } from 'react';
import { 
  Page, 
  PageWithPrompts, 
  UIPrompt, 
  UIPromptStep, 
  PromptStatus 
} from '@/types/ui-prompts';
import {
  initializePageWorkflow,
  advancePageStep,
  getPageWithPrompts,
  updateUIPrompt,
  generateUIPrompt,
  addIssueToPrompt,
  addSuggestionToPrompt
} from '@/api/ui-prompts';

interface UseUIPromptsParams {
  projectId: string;
  pageName?: string;
  pageRoute?: string;
  pageId?: string;
  autoInit?: boolean;
}

interface UIPromptsState {
  isLoading: boolean;
  error: string | null;
  page: Page | null;
  pageWithPrompts: PageWithPrompts | null;
  currentStep?: UIPromptStep;
  nextStep?: UIPromptStep;
  progress: number;
}

export function useUIPrompts({
  projectId,
  pageName,
  pageRoute,
  pageId,
  autoInit = false
}: UseUIPromptsParams) {
  const [state, setState] = useState<UIPromptsState>({
    isLoading: true,
    error: null,
    page: null,
    pageWithPrompts: null,
    progress: 0
  });

  // Load page data
  const fetchPageData = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // If we have a pageId, use it directly
      if (pageId) {
        const pageData = await getPageWithPrompts(pageId);
        
        if (!pageData && autoInit && pageName && pageRoute) {
          // Initialize a new page workflow if requested
          const newPage = await initializePageWorkflow(
            projectId,
            pageName,
            pageRoute
          );
          
          if (newPage) {
            // Fetch the newly created page with prompts
            const newPageWithPrompts = await getPageWithPrompts(newPage.id);
            
            setState({
              isLoading: false,
              error: null,
              page: newPage,
              pageWithPrompts: newPageWithPrompts || null,
              currentStep: newPageWithPrompts?.currentStep,
              nextStep: newPageWithPrompts?.nextStep,
              progress: newPageWithPrompts?.progress || 0
            });
            return;
          } else {
            throw new Error('Failed to initialize page workflow');
          }
        } else if (!pageData) {
          setState({
            isLoading: false,
            error: 'Page not found',
            page: null,
            pageWithPrompts: null,
            progress: 0
          });
          return;
        }
        
        setState({
          isLoading: false,
          error: null,
          page: pageData,
          pageWithPrompts: pageData,
          currentStep: pageData.currentStep,
          nextStep: pageData.nextStep,
          progress: pageData.progress
        });
        return;
      }
      
      // If we don't have a pageId but have pageName and pageRoute, we can try to initialize a new page
      if (!pageId && pageName && pageRoute && autoInit) {
        const newPage = await initializePageWorkflow(
          projectId,
          pageName,
          pageRoute
        );
        
        if (newPage) {
          // Fetch the newly created page with prompts
          const newPageWithPrompts = await getPageWithPrompts(newPage.id);
          
          setState({
            isLoading: false,
            error: null,
            page: newPage,
            pageWithPrompts: newPageWithPrompts || null,
            currentStep: newPageWithPrompts?.currentStep,
            nextStep: newPageWithPrompts?.nextStep,
            progress: newPageWithPrompts?.progress || 0
          });
          return;
        }
      }
      
      // If we get here, we don't have enough information to load or create a page
      setState({
        isLoading: false,
        error: 'Insufficient information to load or create page',
        page: null,
        pageWithPrompts: null,
        progress: 0
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  // Initialize the page workflow
  const initializePage = async (
    name: string,
    route: string,
    description?: string
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const newPage = await initializePageWorkflow(
        projectId,
        name,
        route,
        description
      );
      
      if (!newPage) {
        throw new Error('Failed to initialize page workflow');
      }
      
      // Refresh the data
      const newPageWithPrompts = await getPageWithPrompts(newPage.id);
      
      setState({
        isLoading: false,
        error: null,
        page: newPage,
        pageWithPrompts: newPageWithPrompts || null,
        currentStep: newPageWithPrompts?.currentStep,
        nextStep: newPageWithPrompts?.nextStep,
        progress: newPageWithPrompts?.progress || 0
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  };

  // Advance to the next step
  const advanceToNextStep = async (customNotes?: string) => {
    if (!state.page) {
      setState(prev => ({
        ...prev,
        error: 'No page loaded'
      }));
      return false;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const nextStep = await advancePageStep(
        state.page.id,
        customNotes
      );
      
      if (!nextStep) {
        // This could mean we've completed all steps
        // Refresh to get the updated status
        await fetchPageData();
        return true;
      }
      
      // Refresh the data
      await fetchPageData();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
      return false;
    }
  };

  // Create a new prompt for a specific step
  const createPrompt = async (
    step: UIPromptStep,
    customNotes?: string
  ) => {
    if (!state.page) {
      setState(prev => ({
        ...prev,
        error: 'No page loaded'
      }));
      return null;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const promptId = await generateUIPrompt(
        state.page.id,
        step,
        customNotes
      );
      
      if (!promptId) {
        throw new Error('Failed to create prompt');
      }
      
      // Refresh the data
      await fetchPageData();
      return promptId;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
      return null;
    }
  };

  // Update a prompt's status
  const updatePromptStatus = async (
    promptId: string,
    status: PromptStatus
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedPrompt = await updateUIPrompt(
        promptId,
        { status }
      );
      
      if (!updatedPrompt) {
        throw new Error('Failed to update prompt status');
      }
      
      // Refresh the data
      await fetchPageData();
      return updatedPrompt;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
      return null;
    }
  };

  // Update a prompt's response
  const updatePromptResponse = async (
    promptId: string,
    response: string
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedPrompt = await updateUIPrompt(
        promptId,
        { response }
      );
      
      if (!updatedPrompt) {
        throw new Error('Failed to update prompt response');
      }
      
      // Refresh the data
      await fetchPageData();
      return updatedPrompt;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
      return null;
    }
  };

  // Add an issue to a prompt
  const addIssue = async (
    promptId: string,
    issue: Record<string, any>
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await addIssueToPrompt(promptId, issue);
      
      if (!success) {
        throw new Error('Failed to add issue');
      }
      
      // Refresh the data
      await fetchPageData();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
      return false;
    }
  };

  // Add a suggestion to a prompt
  const addSuggestion = async (
    promptId: string,
    suggestion: Record<string, any>
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await addSuggestionToPrompt(promptId, suggestion);
      
      if (!success) {
        throw new Error('Failed to add suggestion');
      }
      
      // Refresh the data
      await fetchPageData();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
      return false;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPageData();
  }, [projectId, pageId]);

  return {
    ...state,
    refresh: fetchPageData,
    initializePage,
    advanceToNextStep,
    createPrompt,
    updatePromptStatus,
    updatePromptResponse,
    addIssue,
    addSuggestion,
    isInitialized: !!state.page
  };
} 