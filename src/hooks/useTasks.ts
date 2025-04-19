
import { useQuery } from '@tanstack/react-query';
import { Task, TaskCategory, TaskStats, TaskPriority } from '@/types/task.types';
import { fetchTasks, fetchTaskStats } from '@/api/taskApi';
import { useTaskOperations } from './useTaskOperations';

export function useTasks() {
  const useTaskQuery = (category?: TaskCategory, userId?: string) => {
    console.log('Fetching tasks with category:', category, 'userId:', userId);
    return useQuery({
      queryKey: ['tasks', category, userId],
      queryFn: () => fetchTasks(category, userId),
      meta: {
        onSuccess: (data: Task[]) => {
          console.log('Tasks fetched successfully:', data);
        },
        onError: (error: Error) => {
          console.error('Error fetching tasks:', error);
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
