
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PainPointsPrompt } from '@/components/plan/PainPointsPrompt';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { WelcomeLoader } from '@/components/plan/WelcomeLoader';

const DecoraPlan = () => {
  const navigate = useNavigate();
  const [showPrompts, setShowPrompts] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Simulating loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setLoadingComplete(true);
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
  
  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      handlePromptsComplete();
    }
  };
  
  const steps = [
    "Personalizing your experience...",
    "Mapping solutions to your agency needs...",
    "Finalizing your custom OnlyFans Management Suite..."
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black flex items-center justify-center p-4">
      {/* Progress bar that shows how far down the page you've scrolled */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-black/30">
        <div 
          className="h-full bg-gradient-to-r from-siso-red to-siso-orange transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {showPrompts ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-4xl"
        >
          <PainPointsPrompt 
            onComplete={handlePromptsComplete} 
            currentStep={currentStep}
            onNextStep={handleNextStep}
          />
          
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
                {loadingComplete ? 'Ready!' : `${loadingProgress}%`}
              </span>
            </div>
            <Progress 
              value={loadingProgress} 
              className="h-2 bg-black/30" 
              indicatorClassName="bg-gradient-to-r from-siso-red to-siso-orange" 
            />
          </div>
          
          <div className="space-y-3 mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  loadingProgress >= (index + 1) * 33 ? 'bg-siso-orange/20' : 'bg-siso-text/5'
                }`}>
                  {loadingProgress >= (index + 1) * 33 ? (
                    <CheckCircle className="h-4 w-4 text-siso-orange" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-siso-text/20" />
                  )}
                </div>
                <p className={`text-sm ${
                  loadingProgress >= (index + 1) * 33 ? 'text-siso-text' : 'text-siso-text/50'
                }`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
          
          {loadingComplete && (
            <Button 
              onClick={handleSkipToFullPlan}
              className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
            >
              View Your Personalized Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DecoraPlan;
