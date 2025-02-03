import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/ui/animated-hero';
import { Waves } from '@/components/ui/waves-background';

export const HeroSection = memo(() => {
  const navigate = useNavigate();

  return (
    <section id="hero" className="min-h-screen">
      <Hero />
      <Waves 
        lineColor="rgba(255, 87, 34, 0.15)"
        backgroundColor="transparent"
        waveSpeedX={0.015}
        waveSpeedY={0.012}
        waveAmpX={60}
        waveAmpY={30}
        friction={0.92}
        tension={0.01}
        maxCursorMove={150}
        xGap={25}
        yGap={60}
      />
    </section>
  );
});

HeroSection.displayName = 'HeroSection';