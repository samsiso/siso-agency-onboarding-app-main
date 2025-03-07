
import React from 'react';
import { motion } from 'framer-motion';
import { BadgeAlert, Sparkles, TrendingUp } from 'lucide-react';
import { NewsItem } from '@/types/blog';
import { GradientSectionTitle } from './GradientSectionTitle';
import { EnhancedNewsCard } from './EnhancedNewsCard';

// [Analysis] Spotlight section for high-importance news items
interface FeaturedNewsSectionProps {
  newsItems: NewsItem[];
  onAnalyzeArticle?: (id: string) => Promise<void>;
}

export const FeaturedNewsSection: React.FC<FeaturedNewsSectionProps> = ({
  newsItems,
  onAnalyzeArticle
}) => {
  // Get featured or high importance news items
  const featuredItems = newsItems.filter(item => 
    item.featured || 
    (item.ai_importance_score && item.ai_importance_score > 80)
  ).slice(0, 3);
  
  if (featuredItems.length === 0) return null;
  
  return (
    <section className="mb-10">
      <GradientSectionTitle 
        title="Featured Insights" 
        subtitle="Top stories with highest AI importance scores"
        icon={<Sparkles className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredItems.map((item, index) => (
          <EnhancedNewsCard 
            key={item.id} 
            item={item} 
            onAnalyzeArticle={onAnalyzeArticle}
          />
        ))}
      </div>
    </section>
  );
};
