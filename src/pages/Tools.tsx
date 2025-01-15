import { useQuery } from '@tanstack/react-query';
import { Download, ExternalLink, Heart, Search, Star, Youtube, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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

interface ToolDetails extends Tool {
  website_url?: string;
  youtube_videos?: {
    title: string;
    url: string;
  }[];
}

// Mock data for tool details - in production this would come from your database
const getToolDetails = (tool: Tool): ToolDetails => ({
  ...tool,
  website_url: "https://example.com",
  youtube_videos: [
    {
      title: "Getting Started Guide",
      url: "https://youtube.com/watch?v=example1"
    },
    {
      title: "Advanced Features Tutorial",
      url: "https://youtube.com/watch?v=example2"
    },
    {
      title: "Pro Tips & Tricks",
      url: "https://youtube.com/watch?v=example3"
    }
  ]
});

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolDetails | null>(null);

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

  const handleToolClick = (tool: Tool) => {
    const toolDetails = getToolDetails(tool);
    setSelectedTool(toolDetails);
  };

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
                <Card 
                  key={tool.id} 
                  className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 cursor-pointer"
                  onClick={() => handleToolClick(tool)}
                >
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

          <Sheet open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
            <SheetContent className="bg-siso-bg border-l border-siso-text/10 w-full sm:max-w-xl">
              {selectedTool && (
                <>
                  <SheetHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-2xl font-bold text-siso-text-bold">
                        {selectedTool.name}
                      </SheetTitle>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setSelectedTool(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <SheetDescription className="text-siso-text">
                      {selectedTool.description}
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-siso-text-bold">Quick Actions</h3>
                      <div className="flex flex-col gap-2">
                        <Button
                          className="w-full justify-start gap-2"
                          onClick={() => window.open(selectedTool.website_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Visit Website
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedTool.name + ' tutorial')}`, '_blank')}
                        >
                          <Youtube className="h-4 w-4 text-red-500" />
                          Watch Tutorials
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-siso-text-bold">Featured Videos</h3>
                      <div className="space-y-2">
                        {selectedTool.youtube_videos?.map((video, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start gap-2 text-left"
                            onClick={() => window.open(video.url, '_blank')}
                          >
                            <Youtube className="h-4 w-4 text-red-500 shrink-0" />
                            <span className="truncate">{video.title}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-siso-text-bold">Stats</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-lg bg-siso-text/5">
                          <Star className="h-5 w-5 text-siso-orange mx-auto mb-1" />
                          <div className="text-sm text-siso-text-bold">{selectedTool.rating?.toFixed(1) || '-'}</div>
                          <div className="text-xs text-siso-text">Rating</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-siso-text/5">
                          <Download className="h-5 w-5 text-siso-text/60 mx-auto mb-1" />
                          <div className="text-sm text-siso-text-bold">{selectedTool.downloads_count || '0'}</div>
                          <div className="text-xs text-siso-text">Downloads</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-siso-text/5">
                          <Heart className="h-5 w-5 text-siso-red mx-auto mb-1" />
                          <div className="text-sm text-siso-text-bold">{selectedTool.likes_count || '0'}</div>
                          <div className="text-xs text-siso-text">Likes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}