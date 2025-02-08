
import { motion } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { SearchInput } from './components/SearchInput';
import { supabase } from '@/integrations/supabase/client';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isSearchFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

export const SearchSection = ({ 
  searchQuery, 
  onSearchChange,
  isSearchFocused,
  onFocus,
  onBlur
}: SearchSectionProps) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      await supabase.from('user_search_history').insert({
        query: searchQuery,
        result_type: 'path'
      });
      onBlur();
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  return (
    <motion.div 
      className="w-full relative z-[101]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="relative">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onFocus={onFocus}
          onBlur={() => setTimeout(onBlur, 200)}
          onSubmit={handleSubmit}
          placeholders={searchPlaceholders}
        />
      </div>
    </motion.div>
  );
};
