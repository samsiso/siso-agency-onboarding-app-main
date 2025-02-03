import { useState } from 'react';
import { ToolVideoCard } from './ToolVideoCard';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from 'lucide-react';

const categories = [
  'Business Strategy',
  'Marketing',
  'Tech Implementation',
  'Growth Tactics',
  'Agency Management'
];

interface ToolVideoGridProps {
  videos: any[];
  featuredVideos?: any[];
  isLoading?: boolean;
}

export function ToolVideoGrid({ videos = [], featuredVideos = [], isLoading = false }: ToolVideoGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategories = selectedCategories.length === 0 || 
      video.topics.some((topic: string) => selectedCategories.includes(topic));
    return matchesSearch && matchesCategories;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-siso-bg-alt rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/50" />
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="views">Most Viewed</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="ai_score">AI Insight Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            className="cursor-pointer hover:bg-siso-red/10"
            onClick={() => toggleCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {featuredVideos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-siso-text-bold">Featured Videos</h2>
          <div className="grid gap-4">
            {/* Top row: Two featured videos side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredVideos.slice(0, 2).map((video, index) => (
                <ToolVideoCard 
                  key={index} 
                  video={video} 
                  featured 
                  className="h-full"
                />
              ))}
            </div>
            {/* Bottom row: One larger featured video */}
            {featuredVideos[2] && (
              <div className="md:col-span-2">
                <ToolVideoCard 
                  video={featuredVideos[2]} 
                  featured 
                  className="md:max-w-3xl mx-auto"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video, index) => (
          <ToolVideoCard key={index} video={video} />
        ))}
      </div>
    </div>
  );
}