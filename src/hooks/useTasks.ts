import { useQuery } from '@tanstack/react-query';
import { Task, TaskCategory, TaskStats, TaskPriority, TaskStatus } from '@/types/task.types';
import { fetchTaskStats } from '@/api/taskApi';
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
          
        if (category) {
          query.eq('category', category);
        }

        if (userId) {
          query.eq('assigned_to', userId);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching tasks:', error);
          throw error;
        }

        // Map the data to ensure types are correct
        const mappedData = (data || []).map(item => ({
          ...item,
          // Ensure status is a valid TaskStatus
          status: validateTaskStatus(item.status),
          // Ensure priority is a valid TaskPriority
          priority: validateTaskPriority(item.priority)
        } as Task));

        // Sort tasks by priority
        return mappedData.sort((a, b) => {
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

  // Helper function to validate task status
  const validateTaskStatus = (status: any): TaskStatus => {
    const validStatuses: TaskStatus[] = ['pending', 'in_progress', 'completed'];
    return validStatuses.includes(status) ? status : 'pending';
  };

  // Helper function to validate task priority
  const validateTaskPriority = (priority: any): TaskPriority => {
    const validPriorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
    return validPriorities.includes(priority) ? priority : 'medium';
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
