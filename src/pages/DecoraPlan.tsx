
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';

const DecoraPlan = () => {
  const navigate = useNavigate();
  const { userId } = useOnboardingAuth();
  const [typedText, setTypedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const agencyName = "Decora Agency";
  
  // Typewriter effect for the agency name
  useEffect(() => {
    const text = agencyName;
    let i = 0;
    // Speed up the typewriter effect
    const interval = setInterval(() => {
      if (i <= text.length) {
        setTypedText(text.substring(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTypingComplete(true);
      }
    }, 80); // Slightly slower for better readability
    
    return () => clearInterval(interval);
  }, []);
  
  // Auto-redirect after typing completes
  useEffect(() => {
    if (typingComplete) {
      // Auto-redirect after a delay
      const redirectTimer = setTimeout(() => {
        navigate('/plan/decora', { replace: true });
      }, 2500); // Give users time to read the welcome message
      
      return () => clearTimeout(redirectTimer);
    }
  }, [typingComplete, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl w-full z-10"
      >
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
            Welcome, <span className="text-siso-orange">{typedText}</span>
            <span className="animate-pulse">|</span>
          </h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: typingComplete ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="text-siso-text mx-auto mt-3 text-lg mb-6 space-y-4"
          >
            <p>Ready to transform your OnlyFans management?</p>
            
            <div className="bg-black/30 p-4 rounded-lg border border-siso-orange/10 text-left">
              <h3 className="text-white text-lg font-semibold mb-2">Your plan includes:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-siso-orange"></div>
                  <span>Complete creator management system</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-siso-orange"></div>
                  <span>Automated content scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-siso-orange"></div>
                  <span>Unified messaging platform</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-siso-orange"></div>
                  <span>Real-time analytics dashboard</span>
                </li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: typingComplete ? 1 : 0, y: typingComplete ? 0 : 10 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Button 
              onClick={() => navigate('/plan/decora', { replace: true })}
              className="px-8 py-6 text-lg bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
            >
              View Your Plan
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DecoraPlan;
