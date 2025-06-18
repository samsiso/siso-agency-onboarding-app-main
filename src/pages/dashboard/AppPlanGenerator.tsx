import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartnershipLayout } from '@/components/partnership/PartnershipLayout';
import { Waves } from '@/components/ui/waves-background';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';
import { VercelV0Chat } from '@/components/ui/v0-ai-chat';
import { AppPlanGenerator } from '@/components/app-plan/AppPlanGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  History, 
  FileText, 
  Clock, 
  ChevronRight,
  Zap,
  Brain,
  Rocket,
  Star,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeneratedPlan {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  status: 'generating' | 'completed' | 'error';
  features?: string[];
  timeline?: string;
  budget?: string;
}

const AppPlanGeneratorPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(null);
  const [previousPlans, setPreviousPlans] = useState<GeneratedPlan[]>([
    {
      id: '1',
      title: 'E-commerce Mobile App',
      description: 'A comprehensive mobile e-commerce platform with user authentication, product catalog, shopping cart, and payment integration.',
      timestamp: new Date(Date.now() - 86400000),
      status: 'completed',
      features: ['User Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Tracking'],
      timeline: '12-16 weeks',
      budget: '$25,000 - $35,000'
    },
    {
      id: '2',
      title: 'Social Media Dashboard',
      description: 'Analytics dashboard for social media management with real-time metrics and automated reporting.',
      timestamp: new Date(Date.now() - 172800000),
      status: 'completed',
      features: ['Real-time Analytics', 'Multi-platform Integration', 'Automated Reports', 'Team Collaboration'],
      timeline: '8-10 weeks',
      budget: '$18,000 - $25,000'
    },
    {
      id: '3',
      title: 'Fitness Tracking App',
      description: 'Comprehensive fitness application with workout tracking, nutrition planning, and social features.',
      timestamp: new Date(Date.now() - 259200000),
      status: 'completed',
      features: ['Workout Tracking', 'Nutrition Planning', 'Social Features', 'Progress Analytics'],
      timeline: '14-18 weeks',
      budget: '$30,000 - $45,000'
    }
  ]);

  const handleChatSubmit = async (message: string) => {
    if (!message.trim()) return;

    const newPlan: GeneratedPlan = {
      id: Date.now().toString(),
      title: 'Generating App Plan...',
      description: message,
      timestamp: new Date(),
      status: 'generating'
    };

    setCurrentPlan(newPlan);
    setIsGenerating(true);

    // Simulate AI generation process
    try {
      // This would integrate with your existing AppPlanGenerator logic
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const completedPlan: GeneratedPlan = {
        ...newPlan,
        title: 'Custom App Plan',
        status: 'completed',
        features: ['Core Feature 1', 'Core Feature 2', 'Advanced Feature', 'Integration'],
        timeline: '10-14 weeks',
        budget: '$20,000 - $30,000'
      };

      setCurrentPlan(completedPlan);
      setPreviousPlans(prev => [completedPlan, ...prev]);
    } catch (error) {
      setCurrentPlan({ ...newPlan, status: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <PartnershipLayout>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <Waves 
          lineColor="rgba(251, 146, 60, 0.3)" 
          className="-z-10"
        />
        <FloatingOrbs count={6} />
      </div>

      <div className="relative min-h-screen">
        {/* Header */}
        <div className="relative z-10 px-6 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                AI App Plan Generator
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Describe your app idea and let AI create a comprehensive development plan with features, timeline, and budget estimates.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                <Rocket className="h-3 w-3 mr-1" />
                Instant Results
              </Badge>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                <Star className="h-3 w-3 mr-1" />
                Professional Grade
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-6 pb-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* AI Chat Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-orange-500/20 shadow-2xl">
                <CardContent className="p-6">
                  <VercelV0Chat
                    onSubmit={handleChatSubmit}
                    placeholder="Describe your app idea... (e.g., 'I want to build a social media app for fitness enthusiasts with workout tracking and community features')"
                    isLoading={isGenerating}
                    className="bg-gray-900/50 border-orange-500/30"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Current Generation */}
            <AnimatePresence>
              {currentPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {isGenerating ? (
                    <Card className="bg-black/40 backdrop-blur-xl border-orange-500/20">
                      <CardContent className="p-6">
                        <AppPlanGenerator
                          prompt={currentPlan.description}
                          onComplete={(plan) => {
                            // Handle completion
                          }}
                          demoMode={false}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-black/40 backdrop-blur-xl border-green-500/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl text-white flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            {currentPlan.title}
                          </CardTitle>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-300">{currentPlan.description}</p>
                        {currentPlan.features && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Key Features:</h4>
                            <div className="flex flex-wrap gap-2">
                              {currentPlan.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="border-orange-500/30 text-orange-400">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="text-center p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
                            <p className="text-sm text-gray-400">Timeline</p>
                            <p className="font-medium text-white">{currentPlan.timeline}</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
                            <p className="text-sm text-gray-400">Budget</p>
                            <p className="font-medium text-white">{currentPlan.budget}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Previous Plans History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-orange-400" />
                    Previous App Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {previousPlans.map((plan) => (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group p-4 rounded-lg bg-gray-900/30 border border-gray-700/30 hover:border-orange-500/30 transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-orange-400" />
                                <h4 className="font-medium text-white group-hover:text-orange-300 transition-colors">
                                  {plan.title}
                                </h4>
                                <Badge 
                                  className={cn(
                                    "text-xs",
                                    plan.status === 'completed' && "bg-green-500/20 text-green-400 border-green-500/30",
                                    plan.status === 'generating' && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                                    plan.status === 'error' && "bg-red-500/20 text-red-400 border-red-500/30"
                                  )}
                                >
                                  {plan.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                                {plan.description}
                              </p>
                              {plan.features && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {plan.features.slice(0, 3).map((feature, index) => (
                                    <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                      {feature}
                                    </Badge>
                                  ))}
                                  {plan.features.length > 3 && (
                                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                                      +{plan.features.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimeAgo(plan.timestamp)}
                                </div>
                                {plan.timeline && (
                                  <span>{plan.timeline}</span>
                                )}
                                {plan.budget && (
                                  <span>{plan.budget}</span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PartnershipLayout>
  );
};

export default AppPlanGeneratorPage;