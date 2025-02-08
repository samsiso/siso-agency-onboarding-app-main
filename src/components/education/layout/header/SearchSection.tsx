
import { Search, Command, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button } from '@/components/ui/button';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SearchSection = ({ searchQuery, onSearchChange }: SearchSectionProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useHotkeys('mod+k', (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  const searchPlaceholders = [
    "Search for AI implementation tutorials...",
    "Find courses on automation...",
    "Discover educators specializing in AI...",
    "Learn about AI tools and platforms..."
  ];

  const filters = [
    { label: 'Beginner', color: '#4776E6' },
    { label: 'Intermediate', color: '#8E54E9' },
    { label: 'Advanced', color: '#11998e' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
  };

  return (
    <motion.div 
      className="relative w-full max-w-3xl mx-auto space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Quick Filters */}
      <motion.div 
        className="flex flex-wrap gap-2 justify-center md:justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {filters.map((filter) => (
          <Button
            key={filter.label}
            variant="outline"
            size="sm"
            className={`rounded-full border-2 transition-all duration-300 ${
              selectedFilter === filter.label
                ? 'bg-white/10'
                : 'bg-transparent hover:bg-white/5'
            }`}
            style={{
              borderColor: selectedFilter === filter.label ? filter.color : 'transparent',
              color: selectedFilter === filter.label ? filter.color : 'inherit'
            }}
            onClick={() => setSelectedFilter(filter.label === selectedFilter ? null : filter.label)}
          >
            {filter.label}
          </Button>
        ))}
      </motion.div>

      <div className="relative group">
        <PlaceholdersAndVanishInput
          placeholders={searchPlaceholders}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onSubmit={handleSubmit}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="w-full h-14 pl-12 pr-24 bg-black/20 backdrop-blur-sm
            border border-[#4776E6]/20 rounded-xl text-lg text-siso-text-bold placeholder-siso-text/60
            focus:ring-2 focus:ring-[#4776E6]/30 focus:border-[#4776E6]/40
            hover:bg-black/30 hover:border-[#4776E6]/30
            transition-all duration-300"
        />
        
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4776E6]/70 
          group-hover:text-[#4776E6] transition-colors" />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-siso-text/70">
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border 
            border-[#4776E6]/20 bg-black/20 px-1.5 font-mono text-[10px] font-medium text-siso-text/80">
            <span className="text-xs"><Command className="h-3 w-3" /></span>K
          </kbd>
          <Mic className="w-5 h-5 cursor-pointer hover:text-[#4776E6] transition-colors" />
        </div>

        {/* Knowledge Map Preview */}
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute mt-2 w-full bg-black/90 border border-[#4776E6]/20 rounded-xl p-4 backdrop-blur-sm"
          >
            <div className="text-sm font-medium text-white/80 mb-3">Popular Learning Paths</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { path: "AI Fundamentals → ML Basics → Deep Learning", color: "#4776E6" },
                { path: "Web Dev → React → Full Stack", color: "#8E54E9" },
                { path: "Python → Data Science → AI", color: "#11998e" },
                { path: "Blockchain → Smart Contracts → DApps", color: "#DD2476" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer group"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                    {item.path}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
