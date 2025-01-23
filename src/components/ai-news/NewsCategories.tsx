import { Button } from "@/components/ui/button";

interface NewsCategoriesProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const NewsCategories = ({ selectedCategory, onCategoryChange }: NewsCategoriesProps) => {
  const categories = [
    "All",
    "Tech Giants",
    "Research",
    "Policy",
    "Business",
    "Innovation"
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === (category === "All" ? null : category) ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category === "All" ? null : category)}
          className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};