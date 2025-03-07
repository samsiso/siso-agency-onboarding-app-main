
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EnhancedNewsItem, AIAnalysis } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, Download, FileText, TrendingUp, Briefcase, Target, Clock, DollarSign } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageLoading } from '@/components/ui/message-loading';

// [Analysis] This component presents AI analysis in a dialog with different sections
// [Plan] In the future, add export to PDF functionality

interface AIAnalysisDialogProps {
  // [Analysis] We're making the article prop optional to allow passing analysis directly
  article?: EnhancedNewsItem;
  // [Analysis] Added direct analysis prop for components that don't have the full article
  analysis?: AIAnalysis;
  isOpen: boolean;
  onClose: () => void;
  onRefreshAnalysis?: () => Promise<void>;
  // [Analysis] Added optional props to support components without article object
  articleTitle?: string;
  articleId?: string;
  // [Analysis] Added articleDescription to fix TypeScript errors in components using this dialog
  articleDescription?: string;
  isLoading?: boolean;
}

export const AIAnalysisDialog = ({ 
  article, 
  analysis: passedAnalysis,
  isOpen, 
  onClose,
  onRefreshAnalysis,
  articleTitle,
  articleId,
  articleDescription,
  isLoading = false
}: AIAnalysisDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // [Analysis] Get analysis either from article or direct prop
  const analysis = passedAnalysis || (article?.ai_analysis);
  const title = articleTitle || article?.title;
  const id = articleId || article?.id;
  
  const hasAnalysis = !!analysis && Object.keys(analysis).length > 0;
  const showLoadingState = isLoading || (!hasAnalysis && article?.has_ai_analysis);
  
  // [Analysis] Handle refresh button click
  const handleRefresh = async () => {
    if (!onRefreshAnalysis) return;
    
    setIsRefreshing(true);
    try {
      await onRefreshAnalysis();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // [Analysis] Handle export to JSON
  const handleExport = () => {
    if (!analysis) return;
    
    const analysisJson = JSON.stringify(analysis, null, 2);
    const blob = new Blob([analysisJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${id?.slice(0, 8) || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-blue-400" />
                </div>
                <DialogTitle className="text-xl font-semibold">AI Analysis</DialogTitle>
              </div>
              <DialogDescription className="text-sm max-w-lg">
                Enhanced AI analysis for agency owners based on "{title}"
              </DialogDescription>
            </div>
            
            <div className="flex gap-2">
              {onRefreshAnalysis && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                  Refresh
                </Button>
              )}
              
              {hasAnalysis && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        {showLoadingState ? (
          <div className="flex flex-col items-center justify-center p-12 h-full">
            <MessageLoading />
            <p className="text-lg font-medium mt-6">Generating Analysis</p>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a minute as we're analyzing the article in depth...
            </p>
          </div>
        ) : !hasAnalysis ? (
          <div className="flex flex-col items-center justify-center p-12 h-full">
            <p className="text-lg font-medium">No Analysis Available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Click the refresh button to generate an analysis for this article.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 h-full">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              <div className="border-b border-border px-6 overflow-x-auto">
                <TabsList className="bg-transparent h-14 w-auto justify-start">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="market" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none">
                    Market Impact
                  </TabsTrigger>
                  <TabsTrigger value="implementation" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none">
                    Implementation
                  </TabsTrigger>
                  <TabsTrigger value="business" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none">
                    Business
                  </TabsTrigger>
                  <TabsTrigger value="client-messaging" className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none">
                    Client Messaging
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <TabsContent value="overview" className="mt-0">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card rounded-lg p-4 border border-border">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Agency Relevance</h3>
                          <div className="flex flex-col gap-2">
                            <Progress
                              value={analysis?.agency_relevance_score || 0}
                              className="h-2 mb-1"
                              indicatorClassName={cn(
                                analysis?.agency_relevance_score && analysis.agency_relevance_score > 75 
                                  ? "bg-green-500" 
                                  : analysis?.agency_relevance_score && analysis.agency_relevance_score > 40
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              )}
                            />
                            <span className="text-xl font-bold">{analysis?.agency_relevance_score || 0}%</span>
                          </div>
                        </div>
                        
                        <div className="bg-card rounded-lg p-4 border border-border">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Market Opportunity</h3>
                          <div className="flex flex-col gap-2">
                            <Progress
                              value={analysis?.market_opportunity?.score || 0}
                              className="h-2 mb-1"
                              indicatorClassName={cn(
                                analysis?.market_opportunity?.score && analysis.market_opportunity.score > 75 
                                  ? "bg-green-500" 
                                  : analysis?.market_opportunity?.score && analysis.market_opportunity.score > 40
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              )}
                            />
                            <span className="text-xl font-bold">{analysis?.market_opportunity?.score || 0}%</span>
                          </div>
                        </div>
                        
                        <div className="bg-card rounded-lg p-4 border border-border">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Implementation Complexity</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">{analysis?.implementation_details?.technical_complexity || "Medium"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Key Points</h3>
                        <ul className="space-y-2">
                          {analysis?.key_points?.map((point, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                                {index + 1}
                              </span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Market Impact</h3>
                        <p className="text-sm">{analysis?.market_impact || "No market impact analysis available."}</p>
                      </div>
                      
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Related Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis?.related_technologies?.map((tech, index) => (
                            <Badge key={index} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="market" className="mt-0">
                    <div className="space-y-6">
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Market Opportunity</h3>
                        </div>
                        <p className="text-sm mb-3">{analysis?.market_opportunity?.description || "No market opportunity description available."}</p>
                        
                        <div className="bg-background p-3 rounded border border-border mb-3">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Potential Revenue Impact</h4>
                          <p className="text-sm">{analysis?.market_opportunity?.potential_revenue_impact || "Unknown"}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-2">Target Client Industries</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis?.market_opportunity?.target_client_industries?.map((industry, index) => (
                              <Badge key={index} variant="outline">
                                {industry}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Competitive Analysis</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Current Adoption</h4>
                            <p className="text-sm">{analysis?.competitive_analysis?.current_adoption || "No data available"}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Market Leaders</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis?.competitive_analysis?.market_leaders?.map((leader, index) => (
                                <Badge key={index} variant="secondary">
                                  {leader}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Differentiation Opportunities</h4>
                            <ul className="space-y-1">
                              {analysis?.competitive_analysis?.differentiation_opportunities?.map((opportunity, index) => (
                                <li key={index} className="text-sm">• {opportunity}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="implementation" className="mt-0">
                    <div className="space-y-6">
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Implementation Timeline</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div className="bg-background p-3 rounded border border-border">
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Short Term ({"<"}3 months)</h4>
                            <ul className="space-y-1">
                              {analysis?.implementation_timeline?.short_term?.map((item, index) => (
                                <li key={index} className="text-sm">• {item}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-background p-3 rounded border border-border">
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Medium Term (3-6 months)</h4>
                            <ul className="space-y-1">
                              {analysis?.implementation_timeline?.medium_term?.map((item, index) => (
                                <li key={index} className="text-sm">• {item}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-background p-3 rounded border border-border">
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Long Term (6+ months)</h4>
                            <ul className="space-y-1">
                              {analysis?.implementation_timeline?.long_term?.map((item, index) => (
                                <li key={index} className="text-sm">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Implementation Details</h3>
                        </div>
                        
                        <div className="space-y-4 mt-3">
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Resource Requirements</h4>
                            <ul className="space-y-1">
                              {analysis?.implementation_details?.resource_requirements?.map((resource, index) => (
                                <li key={index} className="text-sm">• {resource}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">Technical Complexity</h4>
                              <p className="text-sm">{analysis?.implementation_details?.technical_complexity || "Medium"}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">Integration Challenges</h4>
                              <ul className="space-y-1">
                                {analysis?.implementation_details?.integration_challenges?.map((challenge, index) => (
                                  <li key={index} className="text-sm">• {challenge}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Tech Stack Recommendations</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis?.implementation_details?.tech_stack_recommendations?.map((tech, index) => (
                                <Badge key={index} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="business" className="mt-0">
                    <div className="space-y-6">
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Cost-Benefit Analysis</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div className="bg-background p-3 rounded border border-border">
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Estimated Implementation Cost</h4>
                            <p className="text-sm">{analysis?.cost_benefit_analysis?.estimated_implementation_cost || "Unknown"}</p>
                          </div>
                          
                          <div className="bg-background p-3 rounded border border-border">
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Time to Value</h4>
                            <p className="text-sm">{analysis?.cost_benefit_analysis?.time_to_value || "Unknown"}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-xs font-medium text-muted-foreground mb-2">Potential ROI Metrics</h4>
                          <ul className="space-y-1">
                            {analysis?.cost_benefit_analysis?.potential_roi_metrics?.map((metric, index) => (
                              <li key={index} className="text-sm">• {metric}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-xs font-medium text-muted-foreground mb-2">Scalability Factors</h4>
                          <ul className="space-y-1">
                            {analysis?.cost_benefit_analysis?.scalability_factors?.map((factor, index) => (
                              <li key={index} className="text-sm">• {factor}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Business Implications</h3>
                        </div>
                        <p className="text-sm">{analysis?.business_implications || "No business implications analysis available."}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="client-messaging" className="mt-0">
                    <div className="space-y-6">
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">Client Messaging</h3>
                        </div>
                        
                        <div className="space-y-4 mt-3">
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Value Propositions</h4>
                            <ul className="space-y-1">
                              {analysis?.client_messaging?.value_propositions?.map((proposition, index) => (
                                <li key={index} className="text-sm">• {proposition}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Key Selling Points</h4>
                            <ul className="space-y-1">
                              {analysis?.client_messaging?.key_selling_points?.map((point, index) => (
                                <li key={index} className="text-sm">• {point}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Case Study Ideas</h4>
                            <ul className="space-y-1">
                              {analysis?.client_messaging?.case_study_ideas?.map((idea, index) => (
                                <li key={index} className="text-sm">• {idea}</li>
                              ))}
                            </ul>
                          </div>
                          
                          {analysis?.client_messaging?.objection_handling && 
                            Object.keys(analysis.client_messaging.objection_handling).length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-2">Objection Handling</h4>
                                <div className="space-y-3">
                                  {Object.entries(analysis.client_messaging.objection_handling).map(([objection, response], index) => (
                                    <div key={index} className="bg-background p-3 rounded border border-border">
                                      <h5 className="text-xs font-medium mb-1">{objection}</h5>
                                      <p className="text-sm">{response as string}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
