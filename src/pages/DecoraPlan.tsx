
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WelcomeLoader } from '@/components/plan/WelcomeLoader';
import { ClickThroughPrompt } from '@/components/plan/ClickThroughPrompt';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';

const DecoraPlan = () => {
  const navigate = useNavigate();
  const { userId } = useOnboardingAuth();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showClickThroughPrompt, setShowClickThroughPrompt] = useState(false);
  
  // Steps for the loading process
  const steps = [
    "Personalizing your experience...",
    "Mapping solutions to your agency needs...",
    "Finalizing your custom OnlyFans Management Suite..."
  ];
  
  // Auto-redirect to plan after loading completes
  useEffect(() => {
    if (loadingComplete) {
      // Show click-through prompt briefly for a better UX transition
      setTimeout(() => {
        setShowClickThroughPrompt(true);
      }, 800);
      
      // Auto-redirect after a total of 5 seconds
      setTimeout(() => {
        navigate('/plan/decora', { replace: true });
      }, 1500);
    }
  }, [loadingComplete, navigate]);
  
  // Simulating loading progress with enhanced animations
  useEffect(() => {
    // Non-linear progress to make loading feel more natural
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        // Complete the progress after approximately 5 seconds
        if (prev >= 100) {
          clearInterval(progressInterval);
          setLoadingComplete(true);
          return 100;
        }
        
        // Slower in the middle to create a realistic loading feel
        if (prev > 70 && prev < 95) {
          return prev + 1;
        } else if (prev > 40 && prev <= 70) {
          return prev + 2;
        } else {
          return prev + (prev < 30 ? 4 : 3);
        }
      });
    }, 100); // Faster interval for smoother animation
    
    return () => clearInterval(progressInterval);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black flex flex-col items-center justify-center p-4">
      {showClickThroughPrompt ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ClickThroughPrompt 
            agencyName="Decora Agency" 
            onContinue={() => navigate('/plan/decora', { replace: true })}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <WelcomeLoader
            progress={loadingProgress}
            complete={loadingComplete}
            steps={steps}
            onContinue={() => navigate('/plan/decora', { replace: true })}
          />
        </motion.div>
      )}
    </div>
  );
};

export default DecoraPlan;
