
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CaseStudy } from '@/components/plan/CaseStudy';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface InteractiveCalloutProps {
  title: string;
  value: string;
  type: 'niche' | 'company' | 'product';
  description: string;
}

export const InteractiveCallout = ({ title, value, type, description }: InteractiveCalloutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Different content based on callout type
  const getDetailContent = () => {
    switch (type) {
      case 'niche':
        return (
          <div className="space-y-4">
            <p className="text-siso-text text-sm">{description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CaseStudy 
                title="40% Revenue Growth" 
                description="How a similar agency increased client retention with our dashboard" 
                imageUrl="/lovable-uploads/2a89d9b1-9fbb-4a86-a53a-36d9f63d1f7a.png"
                notionUrl="https://notion.so"
              />
              <div className="bg-black/30 rounded-lg aspect-video overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-siso-text text-sm">Demo video will be added here</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'company':
        return (
          <div className="space-y-4">
            <p className="text-siso-text text-sm">{description}</p>
            <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10">
              <h4 className="text-white text-sm font-medium mb-2">Success Metrics</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-siso-orange">+60%</span>
                  <span className="text-xs text-siso-text">Client Retention</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-siso-orange">-35%</span>
                  <span className="text-xs text-siso-text">Time Spent on Admin</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'product':
        return (
          <div className="space-y-4">
            <p className="text-siso-text text-sm">{description}</p>
            <div className="bg-black/20 rounded-lg overflow-hidden border border-siso-text/10">
              <img 
                src="/lovable-uploads/3b17a23d-630e-4e55-94bf-9d6fef9e6fc4.png" 
                alt="Dashboard Preview" 
                className="w-full h-auto"
              />
              <div className="p-3">
                <p className="text-xs text-siso-text">Dashboard preview solving content management issues</p>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <HoverCard>
          <HoverCardTrigger asChild>
            <CollapsibleTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-siso-text/10 cursor-pointer 
                hover:border-siso-orange/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-siso-text text-xs uppercase tracking-wider">{title}</h3>
                    <p className="text-white font-semibold mt-1">{value}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-siso-orange opacity-60 group-hover:opacity-100" />
                  </motion.div>
                </div>
              </motion.div>
            </CollapsibleTrigger>
          </HoverCardTrigger>
          
          <HoverCardContent 
            side="bottom" 
            align="start" 
            className="z-50 w-80 p-4 bg-black/90 border border-siso-orange/20 text-siso-text"
          >
            <p className="text-xs">Click to expand and see more details about {value}</p>
          </HoverCardContent>
        </HoverCard>
      
        <AnimatePresence>
          {isOpen && (
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 rounded-lg bg-black/20 backdrop-blur-sm p-4 border border-siso-text/10"
              >
                {getDetailContent()}
                
                <div className="mt-4 text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-siso-orange border-siso-orange/30 hover:bg-siso-orange/10"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </div>
  );
};
