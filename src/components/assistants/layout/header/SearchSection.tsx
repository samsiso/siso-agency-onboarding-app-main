
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SearchSection({ searchQuery, onSearchChange }: SearchSectionProps) {
  return (
    <div className="w-full md:w-72">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60" />
        <Input
          placeholder="Search assistants..."
          className="pl-10 bg-siso-text/5 border-siso-text/10 focus-visible:ring-siso-orange transition-all duration-300"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
