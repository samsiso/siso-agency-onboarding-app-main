import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface TodayTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: string;
  due_date?: string;
  completed_at?: string;
}

export class TodayTasksService {
  
  /**
   * Fetch tasks for today from Supabase
   */
  static async getTodaysTasks(date: Date = new Date()): Promise<TodayTask[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('No authenticated user found');
        return [];
      }

      const todayStr = format(date, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .or(`due_date.eq.${todayStr},created_at.gte.${todayStr}T00:00:00,created_at.lt.${todayStr}T23:59:59`)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching today\'s tasks:', error);
        return [];
      }

      return (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.status === 'done' || task.completed_at !== null,
        category: task.category,
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        due_date: task.due_date,
        completed_at: task.completed_at
      }));

    } catch (error) {
      console.error('Failed to fetch today\'s tasks:', error);
      return [];
    }
  }

  /**
   * Update task completion status
   */
  static async updateTaskCompletion(taskId: string, completed: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: completed ? 'done' : 'pending',
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error updating task completion:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to update task completion:', error);
      return false;
    }
  }

  /**
   * Create a new task for today
   */
  static async createTodayTask(title: string, category: 'main' | 'weekly' | 'daily' | 'siso_app_dev' | 'onboarding_app' | 'instagram' = 'main', priority: 'low' | 'medium' | 'high' = 'medium'): Promise<TodayTask | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('No authenticated user found');
        return null;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          category,
          priority,
          status: 'pending',
          due_date: format(new Date(), 'yyyy-MM-dd'),
          assigned_to: user.id,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        completed: false,
        category: data.category,
        priority: data.priority,
        status: data.status,
        due_date: data.due_date
      };

    } catch (error) {
      console.error('Failed to create task:', error);
      return null;
    }
  }

  /**
   * Get tasks by category for today
   */
  static async getTasksByCategory(category: string, date: Date = new Date()): Promise<TodayTask[]> {
    const allTasks = await this.getTodaysTasks(date);
    return allTasks.filter(task => task.category === category);
  }
} 