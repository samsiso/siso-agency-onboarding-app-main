
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Lightbulb, TrendingUp, BarChart2, Zap, AlertTriangle } from 'lucide-react';
import { type DailySummaryData } from '@/hooks/useAiDailySummary';
import { formatPercentage } from '@/lib/formatters';

interface SummaryContentProps {
  loading: boolean;
  summaryData: DailySummaryData | null;
  activeTab: string;
  setActiveTab?: (value: string) => void; // Made optional
}

// [Analysis] Enhanced content component with tabs and visualizations
export function SummaryContent({ 
  loading, 
  summaryData, 
  activeTab,
  setActiveTab 
}: SummaryContentProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }
  
  if (!summaryData) {
    return null;
  }
  
  // Helper function to determine sentiment color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      case 'neutral': return 'text-blue-400';
      default: return 'text-purple-400';
    }
  };
  
  // Helper function to get impact badge color
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-red-900/40 text-red-300';
      case 'medium': return 'bg-yellow-900/40 text-yellow-300';
      case 'low': return 'bg-green-900/40 text-green-300';
      default: return 'bg-blue-900/40 text-blue-300';
    }
  };
  
  // Helper function to render trend direction indicator
  // Modified to accept string but ensure it's treated as the expected union type
  const renderTrendIndicator = (direction: string) => {
    // Normalize the direction to ensure it's one of our expected values
    const normalizedDirection = direction.toLowerCase();
    
    switch (normalizedDirection) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-400 transform rotate-180" />;
      default:
        // Default to stable for any other value
        return <BarChart2 className="h-4 w-4 text-blue-400" />;
    }
  };

  const handleTabChange = (value: string) => {
    if (setActiveTab) {
      setActiveTab(value);
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="bg-purple-900/30 border-purple-500/30">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="key-points">Key Points</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="impacts">Industry Impacts</TabsTrigger>
        <TabsTrigger value="technologies">Technologies</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary" className="mt-4">
        <div className="space-y-4">
          {/* Main summary text */}
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {summaryData.summary}
          </p>
          
          {/* Sentiment and confidence indicators */}
          <div className="flex flex-wrap gap-2 mt-3">
            {summaryData.sentiment && (
              <Badge variant="outline" className={`${getSentimentColor(summaryData.sentiment)} bg-slate-900/40`}>
                {summaryData.sentiment.charAt(0).toUpperCase() + summaryData.sentiment.slice(1)} Sentiment
              </Badge>
            )}
            
            {summaryData.confidence_score && (
              <Badge variant="outline" className="bg-purple-900/30">
                {formatPercentage(summaryData.confidence_score)} Confidence
              </Badge>
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="key-points" className="mt-4">
        <div className="space-y-4">
          {/* Group key points by category if available */}
          {summaryData.categorized_key_points ? (
            Object.entries(summaryData.categorized_key_points).map(([category, points], idx) => (
              <div key={idx} className="mb-3">
                <h4 className="text-sm font-medium text-purple-300 mb-2 capitalize">
                  {category.replace(/_/g, ' ')}
                </h4>
                <div className="space-y-2">
                  {Array.isArray(points) && points.map((point, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <Badge className="mt-0.5 bg-purple-800">{index + 1}</Badge>
                      <p className="text-sm flex-1">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Default non-categorized view
            summaryData.key_points?.map((point, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Badge className="mt-0.5 bg-purple-800">{index + 1}</Badge>
                <p className="text-sm flex-1">{point}</p>
              </div>
            ))
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="applications" className="mt-4">
        <div className="space-y-3">
          {summaryData.practical_applications?.map((application, index) => (
            <div key={index} className="flex gap-3 items-start border-l-2 border-purple-600 pl-3 py-1">
              <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p>{application}</p>
                {summaryData.application_details?.[index] && (
                  <p className="text-xs text-muted-foreground mt-1">{summaryData.application_details[index]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="impacts" className="mt-4">
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {summaryData.industry_impacts && Object.entries(summaryData.industry_impacts).map(([industry, impact], index) => (
              <div key={index} className="bg-purple-950/30 rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-purple-300 capitalize">
                    {industry.replace(/_/g, ' ')}
                  </h4>
                  
                  {/* Impact severity badge */}
                  {summaryData.impact_severity?.[industry] && (
                    <Badge variant="outline" className={getImpactColor(summaryData.impact_severity[industry])}>
                      {summaryData.impact_severity[industry].toUpperCase()} IMPACT
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-300">{impact}</p>
                
                {/* Trend direction if available */}
                {summaryData.impact_trends?.[industry] && (
                  <div className="flex items-center gap-1 mt-2">
                    {renderTrendIndicator(summaryData.impact_trends[industry])}
                    <span className="text-xs text-muted-foreground">
                      {summaryData.impact_trends[industry].toLowerCase() === 'up' 
                        ? 'Increasing Trend' 
                        : summaryData.impact_trends[industry].toLowerCase() === 'down' 
                          ? 'Decreasing Trend' 
                          : 'Stable Trend'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="technologies" className="mt-4">
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {summaryData.key_technologies ? (
              summaryData.key_technologies.map((tech, index) => (
                <div key={index} className="bg-purple-950/30 rounded-md p-3">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-medium text-purple-300">{tech.name}</h4>
                    {tech.maturity && (
                      <Badge variant="outline" className="bg-blue-900/20 text-blue-300">
                        {tech.maturity}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-300">{tech.description}</p>
                  {tech.adoption_rate && (
                    <div className="mt-2 flex items-center gap-2">
                      <Zap className="h-3 w-3 text-yellow-400" />
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" 
                          style={{ width: `${tech.adoption_rate}%` }}
                        />
                      </div>
                      <span className="text-xs">{tech.adoption_rate}%</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Technology details not available for this summary</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}

