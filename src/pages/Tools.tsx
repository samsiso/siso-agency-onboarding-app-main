import { useQuery } from '@tanstack/react-query';
import { Search, Info, Filter, Star, Wrench } from 'lucide-react';
import { useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Sidebar } from '@/components/Sidebar';
import { ToolCard } from '@/components/tools/ToolCard';
import { Tool } from '@/components/tools/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatBot } from '@/components/ChatBot';
import { toast } from 'react-hot-toast';

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'featured', label: 'Featured' },
    { id: 'development', label: 'Development' },
    { id: 'database', label: 'Database' },
    { id: 'automation', label: 'Automation' },
    { id: 'GPT Builder', label: 'GPT Builder' },
  ];

  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      console.log('Fetching tools...');
      const { data, error } = await supabase
        .from('tools')  // Changed from 'core_tools' to 'tools'
        .select('*');
      
      if (error) {
        console.error('Error fetching tools:', error);
        toast.error('Failed to load tools. Please try again later.');
        throw error;
      }
      
      console.log('Fetched tools:', data);
      
      // Parse youtube_videos JSON for each tool
      const parsedData = data.map(tool => ({
        ...tool,
        youtube_videos: tool.youtube_videos ? JSON.parse(JSON.stringify(tool.youtube_videos)) : null
      }));
      
      return parsedData as Tool[];
    },
  });

  const filteredTools = useMemo(() => {
    console.log('Filtering tools:', tools);
    return tools?.filter(tool => {
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
    console.error('Render error:', error);
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load tools. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                  Tools and Platforms
                </h1>
                <p className="mt-2 text-lg text-siso-text/80 leading-relaxed max-w-3xl">
                  Discover powerful tools and platforms to enhance your workflow. 
                  Browse through various categories including development, database, and automation tools.
                </p>
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <Wrench className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Development:</span> Tools for coding, AI, and technical tasks.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <Filter className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Database:</span> Data storage and management solutions.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <Star className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Automation:</span> Workflow automation tools.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <ScrollArea className="w-full">
            <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
              <TabsList className="h-auto flex-wrap bg-siso-text/5 p-2">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="m-1 data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange"
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

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="h-48 rounded-lg bg-siso-text/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      <ChatBot agentType="tools" />
    </div>
  );
}