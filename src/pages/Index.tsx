import { Hero } from '@/components/Hero';
import { AuthButton } from '@/components/AuthButton';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full relative">
        <Hero />
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100]">
          <AuthButton />
        </div>
      </div>
    </SidebarProvider>
  );
}