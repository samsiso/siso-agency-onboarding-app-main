
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskCategory, TaskStats } from '@/types/task.types';

export async function fetchTasks(category?: TaskCategory, userId?: string): Promise<Task[]> {
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
}

export async function fetchTaskStats(userId?: string): Promise<TaskStats> {
  console.log('Fetching task statistics for userId:', userId);
  
  // Mock data with different stats for different users
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

  return {
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
}
