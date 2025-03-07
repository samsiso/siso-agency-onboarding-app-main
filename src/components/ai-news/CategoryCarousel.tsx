
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cpu, Database, Braces, BrainCircuit, LayoutGrid, Workflow, BookOpen, Building, Code, 
  Lightbulb, ExternalLink, Rocket, Layers, Cpu as Microchip } from 'lucide-react';

// [Analysis] Interactive carousel for category selection with improved visual design
interface CategoryCarouselProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  // Map of categories to icons
  const categoryIcons: Record<string, React.ReactNode> = {
    "AI Research": <BrainCircuit className="h-4 w-4" />,
    "Machine Learning": <Cpu className="h-4 w-4" />,
    "Data Science": <Database className="h-4 w-4" />,
    "Programming": <Braces className="h-4 w-4" />,
    "Business": <Building className="h-4 w-4" />,
    "Development": <Code className="h-4 w-4" />,
    "Innovation": <Lightbulb className="h-4 w-4" />,
    "Integration": <ExternalLink className="h-4 w-4" />,
    "Software": <LayoutGrid className="h-4 w-4" />,
    "Workflow": <Workflow className="h-4 w-4" />,
    "Education": <BookOpen className="h-4 w-4" />,
    "Startups": <Rocket className="h-4 w-4" />,
    "Architecture": <Layers className="h-4 w-4" />,
    "Hardware": <Microchip className="h-4 w-4" />,
  };
  
  const categories = Object.keys(categoryIcons);
  
  return (
    <div className="relative mb-8 overflow-hidden">
      {/* Gradient edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-900 to-transparent z-10" />
      
      <div className="overflow-x-auto scrollbar-none py-2">
        <div className="flex space-x-2 pb-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange(null)}
            className={cn(
              "text-xs whitespace-nowrap flex gap-2 bg-gradient-to-r border transition-all duration-200",
              !selectedCategory 
                ? "from-blue-900/50 to-purple-900/50 border-blue-500/50 text-blue-300"
                : "from-gray-900/50 to-gray-900/50 border-gray-700 text-gray-400 hover:from-blue-900/30 hover:to-purple-900/30"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            All Categories
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={cn(
                "text-xs whitespace-nowrap flex gap-2 bg-gradient-to-r border transition-all duration-200",
                selectedCategory === category 
                  ? "from-blue-900/50 to-purple-900/50 border-blue-500/50 text-blue-300"
                  : "from-gray-900/50 to-gray-900/50 border-gray-700 text-gray-400 hover:from-blue-900/30 hover:to-purple-900/30"
              )}
            >
              {categoryIcons[category]}
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

