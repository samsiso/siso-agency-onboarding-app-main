import { Button } from "@/components/ui/button";

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryFilters({ categories, selectedCategory, onCategorySelect }: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          className={`${
            selectedCategory === category || (category === 'All' && !selectedCategory)
              ? 'bg-siso-orange text-white hover:bg-siso-orange/90'
              : 'bg-siso-text/5 hover:bg-siso-text/10'
          } text-sm`}
          onClick={() => onCategorySelect(category === 'All' ? null : category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}