
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const DecoraPlan = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    // Start progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsRedirecting(true);
          return 100;
        }
        return prev + 4; // Increment by 4% each time (25 steps to reach 100%)
      });
    }, 100);
    
    // Redirect to the plan page after animation completes
    const redirectTimer = setTimeout(() => {
      console.log("DecoraPlan: Redirecting to /plan/decora");
      navigate('/plan/decora');
    }, 3500); // Show loading screen for 3.5 seconds then redirect
    
    // Clean up timers
    return () => {
      clearInterval(progressInterval);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);
  
  // Function to handle manual navigation when button is clicked
  const handleViewPlanClick = () => {
    console.log("DecoraPlan: Manual button click, navigating to /plan/decora");
    setIsRedirecting(true);
    
    // Force immediate navigation rather than waiting
    navigate('/plan/decora');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
      <div className="max-w-md w-full bg-black/40 border border-siso-text/10 rounded-lg p-6 backdrop-blur-sm">
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-12 w-12 text-siso-orange mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-1">
              Welcome, Decora Agency!
            </h2>
            <p className="text-siso-text text-sm">
              We're finalizing your custom OnlyFans Management Suite
            </p>
          </motion.div>
        </div>
        
        <div className="flex justify-center mb-6">
          {isRedirecting ? (
            <CheckCircle className="h-12 w-12 text-siso-orange animate-pulse" />
          ) : (
            <div className="w-12 h-12 border-4 border-siso-orange border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-siso-text">Loading your custom plan</span>
            <span className="text-sm text-siso-orange">
              {isRedirecting ? 'Ready!' : `${progress}%`}
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-black/30" 
            indicatorClassName="bg-gradient-to-r from-siso-red to-siso-orange" 
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 rounded-lg bg-siso-orange/5 border border-siso-orange/20 p-4 text-sm text-siso-text"
        >
          <p className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-siso-orange shrink-0" />
            <span>Your OnlyFans management platform is almost ready. We've added special features just for agencies like yours!</span>
          </p>
        </motion.div>
        
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleViewPlanClick}
            className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
            disabled={progress < 100}
          >
            {isRedirecting ? 'Redirecting...' : 'View Your Plan Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DecoraPlan;
