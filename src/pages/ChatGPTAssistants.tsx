import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { AssistantCard } from '@/components/assistants/AssistantCard';
import { AssistantDetails } from '@/components/assistants/AssistantDetails';
import { CategoryFilters } from '@/components/assistants/CategoryFilters';

interface Assistant {
  id: string;
  name: string;
  description: string | null;
  assistant_type: string | null;
  prompt_template: string | null;
  use_cases: string[] | null;
  input_variables: string[] | null;
  model_type: string | null;
  response_format: string | null;
  rating: number | null;
  likes_count: number | null;
  downloads_count: number | null;
  website_url: string | null;
}

export default function ChatGPTAssistants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['All', 'Featured', 'Software', 'Coding', 'Actions'];

  const { data: assistants, isLoading, error } = useQuery({
    queryKey: ['assistants'],
    queryFn: async () => {
      console.log('Fetching assistants...');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('category', 'assistant');
      
      if (error) {
        console.error('Error fetching assistants:', error);
        throw error;
      }
      
      console.log('Fetched assistants:', data);
      return data as Assistant[];
    },
  });

  const filteredAssistants = assistants?.filter(assistant => {
    const matchesSearch = !searchQuery || 
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
      (selectedCategory === 'Software' && assistant.assistant_type === 'software') ||
      (selectedCategory === 'Coding' && assistant.assistant_type === 'coding') ||
      (selectedCategory === 'Actions' && assistant.assistant_type === 'actions') ||
      (selectedCategory === 'Featured' && assistant.rating && assistant.rating >= 4.5);

    return matchesSearch && matchesCategory;
  });

  if (error) {
    console.error('Error in component:', error);
    return <div className="text-red-500">Error loading assistants. Please try again later.</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                ChatGPT Assistants
              </h1>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60" />
                <Input
                  placeholder="Search assistants..."
                  className="pl-10 bg-siso-text/5 border-siso-text/10 focus-visible:ring-siso-orange"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <CategoryFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>

          {isLoading ? (
            <div className="text-siso-text">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssistants?.map((assistant) => (
                <AssistantCard
                  key={assistant.id}
                  assistant={assistant}
                  onClick={setSelectedAssistant}
                />
              ))}
            </div>
          )}

          <AssistantDetails
            assistant={selectedAssistant}
            onClose={() => setSelectedAssistant(null)}
          />
        </div>
      </div>
    </div>
  );
}
