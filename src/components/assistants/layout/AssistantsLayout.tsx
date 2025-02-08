
import { ReactNode } from 'react';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';

interface AssistantsLayoutProps {
  children: ReactNode;
}

export function AssistantsLayout({ children }: AssistantsLayoutProps) {
  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-[#1A1F2C] to-siso-bg/95">
        <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-8 py-8">
          <Card className="relative border-siso-border bg-black/20 backdrop-blur-lg overflow-hidden
            hover:bg-black/25 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/5 via-[#7E69AB]/5 to-transparent" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
            <FloatingOrbs />
            
            <motion.div 
              className="relative z-10 space-y-8 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
