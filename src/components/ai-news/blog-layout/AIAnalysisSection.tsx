
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Layers, 
  LineChart,
  MessageCircle,
  Zap,
  Clock
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EnhancedNewsItem } from '@/types/blog';

// [Analysis] This component displays AI analysis in a dedicated section
// [Plan] Could be enhanced with visual charts/graphs for deeper insights

interface AIAnalysisSectionProps {
  article: EnhancedNewsItem;
}

export const AIAnalysisSection = ({ article }: AIAnalysisSectionProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  // If no AI analysis exists, don't render this component
  if (!article.ai_analysis || Object.keys(article.ai_analysis).length === 0) {
    return null;
  }

  // Helper function to render AI analysis key points as list items
  const renderListItems = (items: string[] | undefined) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    
    return (
      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="bg-blue-500/20 text-blue-400 p-1 rounded-full mt-0.5">
              <Lightbulb className="h-3 w-3" />
            </div>
            <span className="text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Helper function to render complex objects from AI analysis
  const renderAnalysisObject = (obj: Record<string, any> | undefined, parentKey: string) => {
    if (!obj || typeof obj !== 'object') return null;
    
    return (
      <div className="mt-4 space-y-4">
        {Object.entries(obj).map(([key, value]) => {
          // Skip rendering score directly as it's displayed elsewhere
          if (key === 'score') return null;
          
          // Format the title from the key
          const title = key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          return (
            <div key={key} className="border-l-2 border-blue-500/30 pl-4 py-1">
              <h5 className="font-medium text-blue-300 mb-1">{title}</h5>
              {renderAnalysisValue(value, `${parentKey}-${key}`)}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to render different types of AI analysis values 
  const renderAnalysisValue = (value: any, key: string) => {
    if (!value) return null;
    
    if (Array.isArray(value)) {
      return renderListItems(value);
    } else if (typeof value === 'object') {
      return renderAnalysisObject(value, key);
    } else {
      return <p className="text-gray-300">{value}</p>;
    }
  };

  return (
    <motion.div
      id="ai-analysis-section"
      className="my-12 bg-gradient-to-br from-blue-950/30 to-purple-950/20 border border-blue-500/20 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="p-5 border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/20 p-2 rounded-full">
            <Brain className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-300">AI Analysis</h3>
            <p className="text-xs text-blue-400/80">
              Enhanced insights and implications for AI agency owners
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        {/* Render AI analysis sections using Accordion for better organization */}
        <Accordion type="single" collapsible className="border-none space-y-3">
          {/* Market Impact Section */}
          {article.ai_analysis?.market_impact && (
            <AccordionItem 
              value="market_impact" 
              id="ai-analysis-section-market_impact"
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Market Impact</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0 text-gray-300">
                <p>{article.ai_analysis.market_impact}</p>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Business Implications Section */}
          {article.ai_analysis?.business_implications && (
            <AccordionItem 
              value="business_implications" 
              id="ai-analysis-section-business_implications"
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Business Implications</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0 text-gray-300">
                <p>{article.ai_analysis.business_implications}</p>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Technical Predictions Section */}
          {article.ai_analysis?.technical_predictions && Array.isArray(article.ai_analysis.technical_predictions) && (
            <AccordionItem 
              value="technical_predictions" 
              id="ai-analysis-section-technical_predictions"
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Technical Predictions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                {renderListItems(article.ai_analysis.technical_predictions)}
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Related Technologies Section */}
          {article.ai_analysis?.related_technologies && Array.isArray(article.ai_analysis.related_technologies) && (
            <AccordionItem 
              value="related_technologies" 
              id="ai-analysis-section-related_technologies"
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Related Technologies</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                {renderListItems(article.ai_analysis.related_technologies)}
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Key Points Section */}
          {article.ai_analysis?.key_points && Array.isArray(article.ai_analysis.key_points) && (
            <AccordionItem 
              value="key_points" 
              id="ai-analysis-section-key_points"
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Key Points</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                {renderListItems(article.ai_analysis.key_points)}
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Implementation Timeline Section */}
          {article.ai_analysis?.implementation_timeline && (
            <AccordionItem 
              value="implementation_timeline" 
              id="ai-analysis-section-implementation_timeline"
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Implementation Timeline</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                {article.ai_analysis?.implementation_timeline && renderAnalysisObject(article.ai_analysis?.implementation_timeline, 'timeline')}
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Market Opportunity Section */}
          {article.ai_analysis?.market_opportunity && (
            <AccordionItem 
              value="market_opportunity" 
              id="ai-analysis-section-market_opportunity"
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-blue-300 font-medium">
                    Market Opportunity
                    {article.ai_analysis?.market_opportunity?.score && (
                      <span className="ml-2 text-xs bg-green-500/10 text-green-400 py-0.5 px-2 rounded-full">
                        {article.ai_analysis?.market_opportunity?.score}% Potential
                      </span>
                    )}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                {article.ai_analysis?.market_opportunity && renderAnalysisObject(article.ai_analysis?.market_opportunity, 'opportunity')}
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Competitive Analysis Section */}
          {article.ai_analysis?.competitive_analysis && (
            <AccordionItem 
              value="competitive_analysis" 
              id="ai-analysis-section-competitive_analysis"
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Competitive Analysis</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                {article.ai_analysis?.competitive_analysis && renderAnalysisObject(article.ai_analysis?.competitive_analysis, 'competitive')}
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Agency Relevance Section */}
          {article.ai_analysis?.agency_relevance_score !== undefined && (
            <AccordionItem 
              value="agency_relevance" 
              id="ai-analysis-section-agency_relevance"
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-blue-300 font-medium">
                    Agency Relevance
                    <span className="ml-2 text-xs bg-yellow-500/10 text-yellow-400 py-0.5 px-2 rounded-full">
                      {article.ai_analysis?.agency_relevance_score}% Relevance
                    </span>
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0 text-gray-300">
                <p>How relevant this technology is for agency owners and their clients.</p>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {/* Client Messaging Section */}
          {article.ai_analysis?.client_messaging && (
            <AccordionItem 
              value="client_messaging" 
              id="ai-analysis-section-client_messaging"
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Client Messaging</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                {article.ai_analysis?.client_messaging && renderAnalysisObject(article.ai_analysis?.client_messaging, 'messaging')}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </motion.div>
  );
};
