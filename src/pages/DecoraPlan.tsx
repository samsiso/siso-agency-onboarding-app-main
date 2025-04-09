
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PainPointsPrompt } from '@/components/plan/PainPointsPrompt';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const DecoraPlan = () => {
  const navigate = useNavigate();
  const [showPrompts, setShowPrompts] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    // Simulating loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => clearInterval(progressInterval);
  }, []);
  
  const handlePromptsComplete = () => {
    setShowPrompts(false);
    
    // After small delay for animation, navigate to the plan
    setTimeout(() => {
      navigate('/plan/decora', { replace: true });
    }, 800);
  };
  
  const handleSkipToFullPlan = () => {
    navigate('/plan/decora', { replace: true });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black flex items-center justify-center p-4">
      {showPrompts ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-4xl"
        >
          <PainPointsPrompt onComplete={handlePromptsComplete} />
          
          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              className="text-siso-text hover:text-white"
              onClick={handleSkipToFullPlan}
            >
              Skip to full plan
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-md w-full bg-black/40 border border-siso-text/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-center mb-6">
            <Sparkles className="h-12 w-12 text-siso-orange mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-1">
              Preparing Your Custom Plan
            </h2>
            <p className="text-siso-text text-sm">
              We're finalizing your custom OnlyFans Management Suite
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-siso-text">Loading your custom plan</span>
              <span className="text-sm text-siso-orange">
                {loadingProgress}%
              </span>
            </div>
            <Progress 
              value={loadingProgress} 
              className="h-2 bg-black/30" 
              indicatorClassName="bg-gradient-to-r from-siso-red to-siso-orange" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DecoraPlan;
