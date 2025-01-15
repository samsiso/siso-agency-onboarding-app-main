import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Sidebar } from '@/components/Sidebar';
import { ToolCard } from '@/components/tools/ToolCard';
import { Tool } from '@/components/tools/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      console.log('Fetching tools...');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .not('category', 'eq', 'Assistant')
        .not('category', 'eq', 'Community')
        .not('category', 'eq', 'Automation')
        .not('category', 'eq', 'Chatbots')
        .is('member_type', null);
      
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

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    if (!tools) return {};
    return tools.reduce((acc, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [tools]);

  const filteredTools = tools?.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (error) {
    console.error('Error in component:', error);
    return <div className="text-red-500">Error loading tools. Please try again later.</div>;
  }

  const categories = ['all', 'featured', 'database', 'development', 'sales'];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                Core Tools & Platforms
              </h1>
              <p className="mt-2 text-lg text-siso-text/80 leading-relaxed max-w-3xl">
                Discover our curated collection of tools and platforms that power SISO Agency's operations. 
                These are the trusted solutions we use daily to deliver exceptional results.
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedCategory(value)}>
            <TabsList className="w-full justify-start bg-siso-text/5 border border-siso-text/10 flex-wrap">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  <span className="ml-2 text-sm text-siso-text/60">
                    {category === 'all' ? tools?.length || 0 : categoryCounts[category] || 0}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="h-48 rounded-lg bg-siso-text/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredTools?.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}