import { Hero } from '@/components/Hero';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 bg-siso-bg w-full">
          <div className="container mx-auto px-4 py-8">
            <Hero />
            <div className="mt-8">
              <Leaderboard />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;