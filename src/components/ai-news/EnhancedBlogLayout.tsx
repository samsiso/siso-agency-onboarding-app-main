import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { EnhancedNewsItem, NewsComment } from '@/types/blog';
import { 
  ChevronLeft, 
  Share2, 
  BookmarkPlus,
  Eye,
  Clock,
  MessageCircle,
  ExternalLink,
  Heart,
  TrendingUp,
  Zap,
  Layers,
  Brain,
  LineChart,
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import { EventCard } from './blog-layout/EventCard';
import { complexityColors } from './blog-layout/constants';
import { cn } from '@/lib/utils';
import { ArticleTableOfContents } from './blog-layout/ArticleTableOfContents';
import { useState, useEffect } from 'react';
import { NewsCardComments } from './NewsCardComments';
import { KeyTakeaways } from './blog-layout/KeyTakeaways';
import { HeroImage } from './blog-layout/HeroImage';
import { ReadingProgressBar } from './blog-layout/ReadingProgressBar';
import { BackToTopButton } from './blog-layout/BackToTopButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface EnhancedBlogLayoutProps {
  article: EnhancedNewsItem & { comments?: NewsComment[] };
  onShare?: () => void;
  onBookmark?: () => void;
}

// [Analysis] Define icons for different AI analysis sections
const ANALYSIS_ICONS: Record<string, React.ElementType> = {
  market_impact: TrendingUp,
  technical_predictions: Brain,
  related_technologies: Layers,
  business_implications: LineChart,
  key_points: Lightbulb,
  agency_relevance_score: Zap,
  default: Lightbulb
};

export const EnhancedBlogLayout = ({
  article,
  onShare,
  onBookmark
}: EnhancedBlogLayoutProps) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>();
  const [liked, setLiked] = useState(false);
  
  // [Analysis] Check if this is an external article (no sections but has content)
  const isExternalArticle = article.sections.length === 0 && article.content;
  
  // For external articles without sections, create a dummy section
  const sortedSections = isExternalArticle 
    ? [
        {
          id: 'main-content',
          title: article.title,
          content: article.content || article.description,
          order_index: 0,
          section_order: 0,
          importance_level: 'high',
          technical_complexity: article.technical_complexity,
          subsection_type: 'overview',
          source_references: {},
          created_at: article.date,
          updated_at: article.date,
          article_id: article.id,
        }
      ] 
    : [...article.sections].sort((a, b) => {
        if (a.importance_level === 'high' && b.importance_level !== 'high') return -1;
        if (a.importance_level !== 'high' && b.importance_level === 'high') return 1;
        return a.section_order - b.section_order;
      });

  // [Analysis] Track which section is currently visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' }
    );

    // Observe all content sections - now including AI analysis sections
    const ids = [
      'key-takeaways', 
      ...sortedSections.map(section => section.id),
      'ai-analysis-parent',
      ...(article.ai_analysis ? Object.keys(article.ai_analysis).map(key => `ai-analysis-section-${key}`) : [])
    ];
    
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sortedSections, article.ai_analysis]);

  // [Analysis] Handle external link navigation
  const handleExternalLink = () => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleLike = () => {
    setLiked(!liked);
  };

  // [Analysis] Helper function to render AI analysis key points as list items
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

  // [Analysis] Helper function to render complex objects from AI analysis
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

  // [Analysis] Helper function to render different types of AI analysis values 
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

  // [Analysis] Determine if we should render the AI analysis section
  const hasAiAnalysis = article.ai_analysis && Object.keys(article.ai_analysis).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Reading Progress Indicator */}
      <ReadingProgressBar />
      
      {/* Back to Top Button */}
      <BackToTopButton />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/ai-news')}
          className="mb-6 group"
        >
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to News
        </Button>

        {article.url && (
          <div className="mb-6 flex justify-end">
            <Button
              variant="outline"
              onClick={handleExternalLink}
              className="gap-2 text-blue-500 border-blue-500/30 hover:bg-blue-500/10"
            >
              <ExternalLink className="h-4 w-4" />
              View Original Source
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={cn(
                  complexityColors[article.technical_complexity]
                )}>
                  {article.technical_complexity}
                </Badge>
                <Badge variant="outline" 
                  className="bg-blue-500/10 text-blue-500 border-none">
                  {article.category.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" 
                  className="bg-siso-orange/10 text-siso-orange border-none">
                  {article.impact} Impact
                </Badge>
              </div>

              <h1 className="text-4xl font-bold text-white bg-clip-text">
                {article.title}
              </h1>

              <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400">
                <span>{new Date(article.date).toLocaleDateString()}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.estimated_reading_time} min read
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views} views
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {article.comments?.length || 0} comments
                </span>
              </div>
            </div>
            
            {/* Enhanced Hero Image */}
            <HeroImage article={article} />
            
            {/* Quick Actions Bar */}
            <div className="sticky top-2 z-30 bg-gray-900/80 backdrop-blur-md border border-gray-800/80 rounded-full p-1.5 flex justify-between items-center shadow-lg">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    "h-9 rounded-full gap-2", 
                    liked ? "text-red-400 hover:text-red-500" : "text-gray-400 hover:text-gray-300"
                  )}
                >
                  <Heart className={cn("h-4 w-4", liked && "fill-red-400")} />
                  <span>Like</span>
                </Button>
                
                {onBookmark && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBookmark}
                    className="h-9 rounded-full gap-2"
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    <span>Save</span>
                  </Button>
                )}
                
                {onShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShare}
                    className="h-9 rounded-full gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                {activeSection ? sortedSections.find(s => s.id === activeSection)?.title || 'Reading' : 'Start Reading'}
              </div>
            </div>
            
            {/* Enhanced Key Takeaways */}
            <KeyTakeaways article={article} />

            <motion.div 
              className="grid grid-cols-1 gap-8"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="visible"
            >
              {/* For external articles with just content, render differently */}
              {isExternalArticle ? (
                <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
                  <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                      {article.content || article.description}
                    </p>
                    {article.source && (
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-400">
                          Source: {article.source}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // For regular articles with sections - enhanced with EventCard
                sortedSections.map((section, index) => (
                  <EventCard key={section.id} section={section} index={index} />
                ))
              )}
            </motion.div>
            
            {/* New AI Analysis Section */}
            {hasAiAnalysis && (
              <motion.div
                id="ai-analysis-parent"
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
                    
                    {/* Implementation Details Section */}
                    {article.ai_analysis?.implementation_details && (
                      <AccordionItem 
                        value="implementation_details" 
                        id="ai-analysis-section-implementation_details"
                        className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-300 font-medium">Implementation Details</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0">
                          {article.ai_analysis?.implementation_details && renderAnalysisObject(article.ai_analysis?.implementation_details, 'implementation')}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    
                    {/* Cost-Benefit Analysis Section */}
                    {article.ai_analysis?.cost_benefit_analysis && (
                      <AccordionItem 
                        value="cost_benefit_analysis" 
                        id="ai-analysis-section-cost_benefit_analysis"
                        className="border border-blue-500/20 rounded-lg overflow-hidden bg-blue-950/10 px-0"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-blue-900/20">
                          <div className="flex items-center gap-2">
                            <LineChart className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-300 font-medium">Cost-Benefit Analysis</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0">
                          {article.ai_analysis?.cost_benefit_analysis && renderAnalysisObject(article.ai_analysis?.cost_benefit_analysis, 'cost-benefit')}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
              </motion.div>
            )}

            {/* Comments Section */}
            <div className="mt-12 bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-400" />
                Discussion ({article.comments?.length || 0})
              </h3>
              <NewsCardComments 
                newsId={article.id}
                comments={article.comments || []}
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-8">
              {/* Enhanced Article Table of Contents */}
              <ArticleTableOfContents 
                article={article}
                activeSection={activeSection}
              />
              
              {/* Sharing and bookmarking */}
              <div className="mt-6 bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                <div className="flex flex-col gap-3">
                  {onShare && (
                    <Button 
                      variant="outline" 
                      onClick={onShare} 
                      className="w-full justify-start gap-2 hover:bg-blue-900/20 hover:text-blue-300 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Article
                    </Button>
                  )}
                  
                  {onBookmark && (
                    <Button 
                      variant="outline" 
                      onClick={onBookmark} 
                      className="w-full justify-start gap-2 hover:bg-purple-900/20 hover:text-purple-300 transition-colors"
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Bookmark for Later
                    </Button>
                  )}
                  
                  {article.url && (
                    <Button 
                      variant="outline" 
                      onClick={handleExternalLink} 
                      className="w-full justify-start gap-2 hover:bg-amber-900/20 hover:text-amber-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Original Source
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
