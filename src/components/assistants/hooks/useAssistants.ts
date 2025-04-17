
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
      
      // Make sure data is an array before mapping
      const assistantsArray = Array.isArray(data) ? data : [];
      
      // Cast data to Assistant[] safely with explicit type checking
      return assistantsArray.map(item => {
        if (!item) return {} as Assistant;
        
        return {
          id: String(item.id || ''),
          name: String(item.name || ''),
          description: item.description || null,
          category: String(item.category || ''),
          assistant_type: item.assistant_type || null,
          prompt_template: null,
          use_cases: null,
          input_variables: null,
          model_type: null,
          response_format: null,
          rating: null,
          likes_count: null,
          downloads_count: null,
          website_url: null,
          gpt_url: null,
          review_average: null,
          review_count: null,
          num_conversations_str: null
        } as Assistant;
      });
    },
  });
}
