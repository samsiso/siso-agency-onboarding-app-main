
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { EnhancedNewsItem, ArticleSection, TechnicalComplexity } from '@/types/blog';
import { cn } from '@/lib/utils';

interface EnhancedBlogLayoutProps {
  article: EnhancedNewsItem;
  onShare?: () => void;
  onBookmark?: () => void;
}

// [Analysis] Map section types to appropriate icons
const sectionIcons = {
  'research': Microscope,
  'integration': Network,
  'medical': Heart,
  'robotics': Bot,
  'international': Globe,
  'default': ExternalLink
};

// [Analysis] Color mappings for different importance levels
const importanceColors = {
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-500 border-green-500/20'
};

// [Analysis] Subsection type color mappings
const subsectionColors = {
  overview: 'from-blue-500/10 to-blue-600/10',
  analysis: 'from-purple-500/10 to-purple-600/10',
  key_details: 'from-orange-500/10 to-orange-600/10',
  implications: 'from-red-500/10 to-red-600/10',
  default: 'from-gray-500/10 to-gray-600/10'
};

const complexityColors: Record<TechnicalComplexity, string> = {
  basic: 'bg-green-500/10 text-green-500',
  intermediate: 'bg-yellow-500/10 text-yellow-500',
  advanced: 'bg-red-500/10 text-red-500',
  mixed: 'bg-purple-500/10 text-purple-500'
};

// [Analysis] Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const EventCard = ({ section }: { section: ArticleSection }) => {
  // Determine icon based on content
  const sectionType = section.title.toLowerCase().includes('research') ? 'research'
    : section.title.toLowerCase().includes('integration') ? 'integration'
    : section.title.toLowerCase().includes('medical') ? 'medical'
    : section.title.toLowerCase().includes('robot') ? 'robotics'
    : section.title.toLowerCase().includes('international') ? 'international'
    : 'default';

  const Icon = sectionIcons[sectionType];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      className={cn(
        "rounded-xl overflow-hidden backdrop-blur-sm border border-white/10",
        "bg-gradient-to-br",
        subsectionColors[section.subsection_type as keyof typeof subsectionColors] || subsectionColors.default
      )}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              importanceColors[section.importance_level as keyof typeof importanceColors]
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
          </div>
          <Badge variant="outline" className={cn(
            complexityColors[section.technical_complexity],
            "border text-xs"
          )}>
            {section.technical_complexity}
          </Badge>
        </div>

        {/* Overview Section */}
        {section.overview && (
          <div className="prose prose-invert max-w-none">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">Overview</span>
            </div>
            <p className="text-gray-300">{section.overview}</p>
          </div>
        )}

        {/* Key Details Section */}
        {section.key_details && section.key_details.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Key Details</span>
            </div>
            <ul className="space-y-2">
              {(section.key_details as string[]).map((detail, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-siso-red">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>

        {/* Implications Section */}
        {section.implications && section.implications.length > 0 && (
          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 text-gray-400">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Implications</span>
            </div>
            <ul className="space-y-2">
              {(section.implications as string[]).map((implication, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-siso-orange">→</span>
                  <span>{implication}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 flex items-center justify-between text-sm text-gray-400 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {new Date(section.last_updated).toLocaleDateString()}
            {section.reading_time_minutes && (
              <>
                <span className="mx-2">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {section.reading_time_minutes} min read
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {section.source_references && Object.entries(section.source_references).map(([key, value]) => (
              <Badge key={key} variant="outline" className="bg-white/5">
                {key}
              </Badge>
            ))}
          </div>
        </div>
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
              {sortedSections.map((section) => (
                <EventCard key={section.id} section={section} />
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

