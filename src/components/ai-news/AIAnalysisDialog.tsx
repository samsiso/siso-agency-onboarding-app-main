
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
  
  // [Analysis] Fetch fresh analysis data when dialog opens
  useEffect(() => {
    if (isOpen && articleId && !analysis) {
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
            } else {
              console.log('No AI analysis found for this article');
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
  }, [isOpen, articleId, analysis]);
  
  // [Analysis] Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setAnalysis(initialAnalysis);
      setIsLoading(initialLoading);
    }
  }, [isOpen, initialAnalysis, initialLoading]);
  
  // [Analysis] Handle manual refresh of analysis
  const handleRefreshAnalysis = async () => {
    try {
      setIsLoading(true);
      toast.info('Refreshing analysis...');
      
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
      
      // Fetch the updated analysis with explicit column selection and type checking
      const { data, error } = await supabase
        .from('ai_news')
        .select('id, ai_analysis')
        .eq('id', articleId)
        .single();
        
      if (error) {
        console.error('Error fetching updated analysis:', error);
        throw error;
      }
      
      if (data) {
        // Type-safe check for ai_analysis
        if ('ai_analysis' in data && data.ai_analysis) {
          setAnalysis(data.ai_analysis);
          toast.success('Analysis refreshed successfully');
        } else {
          toast.error('No analysis data was returned');
        }
      }
    } catch (error) {
      console.error('Error refreshing analysis:', error);
      toast.error('Failed to refresh analysis');
    } finally {
      setIsLoading(false);
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
