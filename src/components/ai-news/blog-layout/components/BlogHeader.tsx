
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Clock, Eye, MessageCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedNewsItem } from '@/types/blog';
import { cn } from '@/lib/utils';
import { complexityColors } from '../constants';

// [Analysis] This component handles the blog header with title, metadata, and navigation
interface BlogHeaderProps {
  article: EnhancedNewsItem;
  handleExternalLink: () => void;
}

export const BlogHeader = ({ article, handleExternalLink }: BlogHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mb-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/ai-news')}
        className="group"
      >
        <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to News
      </Button>

      {article.url && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleExternalLink}
            className="gap-2 text-blue-500 border-blue-500/30 hover:bg-blue-500/10"
          >
            <ExternalLink className="h-4 w-4" />
            View Original Source
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={cn(
            complexityColors[article.technical_complexity]
          )}>
            {article.technical_complexity}
          </Badge>
          <Badge variant="outline" 
            className="bg-blue-500/10 text-blue-500 border-none">
            {article.category.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" 
            className="bg-siso-orange/10 text-siso-orange border-none">
            {article.impact} Impact
          </Badge>
        </div>

        <h1 className="text-4xl font-bold text-white bg-clip-text">
          {article.title}
        </h1>

        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400">
          <span>{new Date(article.date).toLocaleDateString()}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {article.estimated_reading_time} min read
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {article.views} views
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {article.comments ? (Array.isArray(article.comments) ? article.comments.length : 0) : 0} comments
          </span>
        </div>
      </div>
    </div>
  );
};
