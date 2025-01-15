import { useQuery } from '@tanstack/react-query';
import { Download, Heart, Search, Star } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';

interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  pricing_type: string | null;
  rating: number | null;
  reviews_count: number | null;
  downloads_count: number | null;
  likes_count: number | null;
}

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      console.log('Fetching tools...');
      const { data, error } = await supabase
        .from('tools')
        .select('*');
      
      if (error) {
        console.error('Error fetching tools:', error);
        throw error;
      }
      console.log('Fetched tools:', data);
      return data as Tool[];
    },
  });

  const categories = ['All', 'Featured', 'Automation', 'Database', 'Development', 'Sales'];

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
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className={`${
                    selectedCategory === category || (category === 'All' && !selectedCategory)
                      ? 'bg-siso-orange text-white hover:bg-siso-orange/90'
                      : 'bg-siso-text/5 hover:bg-siso-text/10'
                  } text-sm`}
                  onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-siso-text">Loading tools...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredTools?.map((tool) => (
                <Card key={tool.id} className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center group-hover:animate-glow">
                        <Star className="w-3 h-3 text-siso-orange" />
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
                    <div className="flex gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-siso-text/60" />
                        <span className="text-xs text-siso-text">{tool.downloads_count || '0'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-siso-red" />
                        <span className="text-xs text-siso-text">{tool.likes_count || '0'}</span>
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
          )}
        </div>
      </div>
    </div>
  );
}