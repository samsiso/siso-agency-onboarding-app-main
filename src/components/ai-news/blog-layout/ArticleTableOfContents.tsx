
import React from 'react';
import { EnhancedNewsItem } from '@/types/blog';
import { ListRestart, ArrowUpDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { AIAnalysis } from './components/AIAnalysis';

// [Analysis] This component renders the table of contents for the article
interface ArticleTableOfContentsProps {
  article: EnhancedNewsItem;
  activeSection?: string;
  onRefreshAnalysis?: () => Promise<void>;
}

export const ArticleTableOfContents = ({ 
  article, 
  activeSection,
  onRefreshAnalysis
}: ArticleTableOfContentsProps) => {
  // Generate TOC items from sections and special sections
  const tocItems = [
    { id: 'key-takeaways', title: 'Key Takeaways', level: 1 },
    ...article.sections.map(section => ({
      id: section.id,
      title: section.title,
      level: section.importance_level === 'high' ? 1 : 2,
    })),
    { id: 'ai-analysis-section', title: 'AI Analysis', level: 1 },
    { id: 'community-notes', title: 'Community Notes', level: 1 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Contents</h3>
          
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode" className="text-xs text-gray-400">Auto-scroll</Label>
          </div>
        </div>
        
        <nav className="space-y-1">
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "block py-1 px-2 text-sm rounded-md transition-colors",
                activeSection === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-400 hover:text-gray-300 hover:bg-white/5",
                item.level === 2 && "pl-4"
              )}
            >
              {item.title}
            </a>
          ))}
        </nav>
        
        <div className="mt-3 flex justify-end">
          <button className="flex items-center text-xs text-gray-400 hover:text-gray-300">
            <ListRestart className="h-3 w-3 mr-1" />
            Reset Position
          </button>
        </div>
      </div>
      
      {/* AI Analysis Component */}
      <AIAnalysis 
        analysis={article.ai_analysis}
        articleTitle={article.title}
        articleId={article.id}
        onRefresh={onRefreshAnalysis}
      />
    </div>
  );
};
