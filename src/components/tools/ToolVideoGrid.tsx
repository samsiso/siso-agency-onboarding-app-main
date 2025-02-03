import { useState } from 'react';
import { ToolVideoCard } from './ToolVideoCard';
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from 'lucide-react';

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
}

export function ToolVideoGrid({ videos, featuredVideos = [] }: ToolVideoGridProps) {
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
        <Select
          value={sortBy}
          onValueChange={setSortBy}
          className="w-full md:w-48"
        >
          <option value="recent">Most Recent</option>
          <option value="views">Most Viewed</option>
          <option value="rating">Highest Rated</option>
          <option value="ai_score">AI Insight Score</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video, index) => (
              <ToolVideoCard key={index} video={video} featured />
            ))}
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