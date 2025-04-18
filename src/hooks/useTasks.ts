
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type TaskCategory = 'main' | 'weekly' | 'daily' | 'siso_app_dev' | 'onboarding_app' | 'instagram';
export type TaskPriority = 'low' | 'medium' | 'high';
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

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch tasks with category filtering
  const fetchTasks = async (category?: TaskCategory) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = supabase
      .from('tasks')
      .select('*')
      .or(`assigned_to.eq.${user?.id},created_by.eq.${user?.id}`)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data as Task[];
  };

  const useTaskQuery = (category?: TaskCategory) => {
    return useQuery({
      queryKey: ['tasks', category],
      queryFn: () => fetchTasks(category)
    });
  };

  const useCreateTask = () => {
    return useMutation({
      mutationFn: async (newTask: Omit<Task, 'id' | 'created_at'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from('tasks')
          .insert({ 
            ...newTask, 
            created_by: user?.id
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    });
  };

  const useUpdateTask = () => {
    return useMutation({
      mutationFn: async (updatedTask: Partial<Task> & { id: string }) => {
        const { data, error } = await supabase
          .from('tasks')
          .update(updatedTask)
          .eq('id', updatedTask.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    });
  };

  return {
    useTaskQuery,
    useCreateTask,
    useUpdateTask
  };
};
