import { Hero } from '@/components/Hero';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Index() {
  return (
    <SidebarProvider>
      <div className="container mx-auto px-4 py-8 min-h-screen flex w-full">
        <Hero />
      </div>
    </SidebarProvider>
  );
}