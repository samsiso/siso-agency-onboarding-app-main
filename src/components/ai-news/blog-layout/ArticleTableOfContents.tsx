
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowUp, List, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { EnhancedNewsItem } from '@/types/blog';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

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
  const [isTOCExpanded, setIsTOCExpanded] = useState(true);
  
  // [Analysis] Generate table of contents items from article sections and key takeaways
  const tableItems: TableItem[] = [
    { id: 'key-takeaways', title: 'Key Takeaways', type: 'section' } as const,
    ...article.sections.map((section) => ({
      id: section.id,
      title: section.title,
      type: 'content' as const,
      importance: section.importance_level
    }))
  ];

  // Calculate reading progress
  const currentIndex = activeSection 
    ? tableItems.findIndex(item => item.id === activeSection) 
    : 0;
  const readingProgress = Math.max(0, Math.min(100, 
    (currentIndex / Math.max(1, tableItems.length - 1)) * 100
  ));

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "w-full text-left p-2.5 rounded-lg transition-all duration-200 flex items-start gap-2",
                      isActive 
                        ? "bg-blue-900/30 shadow-sm border border-blue-500/20" 
                        : isPassed 
                          ? "text-gray-400 hover:bg-gray-800/40" 
                          : "hover:bg-gray-800/40"
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
                      <p className={cn(
                        "text-sm font-medium line-clamp-2",
                        isActive 
                          ? "text-blue-300" 
                          : isPassed 
                            ? "text-gray-400" 
                            : "text-gray-300"
                      )}>
                        {item.title}
                      </p>
                      
                      {item.type === 'content' && item.importance && (
                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${getImportanceColor(item.importance)}`}>
                          {item.importance} Priority
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
