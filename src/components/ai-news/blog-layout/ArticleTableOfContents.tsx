import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowUp, List, ChevronDown, Zap, Lightbulb, TrendingUp, Layers, Brain, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { EnhancedNewsItem } from '@/types/blog';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface ArticleTableOfContentsProps {
  article: EnhancedNewsItem;
  activeSection?: string;
}

// [Analysis] Enhanced types for section and content items with support for AI analysis sections
type TableItem = {
  id: string;
  title: string;
  type: 'section' | 'content' | 'ai_analysis';
  importance?: string;
  relevanceScore?: number;
  parentId?: string;
  order?: number;
};

// [Framework] Icons mapping for different AI analysis sections to enhance visual navigation
const ANALYSIS_ICONS: Record<string, LucideIcon> = {
  market_impact: TrendingUp,
  technical_predictions: Brain,
  related_technologies: Layers,
  business_implications: LineChart,
  key_points: Lightbulb,
  agency_relevance_score: Zap,
  default: Lightbulb
};

export const ArticleTableOfContents = ({ article, activeSection }: ArticleTableOfContentsProps) => {
  const [isTOCExpanded, setIsTOCExpanded] = useState(true);
  const [aiSectionsExpanded, setAiSectionsExpanded] = useState(true);
  
  // [Analysis] Generate comprehensive table of contents items from article sections, 
  // key takeaways and AI analysis data if available
  const generateTableItems = (): TableItem[] => {
    const items: TableItem[] = [
      { id: 'key-takeaways', title: 'Key Takeaways', type: 'section', order: 0 } as const
    ];
    
    // Add regular content sections
    const contentSections = article.sections.map((section, index) => ({
      id: section.id,
      title: section.title,
      type: 'content' as const,
      importance: section.importance_level,
      order: index + 1
    }));
    
    items.push(...contentSections);
    
    // [Analysis] Check if AI analysis exists and add those sections
    if (article.ai_analysis && Object.keys(article.ai_analysis).length > 0) {
      // Add a parent section for AI Analysis
      const aiAnalysisParentId = 'ai-analysis-parent';
      items.push({
        id: aiAnalysisParentId,
        title: 'AI Analysis',
        type: 'section',
        order: items.length + 1
      });
      
      // Add individual AI analysis sections
      const aiAnalysisKeys = [
        'market_impact', 
        'business_implications',
        'technical_predictions',
        'related_technologies',
        'key_points',
        'implementation_timeline',
        'market_opportunity',
        'competitive_analysis',
        'client_messaging',
        'implementation_details',
        'cost_benefit_analysis'
      ];
      
      // [Plan] Filter only sections that actually exist in the analysis
      const availableKeys = aiAnalysisKeys.filter(key => 
        article.ai_analysis && article.ai_analysis[key as keyof typeof article.ai_analysis] && 
        (typeof article.ai_analysis[key as keyof typeof article.ai_analysis] === 'string' || 
         Array.isArray(article.ai_analysis[key as keyof typeof article.ai_analysis]) || 
         typeof article.ai_analysis[key as keyof typeof article.ai_analysis] === 'object')
      );
      
      // Add available sections to TOC
      availableKeys.forEach((key, index) => {
        // Format the title from the key (e.g., "market_impact" -> "Market Impact")
        const title = key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        // Get relevance score if available
        let relevanceScore;
        if (key === 'agency_relevance_score' && article.ai_analysis?.agency_relevance_score) {
          relevanceScore = article.ai_analysis.agency_relevance_score;
        } else if (key === 'market_opportunity' && article.ai_analysis?.market_opportunity?.score) {
          relevanceScore = article.ai_analysis.market_opportunity.score;
        }
        
        items.push({
          id: `ai-analysis-${key}`,
          title,
          type: 'ai_analysis',
          parentId: aiAnalysisParentId,
          relevanceScore,
          order: items.length + 1 + index
        });
      });
    }
    
    // Sort items by order
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const tableItems = generateTableItems();

  // Calculate reading progress
  const currentIndex = activeSection 
    ? tableItems.findIndex(item => item.id === activeSection) 
    : 0;
  const readingProgress = Math.max(0, Math.min(100, 
    (currentIndex / Math.max(1, tableItems.length - 1)) * 100
  ));

  // [Analysis] Scroll to section with enhanced ID handling for AI analysis sections
  const scrollToSection = (id: string) => {
    // For AI analysis sections, create the proper element ID
    let elementId = id;
    
    // If it's an AI analysis section, modify the ID to match the DOM structure
    if (id.startsWith('ai-analysis-') && id !== 'ai-analysis-parent') {
      const analysisType = id.replace('ai-analysis-', '');
      elementId = `ai-analysis-section-${analysisType}`;
    }
    
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.log(`Element with ID "${elementId}" not found`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // [Analysis] Enhanced importance visualization with more meaningful colors and labels
  const getImportanceColor = (importance?: string) => {
    switch (importance?.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-siso-text/10 text-siso-text border-siso-text/20';
    }
  };

  // [Analysis] Display relevance score with appropriate colors
  const getRelevanceColor = (score?: number) => {
    if (score === undefined) return '';
    
    if (score >= 80) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (score >= 50) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  };

  return (
    <div className="sticky top-8 space-y-8">
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Contents</h3>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTOCExpanded(!isTOCExpanded)}
            className="h-7 w-7 p-0 rounded-full"
          >
            {isTOCExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
        
        {/* Reading progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Progress</span>
            <span>{Math.round(readingProgress)}%</span>
          </div>
          <Progress value={readingProgress} className="h-1.5 bg-gray-800" indicatorClassName="bg-blue-500" />
        </div>
        
        {isTOCExpanded && (
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-1">
              {tableItems.map((item, index) => {
                const isActive = activeSection === item.id;
                const isPassed = activeSection 
                  ? tableItems.findIndex(i => i.id === activeSection) > index
                  : false;
                
                // Get appropriate icon for AI analysis sections
                let Icon: LucideIcon = List;
                if (item.type === 'ai_analysis' && item.id.startsWith('ai-analysis-')) {
                  const analysisType = item.id.replace('ai-analysis-', '');
                  Icon = ANALYSIS_ICONS[analysisType] || ANALYSIS_ICONS.default;
                }
                
                // Determine if this is a parent section
                const isParent = item.id === 'ai-analysis-parent';
                
                // Skip child items if parent is collapsed
                if (item.parentId === 'ai-analysis-parent' && !aiSectionsExpanded) {
                  return null;
                }
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      if (isParent) {
                        setAiSectionsExpanded(!aiSectionsExpanded);
                      } else {
                        scrollToSection(item.id);
                      }
                    }}
                    className={cn(
                      "w-full text-left p-2.5 rounded-lg transition-all duration-200 flex items-start gap-2",
                      isActive 
                        ? "bg-blue-900/30 shadow-sm border border-blue-500/20" 
                        : isPassed 
                          ? "text-gray-400 hover:bg-gray-800/40" 
                          : "hover:bg-gray-800/40",
                      item.parentId && "ml-3", // Indent child items
                      isParent && "bg-gray-800/30" // Style for parent items
                    )}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                      isActive 
                        ? "bg-blue-400" 
                        : isPassed 
                          ? "bg-gray-500" 
                          : "bg-gray-700"
                    )} />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {item.type === 'ai_analysis' && (
                          <Icon className="h-3.5 w-3.5 text-blue-400" />
                        )}
                        
                        <p className={cn(
                          "text-sm font-medium line-clamp-2",
                          isActive 
                            ? "text-blue-300" 
                            : isPassed 
                              ? "text-gray-400" 
                              : item.type === 'ai_analysis'
                                ? "text-blue-300"
                                : isParent
                                  ? "text-purple-300"
                                  : "text-gray-300"
                        )}>
                          {item.title}
                          
                          {isParent && (
                            <span className="ml-2">
                              {aiSectionsExpanded ? (
                                <ChevronDown className="inline h-3 w-3 text-gray-400" />
                              ) : (
                                <ChevronRight className="inline h-3 w-3 text-gray-400" />
                              )}
                            </span>
                          )}
                        </p>
                      </div>
                      
                      {item.type === 'content' && item.importance && (
                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${getImportanceColor(item.importance)}`}>
                          {item.importance} Priority
                        </span>
                      )}
                      
                      {item.type === 'ai_analysis' && item.relevanceScore !== undefined && (
                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${getRelevanceColor(item.relevanceScore)}`}>
                          {item.relevanceScore}% Relevance
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </ScrollArea>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={scrollToTop}
          className="w-full mt-4 gap-2 border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
        >
          <ArrowUp className="w-4 h-4" />
          Back to Top
        </Button>
      </div>
    </div>
  );
};
