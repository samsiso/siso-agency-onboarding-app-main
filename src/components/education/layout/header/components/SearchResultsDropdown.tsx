
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchHistory } from './SearchHistory';
import { FeaturedEducators } from './FeaturedEducators';
import { PopularVideos } from './PopularVideos';

interface SearchResultsDropdownProps {
  isVisible: boolean;
  searchHistory: any[] | null;
  onHistoryCleared: () => Promise<void>;
  featuredEducators: any[] | undefined;
  educatorsLoading: boolean;
  recentVideos: any[] | undefined;
  videosLoading: boolean;
}

export const SearchResultsDropdown = ({
  isVisible,
  searchHistory,
  onHistoryCleared,
  featuredEducators,
  educatorsLoading,
  recentVideos,
  videosLoading
}: SearchResultsDropdownProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed inset-0 top-20 z-50 bg-black/90 backdrop-blur-md"
      style={{ height: 'calc(100vh - 5rem)' }}
    >
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
          {searchHistory && (
            <SearchHistory
              history={searchHistory}
              onHistoryCleared={onHistoryCleared}
            />
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90">Featured Educators</h3>
            <FeaturedEducators
              educators={featuredEducators}
              isLoading={educatorsLoading}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90">Popular Videos</h3>
            <PopularVideos
              videos={recentVideos}
              isLoading={videosLoading}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/90">Popular Learning Paths</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { path: "Python → Data Science → AI", color: "#FF5722" },
                { path: "React → Full Stack → Cloud", color: "#FF7043" },
                { path: "UI/UX → Web Design → Dev", color: "#FFA726" },
                { path: "Data Analysis → Statistics → ML", color: "#FF9100" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer group transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-base text-white/80 group-hover:text-white transition-colors">
                    {item.path}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
};
