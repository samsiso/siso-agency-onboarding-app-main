
import React, { useState } from 'react';
import { EnhancedNewsItem, AIAnalysis } from '@/types/blog';
import { Brain, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIAnalysisDialog } from '../AIAnalysisDialog';
import { cn } from '@/lib/utils';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';

// [Analysis] This component renders the AI analysis section in the blog layout
interface AIAnalysisSectionProps {
  article: EnhancedNewsItem;
  onAnalyze?: () => Promise<void>;
}

export const AIAnalysisSection = ({ article, onAnalyze }: AIAnalysisSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const supabase = useSupabaseClient();
  
  // [Analysis] Check if analysis exists and has data
  const hasAnalysis = article.ai_analysis && Object.keys(article.ai_analysis).length > 0;
  
  // [Analysis] Function to generate analysis using Edge Function
  const handleGenerateAnalysis = async () => {
    if (!article.id) {
      toast.error('Article ID not found');
      return;
    }
    
    setIsGeneratingAnalysis(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-article', {
        body: { articleId: article.id }
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.success) {
        toast.success('Analysis generated successfully');
        
        // Refresh article data if callback is provided
        if (onAnalyze) {
          await onAnalyze();
        }
      } else {
        throw new Error(data?.message || 'Failed to generate analysis');
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error('Failed to generate analysis');
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };
  
  // [Analysis] Open the dialog when clicking on analysis
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  
  if (!hasAnalysis) {
    return null;
  }
  
  return (
    <div id="ai-analysis-section" className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/20 p-2 rounded-full">
            <Brain className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
        </div>
        
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateAnalysis}
            disabled={isGeneratingAnalysis}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isGeneratingAnalysis && "animate-spin")} />
            Refresh Analysis
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenDialog}
          >
            View Full Analysis
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Key Points */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Key Points</h4>
          <ul className="space-y-2">
            {(article.ai_analysis?.key_points || []).slice(0, 3).map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                  {index + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Market Impact */}
        {article.ai_analysis?.market_impact && (
          <div className="bg-card rounded-lg p-4 border border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Market Impact</h4>
            <p className="text-sm">{article.ai_analysis.market_impact}</p>
          </div>
        )}
        
        {/* Related Technologies */}
        {article.ai_analysis?.related_technologies && article.ai_analysis.related_technologies.length > 0 && (
          <div className="bg-card rounded-lg p-4 border border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Related Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {article.ai_analysis.related_technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* AI Analysis Dialog */}
      <AIAnalysisDialog
        article={article}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onRefreshAnalysis={handleGenerateAnalysis}
      />
    </div>
  );
};
