
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Brain } from 'lucide-react';
import { useBlogPostActions } from '@/hooks/useBlogPostActions';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisTabs } from './analysis/AnalysisTabs';
import { AnalysisLoading } from './analysis/AnalysisLoading';
import { AnalysisEmptyState } from './analysis/AnalysisEmptyState';
import { AnalysisActions } from './analysis/AnalysisActions';

// [Analysis] Improved dialog component with better separation of concerns
export interface AIAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: any;
  isLoading: boolean;
  articleTitle?: string;
  articleDescription?: string;
  articleId: string;
}

export const AIAnalysisDialog: React.FC<AIAnalysisDialogProps> = ({
  isOpen,
  onClose,
  analysis: initialAnalysis,
  isLoading: initialLoading,
  articleTitle = "Article",
  articleDescription = "",
  articleId
}) => {
  const { handleShare, handleBookmark } = useBlogPostActions();
  const [analysis, setAnalysis] = useState(initialAnalysis);
  const [isLoading, setIsLoading] = useState(initialLoading);
  
  // [Framework] Prevent page refresh by using local state management 
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // [Analysis] Add a flag to prevent redundant API calls
  const [isAnalysisRequested, setIsAnalysisRequested] = useState(false);
  
  // [Analysis] Cache analyzed articles to make them load instantly for repeat views
  const [cachedAnalyses, setCachedAnalyses] = useState<Record<string, any>>({});
  
  // [Analysis] Fetch fresh analysis data when dialog opens or when explicitly refreshed
  useEffect(() => {
    if (isOpen && articleId) {
      // Check for cached result first
      if (cachedAnalyses[articleId]) {
        console.log("Using cached analysis");
        setAnalysis(cachedAnalyses[articleId]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      const fetchAnalysis = async () => {
        try {
          // [Framework] Using explicit column selection to avoid type errors and ensure ai_analysis is retrieved
          const { data, error } = await supabase
            .from('ai_news')
            .select('id, ai_analysis, has_ai_analysis')
            .eq('id', articleId)
            .single();
            
          if (error) {
            console.error('Error fetching analysis:', error);
            throw error;
          }
          
          if (data) {
            // Check if ai_analysis exists safely
            if ('ai_analysis' in data && data.ai_analysis) {
              setAnalysis(data.ai_analysis);
              // Cache the result for future use
              setCachedAnalyses(prev => ({
                ...prev,
                [articleId]: data.ai_analysis
              }));
            } else {
              console.log('No AI analysis found for this article');
              setAnalysis(null);
            }
          }
        } catch (error) {
          console.error('Error fetching analysis:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAnalysis();
    }
  }, [isOpen, articleId, refreshCounter, cachedAnalyses]); 
  
  // [Analysis] Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsAnalysisRequested(false);
    }
  }, [isOpen]);
  
  // [Analysis] Handle manual refresh of analysis with optimized performance
  const handleRefreshAnalysis = async () => {
    if (isLoading || isAnalysisRequested) return;
    
    try {
      setIsLoading(true);
      setIsAnalysisRequested(true);
      
      toast.info('Analyzing article...', {
        description: 'This might take a few seconds',
        duration: 3000,
      });
      
      const response = await supabase.functions.invoke('analyze-article', {
        body: { 
          articleId,
          title: articleTitle,
          content: articleDescription || "",
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Check if we received a cached result
      if (response.data.cached) {
        toast.success('Analysis loaded from cache', {
          duration: 2000,
        });
      } else {
        toast.success('Analysis completed');
      }
      
      // Update cache and state with the new analysis
      setCachedAnalyses(prev => ({
        ...prev,
        [articleId]: response.data.analysis
      }));
      
      setAnalysis(response.data.analysis);
      
      // Use refresh counter to trigger state update just once
      setRefreshCounter(prev => prev + 1);
    } catch (error) {
      console.error('Error initiating analysis refresh:', error);
      toast.error('Failed to refresh analysis');
    } finally {
      setIsLoading(false);
      setIsAnalysisRequested(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gray-950 border-gray-800 text-white overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            AI Analysis: {articleTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Detailed AI-powered analysis of this article and its implications for AI agencies
          </DialogDescription>
        </DialogHeader>

        <AnalysisActions 
          isLoading={isLoading}
          onRefresh={handleRefreshAnalysis}
          onShare={() => handleShare(articleTitle, articleDescription)}
          onBookmark={() => handleBookmark(articleId)}
        />

        {isLoading ? (
          <AnalysisLoading />
        ) : analysis ? (
          <AnalysisTabs analysis={analysis} />
        ) : (
          <AnalysisEmptyState onRefresh={handleRefreshAnalysis} />
        )}
      </DialogContent>
    </Dialog>
  );
};
