import { useQuery } from '@tanstack/react-query';
import { Task, TaskCategory, TaskStats, TaskPriority } from '@/types/task.types';
import { fetchTasks, fetchTaskStats } from '@/api/taskApi';
import { useTaskOperations } from './useTaskOperations';
import { supabase } from '@/integrations/supabase/client';

export function useTasks() {
  const useTaskQuery = (category?: TaskCategory, userId?: string) => {
    console.log('Fetching tasks with category:', category, 'userId:', userId);
    return useQuery({
      queryKey: ['tasks', category, userId],
      queryFn: async () => {
        const query = supabase
          .from('tasks')
          .select('*')
          .eq('category', category);

        if (userId) {
          query.eq('assigned_to', userId);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching tasks:', error);
          throw error;
        }

        // Sort tasks by priority
        return (data || []).sort((a, b) => {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
        });
      },
      meta: {
        onError: (error: Error) => {
          console.error('Error in task query:', error);
        }
      }
    });
  };

  const useTaskStatsQuery = (userId?: string) => {
    return useQuery({
      queryKey: ['taskStats', userId],
      queryFn: () => fetchTaskStats(userId)
    });
  };

  // Import and re-export mutation functions from useTaskOperations
  const { useCreateTask, useUpdateTask } = useTaskOperations();

  return {
    useTaskQuery,
    useTaskStatsQuery,
    useCreateTask,
    useUpdateTask
  };
}

// Export types for backward compatibility
export type { Task, TaskCategory, TaskStats, TaskPriority };
