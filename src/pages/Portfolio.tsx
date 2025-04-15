
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { PortfolioCard } from '@/components/portfolio/PortfolioCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spotlight } from '@/components/ui/spotlight';

export default function Portfolio() {
  const { items, categories, loading } = usePortfolioData();

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="relative">
          <Spotlight className="-top-40 left-0" />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent mb-2">
              Our Portfolio
            </h1>
            <p className="text-siso-text/80">
              Discover our latest projects and success stories
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.slug}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <PortfolioCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.slug} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items
                    .filter((item) => item.category_id === category.id)
                    .map((item) => (
                      <PortfolioCard key={item.id} item={item} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
