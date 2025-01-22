import { Hero } from '@/components/Hero';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col bg-siso-bg w-full">
          <Hero />
          <div className="px-4 py-8">
            <Leaderboard />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;