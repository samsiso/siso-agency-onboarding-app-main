
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
  ThumbsDown
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

interface EventCardProps {
  section: ArticleSection;
  index: number;
}

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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(
              complexityColors[section.technical_complexity],
              "border text-sm px-3 py-1"
            )}>
              {section.technical_complexity}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/10"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {section.overview && (
                <div className="prose prose-invert max-w-none">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-400" />
                      <span className="text-base font-semibold text-blue-400">Overview</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-white/10"
                            onClick={() => handleCopyContent(section.overview)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy overview</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-200">{section.overview}</p>
                </div>
              )}

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

              <div className="prose prose-invert prose-lg max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: section.content }}
                  className="text-gray-200 leading-relaxed"
                />
              </div>

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

              {section.related_topics && section.related_topics.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-white/10 pt-6">
                  {section.related_topics.map((topic, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1 hover:bg-purple-500/20 transition-colors cursor-pointer"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}

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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
