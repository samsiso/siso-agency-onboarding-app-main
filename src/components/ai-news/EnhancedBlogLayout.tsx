
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

  const sortedSections = [...article.sections].sort((a, b) => {
    if (a.importance_level === 'high' && b.importance_level !== 'high') return -1;
    if (a.importance_level !== 'high' && b.importance_level === 'high') return 1;
    return a.section_order - b.section_order;
  });

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
            <div className="sticky top-8 space-y-8">
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Table of Contents</h3>
                <ScrollArea className="h-[300px]">
                  <nav className="space-y-2">
                    {article.table_of_contents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "block text-sm text-gray-400 hover:text-white transition-colors",
                          item.level === 1 ? "font-medium" : "pl-4"
                        )}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </ScrollArea>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Key Takeaways</h3>
                <ul className="space-y-2">
                  {article.key_takeaways.map((takeaway, index) => (
                    <li key={index} className="text-sm text-gray-400">
                      • {takeaway}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={onShare}
                  className="flex-1 border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={onBookmark}
                  className="flex-1 border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                >
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
