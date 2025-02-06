import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { MessageSquare, Slack, Linkedin } from "lucide-react";

interface NetworkingCategoriesProps {
  categories: Record<string, number>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'discord':
      return <MessageSquare className="w-4 h-4" />;
    case 'slack':
      return <Slack className="w-4 h-4" />;
    case 'linkedin':
      return <Linkedin className="w-4 h-4" />;
    default:
      return null;
  }
};

export const NetworkingCategories = ({ 
  categories, 
  selectedCategory,
  onCategoryChange 
}: NetworkingCategoriesProps) => {
  const allCategories = {
    all: Object.values(categories).reduce((a, b) => a + b, 0),
    ...categories
  };

  return (
    <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
      <TabsList className="w-full justify-start bg-siso-text/5 border border-siso-text/10 flex-wrap h-auto p-1 gap-1">
        {Object.entries(allCategories).map(([category, count]) => (
          <motion.div
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TabsTrigger 
              value={category}
              className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-siso-red/20 data-[state=active]:to-siso-orange/20 
                data-[state=active]:text-siso-orange transition-all duration-300 hover:bg-siso-text/10 
                focus:ring-2 focus:ring-siso-orange/50 focus:outline-none relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {getCategoryIcon(category)}
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="ml-2 text-sm text-siso-text/60 group-data-[state=active]:text-siso-orange/60"
                >
                  {count}
                </motion.span>
              </span>
              {selectedCategory === category && (
                <motion.div
                  layoutId="active-category"
                  className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </TabsTrigger>
          </motion.div>
        ))}
      </TabsList>
    </Tabs>
  );
};