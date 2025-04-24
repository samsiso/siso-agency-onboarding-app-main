
import { AppLayout } from '@/components/layout/AppLayout';
import { Waves } from '@/components/ui/waves-background';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";

export default function PlanBuilder() {
  return (
    <AppLayout>
      <div className="relative min-h-screen w-full">
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <FloatingOrbs />
        </div>
        
        <div className="absolute inset-0 z-10">
          <Waves 
            lineColor="rgba(155, 135, 245, 0.2)"
            backgroundColor="transparent"
            waveSpeedX={0.018}
            waveSpeedY={0.015}
            waveAmpX={70}
            waveAmpY={35}
            friction={0.92}
            tension={0.012}
            maxCursorMove={180}
            xGap={22}
            yGap={55}
          />
        </div>

        {/* Content container with VercelV0Chat */}
        <div className="relative z-20 container mx-auto px-4 py-8">
          <VercelV0Chat />
        </div>
      </div>
    </AppLayout>
  );
}
