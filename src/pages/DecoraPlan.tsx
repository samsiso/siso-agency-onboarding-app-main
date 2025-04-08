
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageLoading } from '@/components/ui/message-loading';
import { FileText, Users, MessageSquare, BarChart, CheckCircle, Loader2, Sparkles, Heart, DollarSign, Check } from 'lucide-react';

const DecoraPlan = () => {
  const navigate = useNavigate();
  const [loadingStep, setLoadingStep] = useState(1);
  
  useEffect(() => {
    // Set up a sequence of loading steps
    const step1 = setTimeout(() => setLoadingStep(2), 1500);
    const step2 = setTimeout(() => setLoadingStep(3), 3000);
    const step3 = setTimeout(() => setLoadingStep(4), 4500);
    const step4 = setTimeout(() => setLoadingStep(5), 5500);
    
    // Final navigation
    const navigationTimer = setTimeout(() => {
      navigate('/plan/decora');
    }, 7000);
    
    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);
  
  const loadingSteps = [
    { icon: <Users className="h-5 w-5 text-siso-orange" />, text: "Analyzing Decora's client management needs..." },
    { icon: <FileText className="h-5 w-5 text-siso-orange" />, text: "Customizing content management features..." },
    { icon: <MessageSquare className="h-5 w-5 text-siso-orange" />, text: "Optimizing communication tools..." },
    { icon: <BarChart className="h-5 w-5 text-siso-orange" />, text: "Finalizing analytics and reporting..." },
    { icon: <DollarSign className="h-5 w-5 text-siso-orange" />, text: "Calculating investment tiers..." }
  ];
  
  // Price tier animation
  const tiers = [
    { name: "MVP", price: "£249", features: 5 },
    { name: "Standard", price: "£999", features: 12 },
    { name: "Premium", price: "£1,749", features: 18 },
    { name: "Enterprise", price: "£2,490", features: 25 }
  ];
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <Sparkles className="h-16 w-16 text-siso-orange mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Creating Your OnlyFans Management Suite
        </h1>
        <p className="text-siso-text max-w-md mx-auto">
          We're building a customized plan for Decora Agency based on your industry needs
        </p>
      </motion.div>
      
      <div className="max-w-md w-full bg-black/40 border border-siso-text/10 rounded-lg p-6 backdrop-blur-sm">
        <MessageLoading className="mx-auto mb-6" />
        
        <motion.div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-siso-text">Loading your plan</span>
            <span className="text-sm text-siso-orange">{Math.min(20 * loadingStep, 100)}%</span>
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-siso-red to-siso-orange"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(20 * loadingStep, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
        
        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: loadingStep > index ? 1 : 0.3,
                y: 0 
              }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                loadingStep > index ? 'bg-siso-orange/20' : 'bg-siso-text/5'
              }`}>
                {loadingStep > index ? (
                  <CheckCircle className="h-4 w-4 text-siso-orange" />
                ) : loadingStep === index + 1 ? (
                  <Loader2 className="h-4 w-4 text-siso-orange animate-spin" />
                ) : (
                  step.icon
                )}
              </div>
              <p className={`text-sm ${
                loadingStep > index ? 'text-siso-text' : 'text-siso-text/50'
              }`}>
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
        
        {loadingStep >= 5 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mt-6 overflow-hidden"
          >
            <h3 className="text-white font-medium mb-2">Available Investment Tiers:</h3>
            <div className="space-y-3">
              {tiers.map((tier, index) => (
                <motion.div 
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className="flex items-center justify-between p-2 rounded-lg border border-siso-text/10 bg-black/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-siso-orange/10 text-siso-orange">
                      {index === 0 ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-medium">{index+1}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-white">{tier.name}</span>
                      <div className="text-xs text-siso-text/70">{tier.features} features</div>
                    </div>
                  </div>
                  <span className="text-siso-orange font-medium">{tier.price}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 rounded-lg bg-siso-orange/5 border border-siso-orange/20 p-4 text-sm text-siso-text"
        >
          <p className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-siso-orange shrink-0" />
            <span>We've included premium features specifically for OnlyFans management agencies like yours!</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DecoraPlan;
