
import { Sidebar } from '@/components/Sidebar';
import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
