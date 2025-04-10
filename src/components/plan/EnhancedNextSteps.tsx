
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { ButtonCta } from '@/components/ui/button-shiny';
import { Button } from '@/components/ui/button';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { RainbowButton } from '@/components/ui/rainbow-button';

interface EnhancedNextStepsProps {
  showFeatureSelection: boolean;
  onShowFeatures: () => void;
}

export const EnhancedNextSteps: React.FC<EnhancedNextStepsProps> = ({
  showFeatureSelection,
  onShowFeatures
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.section 
      className="space-y-6 fixed bottom-6 left-0 right-0 z-30 mx-auto max-w-5xl px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GradientHeading 
        className="text-2xl font-bold" 
        variant="primary"
      >
        Next Steps
      </GradientHeading>
      
      <motion.div 
        className="bg-gradient-to-r from-siso-red/30 to-siso-orange/30 rounded-xl p-6 border border-siso-orange/20 shadow-lg backdrop-blur-sm"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-siso-red to-siso-orange p-2.5 rounded-full">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Ready to transform your OnlyFans agency?
          </h3>
        </div>
        
        <p className="text-siso-text mb-6 max-w-3xl">
          {!showFeatureSelection ? 
            "Select your features to create a customized plan for your agency's needs. Our platform is designed specifically for OnlyFans agencies to help scale beyond $100k/month." :
            "Book a call with our implementation team to discuss your specific needs and get started with your custom platform. We'll guide you through every step of the process."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {!showFeatureSelection ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RainbowButton
                onClick={onShowFeatures}
                className="w-full sm:w-auto text-base font-medium"
              >
                Customize Your Features
                <ChevronRight className="ml-2 h-4 w-4" />
              </RainbowButton>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ButtonCta
                label="Schedule Free Consultation"
                className="w-full sm:w-auto"
                onClick={() => window.open('https://calendly.com/siso-team/onlyfans-platform', '_blank')}
              />
            </motion.div>
          )}
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Button 
              variant="outline"
              className="w-full sm:w-auto relative overflow-hidden group border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
              onClick={() => window.open('https://calendly.com/siso-team/demo', '_blank')}
            >
              <span className="relative z-10 flex items-center">
                Request Live Demo
                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              
              {/* Button shine effect */}
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: isHovered ? '100%' : '-100%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </Button>
          </motion.div>
        </div>
        
        <div className="mt-6 pt-5 border-t border-siso-text/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-siso-orange" />
            <span className="text-sm text-siso-text">Implementation begins within 48 hours</span>
          </div>
          
          <motion.div 
            className="text-xs text-siso-orange flex items-center gap-1 cursor-pointer"
            whileHover={{ x: 3 }}
          >
            View case studies
            <ArrowRight className="h-3 w-3" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Progress pills */}
      <div className="flex justify-center space-x-2 mt-6">
        <motion.div 
          className="h-1.5 w-12 rounded-full bg-siso-orange opacity-80"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="h-1.5 w-3 rounded-full bg-siso-text/30" />
        <div className="h-1.5 w-3 rounded-full bg-siso-text/30" />
      </div>
    </motion.section>
  );
};
