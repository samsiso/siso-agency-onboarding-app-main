import { Search, Command, Mic, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SearchSection = ({ searchQuery, onSearchChange }: SearchSectionProps) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  useHotkeys('mod+k', (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveSearch(searchQuery);
  };

  const searchPlaceholders = [
    "Search for AI implementation tutorials...",
    "Find courses on automation...",
    "Discover educators specializing in AI...",
    "Learn about AI tools and platforms...",
    "Explore AI case studies and success stories..."
  ];

  return (
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
  );
};