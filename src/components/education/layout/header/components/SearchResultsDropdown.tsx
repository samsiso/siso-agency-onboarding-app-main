
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
      className="absolute mt-2 w-full max-h-[80vh] bg-black/90 border border-[#FF5722]/20 rounded-xl backdrop-blur-sm shadow-xl overflow-hidden"
      style={{ maxHeight: 'calc(100vh - 200px)' }}
    >
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {searchHistory && (
            <SearchHistory
              history={searchHistory}
              onHistoryCleared={onHistoryCleared}
            />
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/80">Featured Educators</h3>
            <FeaturedEducators
              educators={featuredEducators}
              isLoading={educatorsLoading}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/80">Popular Videos</h3>
            <PopularVideos
              videos={recentVideos}
              isLoading={videosLoading}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/80">Popular Learning Paths</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { path: "Python → Data Science → AI", color: "#FF5722" },
                { path: "React → Full Stack → Cloud", color: "#FF7043" },
                { path: "UI/UX → Web Design → Dev", color: "#FFA726" },
                { path: "Data Analysis → Statistics → ML", color: "#FF9100" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/5 cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
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
