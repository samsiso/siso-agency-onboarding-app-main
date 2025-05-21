// UI Prompt System Types

/**
 * Enum for UI prompt steps
 * Corresponds to the 10-step UI improvement prompt cycle
 */
export enum UIPromptStep {
  AnalyzeCodebase1 = 'analyze_codebase_1',
  AnalyzeCodebase2 = 'analyze_codebase_2',
  ExtractPDRData = 'extract_pdr_data',
  PlanInnovation1 = 'plan_innovation_1',
  PlanInnovation2 = 'plan_innovation_2',
  ExecutePlan1 = 'execute_plan_1',
  ExecutePlan2 = 'execute_plan_2',
  ExecutePlan3 = 'execute_plan_3',
  ReviewUpdate1 = 'review_update_1',
  ReviewUpdate2 = 'review_update_2'
}

/**
 * Enum for prompt status
 */
export enum PromptStatus {
  Draft = 'draft',
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
  Archived = 'archived'
}

/**
 * Interface for page data
 */
export interface Page {
  id: string;
  project_id: string;
  name: string;
  route: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  priority: number;
  category?: string;
  pdr_source?: string;
}

/**
 * Interface for prompt template
 */
export interface PromptTemplate {
  id: string;
  title: string;
  description?: string;
  step: UIPromptStep;
  template_content: string;
  estimated_time?: string;
  order_position: number;
  created_at: string;
  updated_at: string;
  category?: string;
}

/**
 * Interface for UI prompt
 */
export interface UIPrompt {
  id: string;
  page_id: string;
  template_id?: string;
  step: UIPromptStep;
  content: string;
  status: PromptStatus;
  response?: string;
  iteration: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  assigned_to?: string;
  issues?: Array<Record<string, any>>;
  suggestions?: Array<Record<string, any>>;
}

/**
 * Interface for inserting a new page
 */
export type PageInsert = Omit<Page, 'id' | 'created_at' | 'updated_at'>;

/**
 * Interface for inserting a new prompt template
 */
export type PromptTemplateInsert = Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at'>;

/**
 * Interface for inserting a new UI prompt
 */
export type UIPromptInsert = Omit<UIPrompt, 'id' | 'created_at' | 'updated_at'>;

/**
 * Interface for updating a page
 */
export type PageUpdate = Partial<Omit<Page, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Interface for updating a prompt template
 */
export type PromptTemplateUpdate = Partial<Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Interface for updating a UI prompt
 */
export type UIPromptUpdate = Partial<Omit<UIPrompt, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Issue type for tracking UI/UX issues
 */
export interface UIIssue {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  impact: string;
  screenshot_url?: string;
}

/**
 * Suggestion type for improvement suggestions
 */
export interface UISuggestion {
  id: string;
  title: string;
  description: string;
  complexity: 'simple' | 'moderate' | 'complex';
  impact: 'low' | 'medium' | 'high';
  mockup_url?: string;
}

/**
 * Page with UI prompts grouped by step
 */
export interface PageWithPrompts extends Page {
  prompts: Record<UIPromptStep, UIPrompt[]>;
  currentStep?: UIPromptStep;
  nextStep?: UIPromptStep;
  progress: number; // 0-100
}

/**
 * Step labels for UI display
 */
export const UI_PROMPT_STEP_LABELS: Record<UIPromptStep, string> = {
  [UIPromptStep.AnalyzeCodebase1]: 'Analyze Codebase (Step 1)',
  [UIPromptStep.AnalyzeCodebase2]: 'Analyze Codebase (Step 2)',
  [UIPromptStep.ExtractPDRData]: 'Extract PDR Data',
  [UIPromptStep.PlanInnovation1]: 'Plan Innovation (Step 1)',
  [UIPromptStep.PlanInnovation2]: 'Plan Innovation (Step 2)',
  [UIPromptStep.ExecutePlan1]: 'Execute Plan (Step 1)',
  [UIPromptStep.ExecutePlan2]: 'Execute Plan (Step 2)',
  [UIPromptStep.ExecutePlan3]: 'Execute Plan (Step 3)',
  [UIPromptStep.ReviewUpdate1]: 'Review & Update (Step 1)',
  [UIPromptStep.ReviewUpdate2]: 'Review & Update (Step 2)'
};

/**
 * Step descriptions for UI display
 */
export const UI_PROMPT_STEP_DESCRIPTIONS: Record<UIPromptStep, string> = {
  [UIPromptStep.AnalyzeCodebase1]: 'Initial analysis of page UI codebase',
  [UIPromptStep.AnalyzeCodebase2]: 'Detailed listing of UI issues',
  [UIPromptStep.ExtractPDRData]: 'Extract UI requirements from PDR',
  [UIPromptStep.PlanInnovation1]: 'Create detailed UI improvement plan',
  [UIPromptStep.PlanInnovation2]: 'Propose creative UI enhancements',
  [UIPromptStep.ExecutePlan1]: 'Implement first phase of UI improvements',
  [UIPromptStep.ExecutePlan2]: 'Implement second phase of UI improvements',
  [UIPromptStep.ExecutePlan3]: 'Implement third phase of UI improvements',
  [UIPromptStep.ReviewUpdate1]: 'Review updated UI for alignment with PDR',
  [UIPromptStep.ReviewUpdate2]: 'Update PDR and changelog with UI changes'
};

/**
 * Step order for determining progression
 */
export const UI_PROMPT_STEP_ORDER = [
  UIPromptStep.AnalyzeCodebase1,
  UIPromptStep.AnalyzeCodebase2,
  UIPromptStep.ExtractPDRData,
  UIPromptStep.PlanInnovation1,
  UIPromptStep.PlanInnovation2,
  UIPromptStep.ExecutePlan1,
  UIPromptStep.ExecutePlan2,
  UIPromptStep.ExecutePlan3,
  UIPromptStep.ReviewUpdate1,
  UIPromptStep.ReviewUpdate2
];

/**
 * Step time estimates for UI display
 */
export const UI_PROMPT_STEP_TIMES: Record<UIPromptStep, string> = {
  [UIPromptStep.AnalyzeCodebase1]: '30-45 minutes',
  [UIPromptStep.AnalyzeCodebase2]: '30-45 minutes',
  [UIPromptStep.ExtractPDRData]: '30-45 minutes',
  [UIPromptStep.PlanInnovation1]: '45-60 minutes',
  [UIPromptStep.PlanInnovation2]: '45-60 minutes',
  [UIPromptStep.ExecutePlan1]: '2-3 hours',
  [UIPromptStep.ExecutePlan2]: '2-3 hours',
  [UIPromptStep.ExecutePlan3]: '2-3 hours',
  [UIPromptStep.ReviewUpdate1]: '45-60 minutes',
  [UIPromptStep.ReviewUpdate2]: '30-45 minutes'
}; 