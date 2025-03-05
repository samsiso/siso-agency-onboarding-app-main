
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { EnhancedNewsItem } from '@/types/blog';
import { 
  ChevronLeft, 
  Share2, 
  BookmarkPlus,
  Eye,
  Clock,
  MessageCircle,
  ExternalLink
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

interface EnhancedBlogLayoutProps {
  article: EnhancedNewsItem & { comments?: Array<{
    id: string;
    content: string;
    created_at: string;
    user_email: string;
    updated_at: string;
    news_id: string;
  }> };
  onShare?: () => void;
  onBookmark?: () => void;
}

export const EnhancedBlogLayout = ({
  article,
  onShare,
  onBookmark
}: EnhancedBlogLayoutProps) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>();
  
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
      { threshold: 0.5 }
    );

    // Observe all content sections
    sortedSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sortedSections]);

  // [Analysis] Handle external link navigation
  const handleExternalLink = () => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-siso-red/20 origin-left z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/ai-news')}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
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

              <div className="flex items-center gap-4 text-sm text-gray-400">
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
            
            {/* Added Hero Image */}
            <HeroImage article={article} />
            
            {/* Added Key Takeaways */}
            <KeyTakeaways article={article} />

            <motion.div 
              className="grid grid-cols-1 gap-6"
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
                // For regular articles with sections
                sortedSections.map((section, index) => (
                  <EventCard key={section.id} section={section} index={index} />
                ))
              )}
            </motion.div>

            {/* Comments Section */}
            <div className="mt-12 bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Discussion</h3>
              <NewsCardComments 
                newsId={article.id}
                comments={article.comments || []}
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-8">
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
                      className="w-full justify-start gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Article
                    </Button>
                  )}
                  
                  {onBookmark && (
                    <Button 
                      variant="outline" 
                      onClick={onBookmark} 
                      className="w-full justify-start gap-2"
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Bookmark for Later
                    </Button>
                  )}
                  
                  {article.url && (
                    <Button 
                      variant="outline" 
                      onClick={handleExternalLink} 
                      className="w-full justify-start gap-2"
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
