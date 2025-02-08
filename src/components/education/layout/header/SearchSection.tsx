
import { Search, Command, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SearchSection = ({ searchQuery, onSearchChange }: SearchSectionProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
  };

  return (
    <motion.div 
      className="relative w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="relative group">
        <PlaceholdersAndVanishInput
          placeholders={searchPlaceholders}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onSubmit={handleSubmit}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="w-full h-14 pl-12 pr-24 bg-white/10 backdrop-blur-sm
            border border-white/20 rounded-xl text-lg text-white placeholder-white/60
            focus:ring-2 focus:ring-white/30 focus:border-white/40
            hover:bg-white/15 hover:border-white/30
            transition-all duration-300"
        />
        
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 
          group-hover:text-white transition-colors" />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/70">
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border 
            border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/80">
            <span className="text-xs"><Command className="h-3 w-3" /></span>K
          </kbd>
          <Mic className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};
