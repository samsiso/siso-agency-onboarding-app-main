
import React, { useState, useEffect } from 'react';
// [Analysis] Use type-only import for AIAnalysis type to avoid naming conflicts
import type { AIAnalysis as AIAnalysisType } from '@/types/blog';
import { AIAnalysisDialog } from '../../AIAnalysisDialog';
import { AIAnalysisHeader } from './analysis/AIAnalysisHeader';
import { EmptyAnalysisState } from './analysis/EmptyAnalysisState';
import { AIAnalysisContent } from './analysis/AIAnalysisContent';

// [Analysis] This component renders a summary of the AI analysis
interface AIAnalysisComponentProps {
  analysis: AIAnalysisType | undefined | null;
  articleTitle: string;
  articleId: string;
  onRefresh?: () => Promise<void>;
}

export const AIAnalysis = ({ 
  analysis, 
  articleTitle,
  articleId,
  onRefresh 
}: AIAnalysisComponentProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasData, setHasData] = useState(false);
  
  // Check if we have meaningful analysis data
  useEffect(() => {
    const hasAnalysisData = !!analysis && 
      Object.keys(analysis).length > 0 &&
      // Check for at least one key property that should have data
      (analysis.key_points?.length > 0 || 
       analysis.market_impact || 
       analysis.business_implications);
       
    // [Analysis] Fix TypeScript error - ensuring we set boolean value
    setHasData(Boolean(hasAnalysisData));
    console.log('[AIAnalysis-Sidebar] Analysis exists:', hasAnalysisData, analysis);
  }, [analysis]);
  
  // Handle refresh button click
  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    console.log('Attempting to refresh AI Analysis...');
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle view details button click
  const handleViewDetails = () => {
    setIsDialogOpen(true);
  };
  
  // Render empty state if no data
  if (!hasData) {
    return (
      <EmptyAnalysisState 
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    );
  }
  
  return (
    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
      <AIAnalysisHeader onViewDetails={handleViewDetails} />
      
      <AIAnalysisContent 
        analysis={analysis as AIAnalysisType} 
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      {/* AI Analysis Dialog */}
      <AIAnalysisDialog
        analysis={analysis}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onRefreshAnalysis={onRefresh}
        articleTitle={articleTitle}
        articleId={articleId}
      />
    </div>
  );
};
