import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wand2, 
  Clock, 
  DollarSign, 
  Users, 
  Lightbulb,
  FileText,
  Cog,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { appPlanAgent } from '@/services/appPlanAgent';
import { GeneratedAppPlan } from '@/types/appPlan.types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function AppPlanGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedAppPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Get business data from onboarding
      const inputData = appPlanAgent.createInputFromOnboardingData();
      
      if (!inputData) {
        throw new Error('No business data found. Please complete onboarding first.');
      }

      toast({
        title: "🤖 AI Agent Activated",
        description: "Analyzing your business requirements..."
      });

      // Generate plan with AI
      const plan = await appPlanAgent.generatePlan(inputData, {
        model: 'gpt-4',
        includeMarketAnalysis: true,
        includeCostEstimates: true,
        includeWireframes: false,
        detailLevel: 'detailed',
        focusAreas: ['technical', 'business', 'design']
      });

      setGeneratedPlan(plan);
      
      toast({
        title: "✅ App Plan Generated!",
        description: `Comprehensive plan created for ${plan.businessName}`
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate plan';
      setError(errorMessage);
      
      toast({
        title: "❌ Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Check if we have existing plan
  const existingPlan = appPlanAgent.getLatestPlan();
  const planToShow = generatedPlan || existingPlan;

  return (
    <div className="space-y-6">
      {/* Generator Header */}
      <Card className="bg-gradient-to-r from-purple-600/20 via-purple-500/10 to-pink-500/20 border border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            <Wand2 className="h-6 w-6 text-purple-400" />
            AI App Plan Generator
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              Powered by AI
            </Badge>
          </CardTitle>
          <p className="text-gray-300">
            Generate a comprehensive app development plan using AI analysis of your business requirements.
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate App Plan
                </>
              )}
            </Button>
            
            {existingPlan && (
              <div className="text-sm text-gray-400">
                Last generated: {new Date(existingPlan.generatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Plan Display */}
      <AnimatePresence>
        {planToShow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Plan Overview */}
            <Card className="bg-black/30 border border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-400" />
                    App Plan: {planToShow.businessName}
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "capitalize",
                      planToShow.status === 'draft' && "bg-yellow-500/20 text-yellow-300",
                      planToShow.status === 'approved' && "bg-green-500/20 text-green-300"
                    )}
                  >
                    {planToShow.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  {planToShow.executiveSummary}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Timeline</p>
                      <p className="text-white font-semibold">{planToShow.totalTimelineWeeks} weeks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Total Cost</p>
                      <p className="text-white font-semibold">
                        {formatCurrency(planToShow.costBreakdown.total, planToShow.costBreakdown.currency)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
                    <Lightbulb className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Features</p>
                      <p className="text-white font-semibold">{planToShow.features.length} planned</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card className="bg-black/30 border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Cog className="h-5 w-5 text-orange-400" />
                  Key Features
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {planToShow.features.slice(0, 4).map((feature, index) => (
                    <div 
                      key={feature.id}
                      className="p-3 bg-black/20 rounded-lg border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">{feature.name}</h4>
                        <Badge 
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            feature.priority === 'high' && "bg-red-500/20 text-red-300",
                            feature.priority === 'medium' && "bg-yellow-500/20 text-yellow-300",
                            feature.priority === 'low' && "bg-green-500/20 text-green-300"
                          )}
                        >
                          {feature.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{feature.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{feature.estimatedHours}h</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500 capitalize">{feature.complexity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {planToShow.features.length > 4 && (
                  <div className="mt-4 text-center">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      View all {planToShow.features.length} features →
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Development Phases */}
            <Card className="bg-black/30 border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Development Phases
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {planToShow.developmentPhases.map((phase, index) => (
                    <div key={phase.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-400 font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{phase.name}</h4>
                          <p className="text-sm text-gray-400">{phase.estimatedDuration}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{phase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((deliverable, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-blue-500/20 text-blue-300">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Confidence & Actions */}
            <Card className="bg-black/30 border border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-white">AI Confidence Score</p>
                      <p className="text-xs text-gray-400">Model: {planToShow.modelUsed}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">{planToShow.confidence}%</p>
                      <p className="text-xs text-gray-400">confidence</p>
                    </div>
                    
                    <Button variant="outline" size="sm" className="border-white/20 text-gray-300">
                      Refine Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 