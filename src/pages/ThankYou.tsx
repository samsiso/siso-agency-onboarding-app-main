import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Waves } from '@/components/ui/waves-background';
import { Card } from '@/components/ui/card';
import { ButtonCta } from '@/components/ui/button-shiny';
import { GradientText } from '@/components/ui/gradient-text';
import { Confetti } from '@/components/ui/confetti';
import confetti from 'canvas-confetti';
import type { ConfettiRef } from '@/components/ui/confetti';
import { supabase } from '@/integrations/supabase/client';

export default function ThankYou() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    // Fire multiple confetti bursts for a more dramatic effect
    const fireCelebration = () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => 
        Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Confetti from multiple origins
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: 0.5, y: 0.5 }
        });
      }, 250);
    };

    fireCelebration();

    const handleOnboardingCompletion = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.id) {
          const { error } = await supabase.rpc('handle_onboarding_completion', {
            user_id: user.id
          });

          if (error) throw error;

          toast({
            title: "Points Awarded!",
            description: "You've earned 500 points for completing onboarding",
          });
        }
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    };

    handleOnboardingCompletion();
  }, [toast]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-siso-bg to-black p-4 overflow-hidden">
      <Waves 
        lineColor="rgba(255, 87, 34, 0.1)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      
      <Confetti
        ref={confettiRef}
        className="fixed inset-0 pointer-events-none z-50"
        options={{
          particleCount: 150,
          spread: 180,
          origin: { y: 0.5, x: 0.5 },
          colors: ['#FF5722', '#FFA726', '#FFD54F', '#4CAF50', '#2196F3'],
          disableForReducedMotion: true
        }}
      />
      
      <Card className="relative z-10 w-full max-w-2xl p-8 space-y-8 bg-siso-bg/80 backdrop-blur-lg border-siso-border animate-fadeIn">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <div className="p-3 rounded-full bg-gradient-to-br from-siso-red/10 to-siso-orange/10">
              <Rocket className="w-8 h-8 text-siso-orange animate-bounce" />
            </div>
            <GradientText
              colors={["#FF5722", "#FFA726", "#FF5722"]}
              animationSpeed={6}
              className="text-3xl font-bold"
            >
              Welcome to SISO!
            </GradientText>
          </div>
          
          <p className="text-xl text-siso-text/80 leading-relaxed">
            Congratulations on joining our community! You're now ready to explore the best tools and resources for your agency.
          </p>

          <div className="aspect-video w-full max-w-xl mx-auto rounded-xl bg-black/40 border border-siso-border flex items-center justify-center">
            <p className="text-siso-text/60">Video message placeholder</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-lg bg-black/20 border border-siso-border/20">
              <Trophy className="w-8 h-8 text-siso-orange mx-auto mb-2" />
              <p className="text-sm text-siso-text/70">Initial Rank</p>
              <p className="text-lg font-semibold text-siso-text-bold">Prank</p>
            </div>
            
            <div className="p-4 rounded-lg bg-black/20 border border-siso-border/20">
              <Star className="w-8 h-8 text-siso-orange mx-auto mb-2" />
              <p className="text-sm text-siso-text/70">Points Earned</p>
              <p className="text-lg font-semibold text-siso-text-bold">+500</p>
            </div>
          </div>
        </div>

        <ButtonCta
          onClick={() => navigate('/tools')}
          className="w-full bg-gradient-to-r from-[#FF5722] to-[#FFA726]"
          label="Start Exploring"
        />
      </Card>
    </div>
  );
}