
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';

export function useClientTasks(clientId?: string) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, user } = useAuthSession();
  
  useEffect(() => {
    if (!user && !clientId) {
      console.log('No user or clientId provided, skipping task fetch');
      setLoading(false);
      return;
    }
    
    const fetchTasks = async () => {
      try {
        console.log('Fetching tasks with user:', user?.id, 'isAdmin:', isAdmin, 'clientId:', clientId);
        
        let query = supabase
          .from('tasks')
          .select(`
            *,
            client_onboarding(
              id,
              company_name,
              contact_name
            )
          `);

        // If clientId is provided, filter by it
        if (clientId) {
          console.log('Filtering tasks by clientId:', clientId);
          query = query.eq('assigned_client_id', clientId);
        }

        console.log('Executing tasks query');
        const { data, error } = await query;

        if (error) {
          console.error('Error fetching tasks:', error);
          throw error;
        }
        
        console.log('Tasks data received:', data);

        if (data && data.length > 0) {
          // Map the data to include client information
          const mappedTasks = data.map(task => ({
            id: task.id,
            name: task.title,
            description: task.description,
            startAt: new Date(task.start_time || Date.now()),
            endAt: new Date(task.due_date || Date.now()),
            category: task.category,
            priority: task.priority,
            status: {
              name: task.status,
              color: task.status === 'completed' ? '#10B981' : 
                    task.status === 'in_progress' ? '#F59E0B' : '#6B7280'
            },
            owner: {
              name: task.client_onboarding?.company_name || 'Unknown Client',
              image: `https://api.dicebear.com/7.x/initials/svg?seed=${task.client_onboarding?.company_name || 'Client'}`
            }
          }));
          console.log('Mapped tasks:', mappedTasks);
          setTasks(mappedTasks);
        } else {
          console.log('No tasks found');
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          variant: "destructive",
          title: "Error loading tasks",
          description: "Failed to load tasks. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Set up real-time subscription
    console.log('Setting up real-time subscription for tasks table');
    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up supabase channel');
      supabase.removeChannel(channel);
    };
  }, [clientId, toast, user, isAdmin]);

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      console.log(`Updating task ${taskId} status to ${status}`);
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task updated",
        description: "Task status has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: "destructive",
        title: "Error updating task",
        description: "Failed to update task status. Please try again."
      });
    }
  };

  return {
    tasks,
    loading,
    isAdmin,
    updateTaskStatus
  };
}
