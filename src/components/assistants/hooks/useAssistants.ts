
import { useQuery } from '@tanstack/react-query';
import { safeSupabase } from '@/utils/supabaseHelpers';
import { Assistant } from '@/components/assistants/types';

export function useAssistants() {
  return useQuery({
    queryKey: ['assistants'],
    queryFn: async () => {
      console.log('Fetching assistants...');
      const { data, error } = await safeSupabase
        .from('tools')
        .select('*')
        .or('category.eq.assistant,category.eq.gpt builder');
      
      if (error) {
        console.error('Error fetching assistants:', error);
        throw error;
      }
      
      console.log('Fetched assistants:', data);
      // Cast data to Assistant[] safely
      return (data || []) as Assistant[];
    },
  });
}
