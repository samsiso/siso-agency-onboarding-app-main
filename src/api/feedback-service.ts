import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface FeedbackEntry {
  id: string;
  source: string;
  date: string;
  type: 'feature' | 'bug' | 'ui' | 'performance' | 'other';
  status: 'new' | 'in-progress' | 'implemented' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  response?: string;
  project_id?: string;
  user_id?: string;
}

export async function getFeedbackForProject(projectId: string): Promise<FeedbackEntry[]> {
  try {
    const { data, error } = await supabase
      .from('project_feedback')
      .select('*')
      .eq('project_id', projectId)
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getFeedbackForProject:', error);
    return [];
  }
}

export async function addFeedback(feedback: Omit<FeedbackEntry, 'id'>): Promise<FeedbackEntry | null> {
  try {
    const newFeedback = {
      ...feedback,
      id: uuidv4(),
      date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('project_feedback')
      .insert([newFeedback])
      .select()
      .single();
      
    if (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addFeedback:', error);
    return null;
  }
}

export async function updateFeedback(id: string, updates: Partial<FeedbackEntry>): Promise<FeedbackEntry | null> {
  try {
    const { data, error } = await supabase
      .from('project_feedback')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateFeedback:', error);
    return null;
  }
}

export async function deleteFeedback(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('project_feedback')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFeedback:', error);
    return false;
  }
} 