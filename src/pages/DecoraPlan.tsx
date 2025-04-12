
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';
import { WelcomeLoader } from '@/components/plan/WelcomeLoader';
import { ClickThroughPrompt } from '@/components/plan/ClickThroughPrompt';
import { useToast } from '@/hooks/use-toast';

export const useTypewriter = (text: string, speed: number = 80) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayText, isComplete };
};

const DecoraPlan = () => {
  const { toast } = useToast();
  const { userId } = useOnboardingAuth();
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [showClickThroughPrompt, setShowClickThroughPrompt] = useState(false);
  const agencyName = "Decora Agency";
  
  const { displayText, isComplete: typingComplete } = useTypewriter(agencyName);
  
  // Progress animation
  useEffect(() => {
    if (typingComplete) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setLoadingComplete(true);
            return 100;
          }
          return prev + 3;
        });
      }, 120);
      
      return () => clearInterval(interval);
    }
  }, [typingComplete]);
  
  // Show click-through prompt after loading completes
  useEffect(() => {
    if (loadingComplete && !redirectAttempted) {
      setRedirectAttempted(true);
      
      setTimeout(() => {
        setShowClickThroughPrompt(true);
      }, 500);
    }
  }, [loadingComplete, redirectAttempted]);
  
  // Loading steps
  const loadingSteps = [
    "Analyzing your business needs",
    "Preparing feature recommendations",
    "Generating your custom plan"
  ];
  
  const handleContinue = () => {
    console.log("Manual continue clicked, redirecting to /plan/decora");
    toast({
      title: "Your plan is ready!",
      description: "Redirecting you to your personalized plan."
    });
    // Using direct window.location for consistent behavior
    window.location.href = '/plan/decora';
  };
  
  // Show the welcome/loading screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black flex flex-col items-center justify-center p-4">
      {!showClickThroughPrompt ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl w-full z-10"
        >
          {!typingComplete ? (
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 border border-siso-orange/20">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-5"
              >
                <Sparkles className="h-16 w-16 text-siso-orange mx-auto mb-4" />
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome, <span className="text-siso-orange">{displayText}</span>
                <span className="animate-pulse">|</span>
              </h1>
            </div>
          ) : (
            <WelcomeLoader
              progress={progress}
              complete={loadingComplete}
              steps={loadingSteps}
              onContinue={handleContinue}
            />
          )}
        </motion.div>
      ) : (
        <ClickThroughPrompt 
          agencyName={agencyName} 
          onContinue={handleContinue} 
        />
      )}
    </div>
  );
};

export default DecoraPlan;
