import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AppPlanGenerator } from '@/components/app-plan/AppPlanGenerator';
import { BusinessDataForm, BusinessDataInput } from '@/components/app-plan/BusinessDataForm';
import { AppPlanFeaturesOutput } from '@/components/app-plan/AppPlanFeaturesOutput';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Wand2, FileText, FlaskConical, Search, BarChart3, MessageSquare, ExternalLink, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { appPlanAgent } from '@/services/appPlanAgent';
import { GeneratedAppPlan } from '@/types/appPlan.types';
import { Progress } from '@/components/ui/progress';
import { getAppPlanByUsername, type SavedAppPlan } from '@/services/appPlanService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Helper functions for enhanced feature display
function getFeatureDescription(featureName: string, companyName: string, priority: string): string {
  const descriptions: Record<string, string> = {
    'User Authentication & Security': `Secure user registration, login, and profile management with multi-factor authentication for ${companyName} users`,
    'Core Dashboard': `Centralized dashboard displaying key metrics, activities, and quick actions tailored for business operations`,
    'Mobile-First Responsive Design': 'Optimized mobile experience with responsive design ensuring seamless usage across all devices',
    'Project Management Suite': 'Comprehensive project tracking with timelines, milestones, resource allocation, and progress monitoring',
    'Equipment & Inventory Management': 'Track equipment usage, maintenance schedules, inventory levels, and supplier management',
    'Menu Management System': 'Digital menu creation, pricing management, availability tracking, and nutritional information',
    'Order Processing & POS': 'Integrated point-of-sale system with order taking, payment processing, and kitchen communication',
    'Product Catalog & Inventory': 'Comprehensive product management with categories, variants, pricing, and real-time inventory tracking',
    'Shopping Cart & Checkout': 'Secure shopping experience with cart management, multiple payment options, and order processing',
    'Push Notifications & Alerts': 'Real-time notifications for important updates, reminders, and system alerts with customizable preferences',
    'Advanced Analytics & Reporting': 'Detailed business insights, performance metrics, trend analysis, and exportable reports',
    'Customer Support Integration': 'Built-in help desk, live chat support, ticketing system, and knowledge base',
    'Third-Party Integrations': 'API connections to popular business tools, payment gateways, and industry-specific software',
    'AI-Powered Insights': 'Machine learning algorithms for predictive analytics, automated suggestions, and intelligent automation',
    'Advanced User Roles & Permissions': 'Granular access control, team management, custom roles, and permission hierarchies'
  };
  
  return descriptions[featureName] || `${priority} priority feature designed to enhance ${companyName}'s business operations and user experience`;
}

function getFeatureCategory(featureName: string): string {
  const categories: Record<string, string> = {
    'User Authentication & Security': 'Security',
    'Core Dashboard': 'Core Functionality',
    'Mobile-First Responsive Design': 'User Experience',
    'Project Management Suite': 'Project Management',
    'Equipment & Inventory Management': 'Resource Management',
    'Menu Management System': 'Core Business',
    'Order Processing & POS': 'Operations',
    'Product Catalog & Inventory': 'E-commerce',
    'Shopping Cart & Checkout': 'E-commerce',
    'Push Notifications & Alerts': 'Communication',
    'Advanced Analytics & Reporting': 'Analytics',
    'Customer Support Integration': 'Support',
    'Third-Party Integrations': 'Integration',
    'AI-Powered Insights': 'AI & Automation',
    'Advanced User Roles & Permissions': 'User Management'
  };
  
  return categories[featureName] || 'Business Logic';
}

export default function AppPlan() {
  const navigate = useNavigate();
  const { username } = useParams();
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

  const [savedPlan, setSavedPlan] = useState<SavedAppPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // If username is provided, this is a saved plan view
  const isViewingSharedPlan = Boolean(username);

  // Load saved plan if username is provided
  useEffect(() => {
    if (username) {
      setLoading(true);
      setError(null);
      
      getAppPlanByUsername(username)
        .then((plan) => {
          if (plan) {
            setSavedPlan(plan);
          } else {
            setError('App plan not found');
            toast({
              title: "Plan Not Found",
              description: "The requested app plan could not be found.",
              variant: "destructive"
            });
          }
        })
        .catch((err) => {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load app plan';
          setError(errorMessage);
          toast({
            title: "Error Loading Plan",
            description: errorMessage,
            variant: "destructive"
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [username, toast]);

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

  // Show loading state for shared plans
  if (isViewingSharedPlan && loading) {
    return (
      <MainLayout>
        <div className="container max-w-5xl py-6 space-y-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-orange-500/50 border-t-orange-500 rounded-full animate-spin mx-auto" />
              <p className="text-white">Loading app plan...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state for shared plans
  if (isViewingSharedPlan && error) {
    return (
      <MainLayout>
        <div className="container max-w-5xl py-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">App Plan</h1>
          </div>
          
          <Card className="bg-red-950/50 border-red-800">
            <CardContent className="p-6 text-center">
              <p className="text-red-200 text-lg mb-4">{error}</p>
              <Button onClick={() => navigate('/onboarding-chat')} className="bg-gradient-to-r from-orange-500 to-red-500">
                Create Your Own App Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Render shared plan view
  if (isViewingSharedPlan && savedPlan) {
    return (
      <MainLayout>
        <div className="container max-w-5xl py-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{savedPlan.app_name}</h1>
              <p className="text-gray-400">{savedPlan.company_name}</p>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
              {savedPlan.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* App Plan Features */}
            <div className="lg:col-span-2">
              <Card className="bg-black/20 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-500" />
                    App Features & Development Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {savedPlan.features && savedPlan.features.length > 0 ? (
                    <div className="space-y-4">
                      {/* Essential Features Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                            Essential Features
                          </Badge>
                          <span className="text-sm text-gray-400">Must-have for core functionality</span>
                        </div>
                        <div className="space-y-3">
                          {savedPlan.features.slice(0, Math.ceil(savedPlan.features.length * 0.6)).map((feature, index) => (
                            <div key={index} className="p-4 bg-gradient-to-r from-red-950/20 to-orange-950/20 rounded-lg border border-red-500/20">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-red-400" />
                                    {feature}
                                  </h4>
                                  <p className="text-sm text-gray-300 mb-2">
                                    {getFeatureDescription(feature, savedPlan.company_name, 'essential')}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <span>High Priority</span>
                                    <span>•</span>
                                    <span>{getFeatureCategory(feature)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Features Section */}
                      {savedPlan.features.length > 3 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              Recommended Features  
                            </Badge>
                            <span className="text-sm text-gray-400">Enhance user experience & functionality</span>
                          </div>
                          <div className="space-y-3">
                            {savedPlan.features.slice(Math.ceil(savedPlan.features.length * 0.6), -2).map((feature, index) => (
                              <div key={index} className="p-4 bg-gradient-to-r from-blue-950/20 to-indigo-950/20 rounded-lg border border-blue-500/20">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-blue-400" />
                                      {feature}
                                    </h4>
                                    <p className="text-sm text-gray-300 mb-2">
                                      {getFeatureDescription(feature, savedPlan.company_name, 'recommended')}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                      <span>Medium Priority</span>
                                      <span>•</span>
                                      <span>{getFeatureCategory(feature)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Features Section */}
                      {savedPlan.features.length > 5 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                              Additional Features
                            </Badge>
                            <span className="text-sm text-gray-400">Future enhancements & advanced capabilities</span>
                          </div>
                          <div className="space-y-3">
                            {savedPlan.features.slice(-2).map((feature, index) => (
                              <div key={index} className="p-4 bg-gradient-to-r from-purple-950/20 to-violet-950/20 rounded-lg border border-purple-500/20">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-purple-400" />
                                      {feature}
                                    </h4>
                                    <p className="text-sm text-gray-300 mb-2">
                                      {getFeatureDescription(feature, savedPlan.company_name, 'additional')}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                      <span>Low Priority</span>
                                      <span>•</span>
                                      <span>{getFeatureCategory(feature)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">No features defined yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Plan Details Sidebar */}
            <div className="space-y-6">
              <Card className="bg-black/20 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Plan Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Estimated Cost</p>
                      <p className="text-white font-semibold">${savedPlan.estimated_cost?.toLocaleString() || 'TBD'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Timeline</p>
                      <p className="text-white font-semibold">{savedPlan.estimated_days || 'TBD'} days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Features</p>
                      <p className="text-white font-semibold">{savedPlan.features?.length || 0} features</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Company Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Company</p>
                    <p className="text-white">{savedPlan.company_name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="text-white text-sm">{savedPlan.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="text-white text-sm">{new Date(savedPlan.created_at).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={() => navigate('/onboarding-chat')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Create Your Own Plan
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

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