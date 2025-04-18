
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define Task type based on the database schema
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
    return data;
  };

  // Query hook for tasks
  const useTaskQuery = (category?: Task['category']) => {
    return useQuery<Task[]>({
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

  return {
    useTaskQuery,
    useCreateTask,
    useUpdateTask
  };
};
