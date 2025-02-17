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
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { EventCard } from './blog-layout/EventCard';
import { complexityColors } from './blog-layout/constants';
import { cn } from '@/lib/utils';
import { ArticleTableOfContents } from './blog-layout/ArticleTableOfContents';
import { useState, useEffect } from 'react';

interface EnhancedBlogLayoutProps {
  article: EnhancedNewsItem;
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

  const sortedSections = [...article.sections].sort((a, b) => {
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

    // Observe key takeaways section
    const keyTakeawaysElement = document.getElementById('key-takeaways');
    if (keyTakeawaysElement) {
      observer.observe(keyTakeawaysElement);
    }

    // Observe all content sections
    sortedSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sortedSections]);

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
              </div>
            </div>

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
              {sortedSections.map((section, index) => (
                <EventCard key={section.id} section={section} index={index} />
              ))}
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <ArticleTableOfContents 
              article={article}
              activeSection={activeSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
