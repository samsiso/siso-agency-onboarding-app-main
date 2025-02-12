
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/ui/animated-hero';
import { Waves } from '@/components/ui/waves-background';

export const HeroSection = memo(() => {
  console.log('[HeroSection] Rendering hero section'); // Debug log
  const navigate = useNavigate();

  return (
    <section id="hero" className="min-h-screen">
      <Hero />
      <Waves 
        lineColor="rgba(255, 87, 34, 0.2)"
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
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
