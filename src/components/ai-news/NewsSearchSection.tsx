
import { Search, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface NewsSearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const NewsSearchSection = ({ searchQuery, onSearchChange }: NewsSearchSectionProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useHotkeys('mod+k', (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  return (
    <motion.div 
      className="relative w-full max-w-3xl mx-auto mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="relative group">
        <Input
          type="text"
          placeholder="Search AI news and updates... (⌘K)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="w-full h-14 pl-12 pr-24 bg-gradient-to-r from-siso-text/5 to-siso-text/10 
            border border-siso-text/10 rounded-xl text-lg
            focus:ring-2 focus:ring-siso-orange/30 focus:border-siso-orange/50
            hover:border-siso-text/20 hover:bg-siso-text/10
            transition-all duration-300 backdrop-blur-sm"
        />
        
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-siso-text/50 
          group-hover:text-siso-text/70 transition-colors" />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-siso-text/50">
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border 
            border-siso-text/20 bg-siso-text/5 px-1.5 font-mono text-[10px] font-medium">
            <span className="text-xs"><Command className="h-3 w-3" /></span>K
          </kbd>
        </div>
      </div>
    </motion.div>
  );
};
