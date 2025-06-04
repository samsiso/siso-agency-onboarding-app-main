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
import { AppPlanFeaturesOutput } from './AppPlanFeaturesOutput';

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
        description: `Features plan created for ${plan.businessName}`
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

  // Check if we have existing plan
  const existingPlan = appPlanAgent.getLatestPlan();
  const planToShow = generatedPlan || existingPlan;

  return (
    <div className="space-y-6">
      {/* Generator Header */}
      <Card className="bg-gradient-to-r from-orange-950/30 via-orange-900/20 to-orange-800/20 border border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            <Wand2 className="h-6 w-6 text-orange-400" />
            AI App Features Generator
            <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
              Powered by AI
            </Badge>
          </CardTitle>
          <p className="text-gray-300">
            Generate a focused list of app features based on your business requirements.
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Features
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

      {/* Generated Plan Display - Using the new features-focused output component */}
      <AnimatePresence>
        {planToShow && (
          <AppPlanFeaturesOutput 
            plan={planToShow} 
            isNewlyGenerated={!!generatedPlan && generatedPlan === planToShow} 
          />
        )}
      </AnimatePresence>
    </div>
  );
} 