
import { Search, Command, Mic } from 'lucide-react';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { motion } from 'framer-motion';

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholders: string[];
}

export const SearchInput = ({ 
  searchQuery, 
  onSearchChange, 
  onFocus, 
  onBlur, 
  onSubmit,
  placeholders 
}: SearchInputProps) => {
  return (
    <div className="relative group">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmit={onSubmit}
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
    </div>
  );
};
