
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { EnhancedNewsItem } from '@/types/blog';

interface ArticleTableOfContentsProps {
  article: EnhancedNewsItem;
  activeSection?: string;
}

// [Analysis] Define distinct types for section and content items
type TableItem = {
  id: string;
  title: string;
  type: 'section' | 'content';
  importance?: string;
};

export const ArticleTableOfContents = ({ article, activeSection }: ArticleTableOfContentsProps) => {
  // [Analysis] Generate table of contents items from article sections and key takeaways
  const tableItems: TableItem[] = [
    { id: 'key-takeaways', title: 'Key Takeaways', type: 'section' },
    ...article.sections.map((section) => ({
      id: section.id,
      title: section.title,
      type: 'content',
      importance: section.importance_level
    }))
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <div className="sticky top-8 space-y-8">
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Contents</h3>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {tableItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200
                  ${activeSection === item.id 
                    ? 'bg-siso-text/10 shadow-sm' 
                    : 'hover:bg-siso-text/5'
                  }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-siso-text/90 line-clamp-2">
                      {item.title}
                    </p>
                    {item.type === 'content' && item.importance && (
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${getImportanceColor(item.importance)}`}>
                        {item.importance} Priority
                      </span>
                    )}
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 mt-1 transition-colors
                      ${activeSection === item.id 
                        ? 'text-siso-orange' 
                        : 'text-siso-text/40'
                      }`}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </ScrollArea>
        
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
