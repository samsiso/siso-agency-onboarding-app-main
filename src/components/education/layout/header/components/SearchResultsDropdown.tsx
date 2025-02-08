
import { motion, AnimatePresence } from 'framer-motion';
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full mt-2 z-50"
        >
          <div className="relative mx-auto max-w-7xl">
            <div className="absolute inset-x-4 top-0 z-50 rounded-xl border border-[#FF5722]/20 bg-black/90 backdrop-blur-md shadow-2xl">
              <ScrollArea className="max-h-[calc(100vh-12rem)]">
                <div className="p-6 space-y-8">
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
