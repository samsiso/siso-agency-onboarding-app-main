
import { Search, Command, Mic, Clock, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { useState } from 'react';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isSearchFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function SearchSection({ 
  searchQuery, 
  onSearchChange,
  isSearchFocused,
  onFocus,
  onBlur,
  onSubmit
}: SearchSectionProps) {
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  
  const searchPlaceholders = [
    "Search for AI assistants...",
    "Find GPT tools...",
    "Discover automation assistants...",
    "Explore coding helpers..."
  ];

  const recentSearches = [
    "Code review assistant",
    "Data analysis GPT",
    "Writing assistant",
    "Image generation"
  ];

  const suggestions = [
    { text: "Most popular assistants", icon: Star },
    { text: "Recently added", icon: Clock },
    { text: "Highest rated", icon: TrendingUp }
  ];

  return (
    <motion.div 
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="relative group">
        <PlaceholdersAndVanishInput
          placeholders={searchPlaceholders}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onSubmit={onSubmit}
          onFocus={onFocus}
          onBlur={() => setTimeout(onBlur, 200)}
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
          <button
            onClick={() => setShowVoiceSearch(true)}
            className="p-1.5 hover:bg-siso-text/10 rounded-full transition-colors"
          >
            <Mic className="w-4 h-4 text-siso-text/70 hover:text-siso-orange transition-colors" />
          </button>
        </div>

        <AnimatePresence>
          {isSearchFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute w-full mt-2 z-50"
            >
              <Card className="border-siso-text/10 bg-black/90 backdrop-blur-xl">
                <CardContent className="p-4">
                  {searchQuery ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-siso-text/70">
                        <History className="w-4 h-4" />
                        <span>Recent searches</span>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((search, i) => (
                          <motion.button
                            key={search}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                              hover:bg-siso-text/10 text-left transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <span className="text-siso-text/90">{search}</span>
                            <ArrowRight className="w-4 h-4 text-siso-text/50" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-siso-text/70">
                        <Search className="w-4 h-4" />
                        <span>Popular searches</span>
                      </div>
                      <div className="space-y-2">
                        {suggestions.map((suggestion, i) => {
                          const Icon = suggestion.icon;
                          return (
                            <motion.button
                              key={suggestion.text}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                                hover:bg-siso-text/10 text-left transition-colors"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-siso-orange" />
                                <span className="text-siso-text/90">{suggestion.text}</span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-siso-text/50" />
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
