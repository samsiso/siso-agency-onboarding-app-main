
import React from 'react';
import type { AIAnalysis as AIAnalysisType } from '@/types/blog';
import { AnalysisKeyPoints } from './AnalysisKeyPoints';
import { AnalysisImpact } from './AnalysisImpact';
import { AnalysisScore } from './AnalysisScores';
import { AnalysisActions } from './AnalysisActions';

// [Analysis] This component renders all the analysis content sections
interface AIAnalysisContentProps {
  analysis: AIAnalysisType;
  onRefresh?: () => Promise<void>;
  isRefreshing: boolean;
}

export const AIAnalysisContent = ({ 
  analysis,
  onRefresh,
  isRefreshing
}: AIAnalysisContentProps) => {
  // Get confidence score value
  let confidenceScore = 0;
  if (analysis && 'confidence_score' in analysis) {
    confidenceScore = typeof analysis.confidence_score === 'number' 
      ? (analysis.confidence_score <= 1 ? analysis.confidence_score * 100 : analysis.confidence_score)
      : 0;
  }
  
  return (
    <>
      <div className="space-y-4">
        {/* Key Points */}
        <AnalysisKeyPoints keyPoints={analysis.key_points || []} />
        
        {/* Market Impact */}
        <AnalysisImpact 
          content={analysis.market_impact || ''} 
          type="market"
        />
        
        {/* Business Implications */}
        <AnalysisImpact 
          content={analysis.business_implications || ''} 
          type="business" 
        />
        
        {/* Confidence Score */}
        {confidenceScore > 0 && (
          <AnalysisScore 
            value={confidenceScore} 
            label="Confidence" 
          />
        )}
        
        {/* Agency Relevance Score */}
        {analysis.agency_relevance_score && (
          <AnalysisScore 
            value={analysis.agency_relevance_score} 
            label="Agency Relevance" 
          />
        )}
      </div>
      
      {/* Actions */}
      <AnalysisActions 
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
    </>
  );
};
