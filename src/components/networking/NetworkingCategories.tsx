import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NetworkingCategoriesProps {
  categories: Record<string, number>;
  selectedCategory: string;
}

export const NetworkingCategories = ({ categories, selectedCategory }: NetworkingCategoriesProps) => {
  return (
    <TabsList className="w-full justify-start bg-siso-text/5 border border-siso-text/10 flex-wrap">
      {Object.entries(categories).map(([category, count]) => (
        <TabsTrigger 
          key={category}
          value={category}
          className="group data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange transition-all duration-200 hover:bg-siso-text/10"
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
          <span className="ml-2 text-sm text-siso-text/60 group-data-[state=active]:text-siso-orange/60">
            {count}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};