import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ArticleSection, TechnicalComplexity } from '@/types/blog';
import { 
  Clock, 
  Copy,
  ChevronLeft,
  Globe,
  Bot,
  Microscope,
  Network,
  Heart,
  ExternalLink,
  Info,
  MessageSquare,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Brain,
  RefreshCcw
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  complexityColors, 
  importanceColors, 
  sectionIcons, 
  subsectionColors 
} from './constants';
import { cardVariants } from './animations';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EventCardProps {
  section: ArticleSection;
  index: number;
}

// [Analysis] Added mock data for sources and analysis
const mockSources = [
  { title: "Official Research Paper", url: "#", type: "research" },
  { title: "Related Study: Impact Analysis", url: "#", type: "study" },
  { title: "Original Dataset", url: "#", type: "data" },
  { title: "Expert Commentary", url: "#", type: "article" },
];

export const EventCard = ({ section, index }: EventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();
  const [hasReacted, setHasReacted] = useState(false);

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
      // First check if we have existing analysis
      const { data: existingAnalysis } = await supabase
        .from('news_ai_analysis')
        .select('*')
        .eq('section_id', section.id)
        .single();

      if (existingAnalysis) {
        return existingAnalysis;
      }

      // If no existing analysis, generate new one
      const response = await supabase.functions.invoke('analyze-news', {
        body: {
          content: section.content,
          title: section.title,
          key_details: section.key_details,
          implications: section.implications,
          news_id: section.article_id,
          section_id: section.id
        },
      });

      if (response.error) throw response.error;
      return response.data.analysis;
    },
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-lg transition-transform duration-300 group-hover:scale-110",
              importanceColors[section.importance_level as keyof typeof importanceColors]
            )}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-siso-orange transition-colors duration-300">
              {section.title}
            </h3>
          </div>
        </div>

        {/* Key Points Section */}
        {section.key_details && section.key_details.length > 0 && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="text-base font-semibold text-emerald-400">Key Details</span>
            </div>
            <ul className="space-y-3">
              {section.key_details.map((detail, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-lg text-gray-200 group/item"
                >
                  <span className="text-emerald-400 mt-1.5">•</span>
                  <span className="leading-relaxed flex-1">{detail}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                    onClick={() => handleCopyContent(detail)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: section.content }}
            className="text-gray-200 leading-relaxed"
          />
        </div>

        {/* Analysis Section */}
        <Accordion type="single" collapsible className="w-full border-t border-white/10 pt-4">
          <AccordionItem value="analysis" className="border-none">
            <AccordionTrigger className="text-sm font-medium text-white hover:no-underline">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-400" />
                AI Analysis
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {isAnalysisLoading ? (
                <div className="flex items-center justify-center py-4">
                  <RefreshCcw className="w-5 h-5 text-white/50 animate-spin" />
                </div>
              ) : analysis ? (
                <div className="space-y-4 pt-2">
                  {/* Key Insights */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white/80">Key Insights</h4>
                    <ul className="space-y-1">
                      {analysis.key_insights.map((insight, i) => (
                        <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Market Impact */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white/80">Market Impact</h4>
                    <p className="text-sm text-white/70">{analysis.market_impact}</p>
                  </div>

                  {/* Tech Predictions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white/80">Technology Predictions</h4>
                    <ul className="space-y-1">
                      {analysis.tech_predictions.map((prediction, i) => (
                        <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">→</span>
                          <span>{prediction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Related Technologies */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white/80">Related Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.related_technologies.map((tech, i) => (
                        <Badge key={i} variant="outline" className="bg-white/5">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-sm text-white/60">Analysis Confidence</span>
                    <Badge variant="outline" className={cn(
                      "bg-white/5",
                      analysis.confidence_score >= 0.8 ? "text-green-400" :
                      analysis.confidence_score >= 0.6 ? "text-yellow-400" :
                      "text-red-400"
                    )}>
                      {Math.round(analysis.confidence_score * 100)}%
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-sm text-white/60 text-center">
                  No analysis available
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Sources Section */}
        <Accordion type="single" collapsible className="w-full border-t border-white/10 pt-4">
          <AccordionItem value="sources" className="border-none">
            <AccordionTrigger className="text-sm font-medium text-white hover:no-underline">
              Related Resources
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 mt-2">
                {mockSources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    className="flex items-center justify-between p-2 text-sm text-gray-300 hover:bg-white/5 rounded-md transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{source.title}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Implications Section */}
        {section.implications && section.implications.length > 0 && (
          <motion.div 
            className="space-y-4 border-t border-white/10 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-orange-400" />
              <span className="text-base font-semibold text-orange-400">Implications & Impact</span>
            </div>
            <ul className="space-y-3">
              {section.implications.map((implication, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-lg text-gray-200 group/item"
                >
                  <span className="text-orange-400 mt-1.5">→</span>
                  <span className="leading-relaxed flex-1">{implication}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                    onClick={() => handleCopyContent(implication)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Footer Section */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-400 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {new Date(section.last_updated).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {section.reading_time_minutes && (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {section.reading_time_minutes} min read
              </span>
            )}
            {section.category && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                {section.category}
              </Badge>
            )}
          </div>

          {/* Reactions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/10"
                onClick={() => handleReaction('like')}
                disabled={hasReacted}
              >
                <ThumbsUp className={cn("h-4 w-4", hasReacted && "text-green-500")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/10"
                onClick={() => handleReaction('dislike')}
                disabled={hasReacted}
              >
                <ThumbsDown className={cn("h-4 w-4", hasReacted && "text-red-500")} />
              </Button>
            </div>

            {/* Source References */}
            {section.source_references && Object.entries(section.source_references).map(([key, value]) => (
              <TooltipProvider key={key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      {key}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View source: {value as string}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
