import { Hero } from '@/components/Hero';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Hero />
      </div>
    </SidebarProvider>
  );
}