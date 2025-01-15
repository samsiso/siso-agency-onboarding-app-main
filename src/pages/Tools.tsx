import { useQuery } from '@tanstack/react-query';
import { Database, Download, Heart, Search, Star, Bot, Code, Trophy } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sidebar } from '@/components/Sidebar';

interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  pricing_type: string | null;
  rating: number | null;
  reviews_count: number | null;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Featured':
      return <Trophy className="w-4 h-4 text-siso-orange" />;
    case 'Automation':
      return <Bot className="w-4 h-4 text-siso-orange" />;
    case 'Database':
      return <Database className="w-4 h-4 text-siso-orange" />;
    case 'Development':
      return <Code className="w-4 h-4 text-siso-orange" />;
    default:
      return <Star className="w-4 h-4 text-siso-orange" />;
  }
};

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tools, isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*');
      
      if (error) throw error;
      return data as Tool[];
    },
  });

  const categories = ['Featured', 'Automation', 'Database', 'Development'];
  
  const filteredTools = tools?.filter(tool => {
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedTools = categories.reduce((acc, category) => {
    acc[category] = filteredTools?.filter(tool => tool.category === category) || [];
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-4xl font-bold text-siso-text-bold">Core Tools & Platforms</h1>
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
          
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full transition-all ${
                !selectedCategory 
                ? 'bg-gradient-to-r from-siso-red to-siso-orange text-white shadow-lg' 
                : 'bg-siso-text/10 text-siso-text hover:bg-siso-text/20'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                  ? 'bg-gradient-to-r from-siso-red to-siso-orange text-white shadow-lg'
                  : 'bg-siso-text/10 text-siso-text hover:bg-siso-text/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-siso-text">Loading tools...</div>
          ) : (
            <div className="space-y-8">
              {categories.map(category => {
                const categoryTools = groupedTools[category];
                if (!selectedCategory || selectedCategory === category) {
                  return categoryTools.length > 0 ? (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        {getCategoryIcon(category)}
                        <h2 className="text-2xl font-bold text-siso-text-bold">{category}</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categoryTools.map((tool) => (
                          <Card key={tool.id} className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center group-hover:animate-glow">
                                  {getCategoryIcon(tool.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-semibold text-siso-text-bold truncate">{tool.name}</h3>
                                  <p className="text-xs text-siso-text/80">{tool.category}</p>
                                </div>
                              </div>
                              {tool.description && (
                                <p className="mt-2 text-xs text-siso-text line-clamp-2">
                                  {tool.description}
                                </p>
                              )}
                              <div className="flex gap-3 mt-3">
                                <div className="flex items-center gap-1">
                                  <Download className="w-3 h-3 text-siso-text/60" />
                                  <span className="text-xs text-siso-text">2.5k</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3 text-siso-red" />
                                  <span className="text-xs text-siso-text">1.2k</span>
                                </div>
                                {tool.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-siso-orange" />
                                    <span className="text-xs text-siso-text">
                                      {tool.rating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : null;
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}