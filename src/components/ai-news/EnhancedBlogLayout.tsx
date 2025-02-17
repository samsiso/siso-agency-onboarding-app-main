import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { EnhancedNewsItem, ArticleSection, TechnicalComplexity } from '@/types/blog';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  Eye, 
  Share2, 
  BookmarkPlus,
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
  Copy,
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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// [Analysis] Define interfaces at the top of the file for better organization
interface EventCardProps {
  section: ArticleSection;
  index: number;
}

interface EnhancedBlogLayoutProps {
  article: EnhancedNewsItem;
  onShare?: () => void;
  onBookmark?: () => void;
}

// [Analysis] Map section types to appropriate icons with semantic meaning
const sectionIcons = {
  'research': Microscope,
  'integration': Network,
  'medical': Heart,
  'robotics': Bot,
  'international': Globe,
  'default': ExternalLink
};

// [Analysis] Color mappings with improved contrast ratios
const importanceColors = {
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-500 border-green-500/20'
};

// [Analysis] Enhanced subsection colors with gradients
const subsectionColors = {
  overview: 'from-blue-500/10 via-blue-400/5 to-blue-600/10',
  analysis: 'from-purple-500/10 via-purple-400/5 to-purple-600/10',
  key_details: 'from-orange-500/10 via-orange-400/5 to-orange-600/10',
  implications: 'from-red-500/10 via-red-400/5 to-red-600/10',
  default: 'from-gray-500/10 via-gray-400/5 to-gray-600/10'
};

const complexityColors: Record<TechnicalComplexity, string> = {
  basic: 'bg-green-500/10 text-green-500',
  intermediate: 'bg-yellow-500/10 text-yellow-500',
  advanced: 'bg-red-500/10 text-red-500',
  mixed: 'bg-purple-500/10 text-purple-500'
};

// [Analysis] Enhanced animation variants with smoother transitions
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const EventCard = ({ section, index }: EventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();
  const [hasReacted, setHasReacted] = useState(false);

  // [Analysis] Determine icon based on content semantics
  const sectionType = section.title.toLowerCase().includes('research') ? 'research'
    : section.title.toLowerCase().includes('integration') ? 'integration'
    : section.title.toLowerCase().includes('medical') ? 'medical'
    : section.title.toLowerCase().includes('robot') ? 'robotics'
    : section.title.toLowerCase().includes('international') ? 'international'
    : 'default';

  const Icon = sectionIcons[sectionType];

  // [Analysis] Handle copy to clipboard with user feedback
  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Content copied!",
      description: "The text has been copied to your clipboard.",
    });
  };

  // [Analysis] Handle user reactions with visual feedback
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
      {/* Pearling effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[shimmer_2s_infinite]" />

      <div className="p-8 space-y-6 relative z-10">
        {/* Enhanced Header with Interactive Elements */}
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
              {/* Overview Section with Copy Feature */}
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

              {/* Key Details Section with Interactive Elements */}
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

              {/* Implications Section with Enhanced Styling */}
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

              {/* Related Topics with Interactive Tags */}
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

              {/* Enhanced Footer with Interactive Elements */}
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
                  {/* Reaction Buttons */}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const EnhancedBlogLayout = ({
  article,
  onShare,
  onBookmark
}: EnhancedBlogLayoutProps) => {
  const navigate = useNavigate();

  // [Analysis] Sort sections by importance and order
  const sortedSections = [...article.sections].sort((a, b) => {
    if (a.importance_level === 'high' && b.importance_level !== 'high') return -1;
    if (a.importance_level !== 'high' && b.importance_level === 'high') return 1;
    return a.section_order - b.section_order;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
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
                <Badge variant="outline" className={cn(
                  complexityColors[article.technical_complexity]
                )}>
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

              <h1 className="text-4xl font-bold text-white bg-clip-text">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-400">
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

            {/* Event Cards Grid */}
            <motion.div 
              className="grid grid-cols-1 gap-6"
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
              {sortedSections.map((section, index) => (
                <EventCard key={section.id} section={section} index={index} />
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* Table of Contents */}
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Table of Contents</h3>
                <ScrollArea className="h-[300px]">
                  <nav className="space-y-2">
                    {article.table_of_contents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "block text-sm text-gray-400 hover:text-white transition-colors",
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
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Key Takeaways</h3>
                <ul className="space-y-2">
                  {article.key_takeaways.map((takeaway, index) => (
                    <li key={index} className="text-sm text-gray-400">
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
                  className="flex-1 border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  onClick={onBookmark}
                  className="flex-1 border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10"
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
