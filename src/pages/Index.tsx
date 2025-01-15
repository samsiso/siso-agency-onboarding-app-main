import { Hero } from '@/components/Hero';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 bg-siso-bg">
          <Hero />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;