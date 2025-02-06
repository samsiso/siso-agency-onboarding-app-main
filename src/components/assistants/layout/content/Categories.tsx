
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

interface CategoriesProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts: Record<string, number>;
  assistantsCount: number;
  featuredCount: number;
}

export function Categories({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  categoryCounts,
  assistantsCount,
  featuredCount
}: CategoriesProps) {
  return (
    <ScrollArea className="w-full">
      <Tabs defaultValue={selectedCategory} className="w-full" onValueChange={onCategoryChange}>
        <TabsList className="h-auto flex-wrap bg-gradient-to-r from-siso-text/5 to-siso-text/10 border border-siso-text/10 p-2 rounded-xl">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="m-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-siso-red/20 data-[state=active]:to-siso-orange/20 data-[state=active]:text-siso-orange transition-all duration-300"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <span className="ml-2 text-sm text-siso-text/60">
                {category === 'all' 
                  ? assistantsCount
                  : category === 'featured'
                    ? featuredCount
                    : categoryCounts[category] || 0}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </ScrollArea>
  );
}
