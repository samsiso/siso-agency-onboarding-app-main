import { useQuery } from '@tanstack/react-query';
import { Database, Download, Heart, Search, Star } from 'lucide-react';
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

  const categories = tools ? [...new Set(tools.map(tool => tool.category))] : [];
  
  const filteredTools = tools?.filter(tool => {
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools?.map((tool) => (
                <Card key={tool.id} className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center group-hover:animate-glow">
                              <Database className="w-6 h-6 text-siso-orange" />
                            </div>
                            <div className="text-left flex-1">
                              <h3 className="text-lg font-semibold text-siso-text-bold">{tool.name}</h3>
                              <p className="text-sm text-siso-text/80">{tool.category}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="mt-4 space-y-4">
                            <p className="text-sm text-siso-text">{tool.description}</p>
                            
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2">
                                <Download className="w-4 h-4 text-siso-text/60" />
                                <span className="text-sm text-siso-text">2.5k downloads</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-siso-red" />
                                <span className="text-sm text-siso-text">1.2k likes</span>
                              </div>
                              {tool.rating && (
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-siso-orange" />
                                    <span className="ml-1 text-sm text-siso-text">
                                      {tool.rating.toFixed(1)}
                                    </span>
                                  </div>
                                  <span className="text-sm text-siso-text/60">
                                    ({tool.reviews_count} reviews)
                                  </span>
                                </div>
                              )}
                            </div>

                            {tool.pricing_type && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full text-xs bg-siso-text/10 text-siso-text">
                                  {tool.pricing_type}
                                </span>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}