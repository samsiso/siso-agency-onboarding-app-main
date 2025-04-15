
import { PortfolioCategory } from '@/types/portfolio';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PortfolioFiltersProps {
  categories: PortfolioCategory[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const PortfolioFilters = ({
  categories,
  activeCategory,
  onCategoryChange,
}: PortfolioFiltersProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Tabs defaultValue={activeCategory} onValueChange={onCategoryChange}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.slug}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
