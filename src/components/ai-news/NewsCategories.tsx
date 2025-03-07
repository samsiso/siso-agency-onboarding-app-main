
import React from "react";
import { motion } from "framer-motion";
import { Chip } from "@/components/ui/chip";

// [Analysis] Category list derived from API data patterns with added colors
const CATEGORIES = [{
  id: "all",
  label: "All Categories",
  color: "bg-gradient-to-r from-blue-500 to-purple-500"
}, {
  id: "breakthrough_technologies",
  label: "Breakthrough Tech",
  color: "bg-gradient-to-r from-purple-600 to-pink-500"
}, {
  id: "language_models",
  label: "Language Models",
  color: "bg-gradient-to-r from-sky-500 to-blue-600"
}, {
  id: "robotics_automation",
  label: "Robotics & Automation",
  color: "bg-gradient-to-r from-teal-500 to-green-500"
}, {
  id: "industry_applications",
  label: "Industry Applications",
  color: "bg-gradient-to-r from-blue-600 to-indigo-600"
}, {
  id: "international_developments",
  label: "International News",
  color: "bg-gradient-to-r from-orange-500 to-amber-500"
}, {
  id: "enterprise_ai",
  label: "Enterprise AI",
  color: "bg-gradient-to-r from-indigo-500 to-purple-500"
}, {
  id: "ai_ethics",
  label: "AI Ethics",
  color: "bg-gradient-to-r from-red-500 to-pink-500"
}, {
  id: "research",
  label: "Research",
  color: "bg-gradient-to-r from-emerald-500 to-teal-500"
}, {
  id: "startups",
  label: "Startups",
  color: "bg-gradient-to-r from-fuchsia-500 to-pink-500"
}];

interface NewsCategoriesProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string; // [Analysis] Added optional className prop to support external styling
}

// [Analysis] Animation variants for smooth transitions
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const NewsCategories = ({
  selectedCategory,
  onCategoryChange,
  className = "" // [Analysis] Default to empty string if no className is provided
}: NewsCategoriesProps) => {
  // [Analysis] Handle toggling category selection
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "all" || selectedCategory === categoryId) {
      onCategoryChange(null);
    } else {
      onCategoryChange(categoryId);
    }
  };
  
  // [Analysis] Fixed issue by adding return statement with JSX
  return (
    <motion.div 
      className={`flex flex-wrap gap-2 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {CATEGORIES.map((category) => (
        <motion.div
          key={category.id}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Chip
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${
              selectedCategory === category.id 
                ? `${category.color} text-white font-medium shadow-lg` 
                : 'bg-gray-800/70 hover:bg-gray-700/70 text-gray-300'
            }`}
          >
            {category.label}
          </Chip>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NewsCategories;
