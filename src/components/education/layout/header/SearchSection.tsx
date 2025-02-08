
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
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const skillLevels = [
    { label: 'Beginner', color: '#FF5722' },
    { label: 'Intermediate', color: '#FF7043' },
    { label: 'Advanced', color: '#FFA726' }
  ];

  const categories = ['AI', 'Machine Learning', 'Web3', 'Cloud'];

  // [Analysis] Added handleSubmit to satisfy the required onSubmit prop
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // We can add search submission logic here if needed
    console.log('Search submitted:', searchQuery);
  };

  return (
    <motion.div 
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Categories */}
      <motion.div 
        className="flex flex-wrap gap-3 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {categories.map((category, i) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-siso-red to-siso-orange text-white'
                : 'bg-gradient-to-r from-siso-red/10 to-siso-orange/10 text-siso-text hover:from-siso-red/20 hover:to-siso-orange/20'
            }`}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Skill Levels */}
      <motion.div 
        className="flex justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {skillLevels.map((level, index) => (
          <Button
            key={level.label}
            variant="outline"
            size="sm"
            className={`rounded-full border-2 transition-all duration-300 ${
              selectedSkillLevel === level.label
                ? 'bg-white/10'
                : 'bg-transparent hover:bg-white/5'
            }`}
            style={{
              borderColor: selectedSkillLevel === level.label ? level.color : 'transparent',
              color: selectedSkillLevel === level.label ? level.color : 'inherit'
            }}
            onClick={() => setSelectedSkillLevel(level.label === selectedSkillLevel ? null : level.label)}
          >
            {level.label}
          </Button>
        ))}
      </motion.div>

      {/* Search Input */}
      <div className="relative group">
        <PlaceholdersAndVanishInput
          placeholders={searchPlaceholders}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          onSubmit={handleSubmit}
          className="w-full h-14 pl-12 pr-24 bg-black/20 backdrop-blur-sm
            border border-[#FF5722]/20 rounded-xl text-lg text-siso-text-bold placeholder-siso-text/60
            focus:ring-2 focus:ring-[#FF5722]/30 focus:border-[#FF5722]/40
            hover:bg-black/30 hover:border-[#FF5722]/30
            transition-all duration-300"
        />
        
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF5722]/70 
          group-hover:text-[#FF5722] transition-colors" />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-siso-text/70">
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border 
            border-[#FF5722]/20 bg-black/20 px-1.5 font-mono text-[10px] font-medium text-siso-text/80">
            <span className="text-xs"><Command className="h-3 w-3" /></span>K
          </kbd>
          <Mic className="w-5 h-5 cursor-pointer hover:text-[#FF5722] transition-colors" />
        </div>

        {/* Search Suggestions */}
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute mt-2 w-full bg-black/90 border border-[#FF5722]/20 rounded-xl p-4 backdrop-blur-sm"
          >
            <div className="text-sm font-medium text-white/80 mb-3">Popular Learning Paths</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { path: "AI Fundamentals → ML Basics → Deep Learning", color: "#FF5722" },
                { path: "Web Dev → React → Full Stack", color: "#FF7043" },
                { path: "Python → Data Science → AI", color: "#FFA726" },
                { path: "Blockchain → Smart Contracts → DApps", color: "#FF9100" },
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

