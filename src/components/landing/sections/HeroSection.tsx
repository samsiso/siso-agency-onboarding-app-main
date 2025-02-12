
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/ui/animated-hero';
import { Waves } from '@/components/ui/waves-background';
import { useIsMobile } from '@/hooks/use-mobile';

export const HeroSection = memo(() => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <section id="hero" className="min-h-[100svh]">
      <Hero />
      <Waves 
        lineColor="rgba(255, 87, 34, 0.2)"
        backgroundColor="transparent"
        waveSpeedX={isMobile ? 0.012 : 0.018}
        waveSpeedY={isMobile ? 0.01 : 0.015}
        waveAmpX={isMobile ? 40 : 70}
        waveAmpY={isMobile ? 20 : 35}
        friction={isMobile ? 0.95 : 0.92}
        tension={isMobile ? 0.008 : 0.012}
        maxCursorMove={isMobile ? 120 : 180}
        xGap={isMobile ? 16 : 22}
        yGap={isMobile ? 40 : 55}
      />
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
