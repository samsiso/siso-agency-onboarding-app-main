import { motion } from 'framer-motion';
import { Search, Users, Video, GraduationCap, Command, Mic, History } from 'lucide-react';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface EducationHeaderProps {
  stats: {
    totalEducators: number;
    totalVideos: number;
    totalStudents: number;
  };
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const EducationHeader = ({ stats, searchQuery, onSearchChange }: EducationHeaderProps) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Keyboard shortcut to focus search
  useHotkeys('mod+k', (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  const statCards = [
    {
      icon: GraduationCap,
      label: "Total Educators",
      value: stats.totalEducators,
      gradient: "from-siso-red/20 to-siso-orange/20",
      iconColor: "text-siso-red"
    },
    {
      icon: Video,
      label: "Total Videos",
      value: stats.totalVideos,
      gradient: "from-blue-500/20 to-purple-500/20",
      iconColor: "text-blue-500"
    },
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-500"
    }
  ];

  const searchPlaceholders = [
    "Search for AI implementation tutorials...",
    "Find courses on automation...",
    "Discover educators specializing in AI...",
    "Learn about AI tools and platforms...",
    "Explore AI case studies and success stories..."
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveSearch(searchQuery);
    console.log('Search submitted:', searchQuery);
  };

  return (
    <div className="space-y-12 px-6 py-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-6 rounded-xl border border-siso-border",
                "bg-gradient-to-br backdrop-blur-sm",
                stat.gradient,
                "hover:border-siso-border-hover transition-all duration-300",
                "group"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-lg bg-white/5",
                  "group-hover:scale-110 transition-transform duration-300"
                )}>
                  <Icon className={cn("w-6 h-6", stat.iconColor)} />
                </div>
                <div>
                  <motion.div 
                    className="text-2xl font-bold text-siso-text-bold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: index * 0.2,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {stat.value.toLocaleString()}
                  </motion.div>
                  <div className="text-siso-text/60 text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search Section */}
      <motion.div 
        className="relative w-full max-w-6xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative">
          <PlaceholdersAndVanishInput
            placeholders={searchPlaceholders}
            onChange={handleInputChange}
            onSubmit={handleInputSubmit}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            value={searchQuery}
            className="bg-siso-bg-alt/50 border-siso-border backdrop-blur-sm
              focus:ring-2 focus:ring-siso-orange/50 focus:border-siso-orange
              hover:bg-siso-bg-alt hover:border-siso-border-hover
              transition-all duration-300 h-20 text-xl py-6 px-8"
          />
          
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-siso-text-muted">
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-siso-border bg-siso-bg px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs"><Command className="h-3 w-3" /></span>K
            </kbd>
            <Mic className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
          </div>

          {/* Recent Searches Dropdown */}
          {isSearchFocused && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute w-full mt-2 py-2 bg-siso-bg-alt border border-siso-border rounded-lg shadow-lg backdrop-blur-sm z-50"
            >
              <div className="px-4 py-2 text-sm text-siso-text-muted flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <motion.button
                  key={search}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full px-4 py-2 text-left text-siso-text hover:bg-siso-bg/50 transition-colors"
                  onClick={() => onSearchChange(search)}
                >
                  {search}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};