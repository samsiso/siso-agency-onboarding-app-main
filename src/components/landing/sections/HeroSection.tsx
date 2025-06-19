
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/ui/animated-hero';
import { Waves } from '@/components/ui/waves-background';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const HeroSection = memo(() => {
  console.log('[HeroSection] Rendering hero section'); // Debug log
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCalloutClick = () => {
    console.log('Callout clicked - navigating to contact');
    navigate('/auth');
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center">
      <Hero />
      
      {/* Mobile-optimized Callout */}
      <div className={`absolute ${isMobile ? 'top-4 left-0 right-0' : 'top-20 md:top-24 left-0 right-0'} z-50 flex justify-center pointer-events-none`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pointer-events-auto"
          onClick={handleCalloutClick}
        >
          <div 
            className={`inline-flex items-center px-3 sm:px-5 py-1.5 sm:py-2 rounded-full 
              bg-black/40 backdrop-blur-md border border-siso-orange/30
              shadow-lg hover:shadow-siso-orange/20 hover:border-siso-orange/50 
              cursor-pointer transition-all duration-300 group
              ${isMobile ? 'max-w-[95%] mx-auto' : ''}`}
          >
            <p className={`text-sm sm:text-base md:text-lg text-white/90 ${isMobile ? 'text-center' : ''}`}>
              We build out your MVP in <span className="font-semibold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">48 hours</span>{" "}
              <span className="font-semibold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">Free of charge</span>
            </p>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 text-siso-orange opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </motion.div>
      </div>
      
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
