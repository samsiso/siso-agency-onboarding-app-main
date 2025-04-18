
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  category: 'main' | 'weekly' | 'daily';
  labels?: string[];
  estimated_time?: number;
  assigned_to?: string;
  created_at: string;
  parent_task_id?: string;
  rolled_over_from?: string;
}

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch tasks with category filtering
  const fetchTasks = async (category?: Task['category']) => {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform data to ensure it conforms to our Task interface
    return (data || []).map(task => ({
      ...task,
      status: (task.status as string || 'pending') as 'pending' | 'in_progress' | 'completed',
      priority: (task.priority as string || 'medium') as 'low' | 'medium' | 'high',
      category: task.category as 'main' | 'weekly' | 'daily'
    })) as Task[];
  };

  // Query hook for tasks
  const useTaskQuery = (category?: Task['category']) => {
    return useQuery({
      queryKey: ['tasks', category],
      queryFn: () => fetchTasks(category)
    });
  };

  // Create task mutation
  const useCreateTask = () => {
    return useMutation({
      mutationFn: async (newTask: Omit<Task, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
          .from('tasks')
          .insert(newTask)
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

  // Update task mutation
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

  // Rollover incomplete tasks
  const useRolloverTasks = () => {
    return useMutation({
      mutationFn: async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data: incompleteTasks, error: fetchError } = await supabase
          .from('tasks')
          .select('*')
          .eq('category', 'daily')
          .neq('status', 'completed')
          .lt('due_date', today);

        if (fetchError) throw fetchError;

        if (!incompleteTasks?.length) return [];

        const rolledOverTasks = incompleteTasks.map(task => ({
          ...task,
          due_date: today,
          rolled_over_from: task.id,
          id: undefined,
          created_at: undefined
        }));

        const { data, error } = await supabase
          .from('tasks')
          .insert(rolledOverTasks)
          .select();

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
    useUpdateTask,
    useRolloverTasks
  };
};
