
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsClient } from './useIsClient';
import { ClientData, TodoItem } from '@/types/client.types';
import { createDefaultClientData } from '@/utils/clientDataProcessors';

/**
 * Hook to fetch client details for the current user or by ID for admins
 */
export function useClientDetails(specificClientId: string | null = null) {
  const { isClient, clientId, loading: clientCheckLoading } = useIsClient();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use the specified clientId if provided, otherwise use the one from useIsClient
  const targetClientId = specificClientId || clientId;

  useEffect(() => {
    const fetchClientData = async () => {
      if (!targetClientId && !specificClientId) {
        setClientData(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch client details from the client_onboarding table
        const { data, error } = await supabase
          .from('client_onboarding')
          .select('*')
          .eq('id', targetClientId)
          .single();

        if (error) {
          console.error('Error fetching client data:', error);
          setError(new Error(error.message));
          setClientData(null);
        } else {
          // Parse todos if they exist
          let parsedTodos: TodoItem[] = [];
          if (data.todos) {
            try {
              // Ensure todos is properly formatted as TodoItem[]
              parsedTodos = Array.isArray(data.todos) 
                ? data.todos.map((item: any) => ({
                    id: item.id || crypto.randomUUID(),
                    text: item.text || '',
                    completed: Boolean(item.completed),
                    priority: item.priority || 'medium',
                    due_date: item.due_date,
                    related_to: item.related_to,
                    assigned_to: item.assigned_to,
                  }))
                : [];
            } catch (err) {
              console.warn('Error parsing todos:', err);
              parsedTodos = [];
            }
          }

          // Transform database result to match ClientData type
          const processedData: ClientData = {
            id: data.id,
            full_name: data.contact_name || 'Unknown',
            email: null,
            business_name: data.company_name || null,
            phone: null,
            avatar_url: null,
            status: data.status,
            current_step: data.current_step,
            total_steps: data.total_steps,
            completed_steps: data.completed_steps || [],
            created_at: data.created_at,
            updated_at: data.updated_at,
            website_url: data.website_url || null,
            professional_role: null,
            bio: null,
            project_name: data.project_name || null,
            company_niche: data.company_niche || null,
            development_url: null,
            mvp_build_status: null,
            notion_plan_url: null,
            payment_status: null,
            estimated_price: null,
            initial_contact_date: null,
            start_date: null,
            estimated_completion_date: null,
            todos: parsedTodos,
            next_steps: null,
            key_research: null,
            priority: null
          };
          
          setClientData(processedData);
          setError(null);
        }
      } catch (err) {
        console.error('Unexpected error fetching client data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setClientData(null);
      } finally {
        setLoading(false);
      }
    };

    if (!clientCheckLoading || specificClientId) {
      fetchClientData();
    }
  }, [isClient, targetClientId, clientCheckLoading, specificClientId]);

  // Function to update todos for a client
  const updateTodos = async (todos: TodoItem[]) => {
    if (!targetClientId || !clientData) return;
    
    setIsUpdating(true);
    try {
      // Convert TodoItem[] to a JSON structure the database expects
      const { error } = await supabase
        .from('client_onboarding')
        .update({ 
          todos: JSON.parse(JSON.stringify(todos)) // Ensure proper JSON serialization 
        })
        .eq('id', targetClientId);
      
      if (error) throw error;
      
      // Update local state
      setClientData({
        ...clientData,
        todos
      });
    } catch (err) {
      console.error('Error updating todos:', err);
      setError(err instanceof Error ? err : new Error('Failed to update todos'));
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to update client data
  const updateClient = async (updates: Partial<ClientData>) => {
    if (!targetClientId || !clientData) return;
    
    setIsUpdating(true);
    try {
      // Convert ClientData updates to database format
      const dbUpdates = {
        contact_name: updates.full_name,
        company_name: updates.business_name,
        website_url: updates.website_url,
        project_name: updates.project_name,
        company_niche: updates.company_niche,
        status: updates.status,
        current_step: updates.current_step,
        total_steps: updates.total_steps,
        completed_steps: updates.completed_steps,
      };
      
      const { error } = await supabase
        .from('client_onboarding')
        .update(dbUpdates)
        .eq('id', targetClientId);
      
      if (error) throw error;
      
      // Update local state
      setClientData({
        ...clientData,
        ...updates
      });
    } catch (err) {
      console.error('Error updating client:', err);
      setError(err instanceof Error ? err : new Error('Failed to update client'));
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    clientData,
    loading,
    error,
    updateTodos,
    updateClient,
    isUpdating,
    isLoading: loading, // Add alias for backward compatibility
  };
}
