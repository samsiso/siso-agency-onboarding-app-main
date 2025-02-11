
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useToast } from '@/hooks/use-toast';
import { Waves } from '@/components/ui/waves-background';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export default function Auth() {
  const { user } = useAuthSession();
  const { handleGoogleSignIn, loading } = useGoogleAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only redirect to profile if user exists and we're not in the middle of onboarding
    const currentPath = window.location.pathname;
    if (user && !currentPath.includes('onboarding')) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      console.log('Starting Google sign in...');
      await handleGoogleSignIn();
      
      // Toast will be shown after successful redirect
      toast({
        title: "Signing in...",
        description: "Redirecting you to complete your profile...",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "Please try again",
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black to-siso-bg z-0" />
      
      <Waves 
        lineColor="rgba(255, 87, 34, 0.1)"
        backgroundColor="rgba(255, 87, 34, 0.01)"
        waveSpeedX={0.025}
        waveSpeedY={0.015}
        waveAmpX={80}
        waveAmpY={40}
        friction={0.85}
        tension={0.02}
        maxCursorMove={150}
        xGap={8}
        yGap={24}
        className="z-10"
      />
      
      <div className="relative z-20 w-full max-w-md p-8">
        <div className="backdrop-blur-xl bg-black/40 rounded-lg shadow-xl p-8 border border-siso-border/60 space-y-6">
          <div className="absolute -top-10 left-0 w-full flex justify-center text-siso-text/70">
            <span className="px-4 py-1 rounded-full bg-siso-bg-alt border border-siso-border text-sm">
              Step 1 of 3
            </span>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
              Welcome to SISO Agency
            </h1>
            <p className="text-siso-text">Sign in with your Google account to get started</p>
          </div>

          <div className="flex justify-center">
            <GoogleSignInButton
              onClick={handleSignIn}
              disabled={loading}
            />
          </div>

          <div className="text-center text-sm text-siso-text/70">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-siso-red hover:text-siso-orange transition-colors">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="/privacy" className="text-siso-red hover:text-siso-orange transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
