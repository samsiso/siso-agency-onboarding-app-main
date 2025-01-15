import { useQuery } from '@tanstack/react-query';
import { Database, Info, Link, Package } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
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
  const filteredTools = tools?.filter(tool => 
    !selectedCategory || tool.category === selectedCategory
  );

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-siso-text-bold mb-8">Core Tools & Platforms</h1>
          
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full transition-all ${
                !selectedCategory 
                ? 'bg-gradient-to-r from-siso-red to-siso-orange text-white' 
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
                  ? 'bg-gradient-to-r from-siso-red to-siso-orange text-white'
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
                <Card key={tool.id} className="bg-card/50 backdrop-blur border-siso-text/10">
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                              <Package className="w-6 h-6 text-siso-orange" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-lg font-semibold text-siso-text-bold">{tool.name}</h3>
                              <p className="text-sm text-siso-text/80">{tool.category}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="mt-4 space-y-4">
                            <div className="flex items-start gap-3">
                              <Info className="w-5 h-5 text-siso-text/60 mt-1" />
                              <p className="text-sm text-siso-text">{tool.description}</p>
                            </div>
                            {tool.pricing_type && (
                              <div className="flex items-center gap-3">
                                <Database className="w-5 h-5 text-siso-text/60" />
                                <p className="text-sm text-siso-text">{tool.pricing_type}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <Link className="w-5 h-5 text-siso-text/60" />
                              <button className="text-sm text-siso-orange hover:text-siso-red transition-colors">
                                Visit Website
                              </button>
                            </div>
                            {tool.rating && (
                              <div className="flex items-center gap-2 text-sm text-siso-text">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-lg ${
                                        i < Math.floor(tool.rating)
                                          ? 'text-siso-orange'
                                          : 'text-siso-text/20'
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-siso-text/60">
                                  ({tool.reviews_count} reviews)
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