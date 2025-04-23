
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';

export function useClientTasks(clientId?: string) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAdmin, user } = useAuthSession();
  
  useEffect(() => {
    if (!user) {
      console.log('No authenticated user found');
      setError('Authentication required to view tasks');
      setLoading(false);
      return;
    }
    
    const fetchTasks = async () => {
      try {
        console.log('Fetching tasks for user:', user.id);
        setError(null);

        // Check if client-user link exists
        const { data: clientLink, error: linkError } = await supabase
          .from('client_user_links')
          .select('client_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (linkError) {
          console.error('Error checking client link:', linkError);
          throw new Error('Failed to verify client association');
        }

        if (!clientLink && !isAdmin) {
          console.log('No client link found for user');
          setTasks([]);
          setError('No client association found');
          return;
        }

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

        if (clientId) {
          console.log('Filtering tasks by client:', clientId);
          query = query.eq('assigned_client_id', clientId);
        } else if (!isAdmin) {
          // If not admin, only show tasks for linked client
          query = query.eq('assigned_client_id', clientLink?.client_id);
        }

        const { data, error: tasksError } = await query;

        if (tasksError) {
          console.error('Error fetching tasks:', tasksError);
          throw tasksError;
        }
        
        if (data && data.length > 0) {
          console.log('Successfully fetched tasks:', data.length);
          const mappedTasks = data.map(task => ({
            id: task.id,
            name: task.title,
            description: task.description,
            startAt: new Date(task.start_time || Date.now()),
            endAt: new Date(task.due_date || Date.now()),
            category: task.category,
            priority: task.priority,
            status: {
              name: task.status === 'completed' ? 'completed' : 
                    task.status === 'in_progress' ? 'in_progress' : 'pending',
              color: task.status === 'completed' ? '#10B981' : 
                    task.status === 'in_progress' ? '#F59E0B' : '#6B7280'
            },
            owner: {
              name: task.client_onboarding?.company_name || 'Unknown Client',
              image: `https://api.dicebear.com/7.x/initials/svg?seed=${task.client_onboarding?.company_name || 'Client'}`
            }
          }));
          setTasks(mappedTasks);
        } else {
          console.log('No tasks found');
          setTasks([]);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load tasks';
        console.error('Error in fetchTasks:', message);
        setError(message);
        toast({
          variant: "destructive",
          title: "Error loading tasks",
          description: message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Set up real-time subscription
    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        () => {
          console.log('Tasks changed, refreshing...');
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, toast, user, isAdmin]);

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      console.log('Updating task status:', { taskId, status });
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
    error,
    updateTaskStatus
  };
}
