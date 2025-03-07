
import React, { useState, useEffect } from 'react';
import { EnhancedNewsItem } from '@/types/blog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles } from 'lucide-react';

// [Analysis] This component renders a button to generate AI analysis
interface AIAnalysisButtonProps {
  article: EnhancedNewsItem;
  onAnalyze: () => void;
  isGenerating: boolean;
}

export const AIAnalysisButton = ({ 
  article, 
  onAnalyze, 
  isGenerating 
}: AIAnalysisButtonProps) => {
  // [Analysis] Check if analysis exists to prevent showing this button unnecessarily
  const [showButton, setShowButton] = useState(true);
  
  useEffect(() => {
    // Check if analysis exists and has meaningful data
    const hasAnalysis = article.ai_analysis && 
      Object.keys(article.ai_analysis).length > 0 &&
      // Check for at least one key property that should have data
      (article.ai_analysis.key_points?.length > 0 || 
       article.ai_analysis.market_impact || 
       article.ai_analysis.business_implications);
       
    setShowButton(!hasAnalysis);
  }, [article]);
  
  // Don't render if we shouldn't show the button
  if (!showButton) return null;
  
  return (
    <Card className="bg-white/5 p-6 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-500/20 p-2 rounded-full">
          <Brain className="h-5 w-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
      </div>
      
      <p className="text-sm text-gray-300 mb-4">
        Generate an in-depth AI analysis of this article to uncover business opportunities, market impacts, and implementation strategies.
      </p>
      
      <Button 
        onClick={onAnalyze}
        disabled={isGenerating}
        className="w-full gap-2"
      >
        <Sparkles className="h-4 w-4" />
        {isGenerating ? 'Generating Analysis...' : 'Generate AI Analysis'}
      </Button>
    </Card>
  );
};
