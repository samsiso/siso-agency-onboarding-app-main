import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NewsCategoriesProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const NewsCategories = ({ selectedCategory, onCategoryChange }: NewsCategoriesProps) => {
  const categories = [
    "All",
    "Tech Giants",
    "Research",
    "Policy",
    "Business",
    "Innovation"
  ];

  return (
    <div className="relative flex flex-wrap gap-2 mb-6 w-full">
      {categories.map((category) => (
        <motion.div
          key={category}
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant={selectedCategory === (category === "All" ? null : category) ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category === "All" ? null : category)}
            className={`
              relative text-xs sm:text-sm font-medium transition-all duration-200
              ${selectedCategory === (category === "All" ? null : category)
                ? 'bg-siso-red text-white hover:bg-siso-red/90'
                : 'hover:bg-siso-red/10 hover:text-siso-red border-siso-border'
              }
              min-w-[80px] h-9
            `}
          >
            {category}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default NewsCategories;