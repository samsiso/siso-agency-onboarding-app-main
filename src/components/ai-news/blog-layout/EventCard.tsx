
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ArticleSection } from '@/types/blog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { sectionIcons, subsectionColors } from './constants';
import { cardVariants } from './animations';
import { CardHeader } from './components/CardHeader';
import { KeyDetails } from './components/KeyDetails';
import { AIAnalysis } from './components/AIAnalysis';
import { CardFooter } from './components/CardFooter';

interface EventCardProps {
  section: ArticleSection;
  index: number;
}

export const EventCard = ({ section, index }: EventCardProps) => {
  const [hasReacted, setHasReacted] = useState(false);
  const { toast } = useToast();

  // [Analysis] Determine section type for icon selection
  const sectionType = section.title.toLowerCase().includes('research') ? 'research'
    : section.title.toLowerCase().includes('integration') ? 'integration'
    : section.title.toLowerCase().includes('medical') ? 'medical'
    : section.title.toLowerCase().includes('robot') ? 'robotics'
    : section.title.toLowerCase().includes('international') ? 'international'
    : 'default';

  const Icon = sectionIcons[sectionType];

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Content copied!",
      description: "The text has been copied to your clipboard.",
    });
  };

  const handleReaction = (type: 'like' | 'dislike') => {
    if (!hasReacted) {
      setHasReacted(true);
      toast({
        title: "Thanks for your feedback!",
        description: `You ${type}d this section.`,
      });
    }
  };

  // [Analysis] Fetch AI analysis for this section
  const { data: analysis, isLoading: isAnalysisLoading } = useQuery({
    queryKey: ['section-analysis', section.id],
    queryFn: async () => {
      try {
        // First check if we have existing analysis
        const { data: existingAnalysis, error: fetchError } = await supabase
          .from('news_ai_analysis')
          .select('*')
          .eq('id', section.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingAnalysis) {
          return existingAnalysis;
        }

        // If no existing analysis, generate new one
        const { data: analysisData, error: invokeError } = await supabase.functions.invoke('analyze-news', {
          body: {
            content: section.content,
            title: section.title,
            key_details: section.key_details || [],
            implications: section.implications || [],
            section_id: section.id,
            news_id: section.article_id // Add the news_id from the section's article_id
          },
        });

        if (invokeError) throw invokeError;
        return analysisData?.analysis;
      } catch (error) {
        console.error('Error in analysis flow:', error);
        throw error;
      }
    },
    retry: 1,
    enabled: !!section.id
  });

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "rounded-xl overflow-hidden backdrop-blur-lg border border-white/10",
        "bg-gradient-to-br shadow-lg transition-all duration-300",
        "hover:shadow-xl hover:border-white/20",
        "group relative",
        subsectionColors[section.subsection_type as keyof typeof subsectionColors] || subsectionColors.default
      )}
    >
      {sectionType === 'research' && (
        <div className="relative w-full h-[200px] overflow-hidden">
          <img 
            src="/lovable-uploads/05fd06bb-d4a1-4caf-81e9-3572f608b3a6.png"
            alt="Deep Research Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[shimmer_2s_infinite]" />

      <div className="p-8 space-y-6 relative z-10">
        <CardHeader 
          title={section.title}
          icon={Icon}
          importanceLevel={section.importance_level}
        />

        <KeyDetails 
          details={section.key_details || []}
          onCopy={handleCopyContent}
        />

        <div className="prose prose-invert prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: section.content }}
            className="text-gray-200 leading-relaxed"
          />
        </div>

        <AIAnalysis 
          analysis={analysis}
          isLoading={isAnalysisLoading}
        />

        <CardFooter 
          lastUpdated={section.last_updated || section.updated_at}
          readingTime={section.reading_time_minutes}
          category={section.category}
          hasReacted={hasReacted}
          onReaction={handleReaction}
          sourceReferences={section.source_references}
        />
      </div>
    </motion.div>
  );
};
