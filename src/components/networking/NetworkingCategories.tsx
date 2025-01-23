import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface NetworkingCategoriesProps {
  categories: Record<string, number>;
  selectedCategory: string;
}

export const NetworkingCategories = ({ categories, selectedCategory }: NetworkingCategoriesProps) => {
  return (
    <TabsList className="w-full justify-start bg-siso-text/5 border border-siso-text/10 flex-wrap h-auto p-1 gap-1">
      {Object.entries(categories).map(([category, count]) => (
        <motion.div
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TabsTrigger 
            value={category}
            className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-siso-red/20 data-[state=active]:to-siso-orange/20 data-[state=active]:text-siso-orange transition-all duration-300 hover:bg-siso-text/10 focus:ring-2 focus:ring-siso-orange/50 focus:outline-none relative overflow-hidden"
          >
            <span className="relative z-10">
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <span className="ml-2 text-sm text-siso-text/60 group-data-[state=active]:text-siso-orange/60">
                {count}
              </span>
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
  );
};