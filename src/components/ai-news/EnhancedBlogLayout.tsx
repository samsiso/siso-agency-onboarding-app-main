
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Share2, BookmarkPlus, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { EnhancedNewsItem, TechnicalComplexity } from '@/types/blog';
import { cn } from '@/lib/utils';

interface EnhancedBlogLayoutProps {
  article: EnhancedNewsItem;
  onShare?: () => void;
  onBookmark?: () => void;
}

const complexityColors: Record<TechnicalComplexity, string> = {
  basic: 'bg-green-500/10 text-green-500',
  intermediate: 'bg-yellow-500/10 text-yellow-500',
  advanced: 'bg-red-500/10 text-red-500',
  mixed: 'bg-purple-500/10 text-purple-500'
};

export const EnhancedBlogLayout = ({
  article,
  onShare,
  onBookmark
}: EnhancedBlogLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-siso-red/20 origin-left z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/ai-news')}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={cn("border-none", 
                  complexityColors[article.technical_complexity])}>
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

              <h1 className="text-4xl font-bold text-siso-text-bold">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-siso-text/60">
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

            {/* Featured Image */}
            {article.image_url && (
              <div className="aspect-video relative overflow-hidden rounded-xl border border-siso-border">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              {article.sections.map((section) => (
                <div key={section.id} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* Table of Contents */}
              <div className="bg-card rounded-lg border border-siso-border p-6">
                <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                <ScrollArea className="h-[300px]">
                  <nav className="space-y-2">
                    {article.table_of_contents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "block text-sm text-siso-text/60 hover:text-siso-text transition-colors",
                          item.level === 1 ? "font-medium" : "pl-4"
                        )}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </ScrollArea>
              </div>

              {/* Key Takeaways */}
              <div className="bg-card rounded-lg border border-siso-border p-6">
                <h3 className="text-lg font-semibold mb-4">Key Takeaways</h3>
                <ul className="space-y-2">
                  {article.key_takeaways.map((takeaway, index) => (
                    <li key={index} className="text-sm text-siso-text/80">
                      • {takeaway}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={onShare}
                  className="flex-1 hover:bg-siso-red/10 hover:text-siso-red"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={onBookmark}
                  className="flex-1 hover:bg-siso-red/10 hover:text-siso-red"
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
