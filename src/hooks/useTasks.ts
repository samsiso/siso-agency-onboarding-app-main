
import { useQuery } from '@tanstack/react-query';
import { Task, TaskCategory, TaskStats, TaskPriority } from '@/types/task.types';
import { fetchTasks, fetchTaskStats } from '@/api/taskApi';
import { useTaskOperations } from './useTaskOperations';

/**
 * Hook for task-related operations and queries
 */
export function useTasks() {
  // Re-export task types for backward compatibility
  const useTaskQuery = (category?: TaskCategory, userId?: string) => {
    return useQuery({
      queryKey: ['tasks', category, userId],
      queryFn: () => fetchTasks(category, userId)
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
