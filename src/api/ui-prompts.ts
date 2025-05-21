import { supabase } from '@/integrations/supabase/client';
import {
  Page,
  PageInsert,
  PageUpdate,
  PageWithPrompts,
  PromptTemplate,
  UIPrompt,
  UIPromptInsert,
  UIPromptStep,
  UIPromptUpdate,
  UI_PROMPT_STEP_ORDER
} from '@/types/ui-prompts';

/**
 * Create a new page with the first prompt step initialized
 */
export async function initializePageWorkflow(
  projectId: string,
  pageName: string,
  pageRoute: string,
  description?: string
): Promise<Page | null> {
  try {
    const { data, error } = await supabase
      .rpc('initialize_ui_page_workflow', {
        p_project_id: projectId,
        p_page_name: pageName,
        p_page_route: pageRoute,
        p_description: description || null
      })
      .single();

    if (error) {
      console.error('Error initializing page workflow:', error);
      return null;
    }

    // Fetch the newly created page
    return getPageById(data);
  } catch (err) {
    console.error('Error in initializePageWorkflow:', err);
    return null;
  }
}

/**
 * Advance a page to the next step in the workflow
 */
export async function advancePageStep(
  pageId: string,
  customNotes?: string
): Promise<UIPromptStep | null> {
  try {
    const { data, error } = await supabase
      .rpc('advance_ui_page_step', {
        p_page_id: pageId,
        p_custom_notes: customNotes || null
      });

    if (error) {
      console.error('Error advancing page step:', error);
      return null;
    }

    return data as UIPromptStep;
  } catch (err) {
    console.error('Error in advancePageStep:', err);
    return null;
  }
}

/**
 * Generate a new UI prompt for a specific step
 */
export async function generateUIPrompt(
  pageId: string,
  step: UIPromptStep,
  customNotes?: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .rpc('generate_ui_prompt', {
        p_page_id: pageId,
        p_step: step,
        p_custom_notes: customNotes || null
      });

    if (error) {
      console.error('Error generating UI prompt:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in generateUIPrompt:', err);
    return null;
  }
}

/**
 * Get a page by ID
 */
export async function getPageById(pageId: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single();

  if (error) {
    console.error('Error fetching page:', error);
    return null;
  }

  return data;
}

/**
 * Get a UI prompt by ID
 */
export async function getUIPromptById(promptId: string): Promise<UIPrompt | null> {
  const { data, error } = await supabase
    .from('ui_prompts')
    .select('*')
    .eq('id', promptId)
    .single();

  if (error) {
    console.error('Error fetching UI prompt:', error);
    return null;
  }

  return data;
}

/**
 * Get all pages for a project
 */
export async function getPagesByProject(projectId: string): Promise<Page[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('project_id', projectId)
    .order('priority', { ascending: true });

  if (error) {
    console.error('Error fetching pages:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all UI prompts for a page
 */
export async function getPromptsByPage(pageId: string): Promise<UIPrompt[]> {
  const { data, error } = await supabase
    .from('ui_prompts')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all UI prompt templates
 */
export async function getPromptTemplates(): Promise<PromptTemplate[]> {
  const { data, error } = await supabase
    .from('prompt_templates')
    .select('*')
    .order('order_position', { ascending: true });

  if (error) {
    console.error('Error fetching prompt templates:', error);
    return [];
  }

  return data || [];
}

/**
 * Update a UI prompt
 */
export async function updateUIPrompt(
  promptId: string,
  updates: UIPromptUpdate
): Promise<UIPrompt | null> {
  const { data, error } = await supabase
    .from('ui_prompts')
    .update(updates)
    .eq('id', promptId)
    .select()
    .single();

  if (error) {
    console.error('Error updating UI prompt:', error);
    return null;
  }

  return data;
}

/**
 * Update a page
 */
export async function updatePage(
  pageId: string,
  updates: PageUpdate
): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', pageId)
    .select()
    .single();

  if (error) {
    console.error('Error updating page:', error);
    return null;
  }

  return data;
}

/**
 * Get a page with all its prompts, organized by step
 */
export async function getPageWithPrompts(pageId: string): Promise<PageWithPrompts | null> {
  try {
    // Get the page
    const page = await getPageById(pageId);
    if (!page) {
      return null;
    }

    // Get all prompts for the page
    const prompts = await getPromptsByPage(pageId);

    // Group prompts by step
    const promptsByStep: Record<UIPromptStep, UIPrompt[]> = {} as Record<UIPromptStep, UIPrompt[]>;
    
    // Initialize all steps with empty arrays
    UI_PROMPT_STEP_ORDER.forEach(step => {
      promptsByStep[step] = [];
    });

    // Populate the steps with prompts
    prompts.forEach(prompt => {
      if (!promptsByStep[prompt.step]) {
        promptsByStep[prompt.step] = [];
      }
      promptsByStep[prompt.step].push(prompt);
    });

    // Determine current step
    let currentStep: UIPromptStep | undefined;
    let nextStep: UIPromptStep | undefined;
    
    // Find the most recent prompt to determine current step
    if (prompts.length > 0) {
      const sortedPrompts = [...prompts].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      currentStep = sortedPrompts[0].step;
      
      // Find the next step in the sequence
      const currentStepIndex = UI_PROMPT_STEP_ORDER.indexOf(currentStep);
      if (currentStepIndex < UI_PROMPT_STEP_ORDER.length - 1) {
        nextStep = UI_PROMPT_STEP_ORDER[currentStepIndex + 1];
      }
    } else {
      // If no prompts, set to first step
      currentStep = UI_PROMPT_STEP_ORDER[0];
      nextStep = UI_PROMPT_STEP_ORDER[1];
    }

    // Calculate progress
    const completedSteps = UI_PROMPT_STEP_ORDER.filter(step => 
      promptsByStep[step].some(prompt => prompt.status === 'completed')
    );
    
    const progress = Math.round((completedSteps.length / UI_PROMPT_STEP_ORDER.length) * 100);

    return {
      ...page,
      prompts: promptsByStep,
      currentStep,
      nextStep,
      progress
    };
  } catch (err) {
    console.error('Error in getPageWithPrompts:', err);
    return null;
  }
}

/**
 * Get all pages for a project with their progress information
 */
export async function getProjectPagesWithProgress(projectId: string): Promise<Array<Page & { progress: number }>> {
  try {
    const pages = await getPagesByProject(projectId);
    
    // For each page, get its prompts and calculate progress
    const pagesWithProgress = await Promise.all(
      pages.map(async (page) => {
        const prompts = await getPromptsByPage(page.id);
        
        // Count completed steps
        const completedStepSet = new Set<UIPromptStep>();
        prompts.forEach(prompt => {
          if (prompt.status === 'completed') {
            completedStepSet.add(prompt.step);
          }
        });
        
        const progress = Math.round((completedStepSet.size / UI_PROMPT_STEP_ORDER.length) * 100);
        
        return {
          ...page,
          progress
        };
      })
    );
    
    return pagesWithProgress;
  } catch (err) {
    console.error('Error in getProjectPagesWithProgress:', err);
    return [];
  }
}

/**
 * Add an issue to a UI prompt
 */
export async function addIssueToPrompt(
  promptId: string,
  issue: Record<string, any>
): Promise<boolean> {
  try {
    const prompt = await getUIPromptById(promptId);
    if (!prompt) {
      return false;
    }
    
    const issues = prompt.issues || [];
    issues.push({
      ...issue,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    });
    
    const { error } = await supabase
      .from('ui_prompts')
      .update({ issues })
      .eq('id', promptId);
      
    if (error) {
      console.error('Error adding issue to prompt:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in addIssueToPrompt:', err);
    return false;
  }
}

/**
 * Add a suggestion to a UI prompt
 */
export async function addSuggestionToPrompt(
  promptId: string,
  suggestion: Record<string, any>
): Promise<boolean> {
  try {
    const prompt = await getUIPromptById(promptId);
    if (!prompt) {
      return false;
    }
    
    const suggestions = prompt.suggestions || [];
    suggestions.push({
      ...suggestion,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    });
    
    const { error } = await supabase
      .from('ui_prompts')
      .update({ suggestions })
      .eq('id', promptId);
      
    if (error) {
      console.error('Error adding suggestion to prompt:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in addSuggestionToPrompt:', err);
    return false;
  }
} 