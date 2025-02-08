
import { ReactNode } from 'react';
import { MainLayout } from '@/components/assistants/layout/MainLayout';

interface AssistantsLayoutProps {
  children: ReactNode;
}

export function AssistantsLayout({ children }: AssistantsLayoutProps) {
  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-[#1A1F2C] to-siso-bg/95">
        <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-8 py-8">
          {children}
        </div>
      </div>
    </MainLayout>
  );
}
