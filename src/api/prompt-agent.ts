import { createClient } from '@supabase/supabase-js';
import { Page, UIPrompt, PromptTemplate } from '@/types/ui-prompts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Pages API
export const getPagesByProject = async (projectId: string): Promise<Page[]> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('project_id', projectId)
    .order('priority', { ascending: true });

  if (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }

  return data;
};

export const createPage = async (page: Omit<Page, 'id'>): Promise<Page> => {
  const { data, error } = await supabase
    .from('pages')
    .insert([page])
    .select()
    .single();

  if (error) {
    console.error('Error creating page:', error);
    throw error;
  }

  return data;
};

export const updatePage = async (id: string, page: Partial<Page>): Promise<Page> => {
  const { data, error } = await supabase
    .from('pages')
    .update(page)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating page:', error);
    throw error;
  }

  return data;
};

// Prompt Templates API
export const getPromptTemplates = async (): Promise<PromptTemplate[]> => {
  const { data, error } = await supabase
    .from('prompt_templates')
    .select('*')
    .order('order_position', { ascending: true });

  if (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }

  return data;
};

export const createPromptTemplate = async (template: Omit<PromptTemplate, 'id'>): Promise<PromptTemplate> => {
  const { data, error } = await supabase
    .from('prompt_templates')
    .insert([template])
    .select()
    .single();

  if (error) {
    console.error('Error creating prompt template:', error);
    throw error;
  }

  return data;
};

// Prompts API
export const getPromptsByPage = async (pageId: string): Promise<UIPrompt[]> => {
  const { data, error } = await supabase
    .from('ui_prompts')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }

  return data;
};

export const createPrompt = async (prompt: Partial<UIPrompt>): Promise<UIPrompt> => {
  const { data, error } = await supabase
    .from('ui_prompts')
    .insert([prompt])
    .select()
    .single();

  if (error) {
    console.error('Error creating prompt:', error);
    throw error;
  }

  return data;
};

export const updatePrompt = async (promptId: string, updates: Partial<UIPrompt>): Promise<UIPrompt> => {
  const { data, error } = await supabase
    .from('ui_prompts')
    .update(updates)
    .eq('id', promptId)
    .select()
    .single();

  if (error) {
    console.error('Error updating prompt:', error);
    throw error;
  }

  return data;
};

export const advancePageStep = async (pageId: string): Promise<void> => {
  const { data: prompts, error: fetchError } = await supabase
    .from('project_prompts')
    .select('*')
    .eq('page_id', pageId)
    .order('cycle_number');

  if (fetchError) {
    console.error('Error fetching prompts:', fetchError);
    throw fetchError;
  }

  const currentPrompt = prompts.find(p => !p.is_done);
  if (currentPrompt) {
    const { error: updateError } = await supabase
      .from('project_prompts')
      .update({ is_done: true, times_used: currentPrompt.times_used + 1 })
      .eq('id', currentPrompt.id);

    if (updateError) {
      console.error('Error updating prompt:', updateError);
      throw updateError;
    }
  }
}; 