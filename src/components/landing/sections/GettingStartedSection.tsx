
import { GradientHeading } from '@/components/ui/gradient-heading';
import { UserPlusIcon, ClipboardCheckIcon, RocketIcon, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export const GettingStartedSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      navigate('/auth');
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to navigate to signup. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding/social`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "An error occurred during sign in",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      icon: UserPlusIcon,
      title: "Create Your Account",
      description: "Get started with SISO Resources in seconds. Join thousands of successful agency owners.",
      stats: {
        likes: 234,
        signupsToday: 156,
        setupTime: "2 min"
      }
    },
    {
      icon: ClipboardCheckIcon,
      title: "Complete Onboarding",
      description: "Quick and easy setup to personalize your experience. 98% completion rate with stellar reviews.",
      stats: {
        likes: 189,
        completionRate: "98%",
        rating: "4.9/5"
      }
    },
    {
      icon: RocketIcon,
      title: "Access Resources",
      description: "Instantly unlock AI-powered tools and insights. Updated daily with fresh content.",
      stats: {
        likes: 312,
        resources: "1000+",
        dailyUsers: "5k+"
      }
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <GradientHeading variant="secondary" className="text-4xl md:text-5xl font-bold mb-4">
            Get Access in Seconds
          </GradientHeading>
          <p className="text-lg text-siso-text-muted max-w-2xl mx-auto">
            Join thousands of successful agency owners already growing their business
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <motion.div 
              key={step.title}
              className="relative glow-card group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Card Content */}
              <div className="flex items-start gap-8 p-8 rounded-xl bg-gradient-to-br from-siso-red/5 to-siso-orange/5 
                border border-siso-orange/20 hover:border-siso-orange/40 transition-all duration-300">
                
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-siso-red to-siso-orange 
                  flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 
                    group-hover:from-siso-red/20 group-hover:to-siso-orange/20">
                    <step.icon className="w-8 h-8 text-siso-orange" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-semibold text-siso-text-bold">{step.title}</h3>
                  <p className="text-siso-text-muted">{step.description}</p>

                  {/* Stats Bar */}
                  <div className="flex items-center gap-6 text-sm text-siso-text-muted">
                    {/* Like Counter */}
                    <motion.button 
                      className="flex items-center gap-2 hover:text-siso-orange transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart className="w-4 h-4" />
                      <span>{step.stats.likes}</span>
                    </motion.button>

                    {/* Step-specific Stats */}
                    {index === 0 && (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span>{step.stats.signupsToday} signups today</span>
                        </div>
                        <div>{step.stats.setupTime} average setup</div>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div>{step.stats.completionRate} completion rate</div>
                        <div>{step.stats.rating} user rating</div>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <div>{step.stats.resources} resources</div>
                        <div>{step.stats.dailyUsers} daily users</div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons - Only show for first step */}
                  {index === 0 && (
                    <div className="flex flex-wrap items-center gap-4 mt-6">
                      <Button
                        onClick={handleSignUp}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 
                          text-white font-semibold px-6 py-2 flex items-center gap-2"
                      >
                        Create Your Account
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <GoogleSignInButton
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="absolute bottom-0 left-12 w-px h-12 bg-gradient-to-b from-siso-red/20 to-siso-orange/20 
                  transform translate-y-full" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
