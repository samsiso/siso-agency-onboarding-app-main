
import React, { useState } from 'react';
import { AIAnalysis } from '@/types/blog';
import { Brain, TrendingUp, Briefcase, Share2, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AIAnalysisDialog } from '../../AIAnalysisDialog';
import { cn } from '@/lib/utils';

// [Analysis] This component renders a summary of the AI analysis
interface AIAnalysisProps {
  analysis: AIAnalysis | undefined | null;
  articleTitle: string;
  articleId: string;
  onRefresh?: () => Promise<void>;
}

export const AIAnalysis = ({ 
  analysis, 
  articleTitle,
  articleId,
  onRefresh 
}: AIAnalysisProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Check if we have analysis data
  const hasAnalysis = analysis && Object.keys(analysis).length > 0;
  
  // Get confidence score as a number between 0-100
  let confidenceScore = 0;
  if (analysis && 'confidence_score' in analysis) {
    // Handle both percentage and decimal formats
    confidenceScore = typeof analysis.confidence_score === 'number' 
      ? (analysis.confidence_score <= 1 ? analysis.confidence_score * 100 : analysis.confidence_score)
      : 0;
  }
  
  // Handle refresh button click
  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
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
  
  if (!hasAnalysis) {
    return (
      <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-blue-400" />
          <h3 className="font-medium">AI Analysis</h3>
        </div>
        <p className="text-sm text-gray-400 mb-3">No analysis available yet.</p>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Generate Analysis
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-400" />
          <h3 className="font-medium">AI Analysis</h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetails}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30"
        >
          View Details
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Key Points */}
        {analysis.key_points && analysis.key_points.length > 0 && (
          <div>
            <h4 className="text-xs text-gray-400 mb-2">Key Points</h4>
            <ul className="space-y-1">
              {analysis.key_points.slice(0, 2).map((point, index) => (
                <li key={index} className="text-sm flex items-start gap-1">
                  <span className="text-blue-400">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Market Impact */}
        {analysis.market_impact && (
          <div>
            <h4 className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Market Impact
            </h4>
            <p className="text-sm line-clamp-2">{analysis.market_impact}</p>
          </div>
        )}
        
        {/* Business Implications */}
        {analysis.business_implications && (
          <div>
            <h4 className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <Briefcase className="h-3 w-3" /> Business
            </h4>
            <p className="text-sm line-clamp-2">{analysis.business_implications}</p>
          </div>
        )}
        
        {/* Confidence Score */}
        {confidenceScore > 0 && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Confidence</span>
              <span>{Math.round(confidenceScore)}%</span>
            </div>
            <Progress 
              value={confidenceScore} 
              className="h-1.5" 
              indicatorClassName={confidenceScore > 70 ? "bg-green-500" : confidenceScore > 40 ? "bg-amber-500" : "bg-red-500"}
            />
          </div>
        )}
        
        {/* Agency Relevance Score */}
        {analysis.agency_relevance_score && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Agency Relevance</span>
              <span>{analysis.agency_relevance_score}%</span>
            </div>
            <Progress 
              value={analysis.agency_relevance_score} 
              className="h-1.5" 
              indicatorClassName={analysis.agency_relevance_score > 70 ? "bg-green-500" : analysis.agency_relevance_score > 40 ? "bg-amber-500" : "bg-red-500"}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("h-3 w-3 mr-1", isRefreshing && "animate-spin")} />
          Update
        </Button>
        
        <Button
          variant="outline"
          size="sm"
        >
          <Share2 className="h-3 w-3 mr-1" />
          Share
        </Button>
      </div>
      
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
