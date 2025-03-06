
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, BarChart, ExternalLink, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { NewsPost } from '@/types/blog';
import { extractDomain } from '@/lib/utils';
import AISummaryPopup from './AISummaryPopup';
import { useAiArticleSummary } from '@/hooks/useAiArticleSummary';

interface NewsCardContentProps {
  post: NewsPost;
  hideContent?: boolean;
  hideMetadata?: boolean;
  truncateTitle?: boolean;
}

// [Analysis] Enhanced to add AI summary popup functionality
const NewsCardContent: React.FC<NewsCardContentProps> = ({
  post,
  hideContent = false,
  hideMetadata = false,
  truncateTitle = true,
}) => {
  // [Analysis] New state for managing the summary popup
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const { isLoading, summary, generateSummary, resetSummary } = useAiArticleSummary();

  const handleOpenSummary = () => {
    setIsSummaryOpen(true);
    if (!summary) {
      generateSummary(post.title, post.content);
    }
  };

  const handleCloseSummary = () => {
    setIsSummaryOpen(false);
  };

  const displayDate = post.published_date
    ? new Date(post.published_date).toLocaleDateString()
    : 'Unknown date';

  return (
    <CardContent className="p-4 pt-0 h-full flex flex-col justify-between">
      {/* Title Section */}
      <div>
        <Link
          to={`/ai-news/${post.id}`}
          className="hover:text-primary transition-colors"
        >
          <h2
            className={`font-bold text-base sm:text-lg mb-2 ${
              truncateTitle ? 'line-clamp-2' : ''
            }`}
          >
            {post.title}
          </h2>
        </Link>

        {/* Content Section */}
        {!hideContent && post.content && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {post.content}
          </p>
        )}
      </div>

      {/* Footer Section */}
      {!hideMetadata && (
        <div className="mt-auto">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-0 h-5 bg-muted/50"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Metadata and Sources */}
          <div className="flex flex-wrap justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {post.published_date && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {displayDate}
                </span>
              )}
              {post.read_time && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.read_time} min read
                </span>
              )}
            </div>

            <div className="flex gap-3 ml-auto">
              {/* AI Summary Button - New addition */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs" 
                onClick={handleOpenSummary}
              >
                <FileText size={14} className="mr-1" />
                AI Summary
              </Button>

              {post.source_url && (
                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <ExternalLink size={12} />
                  {extractDomain(post.source_url)}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Summary Popup */}
      <AISummaryPopup
        isOpen={isSummaryOpen}
        onClose={handleCloseSummary}
        title={post.title}
        content={post.content}
        isLoading={isLoading}
        summary={summary}
        onGenerate={() => generateSummary(post.title, post.content)}
      />
    </CardContent>
  );
};

export default NewsCardContent;
