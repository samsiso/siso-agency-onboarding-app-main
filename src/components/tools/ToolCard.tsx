import { Download, Heart, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Tool } from './types';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const navigate = useNavigate();

  if (tool.member_type) {
    return (
      <Card 
        className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 cursor-pointer"
        onClick={() => navigate(`/tools/${tool.id}`)}
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

  return (
    <Card 
      className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/tools/${tool.id}`)}
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
}