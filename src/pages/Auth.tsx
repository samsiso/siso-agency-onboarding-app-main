import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useToast } from '@/hooks/use-toast';
import { Waves } from '@/components/ui/waves-background';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const { user, handleSignIn } = useAuthSession();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, starting auth process...');
    
    try {
      // Get form data
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // Validate password length
      if (password.length > 72) {
        throw new Error('Password must be less than 72 characters');
      }

      // Sign in with email/password
      const { data: { session }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (session) {
        console.log('Authentication successful, proceeding to onboarding...');
        await handleSignIn(session);
        toast({
          title: "Account created!",
          description: "Let's set up your profile...",
        });
        navigate('/onboarding/social');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message || "Please try again",
      });
    }
  };

  const handleDemoGoogleSignIn = async () => {
    try {
      console.log('Starting demo Google sign in...');
      await handleGoogleSignIn();
      toast({
        title: "Demo Mode",
        description: "Proceeding with demo account...",
      });
      navigate('/onboarding/social');
    } catch (error: any) {
      console.error('Demo sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "Please try again",
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black to-siso-bg z-0" />
      
      {/* Waves Background - Positioned above gradient but below content */}
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
      
      {/* Content Container - Highest z-index */}
      <div className="relative z-20 w-full max-w-md p-8">
        <div className="backdrop-blur-xl bg-black/40 rounded-lg shadow-xl p-8 border border-siso-border/60 space-y-6">
          {/* Progress Indicator */}
          <div className="absolute -top-10 left-0 w-full flex justify-center text-siso-text/70">
            <span className="px-4 py-1 rounded-full bg-siso-bg-alt border border-siso-border text-sm">
              Step 1 of 3
            </span>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
              Welcome to SISO Agency
            </h1>
            <p className="text-siso-text">Let's get started with your account setup</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Work Email"
                className="w-full bg-white/5 border-siso-border text-siso-text placeholder:text-siso-text-muted focus:border-siso-red"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Create Password"
                className="w-full bg-white/5 border-siso-border text-siso-text placeholder:text-siso-text-muted focus:border-siso-red"
                required
                maxLength={72}
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
            >
              Continue to Next Step
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-siso-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black/20 px-2 text-siso-text-muted">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleDemoGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2"
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            
            <Button
              onClick={() => {
                toast({
                  title: "Demo Mode",
                  description: "Proceeding with demo account...",
                });
                navigate('/onboarding/social');
              }}
              className="w-full bg-[#24292F] text-white hover:bg-[#24292F]/90 flex items-center justify-center gap-2"
            >
              <GitHubIcon />
              Continue with GitHub
            </Button>
          </div>

          <div className="text-center text-sm text-siso-text/70">
            Already have an account?{" "}
            <button 
              onClick={() => navigate('/login')} 
              className="text-siso-red hover:text-siso-orange transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);