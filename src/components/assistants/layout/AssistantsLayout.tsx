
import { ReactNode } from 'react';
import { MainLayout } from '@/components/assistants/layout/MainLayout';

interface AssistantsLayoutProps {
  children: ReactNode;
}

export function AssistantsLayout({ children }: AssistantsLayoutProps) {
  return (
    <MainLayout>
      <div className="relative min-h-screen bg-black">
        {/* [Analysis] Added subtle gradient overlay for depth without the blue tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-siso-bg/10 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto space-y-8 px-4 md:px-8 py-8">
          {children}
        </div>
      </div>
    </MainLayout>
  );
}
