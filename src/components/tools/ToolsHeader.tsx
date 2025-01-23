import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';

interface ToolsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ToolsHeader({ searchQuery, onSearchChange }: ToolsHeaderProps) {
  return (
    <div className="space-y-8">
      <motion.div 
        className="flex flex-col items-start gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
            Tools and Platforms
          </h1>
          <p className="mt-6 text-xl text-siso-text/80 leading-relaxed max-w-3xl">
            Discover powerful tools and platforms to enhance your workflow. 
            Browse through various categories including development, database, and automation tools.
          </p>
        </div>
        <motion.div 
          className="relative w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-siso-text/60 w-5 h-5" />
          <Input
            placeholder="Search tools..."
            className="pl-12 h-14 bg-siso-text/5 border-siso-text/10 hover:border-siso-text/20 focus-visible:ring-siso-orange transition-all duration-300 text-lg rounded-xl"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}