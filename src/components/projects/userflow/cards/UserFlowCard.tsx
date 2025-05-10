import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MessageSquare, Eye, Calendar, ArrowUpRight, Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface UserFlowCardProps {
  id: string;
  title: string;
  description: string;
  type: 'core' | 'secondary' | 'detailed';
  lastUpdated: string;
  views?: number;
  feedbackCount?: number;
  imageUrl?: string;
  onClick?: (id: string) => void;
}

export function UserFlowCard({
  id,
  title,
  description,
  type,
  lastUpdated,
  views,
  feedbackCount = 0,
  imageUrl,
  onClick
}: UserFlowCardProps) {
  const handleClick = () => {
    if (onClick) onClick(id);
  };

  // Get random accent color for cards without images
  const getRandomAccentColor = () => {
    const colors = [
      'from-indigo-500/30 to-violet-500/30',
      'from-cyan-500/30 to-blue-500/30',
      'from-fuchsia-500/30 to-pink-500/30',
      'from-amber-500/30 to-orange-500/30',
      'from-emerald-500/30 to-green-500/30',
    ];
    // Use the id to get a consistent color for the same card
    const colorIndex = id.charCodeAt(id.length - 1) % colors.length;
    return colors[colorIndex];
  };

  // Format number with k for thousands, m for millions
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 h-full",
        "border hover:shadow-lg group cursor-pointer",
        "bg-black/20 border-gray-800 hover:border-indigo-500/50",
        !imageUrl && `bg-gradient-to-br ${getRandomAccentColor()}`,
        type === 'core' && "border-l-indigo-500 border-l-4",
        type === 'secondary' && "border-l-amber-500 border-l-4",
        type === 'detailed' && "border-l-emerald-500 border-l-4"
      )}
      onClick={handleClick}
    >
      {/* Card highlight effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-violet-500/0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
      
      {/* Card preview image if available */}
      {imageUrl && (
        <div className="h-40 w-full overflow-hidden border-b border-gray-800 bg-gray-900/50 relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>
        </div>
      )}
      
      {/* Type indicator */}
      <div className="absolute top-2 right-2 z-10">
        {type === 'core' && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-indigo-300 fill-indigo-400" />
            <Star className="w-3 h-3 text-indigo-300 fill-indigo-400" />
            <Star className="w-3 h-3 text-indigo-300 fill-indigo-400" />
          </div>
        )}
        {type === 'secondary' && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-300 fill-amber-400" />
            <Star className="w-3 h-3 text-amber-300 fill-amber-400" />
          </div>
        )}
        {type === 'detailed' && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-emerald-300 fill-emerald-400" />
          </div>
        )}
      </div>
      
      {/* Card content */}
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <Badge 
            className={cn(
              "text-xs px-2 font-medium",
              type === 'core' ? "bg-indigo-500/90 hover:bg-indigo-500" : 
              type === 'secondary' ? "bg-amber-500/90 hover:bg-amber-500" : 
              "bg-emerald-500/90 hover:bg-emerald-500"
            )}
          >
            {type === 'core' ? 'Core Flow' : 
             type === 'secondary' ? 'Secondary' : 
             'Detailed'}
          </Badge>
          
          <span className="text-xs text-gray-400">
            <Calendar className="w-3 h-3 inline mr-1" />
            {format(new Date(lastUpdated), 'MMM d, yyyy')}
          </span>
        </div>
        
        <h3 className="font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">{title}</h3>
        <p className="text-sm text-gray-300 line-clamp-2">{description}</p>
      </CardContent>
      
      {/* Card footer with stats */}
      <CardFooter className="px-5 py-3 flex items-center justify-between border-t border-gray-800/50 bg-black/20">
        <div className="flex items-center gap-3">
          <span className="text-xs flex items-center text-gray-400 group-hover:text-gray-300">
            <Eye className="w-3 h-3 mr-1 text-gray-500" />
            {views !== undefined ? formatNumber(views) : '0'} views
          </span>
          <span className="text-xs flex items-center text-gray-400 group-hover:text-gray-300">
            <MessageSquare className="w-3 h-3 mr-1 text-gray-500" />
            {feedbackCount} feedbacks
          </span>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-7 w-7 p-0 rounded-full bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
      
      {/* Hover accent effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </Card>
  );
} 