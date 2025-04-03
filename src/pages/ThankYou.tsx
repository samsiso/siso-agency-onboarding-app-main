
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';

const ThankYou = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-siso-bg to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-black/40 backdrop-blur-md border border-siso-text/10 rounded-lg p-8 max-w-md w-full text-center shadow-xl"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-siso-red to-siso-orange flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
        
        <p className="text-siso-text mb-6">
          We've received your information and our team will reach out to you shortly to start working on your 48-hour MVP journey.
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          className="gap-2 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
        >
          <Home className="w-4 h-4" /> Return Home
        </Button>
      </motion.div>
    </div>
  );
}

export default ThankYou;
