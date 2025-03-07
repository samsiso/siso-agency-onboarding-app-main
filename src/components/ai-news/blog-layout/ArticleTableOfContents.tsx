
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedNewsItem } from '@/types/blog';
import { 
  FileText, 
  Lightbulb, 
  Brain, 
  TrendingUp, 
  Layers, 
  LineChart,
  MessageCircle,
  Zap,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleTableOfContentsProps {
  article: EnhancedNewsItem;
  activeSection?: string;
}

export const ArticleTableOfContents = ({ 
  article,
  activeSection
}: ArticleTableOfContentsProps) => {
  // Skip rendering if there are no sections
  if (article.sections.length === 0 && !article.key_takeaways?.length) {
    return null;
  }

  // Filter out sections with importance_level = 'low' for the ToC
  const visibleSections = article.sections.filter(
    section => section.importance_level !== 'low'
  );

  // Determine if we have AI analysis sections to display
  const hasAiAnalysis = article.ai_analysis && Object.keys(article.ai_analysis).length > 0;

  // Determine if key takeaways should be shown
  const showKeyTakeaways = article.key_takeaways && article.key_takeaways.length > 0;

  // Create a mapping for AI analysis section titles
  const aiAnalysisSectionTitles: Record<string, string> = {
    market_impact: 'Market Impact',
    technical_predictions: 'Technical Predictions',
    related_technologies: 'Related Technologies',
    business_implications: 'Business Implications',
    key_points: 'Key Points',
    implementation_timeline: 'Implementation Timeline',
    market_opportunity: 'Market Opportunity',
    competitive_analysis: 'Competitive Analysis',
    client_messaging: 'Client Messaging',
    implementation_details: 'Implementation Details',
    cost_benefit_analysis: 'Cost-Benefit Analysis',
    agency_relevance_score: 'Agency Relevance'
  };

  // Create a mapping for AI analysis section icons
  const aiAnalysisSectionIcons: Record<string, LucideIcon> = {
    market_impact: TrendingUp,
    technical_predictions: Brain,
    related_technologies: Layers,
    business_implications: LineChart,
    key_points: Lightbulb,
    agency_relevance_score: Zap,
    market_opportunity: TrendingUp,
    default: Lightbulb
  };

  // Check if we have any important AI analysis sections
  const hasImportantAnalysis = 
    hasAiAnalysis && 
    (article.ai_analysis?.agency_relevance_score !== undefined || 
     article.ai_analysis?.market_opportunity !== undefined);

  return (
    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-2">Contents</h3>
      
      <ScrollArea className="h-[350px] pr-3">
        <div className="flex flex-col gap-1.5">
          {/* Key Takeaways Link - Always first when present */}
          {showKeyTakeaways && (
            <a 
              href="#key-takeaways"
              className={cn(
                "flex items-center gap-2 text-sm py-1.5 px-3 rounded-md transition-colors",
                activeSection === 'key-takeaways'
                  ? "bg-blue-900/30 text-blue-200"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Lightbulb className="h-4 w-4 text-blue-400" />
              <span>Key Takeaways</span>
            </a>
          )}
          
          {/* Article Section Links */}
          {visibleSections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "flex items-center gap-2 text-sm py-1.5 px-3 rounded-md transition-colors",
                activeSection === section.id
                  ? "bg-blue-900/30 text-blue-200"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <FileText className="h-4 w-4 text-gray-400" />
              <span>{section.title}</span>
            </a>
          ))}
          
          {/* AI Analysis Parent Section */}
          {hasAiAnalysis && (
            <>
              <div className="mt-2 mb-1 border-t border-white/10 pt-2">
                <div className={cn(
                  "flex items-center gap-2 text-sm py-1.5 px-3 rounded-md transition-colors font-medium",
                  activeSection === 'ai-analysis-parent'
                    ? "bg-blue-900/30 text-blue-200"
                    : "text-blue-300"
                )}>
                  <Brain className="h-4 w-4 text-blue-400" />
                  <span>AI Analysis</span>
                </div>
              </div>
              
              {/* Important AI Analysis Metrics - when available */}
              {hasImportantAnalysis && (
                <div className="ml-4 mb-1 space-y-1">
                  {article.ai_analysis?.agency_relevance_score !== undefined && (
                    <div className="flex items-center justify-between text-xs py-1 px-2 rounded-md bg-indigo-900/20 text-indigo-300">
                      <span>Agency Relevance</span>
                      <span className="font-medium">{article.ai_analysis?.agency_relevance_score}%</span>
                    </div>
                  )}
                  {article.ai_analysis?.market_opportunity?.score !== undefined && (
                    <div className="flex items-center justify-between text-xs py-1 px-2 rounded-md bg-green-900/20 text-green-300">
                      <span>Market Opportunity</span>
                      <span className="font-medium">{article.ai_analysis?.market_opportunity?.score}%</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* AI Analysis Section Links */}
              <div className="ml-4 space-y-0.5">
                {article.ai_analysis && Object.keys(article.ai_analysis).map(key => {
                  // Skip rendering some metadata fields directly in the TOC
                  if (['confidence_score', 'summary', 'score'].includes(key)) {
                    return null;
                  }
                  
                  // Skip empty arrays or objects
                  const value = article.ai_analysis?.[key];
                  if (!value || 
                      (Array.isArray(value) && value.length === 0) || 
                      (typeof value === 'object' && Object.keys(value).length === 0)) {
                    return null;
                  }
                  
                  // Get the icon for this section
                  const IconComponent = aiAnalysisSectionIcons[key] || aiAnalysisSectionIcons.default;
                  
                  return (
                    <a
                      key={`ai-analysis-${key}`}
                      href={`#ai-analysis-section-${key}`}
                      className={cn(
                        "flex items-center gap-2 text-xs py-1.5 px-3 rounded-md transition-colors",
                        activeSection === `ai-analysis-section-${key}`
                          ? "bg-blue-900/20 text-blue-200"
                          : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                      )}
                    >
                      <IconComponent className="h-3.5 w-3.5 text-blue-400" />
                      <span>{aiAnalysisSectionTitles[key] || key.replace(/_/g, ' ')}</span>
                    </a>
                  );
                })}
              </div>
            </>
          )}
          
          {/* Community Notes Link */}
          <div className="mt-2 pt-2 border-t border-white/10">
            <a 
              href="#community-notes"
              className={cn(
                "flex items-center gap-2 text-sm py-1.5 px-3 rounded-md transition-colors",
                "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <MessageCircle className="h-4 w-4 text-blue-400" />
              <span>Community Notes ({article.comments ? (Array.isArray(article.comments) ? article.comments.length : 0) : 0})</span>
            </a>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
