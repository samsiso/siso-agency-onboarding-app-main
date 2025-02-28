
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, CornerDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NewsItem } from '@/types/blog';
import { ArticleMetadata } from './ArticleMetadata';
import { useNavigate } from 'react-router-dom';

interface NewsDetailModalProps {
  article: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
  summary?: string;
  onGenerateSummary?: () => void;
  loadingSummary?: boolean;
}

// [Analysis] Modal component for showing quick article previews
export const NewsDetailModal = ({
  article,
  isOpen,
  onClose,
  summary,
  onGenerateSummary,
  loadingSummary = false
}: NewsDetailModalProps) => {
  const navigate = useNavigate();

  if (!article) return null;

  const handleViewFull = () => {
    navigate(`/ai-news/${article.id}`);
    onClose();
  };

  const handleOpenSource = () => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl pr-8">{article.title}</DialogTitle>
          <button 
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
          <DialogDescription>
            <ArticleMetadata
              date={article.date}
              source={article.source}
              impact={article.impact}
              views={article.views}
              bookmarks={article.bookmarks}
              readingTime={article.reading_time}
              sourceCredibility={article.source_credibility}
              technicalComplexity={article.technical_complexity}
              articleType={article.article_type}
              isCompact={false}
            />
          </DialogDescription>
        </DialogHeader>

        {article.image_url && (
          <div className="my-4 rounded-lg overflow-hidden">
            <img 
              src={article.image_url} 
              alt={article.title} 
              className="w-full h-52 object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          {summary ? (
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </div>
          ) : loadingSummary ? (
            <div className="bg-muted/30 p-4 rounded-lg animate-pulse">
              <h4 className="text-sm font-medium mb-2">Generating summary...</h4>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ) : onGenerateSummary ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGenerateSummary}
              className="w-full"
            >
              Generate Summary
            </Button>
          ) : null}

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="leading-relaxed">{article.description}</p>
            {article.content && article.content !== article.description && (
              <div 
                className="mt-4 leading-relaxed line-clamp-10"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}
          </div>

          {article.content && article.content.length > 300 && (
            <div className="relative py-6">
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex-1 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenSource}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Source
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              <CornerDownLeft className="h-4 w-4" />
              Close
            </Button>
          </div>
          
          <Button
            variant="default"
            onClick={handleViewFull}
            className="gap-2"
          >
            View Full Article
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
