import { supabase } from '@/integrations/supabase/client';
import { AutoPrompt, AutoPromptInsert, CycleStep, CycleStatus } from '@/types/auto-prompts';
import { CyclePromptTemplate, PageCycleConfig, generateCyclePrompt } from '@/types/cycle-prompts';

interface CreateCyclePromptParams {
  projectName: string;
  pageName: string;
  pageRoute: string;
  domain: string;
  cycleStep: CycleStep;
  cycleNumber: number;
  promptTemplate: CyclePromptTemplate;
  userNotes?: string;
}

export async function createCyclePrompt({
  projectName,
  pageName,
  pageRoute,
  domain,
  cycleStep,
  cycleNumber,
  promptTemplate,
  userNotes
}: CreateCyclePromptParams): Promise<AutoPrompt | null> {
  // Generate the prompt content from template
  const promptContent = generateCyclePrompt(
    promptTemplate,
    pageName,
    pageRoute,
    projectName
  );

  // Create the prompt insert object
  const promptData: AutoPromptInsert = {
    client: 'UbahCrypt', // This should come from a config or context
    project: projectName,
    domain,
    module: domain === 'frontend' ? 'ui' : 'api',
    feature: pageName,
    prompt: promptContent,
    status: 'draft',
    priority: 'medium',
    notes: userNotes,
    page_name: pageName,
    page_route: pageRoute,
    prompt_type: undefined, // This could be mapped from cycle step
    response: '',
    cycle_number: cycleNumber,
    cycle_step: cycleStep,
    cycle_status: CycleStatus.InProgress,
    metadata: {
      templateKey: promptTemplate.key,
      estimatedTime: promptTemplate.estimatedTime,
      title: promptTemplate.title
    }
  };

  // Insert the prompt into the database
  const { data, error } = await supabase
    .from('auto_prompts')
    .insert(promptData)
    .select()
    .single();

  if (error) {
    console.error('Error creating cycle prompt:', error);
    return null;
  }

  return data;
}

export async function initializePageCycle(
  projectName: string,
  pageName: string,
  pageRoute: string,
  domain: string = 'frontend',
  cycleTemplates: CyclePromptTemplate[]
): Promise<boolean> {
  try {
    // Create the first prompt (Review) to start the cycle
    const reviewTemplate = cycleTemplates.find(t => t.cycleStep === CycleStep.Review);
    
    if (!reviewTemplate) {
      console.error('Review template not found');
      return false;
    }

    await createCyclePrompt({
      projectName,
      pageName,
      pageRoute,
      domain,
      cycleStep: CycleStep.Review,
      cycleNumber: 1,
      promptTemplate: reviewTemplate
    });

    // Create tracking record for this page cycle in a separate table
    const { error } = await supabase
      .from('page_cycles')
      .insert({
        project_name: projectName,
        page_name: pageName,
        page_route: pageRoute,
        domain,
        current_step: CycleStep.Review,
        cycle_number: 1,
        started_at: new Date().toISOString(),
        status: CycleStatus.InProgress,
        completed_steps: []
      });

    if (error) {
      console.error('Error initializing page cycle:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in initializePageCycle:', err);
    return false;
  }
}

export async function advancePageCycle(
  projectName: string,
  pageName: string,
  pageRoute: string,
  domain: string = 'frontend',
  currentStep: CycleStep,
  cycleNumber: number,
  cycleTemplates: CyclePromptTemplate[]
): Promise<boolean> {
  try {
    // Mark current step as completed
    const { error: updateError } = await supabase
      .from('auto_prompts')
      .update({
        cycle_status: CycleStatus.Completed,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .match({
        project: projectName,
        page_name: pageName,
        page_route: pageRoute,
        domain,
        cycle_step: currentStep,
        cycle_number: cycleNumber
      });

    if (updateError) {
      console.error('Error updating current step:', updateError);
      return false;
    }

    // Get the next step in the cycle
    const currentStepIndex = cycleTemplates.findIndex(t => t.cycleStep === currentStep);
    if (currentStepIndex === -1 || currentStepIndex >= cycleTemplates.length - 1) {
      console.log('No next step available or cycle completed');
      
      // Update the page cycle record to mark completion
      if (currentStep === CycleStep.FinalReview) {
        await supabase
          .from('page_cycles')
          .update({
            status: CycleStatus.Completed,
            updated_at: new Date().toISOString()
          })
          .match({
            project_name: projectName,
            page_name: pageName,
            page_route: pageRoute,
            domain,
            cycle_number: cycleNumber
          });
      }
      
      return true;
    }

    // Get the next step template
    const nextStepTemplate = cycleTemplates[currentStepIndex + 1];

    // Create the next step prompt
    await createCyclePrompt({
      projectName,
      pageName,
      pageRoute,
      domain,
      cycleStep: nextStepTemplate.cycleStep,
      cycleNumber,
      promptTemplate: nextStepTemplate
    });

    // Update the page cycle record
    const { data: pageCycle, error: cycleError } = await supabase
      .from('page_cycles')
      .update({
        current_step: nextStepTemplate.cycleStep,
        completed_steps: supabase.sql`array_append(completed_steps, ${currentStep})`,
        updated_at: new Date().toISOString()
      })
      .match({
        project_name: projectName,
        page_name: pageName,
        page_route: pageRoute,
        domain,
        cycle_number: cycleNumber
      })
      .select()
      .single();

    if (cycleError) {
      console.error('Error updating page cycle:', cycleError);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in advancePageCycle:', err);
    return false;
  }
}

export async function getPageCyclePrompts(
  projectName: string,
  pageName: string,
  pageRoute: string,
  domain: string = 'frontend',
  cycleNumber: number = 1
): Promise<AutoPrompt[]> {
  const { data, error } = await supabase
    .from('auto_prompts')
    .select('*')
    .match({
      project: projectName,
      page_name: pageName,
      page_route: pageRoute,
      domain,
      cycle_number: cycleNumber
    })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching cycle prompts:', error);
    return [];
  }

  return data || [];
}

export async function getPageCycleStatus(
  projectName: string,
  pageName: string,
  pageRoute: string,
  domain: string = 'frontend'
): Promise<{
  currentStep: CycleStep;
  cycleNumber: number;
  status: CycleStatus;
  completedSteps: CycleStep[];
} | null> {
  const { data, error } = await supabase
    .from('page_cycles')
    .select('*')
    .match({
      project_name: projectName,
      page_name: pageName,
      page_route: pageRoute,
      domain
    })
    .order('cycle_number', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching page cycle status:', error);
    return null;
  }

  return {
    currentStep: data.current_step,
    cycleNumber: data.cycle_number,
    status: data.status,
    completedSteps: data.completed_steps || []
  };
}

export async function getAllPageCycles(projectName: string): Promise<Record<string, any>[]> {
  const { data, error } = await supabase
    .from('page_cycles')
    .select('*')
    .match({ project_name: projectName })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching all page cycles:', error);
    return [];
  }

  return data || [];
} 