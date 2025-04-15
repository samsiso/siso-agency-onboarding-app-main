
import { useState } from 'react';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { PortfolioCard } from '@/components/portfolio/PortfolioCard';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { PortfolioFilters } from '@/components/portfolio/PortfolioFilters';
import { Skeleton } from '@/components/ui/skeleton';

export default function Portfolio() {
  const { items, categories, loading } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => {
        const category = categories.find(cat => cat.id === item.category_id);
        return category?.slug === activeCategory;
      });

  if (loading) {
    return (
      <MainLayout>
        <PortfolioHero />
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-lg" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PortfolioHero />
      
      <div className="container mx-auto px-4 py-6">
        <PortfolioFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
