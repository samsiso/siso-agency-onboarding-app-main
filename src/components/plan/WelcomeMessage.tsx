
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Trophy, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeMessageProps {
  agencyName: string;
  industryType: string;
  scrollToFeatures: () => void;
}

export const WelcomeMessage = ({ 
  agencyName, 
  industryType,
  scrollToFeatures 
}: WelcomeMessageProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const highlightText = "text-siso-orange font-semibold";
  
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-gradient-to-r from-siso-red/10 via-siso-orange/15 to-siso-orange/10 rounded-lg border border-siso-orange/20 shadow-lg p-6 mb-8"
    >
      <motion.div variants={item} className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-siso-orange/10 rounded-full">
          <Heart className="h-6 w-6 text-siso-orange" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-siso-orange to-white bg-clip-text text-transparent">
          Welcome, {agencyName}!
        </h2>
      </motion.div>
      
      <motion.div variants={item} className="mb-4 space-y-3">
        <p className="text-white text-lg leading-relaxed">
          We've designed your <span className={highlightText}>custom {industryType} management platform</span> to transform 
          how you run your business. This solution addresses your unique challenges and will 
          help you <span className={highlightText}>scale operations</span> while dramatically improving client retention.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <motion.div 
            variants={item}
            className="flex items-start gap-2 bg-black/20 rounded-lg p-3 border border-siso-text/10"
          >
            <TrendingUp className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-medium">40% Increase in Revenue</h3>
              <p className="text-siso-text text-sm">Based on similar implementations with agencies like yours</p>
            </div>
          </motion.div>
          
          <motion.div 
            variants={item}
            className="flex items-start gap-2 bg-black/20 rounded-lg p-3 border border-siso-text/10"
          >
            <Trophy className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-medium">60% Improved Client Retention</h3>
              <p className="text-siso-text text-sm">Through better communication and organization</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div variants={item} className="space-y-2 mb-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-siso-orange" />
          Platform Highlights:
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <li className="flex items-center gap-2 text-siso-text">
            <CheckCircle2 className="h-4 w-4 text-siso-orange shrink-0" />
            <span>Custom-built for {industryType} agencies</span>
          </li>
          <li className="flex items-center gap-2 text-siso-text">
            <CheckCircle2 className="h-4 w-4 text-siso-orange shrink-0" />
            <span>Comprehensive client management</span>
          </li>
          <li className="flex items-center gap-2 text-siso-text">
            <CheckCircle2 className="h-4 w-4 text-siso-orange shrink-0" />
            <span>Advanced content scheduling</span>
          </li>
          <li className="flex items-center gap-2 text-siso-text">
            <CheckCircle2 className="h-4 w-4 text-siso-orange shrink-0" />
            <span>Real-time analytics dashboard</span>
          </li>
        </ul>
      </motion.div>
      
      <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-3 mt-5">
        <Button 
          onClick={scrollToFeatures}
          className="w-full sm:w-auto bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
        >
          Explore All Features
        </Button>
        
        <div className="flex items-center gap-2 text-siso-text">
          <Clock className="h-4 w-4 text-siso-orange" />
          <span>Ready to launch in {industryType === "OnlyFans" ? "21" : "30"} days</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
