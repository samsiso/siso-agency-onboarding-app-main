
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Assistant } from '@/components/assistants/types';

export function useAssistants() {
  return useQuery({
    queryKey: ['assistants'],
    queryFn: async () => {
      console.log('Fetching assistants...');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .or('category.eq.assistant,category.eq.gpt builder');
      
      if (error) {
        console.error('Error fetching assistants:', error);
        throw error;
      }
      
      console.log('Fetched assistants:', data);
      return data as Assistant[];
    },
  });
}
