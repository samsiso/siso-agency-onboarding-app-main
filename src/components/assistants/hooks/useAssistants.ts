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
      
      // Map the data to include required properties with defaults
      const assistants: Assistant[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: item.category,
        created_at: item.created_at,
        updated_at: item.updated_at,
        // Add default values for the required fields from the Assistant interface
        assistant_type: item.assistant_type || 'general',
        prompt_template: item.prompt_template || '',
        use_cases: item.use_cases || [],
        input_variables: item.input_variables || [],
        model_type: item.model_type || 'gpt-4',
        response_format: item.response_format || 'text',
        // Other fields with defaults
        rating: item.rating || 0,
        reviews_count: item.reviews_count || 0,
        pricing_type: item.pricing_type || 'free',
        website_url: item.website_url || '',
        profile_image_url: item.profile_image_url || '',
        icon_url: item.icon_url || '',
      }));
      
      return assistants;
    },
  });
}
