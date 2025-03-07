
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedNewsItem } from '@/types/blog';
import { 
  FileText, 
  Lightbulb, 
  MessageCircle,
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

  // Determine if key takeaways should be shown
  const showKeyTakeaways = article.key_takeaways && article.key_takeaways.length > 0;

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
