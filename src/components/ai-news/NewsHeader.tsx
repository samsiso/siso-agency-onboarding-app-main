import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewsSearchSection } from './NewsSearchSection';
import { motion } from 'framer-motion';

interface NewsHeaderProps {
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  postStatus: 'all' | 'draft' | 'published';
  onPostStatusChange: (value: 'all' | 'draft' | 'published') => void;
}

// [Analysis] Database column mapping to UI components:
// - title -> Main heading in NewsCard and hero section
// - description -> Preview text in NewsCard
// - content -> Full article content in detail view
// - category -> Filter chips and category badge
// - source -> Source attribution in NewsCard footer
// - impact -> Colored badge indicating importance
// - date -> Display date and filtering
// - technical_complexity -> Difficulty badge
// - article_type -> Content type filtering
// - source_credibility -> Verification badge
// - tags -> Search keywords and related content
// - reading_time -> Estimated read time display
// - status -> Draft/Published filtering
// - image_url -> Card and hero thumbnails
// - author_id -> Links to profiles table for author info
// - views -> Analytics and trending calculation
// - bookmarks -> User engagement metric
// - meta_description -> SEO and social sharing

// [Analysis] Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const statsData = [
  { label: "Published", value: "50+" },
  { label: "Categories", value: "10+" },
  { label: "Monthly Readers", value: "1.2K" }
];

const NewsHeader = ({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange, 
  onYearChange,
  searchQuery,
  onSearchChange,
  postStatus,
  onPostStatusChange
}: NewsHeaderProps) => {
  return (
    <div className="relative">
      {/* Background gradient and blur effect */}
      <div className="absolute inset-0 bg-gradient-radial from-siso-orange/20 via-transparent to-transparent opacity-30 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-siso-red/10 via-transparent to-transparent animate-pulse" />
      </div>

      {/* Content container */}
      <div className="sticky top-0 z-50">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
        >
          {/* Header content */}
          <div className="relative space-y-6">
            <motion.div 
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-siso-red via-siso-orange to-siso-red bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                SISO Updates
              </h1>
              <p className="text-siso-text/80 text-sm sm:text-base max-w-2xl mx-auto">
                Your trusted source for AI technology news and insights. Stay informed about the latest developments and breakthroughs.
              </p>
            </motion.div>

            {/* Stats display */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center gap-8 py-6"
            >
              {statsData.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="text-center px-4 py-2 rounded-lg bg-siso-text/5 hover:bg-siso-text/10 transition-all duration-300"
                >
                  <div className="text-xl font-semibold text-siso-text-bold">{stat.value}</div>
                  <div className="text-sm text-siso-text/70">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Search section */}
            <motion.div variants={itemVariants}>
              <NewsSearchSection 
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
              />
            </motion.div>

            {/* Filters section */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <div className="flex items-center gap-2 bg-siso-bg-alt/50 p-2 rounded-lg border border-siso-border backdrop-blur-sm">
                <Select value={selectedMonth} onValueChange={onMonthChange}>
                  <SelectTrigger className="w-[120px] h-9 sm:h-10 bg-siso-bg-alt/50 border-siso-border">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="03">March</SelectItem>
                    <SelectItem value="02">February</SelectItem>
                    <SelectItem value="01">January</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={onYearChange}>
                  <SelectTrigger className="w-[120px] h-9 sm:h-10 bg-siso-bg-alt/50 border-siso-border">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={postStatus} onValueChange={onPostStatusChange}>
                  <SelectTrigger className="w-[120px] h-9 sm:h-10 bg-siso-bg-alt/50 border-siso-border backdrop-blur-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsHeader;
