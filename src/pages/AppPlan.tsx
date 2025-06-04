import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AppPlanGenerator } from '@/components/app-plan/AppPlanGenerator';
import { BusinessDataForm, BusinessDataInput } from '@/components/app-plan/BusinessDataForm';
import { AppPlanFeaturesOutput } from '@/components/app-plan/AppPlanFeaturesOutput';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Wand2, FileText, FlaskConical, Search, BarChart3, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { appPlanAgent } from '@/services/appPlanAgent';
import { GeneratedAppPlan } from '@/types/appPlan.types';
import { Progress } from '@/components/ui/progress';

export default function AppPlan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedAppPlan | null>(null);
  const [isNewlyGenerated, setIsNewlyGenerated] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');
  const [businessData, setBusinessData] = useState<BusinessDataInput>({
    businessName: '',
    appPurpose: '',
    industry: '',
    targetAudience: '',
    desiredFeatures: '',
    budget: '',
    timeline: '',
    additionalRequirements: ''
  });

  // Reset progress when generation completes
  useEffect(() => {
    if (!isGenerating) {
      setTimeout(() => {
        setGenerationProgress(0);
        setGenerationStage('');
      }, 500);
    }
  }, [isGenerating]);

  // Simulate progress for the generation process
  useEffect(() => {
    if (isGenerating) {
      // First stage: Industry research (0-40%)
      const timer1 = setTimeout(() => {
        setGenerationStage('Researching industry trends and market data');
        setGenerationProgress(10);
      }, 300);
      
      const timer2 = setTimeout(() => {
        setGenerationProgress(20);
      }, 1200);
      
      const timer3 = setTimeout(() => {
        setGenerationProgress(30);
      }, 2000);
      
      // Second stage: Analyzing requirements (40-70%)
      const timer4 = setTimeout(() => {
        setGenerationStage('Analyzing requirements and identifying features');
        setGenerationProgress(40);
      }, 3000);
      
      const timer5 = setTimeout(() => {
        setGenerationProgress(50);
      }, 4000);
      
      const timer6 = setTimeout(() => {
        setGenerationProgress(60);
      }, 5000);
      
      // Third stage: Generating plan (70-90%)
      const timer7 = setTimeout(() => {
        setGenerationStage('Creating app plan with tailored features');
        setGenerationProgress(70);
      }, 6000);
      
      const timer8 = setTimeout(() => {
        setGenerationProgress(80);
      }, 7000);
      
      // Final stage: Finalizing (90-95%)
      const timer9 = setTimeout(() => {
        setGenerationStage('Finalizing and preparing results');
        setGenerationProgress(90);
      }, 8000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
        clearTimeout(timer7);
        clearTimeout(timer8);
        clearTimeout(timer9);
      };
    }
  }, [isGenerating]);

  const handleSubmitBusinessData = async (data: BusinessDataInput) => {
    setIsGenerating(true);
    setGenerationProgress(5);
    setGenerationStage('Initiating generation process');
    
    try {
      const plan = await appPlanAgent.generatePlan(data);
      setGeneratedPlan(plan);
      setIsNewlyGenerated(true);
      setGenerationProgress(100);
      setGenerationStage('Generation complete!');
      setActiveTab('view');
      
      toast({
        title: "App Plan Generated",
        description: "Your app plan features have been generated successfully."
      });
    } catch (error) {
      console.error("Error generating app plan:", error);
      toast({
        title: "Generation Failed",
        description: "There was a problem generating your app plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setIsNewlyGenerated(false), 1000);
    }
  };

  const handleDataCollected = (field: keyof BusinessDataInput, value: string) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <MainLayout>
      <div className="container max-w-5xl py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">App Plan Generator</h1>
          </div>
          
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-gray-300 flex items-center gap-2"
            onClick={() => navigate('/onboarding-chat')}
          >
            <MessageSquare className="h-4 w-4 text-orange-500" />
            Chat Assistant
          </Button>
        </div>

        {isGenerating && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              {generationStage.includes('Research') ? (
                <Search className="h-5 w-5 text-blue-400 animate-pulse" />
              ) : generationStage.includes('Analyzing') ? (
                <BarChart3 className="h-5 w-5 text-green-400 animate-pulse" />
              ) : generationStage.includes('Creating') ? (
                <Wand2 className="h-5 w-5 text-purple-400 animate-pulse" />
              ) : (
                <FlaskConical className="h-5 w-5 text-orange-400 animate-pulse" />
              )}
              <h3 className="text-sm font-medium text-white">{generationStage}</h3>
            </div>
            <div className="space-y-2">
              <Progress 
                value={generationProgress} 
                className="h-2 bg-gray-700" 
                indicatorColor={
                  generationProgress < 40 ? 'bg-blue-500' : 
                  generationProgress < 70 ? 'bg-green-500' : 
                  generationProgress < 90 ? 'bg-purple-500' : 
                  'bg-orange-500'
                }
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Research</span>
                <span>Analysis</span>
                <span>Generation</span>
                <span>Finalize</span>
              </div>
            </div>
          </div>
        )}

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span>Business Data</span>
            </TabsTrigger>
            <TabsTrigger 
              value="view" 
              disabled={!generatedPlan}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>App Features</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4 mt-2">
            <BusinessDataForm 
              onSubmit={handleSubmitBusinessData} 
              isSubmitting={isGenerating}
              initialData={businessData}
            />
          </TabsContent>

          <TabsContent value="view" className="space-y-4 mt-2">
            {generatedPlan ? (
              <AppPlanFeaturesOutput 
                plan={generatedPlan} 
                isNewlyGenerated={isNewlyGenerated}
              />
            ) : (
              <div className="p-8 text-center text-gray-400">
                <p>No app plan generated yet. Please submit business data first.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
} 