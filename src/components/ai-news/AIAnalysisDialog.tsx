
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Brain, Share2, Bookmark, RefreshCw, Download } from 'lucide-react';
import { useBlogPostActions } from '@/hooks/useBlogPostActions';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisTabs } from './analysis/AnalysisTabs';
import { AnalysisLoading } from './analysis/AnalysisLoading';
import { AnalysisEmptyState } from './analysis/AnalysisEmptyState';
import { AnalysisActions } from './analysis/AnalysisActions';

// [Analysis] Improved dialog component with enhanced agency-focused analysis 
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
      
      toast.info('Analyzing article for agency insights...', {
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
        toast.success('Agency-focused analysis completed', {
          description: 'Insights for impacting your agency business are ready',
          duration: 3000,
        });
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

  // [Analysis] Handle exporting the analysis as PDF or JSON
  const handleExportAnalysis = (format: 'json' | 'pdf') => {
    if (!analysis) return;
    
    if (format === 'json') {
      // Generate a JSON file
      const dataStr = JSON.stringify(analysis, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${articleTitle.replace(/\s+/g, '-').toLowerCase()}-analysis.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Analysis exported as JSON', {
        description: 'The file has been downloaded to your device',
      });
    } else {
      // For PDF we'd need a PDF generation library
      // This is a placeholder - in a real implementation you'd use a library like jsPDF
      toast.info('PDF export coming soon', {
        description: 'This feature is under development',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-950 border-gray-800 text-white overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            AI Analysis for Agencies: {articleTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Detailed AI-powered analysis with strategic insights, market opportunities, and implementation guidance for agency owners
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center border-t border-b border-gray-800 py-2 px-1 my-2">
          <AnalysisActions 
            isLoading={isLoading}
            onRefresh={handleRefreshAnalysis}
            onShare={() => handleShare(articleTitle, articleDescription)}
            onBookmark={() => handleBookmark(articleId)}
          />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportAnalysis('json')}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 px-2 py-1 rounded"
              title="Export as JSON"
            >
              <Download className="h-3 w-3" />
              JSON
            </button>
            <button
              onClick={() => handleExportAnalysis('pdf')}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 px-2 py-1 rounded"
              title="Export as PDF"
              disabled
            >
              <Download className="h-3 w-3" />
              PDF
            </button>
          </div>
        </div>

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
