import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Waves } from '@/components/ui/waves-background';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/home', { replace: true });
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleEmailAuth = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        // Handle sign up
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: values.email.split('@')[0], // Default name from email
            },
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created",
          description: "Welcome to SISO Agency Platform",
        });
        navigate('/home');
      } else {
        // Handle sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        });
        
        navigate('/home');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific error messages
      if (error.message.includes('Email not confirmed')) {
        toast({
          variant: "destructive",
          title: "Email not verified",
          description: "Please check your email and click the verification link",
        });
      } else if (error.message.includes('Invalid login')) {
        toast({
          variant: "destructive",
          title: "Invalid credentials",
          description: "Please check your email and password",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: error.message || "Please try again",
        });
      }
    } finally {
      setIsLoading(false);
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
            <p className="text-siso-text">{isSignUp ? 'Create your account' : 'Sign in to your account'}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailAuth)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-siso-text">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="youremail@example.com" 
                        {...field} 
                        className="bg-black/20 border-siso-text/20 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-siso-text">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-black/20 border-siso-text/20 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Button 
              variant="ghost" 
              className="text-siso-text hover:text-siso-orange"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          </div>

          <div className="text-center text-sm text-siso-text/70 mt-6">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-siso-red hover:text-siso-orange transition-colors">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="/privacy" className="text-siso-red hover:text-siso-orange transition-colors">
              Privacy Policy
            </a>
          </div>

          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/testing'}
              className="bg-black/30 border-white/20 text-white hover:bg-black/50"
            >
              🧪 Access AI Testing Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
