import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/ui/animated-hero';
import { Waves } from '@/components/ui/waves-background';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="hero" className="min-h-screen">
      <Hero />
      <Waves 
        lineColor="rgba(255, 87, 34, 0.1)"
        backgroundColor="transparent"
        waveSpeedX={0.015}
        waveSpeedY={0.01}
        waveAmpX={50}
        waveAmpY={25}
        friction={0.9}
        tension={0.01}
        maxCursorMove={150}
        xGap={15}
        yGap={40}
      />
    </section>
  );
};