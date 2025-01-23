import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, Suspense } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tool } from '@/components/tools/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBot } from '@/components/ChatBot';
import { Sidebar } from '@/components/Sidebar';
import { toast } from 'react-hot-toast';
import { ToolsHeader } from '@/components/tools/ToolsHeader';
import { ToolsCategories } from '@/components/tools/ToolsCategories';
import { ToolsGrid } from '@/components/tools/ToolsGrid';
import { motion } from 'framer-motion';

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => [
    { id: 'all', label: 'All Tools' },
    { id: 'featured', label: 'Featured' },
    { id: 'development', label: 'Development' },
    { id: 'database', label: 'Database' },
    { id: 'automation', label: 'Automation' },
    { id: 'GPT Builder', label: 'GPT Builder' },
  ], []);

  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['core_tools'],
    queryFn: async () => {
      console.log('Fetching tools from core_tools table...');
      const { data, error } = await supabase
        .from('core_tools')
        .select('*');
      
      if (error) {
        console.error('Error fetching tools:', error);
        toast.error('Failed to load tools. Please try again later.');
        throw error;
      }
      
      return data.map(tool => ({
        ...tool,
        youtube_videos: tool.youtube_videos 
          ? JSON.parse(JSON.stringify(tool.youtube_videos))
          : null
      })) as Tool[];
    },
  });

  const filteredTools = useMemo(() => {
    if (!tools) return [];
    
    return tools.filter(tool => {
      const matchesSearch = !searchQuery || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        (selectedCategory === 'featured' && tool.rating && tool.rating >= 4.5) ||
        tool.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="p-8">
          <div className="text-red-500">
            Failed to load tools. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div 
          className="max-w-7xl mx-auto space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ToolsHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <ToolsCategories />

          <ScrollArea className="w-full">
            <Tabs 
              defaultValue="all" 
              className="w-full" 
              onValueChange={setSelectedCategory}
            >
              <TabsList className="h-auto flex-wrap bg-siso-text/5 p-2 mb-6 border border-siso-text/10 rounded-xl">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="m-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-siso-red/20 data-[state=active]:to-siso-orange/20 data-[state=active]:text-siso-orange transition-all duration-300 hover:text-siso-orange/80"
                  >
                    {category.label}
                    <span className="ml-2 text-sm text-siso-text/60">
                      ({tools?.filter(t => 
                        category.id === 'all' ? true : 
                        category.id === 'featured' ? (t.rating && t.rating >= 4.5) :
                        t.category.toLowerCase() === category.id.toLowerCase()
                      ).length || 0})
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </ScrollArea>

          <Suspense fallback={<ToolsGrid tools={[]} isLoading={true} />}>
            <ToolsGrid tools={filteredTools} isLoading={isLoading} />
          </Suspense>
        </motion.div>
      </div>
      <ChatBot agentType="tools" />
    </div>
  );
}