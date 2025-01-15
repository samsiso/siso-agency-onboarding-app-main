import { Hero } from '@/components/Hero';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 bg-siso-bg w-full">
          <Hero />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;