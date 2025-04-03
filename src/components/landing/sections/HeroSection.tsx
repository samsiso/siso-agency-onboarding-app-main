
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/ui/animated-hero';
import { Waves } from '@/components/ui/waves-background';

export const HeroSection = memo(() => {
  console.log('[HeroSection] Rendering hero section'); // Debug log
  const navigate = useNavigate();

  return (
    <section id="hero" className="min-h-screen">
      {/* New Callout Text */}
      <div className="relative z-50 w-full flex justify-center pt-12">
        <div className="inline-block bg-[#1A1A1A]/80 border border-siso-orange rounded-lg px-4 py-2 backdrop-blur-sm mb-4">
          <p className="text-center text-lg">
            We build out your MVP in <span className="text-siso-orange font-medium">48 hours</span> <span className="text-siso-orange font-medium">Free of charge</span>
          </p>
        </div>
      </div>
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
