
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { truncateText } from '@/lib/formatters';
import { NewsItem } from '@/types/blog';

interface NewsCardContentProps {
  post: NewsItem;
  hideContent?: boolean;
  hideMetadata?: boolean;
  truncateTitle?: boolean;
}

// [Analysis] Fixed property access to match NewsItem interface
const NewsCardContent = ({ 
  post,
  hideContent = false,
  hideMetadata = false,
  truncateTitle = false
}: NewsCardContentProps) => {
  // Handle formatting the date
  const formatPublishDate = () => {
    if (!post.published_at) return 'Unknown date';
    
    try {
      return formatDistance(new Date(post.published_at), new Date(), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date for article:', post.id, error);
      return 'Invalid date';
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
        {post.featured && (
          <span className="ml-1 inline-flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          </span>
        )}
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
