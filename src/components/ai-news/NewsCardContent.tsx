
import React, { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Share2, Bookmark, Heart, MessageSquare, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types/blog';
import { Badge } from '@/components/ui/badge';

interface NewsCardContentProps {
  post: NewsItem;
  hideContent?: boolean;
  hideMetadata?: boolean;
  truncateTitle?: boolean;
  onAnalyze?: (id: string) => Promise<void> | void;
}

// [Analysis] Component to display article metadata with cleaner implementation
const NewsCardContent = ({ 
  post, 
  hideContent = false, 
  hideMetadata = false,
  truncateTitle = true,
  onAnalyze
}: NewsCardContentProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      // [Q] Is this the correct format expected by the app?
      // Try to parse as ISO string first
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  
  const handleAnalyze = async () => {
    if (!onAnalyze || isAnalyzing) return;
    
    try {
      setIsAnalyzing(true);
      await onAnalyze(post.id);
    } catch (error) {
      console.error('Error analyzing article:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className={`font-semibold text-white ${truncateTitle ? 'line-clamp-2' : ''}`}>
            {post.title}
          </h3>
          
          {!hideMetadata && (
            <div className="flex flex-wrap gap-2 mt-1 items-center">
              <span className="text-xs text-gray-400">
                {formatDate(post.date)}
              </span>
              
              <span className="text-xs text-gray-400">•</span>
              
              <span className="text-xs text-gray-400">
                {post.reading_time || 5} min read
              </span>
              
              {post.source && (
                <>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-blue-400">
                    {post.source}
                  </span>
                </>
              )}
              
              {post.ai_importance_score && (
                <>
                  <span className="text-xs text-gray-400">•</span>
                  <Badge variant="outline" className="bg-blue-900/30 text-blue-400 text-xs border-blue-800">
                    {post.ai_importance_score}% importance
                  </Badge>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {!hideContent && post.description && (
        <p className="text-sm text-gray-300 mt-1 line-clamp-3">
          {post.description}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-auto pt-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
          >
            <Heart className="h-4 w-4 text-gray-400" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
          >
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
          >
            <Share2 className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        
        {onAnalyze && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="text-xs border-blue-800 hover:bg-blue-900/50 text-blue-300"
          >
            {isAnalyzing ? (
              <>
                <span className="mr-1">Analyzing</span>
                <span className="loading loading-dots"></span>
              </>
            ) : (
              <>
                <BarChart className="h-3 w-3 mr-1" />
                AI Analysis
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewsCardContent;
