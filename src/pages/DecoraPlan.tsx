
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageLoading } from '@/components/ui/message-loading';

const DecoraPlan = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add a small delay to show the loading animation
    const timer = setTimeout(() => {
      // Automatically redirect to the pre-populated Decora plan
      navigate('/plan/decora');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Preparing Your Custom Plan
        </h1>
        <p className="text-siso-text max-w-md mx-auto">
          We've created a personalized OnlyFans Management Suite proposal for Decora Agency
        </p>
      </motion.div>
      
      <div className="text-center">
        <MessageLoading className="mx-auto mb-4" />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-siso-text"
        >
          Loading your customized plan...
        </motion.p>
      </div>
    </div>
  );
};

export default DecoraPlan;
