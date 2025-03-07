
import React from 'react';
import { motion } from 'framer-motion';
import { EnhancedNewsItem } from '@/types/blog';
import { EventCard } from '../EventCard';
import { KeyTakeaways } from '../KeyTakeaways';
import { AIAnalysisSection } from '../AIAnalysisSection';
import { CommentsSection } from './CommentsSection';

// [Analysis] This component handles rendering the main content of the blog 
interface BlogContentProps {
  article: EnhancedNewsItem & { comments?: any[] };
  onAnalyze?: () => Promise<void>;
}

export const BlogContent = ({ article, onAnalyze }: BlogContentProps) => {
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

  return (
    <div className="lg:col-span-8 space-y-8">
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
      <AIAnalysisSection article={article} onAnalyze={onAnalyze} />

      {/* Comments Section now named Community Notes */}
      <CommentsSection 
        newsId={article.id} 
        comments={article.comments || []} 
      />
    </div>
  );
};
