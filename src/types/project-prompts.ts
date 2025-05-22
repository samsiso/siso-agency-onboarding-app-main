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
  created_at?: string;
};

export type ProjectPromptInsert = Omit<ProjectPrompt, 'id' | 'times_used' | 'last_used' | 'created_at'>;
export type ProjectPromptUpdate = Partial<ProjectPromptInsert>;

// Type for the response from getByProject
export type ProjectPromptResponse = {
  data: ProjectPrompt[] | null;
  error: Error | null;
  count: number;
}; 