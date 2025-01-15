import { useQuery } from '@tanstack/react-query';
import { Download, ExternalLink, Heart, Search, Star, Youtube, X, Users } from 'lucide-react';
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
  member_type: string | null;
  youtube_url: string | null;
  youtube_videos: {
    title: string;
    url: string;
  }[] | null;
  website_url: string | null;
  specialization: string[] | null;
  content_themes: string[] | null;
  profile_image_url: string | null;
}

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
        .select('*');
      
      if (error) {
        console.error('Error fetching tools:', error);
        throw error;
      }
      console.log('Fetched tools:', data);
      return data as Tool[];
    },
  });

  const categories = ['All', 'Featured', 'Automation', 'Database', 'Development', 'Sales', 'Community'];

  const filteredTools = tools?.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
      (selectedCategory === 'Community' ? tool.member_type !== null : tool.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  if (error) {
    console.error('Error in component:', error);
    return <div className="text-red-500">Error loading tools. Please try again later.</div>;
  }

  const renderToolCard = (tool: Tool) => {
    if (tool.member_type) {
      // Render community member card
      return (
        <Card 
          key={tool.id} 
          className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 cursor-pointer"
          onClick={() => handleToolClick(tool)}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              {tool.profile_image_url ? (
                <img 
                  src={tool.profile_image_url} 
                  alt={tool.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-siso-orange" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-siso-text-bold truncate">{tool.name}</h3>
                <p className="text-xs text-siso-text/80 capitalize">{tool.member_type}</p>
              </div>
            </div>
            {tool.description && (
              <p className="mt-2 text-xs text-siso-text line-clamp-2">
                {tool.description}
              </p>
            )}
            {tool.specialization && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tool.specialization.slice(0, 2).map((spec, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-0.5 rounded-full bg-siso-text/10 text-siso-text"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    // Render regular tool card
    return (
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
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-4xl font-bold text-siso-text-bold">
                {selectedCategory === 'Community' ? 'AI Community Members' : 'Core Tools & Platforms'}
              </h1>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60" />
                <Input
                  placeholder={selectedCategory === 'Community' ? "Search members..." : "Search tools..."}
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
            <div className="text-siso-text">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredTools?.map((tool) => renderToolCard(tool))}
            </div>
          )}

          <Sheet open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
            <SheetContent className="bg-siso-bg border-l border-siso-text/10 w-full sm:max-w-xl">
              {selectedTool && (
                <>
                  <SheetHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedTool.member_type && selectedTool.profile_image_url ? (
                          <img 
                            src={selectedTool.profile_image_url} 
                            alt={selectedTool.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : null}
                        <div>
                          <SheetTitle className="text-2xl font-bold text-siso-text-bold">
                            {selectedTool.name}
                          </SheetTitle>
                          {selectedTool.member_type && (
                            <p className="text-sm text-siso-text/80 capitalize">{selectedTool.member_type}</p>
                          )}
                        </div>
                      </div>
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
                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-siso-text-bold">Quick Actions</h3>
                      <div className="flex flex-col gap-2">
                        {selectedTool.website_url && (
                          <Button
                            className="w-full justify-start gap-2"
                            onClick={() => window.open(selectedTool.website_url!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit Website
                          </Button>
                        )}
                        {selectedTool.youtube_url && (
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={() => window.open(selectedTool.youtube_url!, '_blank')}
                          >
                            <Youtube className="h-4 w-4 text-red-500" />
                            Visit YouTube Channel
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Specializations */}
                    {selectedTool.specialization && selectedTool.specialization.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-siso-text-bold">Specializations</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTool.specialization.map((spec, index) => (
                            <span 
                              key={index}
                              className="text-sm px-3 py-1 rounded-full bg-siso-text/10 text-siso-text"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content Themes */}
                    {selectedTool.content_themes && selectedTool.content_themes.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-siso-text-bold">Content Themes</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTool.content_themes.map((theme, index) => (
                            <span 
                              key={index}
                              className="text-sm px-3 py-1 rounded-full bg-siso-orange/10 text-siso-orange"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stats for regular tools */}
                    {!selectedTool.member_type && (
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
                    )}
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