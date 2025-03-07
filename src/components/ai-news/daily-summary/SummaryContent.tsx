
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Lightbulb, 
  TrendingUp, 
  BarChart2, 
  Zap, 
  AlertTriangle,
  Brain,
  Calendar,
  FileText,
  Sparkles,
  Check,
  ChevronRight
} from 'lucide-react';
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
  // [Analysis] Loading state with improved visual feedback
  if (loading) {
    return (
      <Card className="w-full bg-purple-950/20 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-12 w-12 text-purple-500" />
            </motion.div>
            <p className="text-purple-300 animate-pulse">Generating AI insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!summaryData) {
    return (
      <Card className="w-full bg-purple-950/20 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Brain className="h-16 w-16 text-purple-400/50" />
            <h3 className="text-xl font-medium text-purple-300">No AI Summary Available</h3>
            <p className="text-sm text-purple-300/70 text-center max-w-md">
              AI hasn't generated a summary for today's news yet. Check back later for insights.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // [Analysis] Helper function to determine sentiment color with improved palette
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-400 bg-green-950/30 border-green-600/30';
      case 'negative': return 'text-red-400 bg-red-950/30 border-red-600/30';
      case 'neutral': return 'text-blue-400 bg-blue-950/30 border-blue-600/30';
      case 'mixed': return 'text-yellow-400 bg-yellow-950/30 border-yellow-600/30';
      default: return 'text-purple-400 bg-purple-950/30 border-purple-600/30';
    }
  };
  
  // Helper function to get impact badge color with improved visual hierarchy
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-red-900/40 text-red-300 border-red-700/50';
      case 'medium': return 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50';
      case 'low': return 'bg-green-900/40 text-green-300 border-green-700/50';
      default: return 'bg-blue-900/40 text-blue-300 border-blue-700/50';
    }
  };
  
  // [Analysis] Helper function to render trend direction indicator with enhanced visuals
  const renderTrendIndicator = (direction: string) => {
    // Normalize the direction to ensure it's one of our expected values
    const normalizedDirection = direction.toLowerCase();
    
    switch (normalizedDirection) {
      case 'up':
        return (
          <div className="flex items-center gap-1.5 text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Increasing</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center gap-1.5 text-red-400">
            <TrendingUp className="h-4 w-4 transform rotate-180" />
            <span className="text-xs font-medium">Decreasing</span>
          </div>
        );
      default:
        // Default to stable for any other value
        return (
          <div className="flex items-center gap-1.5 text-blue-400">
            <BarChart2 className="h-4 w-4" />
            <span className="text-xs font-medium">Stable</span>
          </div>
        );
    }
  };

  const handleTabChange = (value: string) => {
    if (setActiveTab) {
      setActiveTab(value);
    }
  };
  
  // [Framework] Enhanced card-based layout for the summary
  return (
    <Card className="w-full bg-gradient-to-br from-purple-950/30 to-blue-950/20 border-purple-500/30 overflow-hidden shadow-lg shadow-purple-900/10">
      <div className="flex items-center space-x-2 px-4 py-3 bg-purple-900/30 border-b border-purple-700/30">
        <Brain className="h-5 w-5 text-purple-300" />
        <h3 className="text-lg font-medium text-purple-100">AI News Insights</h3>
        <div className="ml-auto flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-800/30 text-purple-200 border-purple-600/30">
            <Calendar className="h-3 w-3 mr-1" />
            {summaryData.date || 'Today'}
          </Badge>
          <Badge variant="outline" className="bg-blue-800/30 text-blue-200 border-blue-600/30">
            <FileText className="h-3 w-3 mr-1" />
            {summaryData.article_count || '?'} Articles
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full rounded-none bg-purple-900/20 border-b border-purple-700/30 p-0">
            <TabsTrigger 
              value="summary" 
              className="rounded-none flex-1 py-3 data-[state=active]:bg-purple-800/30 data-[state=active]:text-purple-100"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger 
              value="key-points" 
              className="rounded-none flex-1 py-3 data-[state=active]:bg-purple-800/30 data-[state=active]:text-purple-100"
            >
              <Check className="h-4 w-4 mr-2" />
              Key Points
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="rounded-none flex-1 py-3 data-[state=active]:bg-purple-800/30 data-[state=active]:text-purple-100"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger 
              value="impacts" 
              className="rounded-none flex-1 py-3 data-[state=active]:bg-purple-800/30 data-[state=active]:text-purple-100"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Industry Impact
            </TabsTrigger>
            <TabsTrigger 
              value="technologies" 
              className="rounded-none flex-1 py-3 data-[state=active]:bg-purple-800/30 data-[state=active]:text-purple-100"
            >
              <Zap className="h-4 w-4 mr-2" />
              Technologies
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="p-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-4">
              {/* Main summary with improved typography */}
              <div className="relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-blue-500 rounded-full"></div>
                <div className="pl-4">
                  <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-line">
                    {summaryData.summary}
                  </p>
                </div>
              </div>
              
              {/* Sentiment and confidence indicators with enhanced visuals */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-purple-800/30">
                {summaryData.sentiment && (
                  <Badge variant="outline" className={`${getSentimentColor(summaryData.sentiment)} px-3 py-1.5`}>
                    <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                    {summaryData.sentiment.charAt(0).toUpperCase() + summaryData.sentiment.slice(1)} Sentiment
                  </Badge>
                )}
                
                {summaryData.confidence_score && (
                  <Badge variant="outline" className="bg-purple-900/30 border-purple-600/30 text-purple-300 px-3 py-1.5">
                    <div className="w-full bg-purple-800/50 rounded-full h-1 mr-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-blue-400 h-1 rounded-full" 
                        style={{ width: `${summaryData.confidence_score}%` }}
                      />
                    </div>
                    {formatPercentage(summaryData.confidence_score)} Confidence
                  </Badge>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="key-points" className="p-0 focus-visible:outline-none focus-visible:ring-0">
            <ScrollArea className="h-[300px]">
              <div className="p-6 space-y-5">
                {/* Group key points by category with improved visuals */}
                {summaryData.categorized_key_points ? (
                  Object.entries(summaryData.categorized_key_points).map(([category, points], idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="mb-5"
                    >
                      <h4 className="text-sm font-semibold mb-3 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                        <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent uppercase tracking-wider">
                          {category.replace(/_/g, ' ')}
                        </span>
                      </h4>
                      <div className="space-y-3 pl-4">
                        {Array.isArray(points) && points.map((point, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: (idx * 0.1) + (index * 0.05) }}
                            className="flex gap-3 items-start group"
                          >
                            <div className="bg-purple-900/50 text-purple-300 text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-purple-700/70 transition-colors">
                              {index + 1}
                            </div>
                            <p className="text-sm text-gray-300 flex-1 group-hover:text-gray-100 transition-colors">{point}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // Default non-categorized view with improved visuals
                  <div className="space-y-3">
                    {summaryData.key_points?.map((point, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex gap-3 items-start group"
                      >
                        <div className="bg-purple-900/50 text-purple-300 text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-purple-700/70 transition-colors">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-300 flex-1 group-hover:text-gray-100 transition-colors">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="applications" className="p-0 focus-visible:outline-none focus-visible:ring-0">
            <ScrollArea className="h-[300px]">
              <div className="p-6 space-y-4">
                {summaryData.practical_applications?.map((application, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/20 rounded-lg p-4 hover:from-purple-900/60 hover:to-indigo-900/40 transition-all duration-300 border border-purple-700/30 hover:border-purple-600/50">
                      <div className="flex gap-3 items-start">
                        <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-400">
                          <Lightbulb className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-100 group-hover:text-white transition-colors">
                            {application}
                          </h4>
                          {summaryData.application_details?.[index] && (
                            <motion.p 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="text-xs text-gray-400 mt-2 group-hover:text-gray-300 transition-colors"
                            >
                              {summaryData.application_details[index]}
                            </motion.p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="impacts" className="p-0 focus-visible:outline-none focus-visible:ring-0">
            <ScrollArea className="h-[300px]">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {summaryData.industry_impacts && Object.entries(summaryData.industry_impacts).map(([industry, impact], index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="h-full bg-gradient-to-br from-purple-950/40 to-indigo-950/20 rounded-lg p-4 hover:from-purple-950/60 hover:to-indigo-950/40 transition-all duration-300 border border-purple-700/30 hover:border-purple-600/50 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-purple-200 capitalize flex items-center">
                          <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                          {industry.replace(/_/g, ' ')}
                        </h4>
                        
                        {/* Impact severity badge with improved visuals */}
                        {summaryData.impact_severity?.[industry] && (
                          <Badge variant="outline" className={`${getImpactColor(summaryData.impact_severity[industry])} text-xs px-2`}>
                            {summaryData.impact_severity[industry].toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-300 mb-3 flex-1">{impact}</p>
                      
                      {/* Trend direction with improved visualization */}
                      {summaryData.impact_trends?.[industry] && (
                        <div className="mt-auto pt-2 border-t border-purple-800/30 flex justify-between items-center">
                          {renderTrendIndicator(summaryData.impact_trends[industry])}
                          
                          {/* Simple sparkline visualization */}
                          <div className="flex items-center h-4 gap-0.5">
                            {summaryData.impact_trends[industry].toLowerCase() === 'up' ? (
                              Array(5).fill(0).map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-1 bg-green-500/70 rounded-sm" 
                                  style={{ height: `${40 + i * 15}%` }}
                                ></div>
                              ))
                            ) : summaryData.impact_trends[industry].toLowerCase() === 'down' ? (
                              Array(5).fill(0).map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-1 bg-red-500/70 rounded-sm" 
                                  style={{ height: `${100 - i * 15}%` }}
                                ></div>
                              ))
                            ) : (
                              Array(5).fill(0).map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-1 bg-blue-500/70 rounded-sm" 
                                  style={{ height: `${60 + (i % 3) * 10}%` }}
                                ></div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="technologies" className="p-0 focus-visible:outline-none focus-visible:ring-0">
            <ScrollArea className="h-[300px]">
              <div className="p-6 space-y-4">
                {summaryData.key_technologies ? (
                  summaryData.key_technologies.map((tech, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/10 rounded-lg p-4 border border-blue-800/30 hover:border-blue-700/50 transition-all duration-300">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-blue-300 flex items-center">
                            <Zap className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                            {tech.name}
                          </h4>
                          {tech.maturity && (
                            <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-800/40 text-xs">
                              {tech.maturity}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-300 mb-2">{tech.description}</p>
                        
                        {tech.adoption_rate && (
                          <div className="mt-3">
                            <div className="flex justify-between items-center text-xs mb-1">
                              <span className="text-gray-400">Adoption Rate</span>
                              <span className="text-blue-300 font-medium">{tech.adoption_rate}%</span>
                            </div>
                            <div className="w-full bg-gray-800/70 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                                style={{ width: `${tech.adoption_rate}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <AlertTriangle className="h-10 w-10 text-yellow-400/70 mb-3" />
                    <p className="text-sm text-gray-400 max-w-md">
                      Technology details are not available for this summary yet.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
