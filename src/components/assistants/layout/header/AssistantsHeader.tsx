
import { HeaderTitle } from '@/components/assistants/layout/header/HeaderTitle';
import { HeaderAlerts } from '@/components/assistants/layout/header/HeaderAlerts';
import { SearchSection } from '@/components/assistants/layout/header/SearchSection';
import { StatsDisplay } from '@/components/assistants/layout/header/StatsDisplay';
import { Categories } from '@/components/assistants/layout/content/Categories';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';

interface AssistantsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  assistantsCount: number;
  featuredCount: number;
  totalConversations: number;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  categories: string[];
}

export function AssistantsHeader({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  selectedCategory,
  setSelectedCategory,
  categoryCounts,
  assistantsCount,
  featuredCount,
  totalConversations,
  onSearchSubmit,
  categories
}: AssistantsHeaderProps) {
  return (
    <Card className="relative border-siso-border bg-black/20 backdrop-blur-lg overflow-hidden
      hover:bg-black/25 transition-all duration-500 mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/5 via-[#7E69AB]/5 to-transparent" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
      <FloatingOrbs />
      
      <motion.div 
        className="relative z-10 space-y-8 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderTitle />
        
        <StatsDisplay 
          totalAssistants={assistantsCount}
          featuredCount={featuredCount}
          categoryCount={Object.keys(categoryCounts || {}).length}
          conversationsCount={totalConversations}
        />

        <SearchSection 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isSearchFocused={isSearchFocused}
          onFocus={() => {}}
          onBlur={() => {}}
          onSubmit={onSearchSubmit}
        />

        {!isSearchFocused && (
          <>
            <HeaderAlerts />
            <Categories 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categoryCounts={categoryCounts}
              assistantsCount={assistantsCount}
              featuredCount={featuredCount}
            />
          </>
        )}
      </motion.div>
    </Card>
  );
}
