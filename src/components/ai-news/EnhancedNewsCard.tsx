
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock, Share2, BookmarkPlus, BarChart, Tag, Bookmark, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types/blog';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// [Analysis] Card component with enhanced animations and visual hierarchy
interface EnhancedNewsCardProps {
  item: NewsItem;
  onAnalyzeArticle?: (id: string) => Promise<void>;
  className?: string;
}

export const EnhancedNewsCard: React.FC<EnhancedNewsCardProps> = ({
  item,
  onAnalyzeArticle,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // [Framework] Added explicit navigation function to handle click events
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/ai-news/${item.id}`);
  };
  
  // Get category color based on category name
  const getCategoryColor = (category?: string) => {
    if (!category) return "from-blue-500/20 to-blue-700/20 border-blue-500/30 text-blue-400";
    
    const normalizedCategory = category.toLowerCase();
    
    if (normalizedCategory.includes("research")) {
      return "from-purple-500/20 to-purple-700/20 border-purple-500/30 text-purple-400";
    } else if (normalizedCategory.includes("business") || normalizedCategory.includes("finance")) {
      return "from-green-500/20 to-green-700/20 border-green-500/30 text-green-400";
    } else if (normalizedCategory.includes("tech") || normalizedCategory.includes("technology")) {
      return "from-cyan-500/20 to-cyan-700/20 border-cyan-500/30 text-cyan-400";
    } else if (normalizedCategory.includes("development") || normalizedCategory.includes("coding")) {
      return "from-amber-500/20 to-amber-700/20 border-amber-500/30 text-amber-400";
    } else if (normalizedCategory.includes("legal") || normalizedCategory.includes("regulation")) {
      return "from-red-500/20 to-red-700/20 border-red-500/30 text-red-400";
    }
    
    return "from-blue-500/20 to-blue-700/20 border-blue-500/30 text-blue-400";
  };
  
  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onAnalyzeArticle) {
      await onAnalyzeArticle(item.id);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("h-full", className)}
      onClick={handleCardClick} // Added onClick to the outer container
    >
      <Card className={cn(
        "overflow-hidden h-full bg-gray-900/30 backdrop-blur-sm border-gray-800/80 flex flex-col",
        "transition-all duration-300 relative group cursor-pointer",
        isHovered && "border-gray-700 shadow-xl shadow-purple-900/10"
      )}>
        {/* Top glowing border */}
        <div className={cn(
          "absolute h-[2px] top-0 left-0 right-0 opacity-0 transition-opacity duration-500",
          "bg-gradient-to-r from-transparent via-blue-500 to-transparent",
          isHovered && "opacity-100"
        )} />
        
        {/* Image container with overlay */}
        <div className="h-48 relative overflow-hidden">
          <div className={cn(
            "absolute inset-0 bg-black/30 z-10 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )} />
          
          <motion.img
            src={item.image_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ objectPosition: "center" }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
          />
          
          {/* Category badges */}
          <div className="absolute top-3 left-3 z-20">
            <Badge 
              className={cn(
                "px-2 py-1 text-xs bg-gradient-to-r border",
                getCategoryColor(item.category)
              )}
            >
              <Tag className="h-3 w-3 mr-1" />
              {item.category || "AI News"}
            </Badge>
          </div>
          
          {/* Importance score if available */}
          {item.ai_importance_score && (
            <div className="absolute top-3 right-3 z-20">
              <Badge 
                className="px-2 py-1 text-xs bg-gradient-to-r from-blue-500/20 to-blue-700/20 border border-blue-500/30 text-blue-400"
              >
                <BarChart className="h-3 w-3 mr-1" />
                {item.ai_importance_score}% importance
              </Badge>
            </div>
          )}
          
          {/* Source overlay */}
          {item.source && (
            <div className="absolute bottom-3 left-3 z-20">
              <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-md">
                {item.source}
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-400">
              {new Date(item.date || Date.now()).toLocaleDateString()}
            </span>
            
            <span className="text-xs text-gray-400">•</span>
            
            <span className="text-xs text-gray-400">
              {item.reading_time || 5} min read
            </span>
          </div>
          
          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
            {item.title}
          </h3>
          
          <p className="text-sm text-gray-300 mb-4 line-clamp-3">
            {item.description}
          </p>
          
          {/* Actions */}
          <div className="mt-auto flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-800/80"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                }}
              >
                <Bookmark className="h-4 w-4 text-gray-400" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-800/80"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                }}
              >
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-800/80"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                }}
              >
                <Share2 className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
            
            {onAnalyzeArticle && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyze}
                className={cn(
                  "text-xs gap-1",
                  item.has_ai_analysis
                    ? "border-green-800 hover:bg-green-900/50 text-green-300"
                    : "border-blue-800 hover:bg-blue-900/50 text-blue-300"
                )}
              >
                <BarChart className="h-3 w-3" />
                {item.has_ai_analysis ? 'View Analysis' : 'AI Analysis'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
