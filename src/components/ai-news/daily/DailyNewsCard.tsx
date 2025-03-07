import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Share2, Bookmark, MessageSquare, BarChart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { NewsItem } from '@/types/blog';
import { useBlogPostActions } from '@/hooks/useBlogPostActions';
import { AIAnalysisDialog } from '../AIAnalysisDialog';

interface DailyNewsCardProps {
  newsItem: NewsItem;
  onAnalyze?: (id: string) => Promise<void>;
  isCompact?: boolean;
}

export const DailyNewsCard = ({ 
  newsItem, 
  onAnalyze,
  isCompact = false 
}: DailyNewsCardProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const { handleShare, handleBookmark } = useBlogPostActions();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
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
      await onAnalyze(newsItem.id);
      // Open the analysis dialog after analysis is complete
      setShowAnalysisDialog(true);
    } catch (error) {
      console.error('Error analyzing article:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleExternalLink = () => {
    if (newsItem.url) {
      window.open(newsItem.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <Card className="overflow-hidden bg-gray-900/30 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="flex flex-col h-full">
        {/* Card Image */}
        <div className={isCompact ? 'h-20' : 'h-44 md:h-52'}>
          <div className="relative w-full h-full overflow-hidden">
            {newsItem.image_url ? (
              <img 
                src={newsItem.image_url} 
                alt={newsItem.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
                <span className="text-lg font-medium text-blue-300">{newsItem.source || 'AI News'}</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
            
            {newsItem.featured && (
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-blue-900/80 text-blue-200 border-blue-700">
                  Featured
                </Badge>
              </div>
            )}
            
            {newsItem.source && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  {newsItem.source_icon ? (
                    <img src={newsItem.source_icon} alt={newsItem.source} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-white">{newsItem.source.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-300">{newsItem.source}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Card Content */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex flex-col gap-2 h-full">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <h3 className={`font-semibold text-white ${isCompact ? 'line-clamp-2' : ''}`}>
                  {newsItem.title}
                </h3>
                
                <div className="flex flex-wrap gap-2 mt-1 items-center">
                  <span className="text-xs text-gray-400">
                    {formatDate(newsItem.date)}
                  </span>
                  
                  <span className="text-xs text-gray-400">•</span>
                  
                  <span className="text-xs text-gray-400">
                    {newsItem.reading_time || 5} min read
                  </span>
                  
                  {newsItem.ai_importance_score && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <Badge variant="outline" className="bg-blue-900/30 text-blue-400 text-xs border-blue-800">
                        {newsItem.ai_importance_score}% importance
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {!isCompact && newsItem.description && (
              <p className="text-sm text-gray-300 mt-1 line-clamp-3">
                {newsItem.description}
              </p>
            )}
            
            <div className="flex justify-between items-center mt-auto pt-3">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleBookmark(newsItem.id)}
                >
                  <Bookmark className="h-4 w-4 text-gray-400" />
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
                  onClick={() => handleShare(newsItem.title, newsItem.description)}
                >
                  <Share2 className="h-4 w-4 text-gray-400" />
                </Button>
                
                {newsItem.url && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={handleExternalLink}
                  >
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </Button>
                )}
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
        </div>
      </div>

      {/* Analysis Dialog */}
      <AIAnalysisDialog
        isOpen={showAnalysisDialog}
        onClose={() => setShowAnalysisDialog(false)}
        analysis={newsItem.ai_analysis}
        isLoading={isAnalyzing}
        articleTitle={newsItem.title}
        articleDescription={newsItem.description}
        articleId={newsItem.id}
      />
    </Card>
  );
};
