
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Zap, BrainCircuit, Users, Scale, Building, LineChart, ArrowBigUp } from 'lucide-react';
import { AIAnalysis } from '@/types/blog';

// [Analysis] Enhanced component to display comprehensive analysis data for agency owners
interface AnalysisTabsProps {
  analysis: AIAnalysis;
}

// [Framework] Helper to render opportunity score with appropriate color
const OpportunityScoreBadge = ({ score }: { score: number }) => {
  let bgColor = 'bg-yellow-500';
  if (score >= 80) bgColor = 'bg-emerald-500';
  else if (score >= 60) bgColor = 'bg-green-500';
  else if (score <= 30) bgColor = 'bg-red-500';
  else if (score <= 50) bgColor = 'bg-orange-500';
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white font-bold`}>
        {score}
      </div>
      <div className="text-xs text-gray-400">
        Opportunity<br/>Score
      </div>
    </div>
  );
};

// [Framework] Helper to render value propositions as badges
const ValuePropositionBadges = ({ propositions }: { propositions: string[] }) => {
  if (!propositions || propositions.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {propositions.map((prop, i) => (
        <Badge key={i} variant="outline" className="bg-blue-900/30 text-blue-300 hover:bg-blue-900/50">
          {prop}
        </Badge>
      ))}
    </div>
  );
};

// [Framework] Helper to render timeline items with appropriate icons
const TimelineItem = ({ title, items }: { title: string; items: string[] }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="mb-3">
      <h4 className="text-sm font-medium text-blue-300 mb-1">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
            <Clock className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ analysis }) => {
  if (!analysis) {
    return <div className="text-gray-400 italic">No analysis data available</div>;
  }
  
  // [Analysis] Extract agency relevance and market opportunity scores with defaults
  const agencyRelevance = analysis?.agency_relevance_score || 50;
  const marketOpportunityScore = analysis?.market_opportunity?.score || 50;
  
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-5 bg-gray-900/50 border border-gray-800 rounded-md p-1">
        <TabsTrigger value="overview" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
          Overview
        </TabsTrigger>
        <TabsTrigger value="opportunity" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
          Opportunity
        </TabsTrigger>
        <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
          Timeline
        </TabsTrigger>
        <TabsTrigger value="technical" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
          Technical
        </TabsTrigger>
        <TabsTrigger value="client" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
          Client Strategy
        </TabsTrigger>
      </TabsList>
      
      {/* Overview Tab */}
      <TabsContent value="overview" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium mb-1 text-blue-300">Market Impact Analysis</h3>
            <p className="text-gray-300 mb-4">{analysis?.market_impact || "No market impact analysis available"}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-400">Agency<br/>Relevance</div>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                agencyRelevance >= 80 ? "bg-emerald-500" : 
                agencyRelevance >= 60 ? "bg-green-500" : 
                agencyRelevance <= 30 ? "bg-red-500" : 
                agencyRelevance <= 50 ? "bg-orange-500" : "bg-yellow-500"
              )}>
                {agencyRelevance}
              </div>
            </div>
            <div className="text-xs text-gray-500">Confidence: {analysis?.confidence_score || "N/A"}%</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <h4 className="text-md font-medium text-blue-300">Key Points</h4>
            {analysis?.key_points && analysis.key_points.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {analysis.key_points.map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">No key points available</p>
            )}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-md font-medium text-blue-300">Business Implications</h4>
            <p className="text-gray-300">{analysis?.business_implications || "No business implications analysis available"}</p>
            
            <h4 className="text-md font-medium text-blue-300 mt-4">Related Technologies</h4>
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
          </div>
        </div>
      </TabsContent>
      
      {/* Market Opportunity Tab */}
      <TabsContent value="opportunity" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium mb-1 text-blue-300">Market Opportunity</h3>
            <p className="text-gray-300">{analysis?.market_opportunity?.description || "No market opportunity analysis available"}</p>
          </div>
          {marketOpportunityScore && <OpportunityScoreBadge score={marketOpportunityScore} />}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div>
              <h4 className="flex items-center gap-2 text-md font-medium text-blue-300 mb-2">
                <Target className="h-4 w-4" /> Target Client Industries
              </h4>
              {analysis?.market_opportunity?.target_client_industries && 
              analysis.market_opportunity.target_client_industries.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.market_opportunity.target_client_industries.map((industry: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-gray-800 border-gray-700">
                      {industry}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No target industries specified</p>
              )}
            </div>
            
            <div>
              <h4 className="flex items-center gap-2 text-md font-medium text-blue-300 mb-2">
                <LineChart className="h-4 w-4" /> Revenue Impact
              </h4>
              <p className="text-gray-300">{analysis?.market_opportunity?.potential_revenue_impact || 
                "No revenue impact assessment available"}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="flex items-center gap-2 text-md font-medium text-blue-300 mb-2">
                <Building className="h-4 w-4" /> Market Leaders
              </h4>
              {analysis?.competitive_analysis?.market_leaders && 
              analysis.competitive_analysis.market_leaders.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  {analysis.competitive_analysis.market_leaders.map((leader: string, i: number) => (
                    <li key={i}>{leader}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No market leaders identified</p>
              )}
            </div>
            
            <div>
              <h4 className="flex items-center gap-2 text-md font-medium text-blue-300 mb-2">
                <ArrowBigUp className="h-4 w-4" /> Differentiation Opportunities
              </h4>
              {analysis?.competitive_analysis?.differentiation_opportunities && 
              analysis.competitive_analysis.differentiation_opportunities.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  {analysis.competitive_analysis.differentiation_opportunities.map((opportunity: string, i: number) => (
                    <li key={i}>{opportunity}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No differentiation opportunities identified</p>
              )}
            </div>
            
            <div>
              <h4 className="flex items-center gap-2 text-md font-medium text-blue-300 mb-2">
                <Users className="h-4 w-4" /> Current Adoption
              </h4>
              <p className="text-gray-300">{analysis?.competitive_analysis?.current_adoption || 
                "No adoption information available"}</p>
            </div>
          </div>
        </div>
      </TabsContent>
      
      {/* Implementation Timeline Tab */}
      <TabsContent value="timeline" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-4 text-blue-300">Implementation Timeline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 p-4 rounded-md border border-blue-900/30">
            <h4 className="font-medium text-blue-300 mb-3">Short Term Actions</h4>
            {analysis?.implementation_timeline?.short_term && analysis.implementation_timeline.short_term.length > 0 ? (
              <ul className="space-y-2">
                {analysis.implementation_timeline.short_term.map((action: string, index: number) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <div className="bg-blue-500/20 p-1 rounded-full mt-0.5">
                      <Zap className="h-3 w-3 text-blue-400" />
                    </div>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No short-term actions identified</p>
            )}
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-md border border-orange-900/30">
            <h4 className="font-medium text-orange-300 mb-3">Medium Term Strategy (3-6 months)</h4>
            {analysis?.implementation_timeline?.medium_term && analysis.implementation_timeline.medium_term.length > 0 ? (
              <ul className="space-y-2">
                {analysis.implementation_timeline.medium_term.map((action: string, index: number) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <div className="bg-orange-500/20 p-1 rounded-full mt-0.5">
                      <Zap className="h-3 w-3 text-orange-400" />
                    </div>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No medium-term strategies identified</p>
            )}
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-md border border-purple-900/30">
            <h4 className="font-medium text-purple-300 mb-3">Long Term Vision (12+ months)</h4>
            {analysis?.implementation_timeline?.long_term && analysis.implementation_timeline.long_term.length > 0 ? (
              <ul className="space-y-2">
                {analysis.implementation_timeline.long_term.map((action: string, index: number) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <div className="bg-purple-500/20 p-1 rounded-full mt-0.5">
                      <Zap className="h-3 w-3 text-purple-400" />
                    </div>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No long-term vision identified</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-gray-900/50 p-4 rounded-md border border-gray-800">
          <h4 className="font-medium text-blue-300 mb-3">Cost-Benefit Analysis</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-1">Est. Implementation Cost</h5>
              <p className="text-gray-300">{analysis?.cost_benefit_analysis?.estimated_implementation_cost || "Unknown"}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-1">Time to Value</h5>
              <p className="text-gray-300">{analysis?.cost_benefit_analysis?.time_to_value || "Unknown"}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-1">ROI Metrics</h5>
              {analysis?.cost_benefit_analysis?.potential_roi_metrics && 
              analysis.cost_benefit_analysis.potential_roi_metrics.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  {analysis.cost_benefit_analysis.potential_roi_metrics.slice(0, 3).map((metric: string, i: number) => (
                    <li key={i}>{metric}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">Not available</p>
              )}
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-1">Scalability Factors</h5>
              {analysis?.cost_benefit_analysis?.scalability_factors && 
              analysis.cost_benefit_analysis.scalability_factors.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                  {analysis.cost_benefit_analysis.scalability_factors.slice(0, 3).map((factor: string, i: number) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">Not available</p>
              )}
            </div>
          </div>
        </div>
      </TabsContent>
      
      {/* Technical Details Tab */}
      <TabsContent value="technical" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-4 text-blue-300">Technical Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-blue-300 mb-2 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" /> Technical Predictions
            </h4>
            {analysis?.technical_predictions && analysis.technical_predictions.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {analysis.technical_predictions.map((prediction: string, index: number) => (
                  <li key={index}>{prediction}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">No technical predictions available</p>
            )}
            
            <h4 className="text-md font-medium text-blue-300 mt-6 mb-2">Technical Complexity</h4>
            <div className="flex items-center gap-3">
              <Badge 
                className={cn(
                  "text-white",
                  analysis?.implementation_details?.technical_complexity === "Easy" ? "bg-green-600" :
                  analysis?.implementation_details?.technical_complexity === "Medium" ? "bg-amber-600" :
                  analysis?.implementation_details?.technical_complexity === "Hard" ? "bg-red-600" :
                  "bg-blue-600"
                )}
              >
                {analysis?.implementation_details?.technical_complexity || "Unknown"}
              </Badge>
              <span className="text-gray-400 text-sm">
                Implementation difficulty
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-blue-300 mb-2">Implementation Details</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-400 mb-1">Resource Requirements</h5>
                {analysis?.implementation_details?.resource_requirements && 
                analysis.implementation_details.resource_requirements.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                    {analysis.implementation_details.resource_requirements.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300 text-sm">No resource requirements specified</p>
                )}
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-400 mb-1">Integration Challenges</h5>
                {analysis?.implementation_details?.integration_challenges && 
                analysis.implementation_details.integration_challenges.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                    {analysis.implementation_details.integration_challenges.map((challenge: string, i: number) => (
                      <li key={i}>{challenge}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300 text-sm">No integration challenges identified</p>
                )}
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-400 mb-1">Recommended Tech Stack</h5>
                {analysis?.implementation_details?.tech_stack_recommendations && 
                analysis.implementation_details.tech_stack_recommendations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.implementation_details.tech_stack_recommendations.map((tech: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-gray-800/50 border-gray-700">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">No tech stack recommendations available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
      
      {/* Client Messaging Tab */}
      <TabsContent value="client" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-4 text-blue-300">Client Strategy</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-blue-300 mb-2">Value Propositions</h4>
            {analysis?.client_messaging?.value_propositions && 
            analysis.client_messaging.value_propositions.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {analysis.client_messaging.value_propositions.map((prop: string, index: number) => (
                  <li key={index}>{prop}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">No value propositions available</p>
            )}
            
            <h4 className="text-md font-medium text-blue-300 mt-6 mb-2">Key Selling Points</h4>
            {analysis?.client_messaging?.key_selling_points && 
            analysis.client_messaging.key_selling_points.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {analysis.client_messaging.key_selling_points.map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">No key selling points available</p>
            )}
          </div>
          
          <div>
            <h4 className="text-md font-medium text-blue-300 mb-2">Case Study Ideas</h4>
            {analysis?.client_messaging?.case_study_ideas && 
            analysis.client_messaging.case_study_ideas.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {analysis.client_messaging.case_study_ideas.map((idea: string, index: number) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">No case study ideas available</p>
            )}
            
            <h4 className="text-md font-medium text-blue-300 mt-6 mb-2">Objection Handling</h4>
            {analysis?.client_messaging?.objection_handling && 
            Object.keys(analysis.client_messaging.objection_handling).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(analysis.client_messaging.objection_handling || {}).map(([objection, response], i) => (
                  <div key={i} className="bg-gray-900/50 p-3 rounded-md">
                    <h5 className="text-sm font-medium text-orange-300 mb-1">"{objection}"</h5>
                    <p className="text-sm text-gray-300">{response as React.ReactNode}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300">No objection handling guidance available</p>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
