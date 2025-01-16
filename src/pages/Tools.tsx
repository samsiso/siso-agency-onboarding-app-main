import { useQuery } from '@tanstack/react-query';
import { Search, Info, Filter, Star, Wrench } from 'lucide-react';
import { useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Sidebar } from '@/components/Sidebar';
import { ToolCard } from '@/components/tools/ToolCard';
import { Tool as ToolType } from '@/components/tools/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'development', label: 'Development' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'content', label: 'Content Creation' },
    { id: 'business', label: 'Business' },
    { id: 'education', label: 'Education' },
    { id: 'design', label: 'Design' },
    { id: 'research', label: 'Research' },
    { id: 'language', label: 'Language' },
    { id: 'media', label: 'Media' },
  ];

  const mapToolToCategory = (originalCategory: string): string => {
    const categoryMap: Record<string, string> = {
      'integration': 'development',
      'page builder': 'development',
      'custom actions': 'development',
      'authentication': 'development',
      'collect email': 'business',
      'knowledge files': 'productivity',
      'ads': 'business',
      'monetization': 'business'
    };
    return categoryMap[originalCategory.toLowerCase()] || originalCategory.toLowerCase();
  };

  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      console.log('Fetching tools...');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('resource_type', 'tool')
        .neq('category', 'gpt builder'); // Exclude GPT builder tools
      
      if (error) {
        console.error('Error fetching tools:', error);
        throw error;
      }
      
      console.log('Raw data from Supabase:', data);
      
      const transformedData = data.map(tool => ({
        ...tool,
        youtube_videos: tool.youtube_videos as { title: string; url: string; }[] | null
      }));
      
      console.log('Transformed tools data:', transformedData);
      return transformedData as ToolType[];
    },
  });

  const categoryCounts = useMemo(() => {
    if (!tools) return {};
    return tools.reduce((acc, tool) => {
      const category = mapToolToCategory(tool.category);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [tools]);

  const filteredTools = tools?.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const toolCategory = mapToolToCategory(tool.category);
    const matchesCategory = selectedCategory === 'all' || toolCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
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
                  Browse through various categories including development, productivity, and business tools.
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
                  <span className="font-semibold text-siso-text">Development:</span> Tools for coding, integration, and technical tasks.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <Filter className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Productivity:</span> Enhance your workflow efficiency.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <Star className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Business:</span> Tools for growth and monetization.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(10)].map((_, i) => (
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
    </div>
  );
}
