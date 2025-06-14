import React, { useState, useEffect } from 'react';
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
  Loader2,
  Zap,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { appPlanAgent } from '@/services/appPlanAgent';
import { GeneratedAppPlan } from '@/types/appPlan.types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AppPlanFeaturesOutput } from './AppPlanFeaturesOutput';

// Enhanced progress tracking interface
interface GenerationProgress {
  stage: 'idle' | 'initializing' | 'analyzing' | 'generating' | 'structuring' | 'finalizing' | 'complete' | 'error';
  progress: number;
  message: string;
  estimatedTimeRemaining?: number;
  startTime?: Date;
}

export function AppPlanGenerator() {
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedAppPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    stage: 'idle',
    progress: 0,
    message: 'Ready to generate your app plan'
  });
  const { toast } = useToast();

  // Subscribe to progress updates from the auto-trigger system
  useEffect(() => {
    // Check if generation is already in progress
    const existingPlan = appPlanAgent.getLatestPlan();
    if (existingPlan) {
      setGeneratedPlan(existingPlan);
    }

    // Listen for progress updates (if auto-trigger system is enhanced with events)
    const handleProgressUpdate = (progress: GenerationProgress) => {
      setGenerationProgress(progress);
    };

    // Simulate subscribing to progress events
    window.addEventListener('appPlanProgress', handleProgressUpdate as any);
    
    return () => {
      window.removeEventListener('appPlanProgress', handleProgressUpdate as any);
    };
  }, []);

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'initializing': return <Clock className="h-4 w-4" />;
      case 'analyzing': return <Brain className="h-4 w-4" />;
      case 'generating': return <Zap className="h-4 w-4" />;
      case 'structuring': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'finalizing': return <CheckCircle className="h-4 w-4" />;
      case 'complete': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'initializing': return 'bg-blue-500';
      case 'analyzing': return 'bg-purple-500';
      case 'generating': return 'bg-orange-500';
      case 'structuring': return 'bg-yellow-500';
      case 'finalizing': return 'bg-green-500';
      case 'complete': return 'bg-green-600';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeRemaining = (seconds?: number): string => {
    if (!seconds) return '';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerationProgress({
      stage: 'initializing',
      progress: 10,
      message: 'Setting up AI analysis...',
      startTime: new Date(),
      estimatedTimeRemaining: 45
    });
    
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

      // Simulate progress updates during generation
      const progressUpdates = [
        { stage: 'analyzing', progress: 25, message: `Analyzing ${inputData.industry} industry requirements...`, estimatedTimeRemaining: 35 },
        { stage: 'generating', progress: 50, message: 'AI generating comprehensive app plan...', estimatedTimeRemaining: 20 },
        { stage: 'structuring', progress: 80, message: 'Organizing recommendations and features...', estimatedTimeRemaining: 10 },
        { stage: 'finalizing', progress: 95, message: 'Finalizing plan with timeline and costs...', estimatedTimeRemaining: 5 }
      ];

      // Simulate realistic progress updates
      for (const update of progressUpdates) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setGenerationProgress({
          ...update,
          startTime: generationProgress.startTime
        } as GenerationProgress);
      }

      // Generate plan with AI
      const plan = await appPlanAgent.generatePlan(inputData, {
        model: 'gpt-4',
        includeMarketAnalysis: true,
        includeCostEstimates: true,
        includeWireframes: false,
        detailLevel: 'detailed',
        focusAreas: ['technical', 'business', 'design']
      });

      setGenerationProgress({
        stage: 'complete',
        progress: 100,
        message: 'App plan generated successfully!',
        startTime: generationProgress.startTime
      });

      setGeneratedPlan(plan);
      
      toast({
        title: "✅ App Plan Generated!",
        description: `Features plan created for ${plan.businessName}`
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate plan';
      setError(errorMessage);
      setGenerationProgress({
        stage: 'error',
        progress: 0,
        message: errorMessage,
        startTime: generationProgress.startTime
      });
      
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

  const resetGeneration = () => {
    setGeneratedPlan(null);
    setError(null);
    setGenerationProgress({
      stage: 'idle',
      progress: 0,
      message: 'Ready to generate your app plan'
    });
    // Clear stored plan for fresh generation
    localStorage.removeItem('latest-app-plan');
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Status */}
      <Card className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-gray-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-white">AI App Plan Generator</CardTitle>
                <p className="text-gray-400 text-sm mt-1">
                  Powered by Google Gemini 2.0 Flash • 100% Free AI
                </p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {planToShow ? 'Plan Generated' : 'Ready'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Progress Display */}
      <AnimatePresence>
        {(isGenerating || generationProgress.stage !== 'idle') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="bg-gray-800/60 border-gray-700/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Progress Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStageColor(generationProgress.stage)}`}>
                        {getStageIcon(generationProgress.stage)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white capitalize">
                          {generationProgress.stage.replace('-', ' ')}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {generationProgress.message}
                        </p>
                      </div>
                    </div>
                    {generationProgress.estimatedTimeRemaining && (
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Est. Time</div>
                        <div className="text-orange-400 font-mono">
                          {formatTimeRemaining(generationProgress.estimatedTimeRemaining)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-mono">{generationProgress.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${getStageColor(generationProgress.stage)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${generationProgress.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Stage Indicators */}
                  <div className="flex justify-between items-center">
                    {['initializing', 'analyzing', 'generating', 'structuring', 'finalizing', 'complete'].map((stage, index) => (
                      <div key={stage} className="flex flex-col items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${
                          generationProgress.stage === stage || (generationProgress.stage === 'complete' && index < 6)
                            ? getStageColor(stage)
                            : 'bg-gray-600'
                        }`} />
                        <span className="text-xs text-gray-500 capitalize">
                          {stage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generation Controls */}
      <Card className="bg-gray-800/60 border-gray-700/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            {!planToShow && !isGenerating && (
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    Generate Your AI App Plan
                  </h3>
                  <p className="text-gray-400">
                    Create a comprehensive app development plan using AI analysis of your business requirements.
                  </p>
                </div>
                <Button
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate AI App Plan
                    </>
                  )}
                </Button>
              </div>
            )}

            {planToShow && (
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    Plan Ready for {planToShow.businessName}
                  </h3>
                  <p className="text-gray-400">
                    Your comprehensive app development plan has been generated successfully.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={resetGeneration}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Generate New Plan
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Generation Error</span>
                </div>
                <p className="text-sm text-gray-300 mt-2">{error}</p>
                <Button
                  onClick={handleGeneratePlan}
                  size="sm"
                  className="mt-3 bg-red-600 hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Display */}
      {planToShow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AppPlanFeaturesOutput plan={planToShow} />
        </motion.div>
      )}
    </div>
  );
} 