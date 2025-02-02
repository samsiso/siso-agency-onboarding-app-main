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
        lineColor="rgba(255, 87, 34, 0.05)"
        backgroundColor="transparent"
        waveSpeedX={0.01}
        waveSpeedY={0.008}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.95}
        tension={0.008}
        maxCursorMove={100}
        xGap={20}
        yGap={50}
      />
    </section>
  );
});

HeroSection.displayName = 'HeroSection';