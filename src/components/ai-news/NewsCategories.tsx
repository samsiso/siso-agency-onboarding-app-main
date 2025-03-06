
import React from "react";
import { Button } from "@/components/ui/button";

// [Analysis] Category list derived from API data patterns
const CATEGORIES = [{
  id: "all",
  label: "All Categories"
}, {
  id: "breakthrough_technologies",
  label: "Breakthrough Tech"
}, {
  id: "language_models",
  label: "Language Models"
}, {
  id: "robotics_automation",
  label: "Robotics & Automation"
}, {
  id: "industry_applications",
  label: "Industry Applications"
}, {
  id: "international_developments",
  label: "International News"
}, {
  id: "enterprise_ai",
  label: "Enterprise AI"
}, {
  id: "ai_ethics",
  label: "AI Ethics"
}, {
  id: "research",
  label: "Research"
}, {
  id: "startups",
  label: "Startups"
}];

interface NewsCategoriesProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string; // [Analysis] Added optional className prop to support external styling
}

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
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {CATEGORIES.map((category) => (
        <Button
          key={category.id}
          size="sm"
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => handleCategoryClick(category.id)}
          className="text-sm"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default NewsCategories;
