import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Sidebar } from '@/components/Sidebar';
import { CategoryFilters } from '@/components/assistants/CategoryFilters';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolDetail } from '@/components/tools/ToolDetail';
import { Tool } from '@/components/tools/types';

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      console.log('Fetching tools...');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        // Exclude items that belong in other sections
        .not('category', 'in', '("Community", "Automation", "Assistant", "Chatbots")')
        .is('member_type', null); // Exclude community members
      
      if (error) {
        console.error('Error fetching tools:', error);
        throw error;
      }

      const transformedData = data.map(tool => ({
        ...tool,
        youtube_videos: tool.youtube_videos as { title: string; url: string; }[] | null
      }));
      
      console.log('Fetched tools:', transformedData);
      return transformedData as Tool[];
    },
  });

  const categories = ['All', 'Featured', 'Database', 'Development', 'Sales']; // Removed categories that have their own pages

  const filteredTools = tools?.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
      tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (error) {
    console.error('Error in component:', error);
    return <div className="text-red-500">Error loading tools. Please try again later.</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
              Core Tools & Platforms
            </h1>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60" />
              <Input
                placeholder="Search tools..."
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

          {isLoading ? (
            <div className="text-siso-text">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
              {filteredTools?.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => setSelectedTool(tool)}
                />
              ))}
            </div>
          )}

          {selectedTool && (
            <ToolDetail
              tool={selectedTool}
              onClose={() => setSelectedTool(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}