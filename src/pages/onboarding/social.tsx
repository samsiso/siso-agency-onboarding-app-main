import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';
import { SocialLinksForm } from '@/components/onboarding/SocialLinksForm';
import { Waves } from '@/components/ui/waves-background';

export default function SocialOnboarding() {
  const { userId, isLoading } = useOnboardingAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-siso-red"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-siso-bg to-black p-4 overflow-hidden">
      <Waves 
        lineColor="rgba(255, 87, 34, 0.2)"
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
      
      <div className="w-full max-w-md bg-black/20 backdrop-blur-lg rounded-lg shadow-xl p-8 space-y-6 border border-siso-border relative z-10">
        {/* Progress Indicator */}
        <div className="absolute -top-10 left-0 w-full flex justify-center text-siso-text/70">
          <span className="px-4 py-1 rounded-full bg-siso-bg-alt border border-siso-border text-sm">
            Step 2 of 3
          </span>
        </div>

        <SocialLinksForm userId={userId} />
      </div>
    </div>
  );
}