
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task.types';

export function useTaskOperations() {
  const queryClient = useQueryClient();

  const useCreateTask = () => {
    return useMutation({
      mutationFn: async (newTask: Omit<Task, 'id' | 'created_at'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        
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
    useCreateTask,
    useUpdateTask
  };
}
