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
import { AIAnalysisButton } from './blog-layout/AIAnalysisButton';
import { AIAnalysisSection } from './blog-layout/AIAnalysisSection';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';

interface EnhancedBlogLayoutProps {
  article: EnhancedNewsItem & { comments?: NewsComment[] };
  onShare?: () => void;
  onBookmark?: () => void;
  onAnalyze?: () => Promise<void>;
}

export const EnhancedBlogLayout = ({
  article,
  onShare,
  onBookmark,
  onAnalyze
}: EnhancedBlogLayoutProps) => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const [activeSection, setActiveSection] = useState<string>();
  const [liked, setLiked] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(article);
  
  // [Analysis] Update current article when prop changes
  useEffect(() => {
    setCurrentArticle(article);
  }, [article]);
  
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

    // Observe all content sections
    const ids = [
      'key-takeaways', 
      ...sortedSections.map(section => section.id),
      'ai-analysis-section',
      'community-notes'
    ];
    
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sortedSections, currentArticle.ai_analysis]);

  // [Analysis] Handle external link navigation
  const handleExternalLink = () => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleLike = () => {
    setLiked(!liked);
  };

  // [Analysis] Handle AI analysis generation with improved data refresh
  const handleGenerateAnalysis = async () => {
    if (!onAnalyze) {
      console.error('No onAnalyze handler provided');
      return;
    }

    setIsGeneratingAnalysis(true);
    
    try {
      // Refresh the article data through the parent component
      await onAnalyze();
      
      toast.success('AI analysis loaded successfully!');
    } catch (error) {
      console.error('Error refreshing article data:', error);
      toast.error('Failed to load AI analysis. Please try again.');
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  // [Analysis] Check for meaningful analysis data with multiple properties
  const hasAnalysis = currentArticle.ai_analysis && 
    Object.keys(currentArticle.ai_analysis || {}).length > 0 &&
    // Check for at least one key property that should have data
    (currentArticle.ai_analysis.key_points?.length > 0 || 
     currentArticle.ai_analysis.market_impact || 
     currentArticle.ai_analysis.business_implications);

  // Determine if we should show the AI analysis button
  const showAnalysisButton = !hasAnalysis;

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
                  {article.comments ? (Array.isArray(article.comments) ? article.comments.length : 0) : 0} comments
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
            
            {/* AI Analysis Section */}
            <AIAnalysisSection article={currentArticle} />

            {/* Comments Section now named Community Notes */}
            <div id="community-notes" className="mt-12 bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-400" />
                Community Notes ({article.comments ? (Array.isArray(article.comments) ? article.comments.length : 0) : 0})
              </h3>
              <NewsCardComments 
                newsId={article.id}
                comments={article.comments || []}
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Enhanced Article Table of Contents */}
              <ArticleTableOfContents 
                article={article}
                activeSection={activeSection}
              />
              
              {/* AI Analysis Button (only shown if no analysis exists) */}
              {showAnalysisButton && (
                <AIAnalysisButton 
                  article={currentArticle}
                  onAnalyze={handleGenerateAnalysis}
                  isGenerating={isGeneratingAnalysis}
                />
              )}
              
              {/* Sharing and bookmarking */}
              <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
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
