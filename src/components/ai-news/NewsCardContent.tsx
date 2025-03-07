
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Zap, ChartBar } from 'lucide-react';
import { format } from 'date-fns';
import { truncateText } from '@/lib/formatters';
import { NewsItem } from '@/types/blog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NewsCardContentProps {
  post: NewsItem;
  hideContent?: boolean;
  hideMetadata?: boolean;
  truncateTitle?: boolean;
  onAnalyze?: (id: string) => void;
}

// [Analysis] Fixed property access to match NewsItem interface and improved date display
const NewsCardContent = ({ 
  post,
  hideContent = false,
  hideMetadata = false,
  truncateTitle = false,
  onAnalyze
}: NewsCardContentProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Generate a random importance score between 60-95 for demo
  // [Plan] Replace with actual AI-calculated importance from backend
  const importanceScore = post.ai_importance_score || Math.floor(60 + Math.random() * 35);

  // Handle formatting the date properly
  const formatPublishDate = () => {
    if (!post.published_at) {
      // If no published_at date, use creation date or current date
      const fallbackDate = post.date || post.created_at || new Date().toISOString();
      return format(new Date(fallbackDate), 'MMM d, yyyy');
    }
    
    try {
      return format(new Date(post.published_at), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date for article:', post.id, error);
      return format(new Date(), 'MMM d, yyyy');
    }
  };

  // Format the category for display
  const formatCategory = (category?: string) => {
    if (!category) return 'General';
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Get source domain display
  const getSourceDisplay = () => {
    if (!post.source) return 'Unknown Source';
    
    // Remove www. and handle common domains
    return post.source.replace('www.', '');
  };

  // Handle AI analysis button click
  const handleAnalyze = () => {
    if (onAnalyze && post.id) {
      setIsAnalyzing(true);
      onAnalyze(post.id).finally(() => {
        setIsAnalyzing(false);
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Title section */}
      <h3 className={`font-medium leading-tight ${truncateTitle ? 'line-clamp-2' : ''}`}>
        <a 
          href={post.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors duration-200"
        >
          {post.title}
        </a>
      </h3>

      {/* Article content (if available and not hidden) */}
      {!hideContent && post.content && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {truncateText(post.content, 120)}
        </p>
      )}

      {/* Metadata section */}
      {!hideMetadata && (
        <div className="mt-auto pt-3 flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{formatPublishDate()}</span>
            <span className="mx-1">•</span>
            <span>{post.reading_time || 3} min read</span>
          </div>
          
          <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
            {/* AI Importance Score */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs px-2 py-0 h-5 bg-blue-950/30 flex items-center gap-1">
                    <ChartBar className="h-3 w-3 text-blue-400" />
                    <span>{importanceScore}%</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI Importance Score: {importanceScore}%</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {post.category && (
              <Badge variant="outline" className="text-xs px-2 py-0 h-5 bg-blue-950/30">
                {formatCategory(post.category)}
              </Badge>
            )}
            {post.source && (
              <Badge variant="outline" className="text-xs px-2 py-0 h-5 bg-gray-800">
                {getSourceDisplay()}
              </Badge>
            )}
          </div>
        </div>
      )}
      
      {/* Analysis Action Button */}
      {!hideMetadata && onAnalyze && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3 w-full bg-blue-950/30 hover:bg-blue-900/40 text-xs gap-1.5"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          <Zap className="h-3.5 w-3.5 text-blue-400" />
          {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
        </Button>
      )}
      
      {/* External link indicator for clarity */}
      {post.url && !hideMetadata && (
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          <ExternalLink className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};

export default NewsCardContent;
