import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ToolsPageHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalTools?: number;
  categoryStats?: { [key: string]: number };
}

export function ToolsPageHeader({ 
  searchQuery, 
  onSearchChange,
  totalTools,
  categoryStats 
}: ToolsPageHeaderProps) {
  const placeholderTexts = [
    "Search for AI tools...",
    "Find development tools...",
    "Discover automation tools...",
    "Explore database tools..."
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        className="flex flex-col items-center text-center gap-6 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background gradient with particles */}
        <div className="absolute inset-0 bg-gradient-radial from-siso-orange/20 via-transparent to-transparent opacity-30 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-siso-red/10 via-transparent to-transparent animate-pulse" />
        </div>

        <div className="w-full max-w-4xl">
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text tracking-tight">
              Tools and Platforms
            </h1>
            {totalTools !== undefined && (
              <motion.span 
                className="text-lg text-siso-text/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {totalTools} tools available
              </motion.span>
            )}
          </div>
          
          <motion.p 
            className="mt-6 text-lg sm:text-xl text-siso-text/80 leading-relaxed text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover powerful tools and platforms to enhance your workflow. 
            Browse through various categories including development, database, and automation tools.
          </motion.p>

          {categoryStats && (
            <motion.div 
              className="mt-6 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {Object.entries(categoryStats).map(([category, count]) => (
                <Badge 
                  key={category}
                  variant="outline" 
                  className="bg-siso-text/5 border-siso-text/10 px-4 py-2"
                >
                  {category}: {count}
                </Badge>
              ))}
            </motion.div>
          )}
        </div>

        <motion.div 
          className="relative w-full max-w-2xl mx-auto group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-siso-text/60 w-5 h-5 transition-colors group-focus-within:text-siso-orange" />
          <Input
            placeholder="Search tools..."
            className="pl-12 h-14 bg-siso-text/5 border-siso-text/10 hover:border-siso-text/20 focus-visible:ring-siso-orange transition-all duration-300 text-lg rounded-xl shadow-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}