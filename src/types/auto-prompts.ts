// Define status options for prompts
export type PromptStatus = 'draft' | 'in_progress' | 'completed' | 'archived';

// Define priority options for prompts
export type PromptPriority = 'low' | 'medium' | 'high' | 'critical';

// Define prompt type options
export enum PromptType {
  Analyze = 'analyze',
  Plan = 'plan',
  Code = 'code',
  Review = 'review',
  Improve = 'improve'
}

// Define the base auto prompt interface
export interface AutoPrompt {
  id: string;
  created_at: string;
  updated_at: string;
  client: string;
  project: string;
  domain: string;
  module: string;
  feature: string;
  component?: string;
  prompt: string;
  status: PromptStatus;
  priority: PromptPriority;
  notes?: string;
  metadata?: Record<string, any>;
  assigned_to?: string;
  tags?: string[];
  step?: number;
  stage?: string;
  stretch_id?: string; // Reference to the stretch this prompt belongs to
  iteration?: number; // Track iterations within a stretch
  page_name?: string; // Name of the page this prompt belongs to
  page_route?: string; // Route for the page
  prompt_type?: PromptType; // Type of prompt action
  response: string;
  cycle_number: number;
  cycle_step: CycleStep;
  cycle_status: CycleStatus;
}

// Define insert type (without generated fields)
export type AutoPromptInsert = Omit<AutoPrompt, 'id' | 'created_at' | 'updated_at'>;

// Define update type (all fields optional except id)
export type AutoPromptUpdate = Partial<Omit<AutoPrompt, 'id' | 'created_at' | 'updated_at'>>;

// Define the prompt stretch interface (for organizing prompts by page/sequence)
export interface PromptStretch {
  id: string;
  created_at: string;
  updated_at: string;
  project: string;
  page_number: number; // 1-25 for the pages
  title: string;
  description?: string;
  sequence: number; // Order within the page
  status: 'not_started' | 'in_progress' | 'completed';
  prompts_count?: number; // Number of prompts in this stretch
}

// Define insert type for stretch
export type PromptStretchInsert = Omit<PromptStretch, 'id' | 'created_at' | 'updated_at' | 'prompts_count'>;

// Define update type for stretch
export type PromptStretchUpdate = Partial<Omit<PromptStretch, 'id' | 'created_at' | 'updated_at' | 'prompts_count'>>;

export enum CycleStep {
  Review = 'review',
  Analysis = 'analysis',
  Innovation = 'innovation',
  Planning = 'planning',
  Execution1 = 'execution_1',
  Execution2 = 'execution_2',
  Execution3 = 'execution_3',
  FinalReview = 'final_review'
}

export enum CycleStatus {
  InProgress = 'in_progress',
  Completed = 'completed'
}

export interface CycleData {
  cycleNumber: number;
  status: CycleStatus;
  steps: Partial<Record<CycleStep, AutoPrompt[]>>;
}

export interface PageCycles {
  [pageRoute: string]: CycleData[];
}

export interface PageData {
  name: string;
  route: string;
  description: string;
  icon: string;
  domains: {
    frontend: CycleData[];
    backend: CycleData[];
    research: CycleData[];
  };
}

export const CYCLE_STEP_ORDER = [
  CycleStep.Review,
  CycleStep.Analysis,
  CycleStep.Innovation,
  CycleStep.Planning,
  CycleStep.Execution1,
  CycleStep.Execution2,
  CycleStep.Execution3,
  CycleStep.FinalReview
] as const;

export const CYCLE_STEP_LABELS: Record<CycleStep, string> = {
  [CycleStep.Review]: 'Initial Review',
  [CycleStep.Analysis]: 'Analysis',
  [CycleStep.Innovation]: 'Innovation',
  [CycleStep.Planning]: 'Planning',
  [CycleStep.Execution1]: 'Execution Phase 1',
  [CycleStep.Execution2]: 'Execution Phase 2',
  [CycleStep.Execution3]: 'Execution Phase 3',
  [CycleStep.FinalReview]: 'Final Review'
};

import { Database } from '@/integrations/supabase/types';

export type ProjectPrompt = {
  id: number;
  project: string;
  page: string;
  domain: string;
  prompt_cycle_number: number;
  prompt: string;
  times_used: number;
  is_done: boolean;
  last_used: string;
};

export type ProjectPromptInsert = Omit<ProjectPrompt, 'id' | 'times_used' | 'last_used'>;
export type ProjectPromptUpdate = Partial<ProjectPromptInsert>;

// Type for the response from getByProject
export type ProjectPromptResponse = {
  data: ProjectPrompt[] | null;
  error: Error | null;
  count: number;
}; 