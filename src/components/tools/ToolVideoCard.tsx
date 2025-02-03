import { Play, Clock, ThumbsUp, Eye, Brain } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolVideoCardProps {
  video: {
    title: string;
    url: string;
    duration: string;
    thumbnail_url: string;
    educator: {
      name: string;
      avatar_url: string;
    };
    metrics: {
      views: number;
      likes: number;
      sentiment_score: number;
      difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
      impact_score: number;
    };
    topics: string[];
    ai_analysis: {
      key_takeaways: string[];
      implementation_steps: string[];
    };
  };
  featured?: boolean;
}

export function ToolVideoCard({ video, featured = false }: ToolVideoCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      "border border-siso-border hover:border-siso-border-hover",
      featured ? "bg-gradient-to-br from-siso-red/5 to-siso-orange/5" : "bg-siso-bg-alt"
    )}>
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img 
            src={video.thumbnail_url} 
            alt={video.title}
            className="object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-12 h-12 text-white" />
          </div>
        </AspectRatio>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white text-sm px-2 py-1 rounded-md">
          <Clock className="w-4 h-4" />
          <span>{video.duration}</span>
        </div>
        {featured && (
          <Badge className="absolute top-2 left-2 bg-siso-red text-white">
            Featured
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-siso-text-bold line-clamp-2">
            {video.title}
          </h3>
          <Tooltip content="AI Analysis Available">
            <Brain className="w-5 h-5 text-siso-orange flex-shrink-0" />
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <img
            src={video.educator.avatar_url}
            alt={video.educator.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-siso-text">{video.educator.name}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-siso-text-muted">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{video.metrics.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{video.metrics.likes.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {video.topics.map((topic, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-siso-bg text-siso-text-muted"
            >
              {topic}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}