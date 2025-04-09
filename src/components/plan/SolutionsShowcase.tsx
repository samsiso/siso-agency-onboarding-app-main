
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart, 
  Shield,
  Settings,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SolutionProps {
  title: string;
  description: string;
  painPoint: string;
  benefits: string[];
  impact: string;
  icon: React.ReactNode;
}

interface SolutionsShowcaseProps {
  onSelectSolution: (solution: SolutionProps) => void;
}

export const SolutionsShowcase = ({ onSelectSolution }: SolutionsShowcaseProps) => {
  const [expandedSolution, setExpandedSolution] = useState<string | null>(null);
  
  const solutions: SolutionProps[] = [
    {
      title: "Client Management Portal",
      description: "Comprehensive dashboard to manage all creator clients in one place",
      painPoint: "Client Retention Issues",
      benefits: [
        "Transparent reporting builds trust",
        "Activity tracking shows your value",
        "Structured onboarding increases satisfaction",
        "Progress visualization demonstrates results"
      ],
      impact: "Reduces client churn by 40%",
      icon: <Users className="h-5 w-5 text-siso-orange" />
    },
    {
      title: "Content Calendar System",
      description: "Plan, organize and schedule content across multiple platforms",
      painPoint: "Content Disorganization",
      benefits: [
        "Visual planning prevents missed deadlines",
        "Content library keeps assets organized",
        "Scheduling automation saves time",
        "Approval workflows maintain quality"
      ],
      impact: "Saves 15+ hours per week",
      icon: <Calendar className="h-5 w-5 text-siso-orange" />
    },
    {
      title: "Unified Communication Hub",
      description: "Centralize all client and fan messages in one streamlined inbox",
      painPoint: "Communication Delays",
      benefits: [
        "Priority inbox highlights urgent messages",
        "Message templates ensure consistency",
        "Auto-replies handle common questions",
        "Integration with popular messaging apps"
      ],
      impact: "Cuts response time by 50%",
      icon: <MessageSquare className="h-5 w-5 text-siso-orange" />
    },
    {
      title: "Performance Analytics",
      description: "Track earnings, growth and engagement metrics for all creators",
      painPoint: "Revenue Tracking",
      benefits: [
        "Real-time revenue dashboard",
        "Subscription trend analysis",
        "Content performance metrics",
        "Custom report generation"
      ],
      impact: "Increases revenue by 35%",
      icon: <BarChart className="h-5 w-5 text-siso-orange" />
    }
  ];
  
  const handleExpandSolution = (title: string) => {
    if (expandedSolution === title) {
      setExpandedSolution(null);
    } else {
      setExpandedSolution(title);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-2">Solutions to Your Challenges</h3>
      <p className="text-siso-text mb-4">Each feature is designed to solve specific pain points for OnlyFans management agencies.</p>
      
      <div className="grid grid-cols-1 gap-4">
        {solutions.map((solution, index) => (
          <motion.div
            key={solution.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div 
              className={`bg-black/20 border rounded-lg overflow-hidden transition-all duration-300 ${
                expandedSolution === solution.title 
                  ? 'border-siso-orange/30' 
                  : 'border-siso-text/10'
              }`}
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => handleExpandSolution(solution.title)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-siso-orange/10 rounded-full mt-0.5">
                      {solution.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{solution.title}</h4>
                      <p className="text-sm text-siso-text">{solution.description}</p>
                    </div>
                  </div>
                  <div className="bg-siso-orange/10 text-siso-orange text-xs font-medium px-2.5 py-1 rounded">
                    {solution.impact}
                  </div>
                </div>
              </div>
              
              {expandedSolution === solution.title && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="pt-3 border-t border-siso-text/10 mt-2">
                    <div className="mb-3">
                      <span className="text-xs font-medium text-siso-text">SOLVES PAIN POINT:</span>
                      <span className="ml-2 text-sm text-white">{solution.painPoint}</span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {solution.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-siso-orange shrink-0 mt-0.5" />
                          <span className="text-sm text-siso-text">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => onSelectSolution(solution)}
                      className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
                    >
                      See How It Works
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
