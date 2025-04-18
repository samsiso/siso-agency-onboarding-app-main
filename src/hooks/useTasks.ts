
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define task types
export type TaskCategory = 'main' | 'weekly' | 'daily' | 'siso_app_dev' | 'onboarding_app' | 'instagram';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  category: TaskCategory;
  labels?: string[];
  estimated_time?: number;
  assigned_to?: string;
  created_at: string;
  created_by?: string;
  parent_task_id?: string;
  rolled_over_from?: string;
}

export interface TaskStats {
  byStatus: {
    pending: number;
    in_progress: number;
    completed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  byDay: Array<{
    day: string;
    created: number;
    completed: number;
  }>;
  totals: {
    pending: number;
    in_progress: number;
    completed: number;
    total: number;
  };
}

// Type definition for database operations to handle the type mismatch
type DatabaseTask = Omit<Task, 'category'> & {
  category: string;
}

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch tasks with category and user filtering
  const fetchTasks = async (category?: TaskCategory, userId?: string) => {
    console.log('Fetching tasks with category:', category, 'and userId:', userId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user found');
      throw new Error('Not authenticated');
    }
    
    let query = supabase
      .from('tasks')
      .select('*');

    if (category) {
      console.log('Applying category filter:', category);
      query = query.eq('category', category);
    }
    
    if (userId) {
      console.log('Filtering tasks by assigned user:', userId);
      query = query.eq('assigned_to', userId);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    console.log('Tasks fetched successfully:', data);
    return data as Task[];
  };

  // Fetch task statistics for analytics
  const fetchTaskStats = async (userId?: string): Promise<TaskStats> => {
    console.log('Fetching task statistics for userId:', userId);
    
    // In a real implementation, this would query aggregated data from the database
    // For this demo, we'll simulate it with mock data
    
    // Base mock data
    const mockStats: TaskStats = {
      byStatus: {
        pending: 12,
        in_progress: 8,
        completed: 24
      },
      byPriority: {
        low: 15,
        medium: 18,
        high: 8,
        urgent: 3
      },
      byDay: [
        { day: 'Mon', created: 5, completed: 4 },
        { day: 'Tue', created: 7, completed: 6 },
        { day: 'Wed', created: 6, completed: 8 },
        { day: 'Thu', created: 8, completed: 5 },
        { day: 'Fri', created: 4, completed: 9 },
        { day: 'Sat', created: 2, completed: 2 },
        { day: 'Sun', created: 1, completed: 0 },
      ],
      totals: {
        pending: 12,
        in_progress: 8,
        completed: 24,
        total: 44
      }
    };

    // Different stats for different users
    if (userId === 'siso') {
      return {
        byStatus: {
          pending: 5,
          in_progress: 4,
          completed: 15
        },
        byPriority: {
          low: 8,
          medium: 9,
          high: 5,
          urgent: 2
        },
        byDay: [
          { day: 'Mon', created: 3, completed: 2 },
          { day: 'Tue', created: 4, completed: 3 },
          { day: 'Wed', created: 3, completed: 4 },
          { day: 'Thu', created: 5, completed: 3 },
          { day: 'Fri', created: 2, completed: 5 },
          { day: 'Sat', created: 1, completed: 1 },
          { day: 'Sun', created: 0, completed: 0 },
        ],
        totals: {
          pending: 5,
          in_progress: 4,
          completed: 15,
          total: 24
        }
      };
    } else if (userId === 'sam') {
      return {
        byStatus: {
          pending: 7,
          in_progress: 4,
          completed: 9
        },
        byPriority: {
          low: 7,
          medium: 9,
          high: 3,
          urgent: 1
        },
        byDay: [
          { day: 'Mon', created: 2, completed: 2 },
          { day: 'Tue', created: 3, completed: 3 },
          { day: 'Wed', created: 3, completed: 4 },
          { day: 'Thu', created: 3, completed: 2 },
          { day: 'Fri', created: 2, completed: 4 },
          { day: 'Sat', created: 1, completed: 1 },
          { day: 'Sun', created: 1, completed: 0 },
        ],
        totals: {
          pending: 7,
          in_progress: 4,
          completed: 9,
          total: 20
        }
      };
    }
    
    return mockStats;
  };

  const useTaskQuery = (category?: TaskCategory, userId?: string) => {
    return useQuery({
      queryKey: ['tasks', category, userId],
      queryFn: () => fetchTasks(category, userId),
      retry: 1,
      refetchOnWindowFocus: true
    });
  };

  const useTaskStatsQuery = (userId?: string) => {
    return useQuery({
      queryKey: ['taskStats', userId],
      queryFn: () => fetchTaskStats(userId),
      retry: 1,
      refetchOnWindowFocus: true
    });
  };

  const useCreateTask = () => {
    return useMutation({
      mutationFn: async (newTask: Omit<Task, 'id' | 'created_at'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        
        // Using type assertion to resolve the mismatch
        const { data, error } = await supabase
          .from('tasks')
          .insert({ 
            ...newTask, 
            created_by: user?.id
          } as any)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      }
    });
  };

  const useUpdateTask = () => {
    return useMutation({
      mutationFn: async (updatedTask: Partial<Task> & { id: string }) => {
        // Using type assertion to resolve the mismatch
        const { data, error } = await supabase
          .from('tasks')
          .update(updatedTask as any)
          .eq('id', updatedTask.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      }
    });
  };

  return {
    useTaskQuery,
    useTaskStatsQuery,
    useCreateTask,
    useUpdateTask
  };
};
