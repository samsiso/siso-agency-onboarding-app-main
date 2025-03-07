
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Bookmark, Download, Brain, Loader2 } from 'lucide-react';
import { useBlogPostActions } from '@/hooks/useBlogPostActions';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
          // [Framework] Using explicit column selection to avoid type errors
          const { data, error } = await supabase
            .from('ai_news')
            .select('id, ai_analysis, has_ai_analysis')
            .eq('id', articleId)
            .single();
            
          if (error) throw error;
          
          if (data && data.ai_analysis) {
            setAnalysis(data.ai_analysis);
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
      
      // Fetch the updated analysis with explicit column selection
      const { data, error } = await supabase
        .from('ai_news')
        .select('id, ai_analysis')
        .eq('id', articleId)
        .single();
        
      if (error) throw error;
      
      if (data && data.ai_analysis) {
        setAnalysis(data.ai_analysis);
        toast.success('Analysis refreshed successfully');
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

        <div className="flex justify-between items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshAnalysis}
            disabled={isLoading}
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
                Refresh Analysis
              </>
            )}
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => handleShare(articleTitle, articleDescription)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => handleBookmark(articleId)}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmark
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Analyzing article content...</p>
            <p className="text-xs text-gray-500 mt-2">This may take up to 30 seconds</p>
          </div>
        ) : analysis ? (
          <Tabs defaultValue="market" className="w-full">
            <TabsList className="grid grid-cols-4 bg-gray-900/50 border border-gray-800 rounded-md p-1">
              <TabsTrigger value="market" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                Market Impact
              </TabsTrigger>
              <TabsTrigger value="technical" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                Technical
              </TabsTrigger>
              <TabsTrigger value="related" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                Related Tech
              </TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                Business
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="market" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
              <h3 className="text-lg font-medium mb-2 text-blue-300">Market Impact Analysis</h3>
              <p className="text-gray-300">{analysis?.market_impact || "No market impact analysis available"}</p>
            </TabsContent>
            
            <TabsContent value="technical" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
              <h3 className="text-lg font-medium mb-2 text-blue-300">Technical Predictions</h3>
              {analysis?.technical_predictions && analysis.technical_predictions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  {analysis.technical_predictions.map((prediction: string, index: number) => (
                    <li key={index}>{prediction}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">No technical predictions available</p>
              )}
            </TabsContent>
            
            <TabsContent value="related" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
              <h3 className="text-lg font-medium mb-2 text-blue-300">Related Technologies</h3>
              {analysis?.related_technologies && analysis.related_technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.related_technologies.map((tech: string, index: number) => (
                    <span key={index} className="bg-gray-800 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No related technologies identified</p>
              )}
            </TabsContent>
            
            <TabsContent value="business" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
              <h3 className="text-lg font-medium mb-2 text-blue-300">Business Implications for AI Agencies</h3>
              <p className="text-gray-300">{analysis?.business_implications || "No business implications analysis available"}</p>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-6 text-center text-gray-400 bg-gray-900/30 rounded-md">
            <Brain className="h-10 w-10 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">No Analysis Available</h3>
            <p>This article hasn't been analyzed by our AI system yet.</p>
            <Button 
              onClick={handleRefreshAnalysis} 
              variant="outline" 
              className="mt-4 border-blue-800 text-blue-300 hover:bg-blue-900/30"
            >
              Generate Analysis Now
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
