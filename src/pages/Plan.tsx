import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { 
  CheckCircle, 
  Loader2, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Users, 
  MessageSquare, 
  FileText, 
  BarChart, 
  Shield, 
  Settings, 
  Target,
  Smartphone,
  Heart,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { MessageLoading } from '@/components/ui/message-loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColorPicker } from '@/components/plan/ColorPicker';
import { FeatureSelection, Feature } from '@/components/plan/FeatureSelection';
import { CaseStudy } from '@/components/plan/CaseStudy';
import { WelcomeMessage } from '@/components/plan/WelcomeMessage';
import { Skeleton } from '@/components/ui/skeleton';
import { InteractiveCallout } from '@/components/plan/InteractiveCallout';
import { PainPointsModal, PainPointDetailProps } from '@/components/plan/PainPointsModal';
import { Progress } from '@/components/ui/progress';
import { SolutionsShowcase } from '@/components/plan/SolutionsShowcase';
import { PlanReviewSummary } from '@/components/plan/PlanReviewSummary';
import { AgencyPainPoints } from '@/components/plan/AgencyPainPoints';
import { TierFeatureSelection, FeatureItem } from '@/components/plan/TierFeatureSelection';
import { ROICalculator } from '@/components/plan/ROICalculator';

interface PlanData {
  id: string;
  username: string;
  company_name: string | null;
  app_name: string | null;
  features: string[] | null;
  branding: {
    logo?: string;
    primary_color?: string;
    secondary_color?: string;
  } | null;
  estimated_cost: number | null;
  estimated_days: number | null;
  status: string | null;
}

interface FeatureCategory {
  name: string;
  icon: JSX.Element;
  description: string;
  features: string[];
}

interface PainPoint {
  problem: string;
  statistic: string;
  solution: string;
  detailedSolution: string;
  benefits: string[];
  metrics: { label: string; value: string; icon: JSX.Element }[];
  images: { url: string; caption: string }[];
  caseStudyLink: string;
  videoUrl?: string;
  researchSources?: { title: string; url: string; description: string }[];
}

interface Testimonial {
  content: string;
  author: string;
  position: string;
  instagram?: string;
  appLink?: string;
}

const brandColorOptions = [
  { name: 'Classic Red', value: '#E53E3E' },
  { name: 'Vibrant Orange', value: '#ED8936' },
  { name: 'Royal Purple', value: '#805AD5' },
  { name: 'Ocean Blue', value: '#3182CE' },
  { name: 'Emerald Green', value: '#38A169' },
  { name: 'Hot Pink', value: '#D53F8C' },
  { name: 'Slate Gray', value: '#4A5568' },
  { name: 'Midnight Black', value: '#1A202C' },
  { name: 'Modern Teal', value: '#319795' }
];

const caseStudies = [
  {
    title: 'OnlyFans Management Platform for Agency X',
    description: 'How we helped Agency X increase their client retention by 40% and double their revenue with our custom platform.',
    imageUrl: '/lovable-uploads/c7ac43fd-bc3e-478d-8b4f-809beafb6838.png',
    notionUrl: 'https://www.notion.so/Case-Study-OnlyFans-Management-Platform-123456'
  },
  {
    title: 'Creator Content Management System',
    description: 'A dedicated content scheduling and management system that improved workflow efficiency by 60%.',
    imageUrl: '/lovable-uploads/1f9eba1e-c2af-4ed8-84e7-a375872c9182.png',
    notionUrl: 'https://www.notion.so/Case-Study-Content-Management-System-789012'
  },
  {
    title: 'Fan Engagement & Analytics Dashboard',
    description: 'How our analytics tools helped boost fan engagement and increase subscription renewal rates.',
    imageUrl: '/lovable-uploads/19ca8c73-3736-4506-bfb2-de867b272e12.png',
    notionUrl: 'https://www.notion.so/Case-Study-Fan-Engagement-Analytics-345678'
  }
];

const additionalFeatures: Feature[] = [
  {
    id: 'white-label',
    name: 'White Label Branding',
    description: 'Remove all Siso branding and use your own logo and colors throughout the platform.',
    price: 1200,
    included: false
  },
  {
    id: 'mobile-apps',
    name: 'Native Mobile Apps',
    description: 'iOS and Android mobile apps for your team and clients to access the platform on the go.',
    price: 2500,
    included: false
  },
  {
    id: 'api-integration',
    name: 'Custom API Integrations',
    description: 'Connect with additional platforms and services beyond our standard integrations.',
    price: 1800,
    included: false
  },
  {
    id: 'ai-insights',
    name: 'AI Content Insights',
    description: 'Advanced AI tools to analyze content performance and suggest improvements.',
    price: 1500,
    included: false
  },
  {
    id: 'premium-support',
    name: 'Premium Support Package',
    description: '24/7 dedicated support team with 1-hour response time and monthly strategy calls.',
    price: 950,
    included: false
  }
];

const Plan = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3182CE');
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showPainPointModal, setShowPainPointModal] = useState(false);
  const [selectedPainPoint, setSelectedPainPoint] = useState<PainPointDetailProps | null>(null);
  const [showSolutionsSection, setShowSolutionsSection] = useState(false);
  const [showFeatureSelection, setShowFeatureSelection] = useState(false);
  
  const [selectedTierFeatures, setSelectedTierFeatures] = useState<FeatureItem[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('mvp');
  const [totalTime, setTotalTime] = useState<number>(14);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        if (!username) return;
        
        setLoading(true);
        
        // Simulated data fetch - in a real app, this would come from Supabase
        setTimeout(() => {
          const mockData: PlanData = {
            id: '123',
            username: username,
            company_name: username === 'decora' ? 'Decora Agency' : 'Siso Agency',
            app_name: 'OnlyFans Management Suite',
            features: ['Content Management', 'Analytics Dashboard', 'Client Portal', 'Messaging System'],
            branding: {
              primary_color: '#3182CE',
              secondary_color: '#805AD5'
            },
            estimated_cost: 4997,
            estimated_days: 14,
            status: 'draft'
          };
          
          setPlanData(mockData);
          setSelectedColor(mockData.branding?.primary_color || '#3182CE');
          setLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error('Error fetching plan data:', error);
        toast({
          title: "Error loading plan",
          description: "Could not load the plan data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchPlanData();
  }, [username, toast]);
  
  const handlePainPointClick = (painPoint: PainPointDetailProps) => {
    setSelectedPainPoint(painPoint);
    setShowPainPointModal(true);
  };
  
  const handleShowSolutions = () => {
    setShowSolutionsSection(true);
    
    // Scroll to the solutions section
    setTimeout(() => {
      if (mainContentRef.current) {
        const solutionsSection = mainContentRef.current.querySelector('#solutions-section');
        if (solutionsSection) {
          solutionsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };
  
  const handleFeatureSelection = (features: FeatureItem[], tier: string, time: number, price: number) => {
    setSelectedTierFeatures(features);
    setSelectedTier(tier);
    setTotalTime(time);
    setTotalPrice(price);
    
    // Extract feature names for the review summary
    const featureNames = features.map(f => f.name);
    setSelectedFeatures(featureNames);
    
    // Scroll to the review section
    setTimeout(() => {
      const reviewSection = document.getElementById('review-section');
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };
  
  const handleApprovePlan = () => {
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Plan Approved!",
        description: "Your selections have been saved. We'll contact you shortly to begin implementation.",
      });
      setIsSubmitting(false);
      
      // Navigate to thank you or dashboard
      // navigate('/dashboard');
    }, 2000);
  };
  
  const handleShowFeatures = () => {
    setShowFeatureSelection(true);
    
    // Scroll to the features section
    setTimeout(() => {
      if (mainContentRef.current) {
        const featuresSection = mainContentRef.current.querySelector('#features-section');
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4 md:p-8">
        <div className="text-center space-y-4">
          <MessageLoading className="justify-center mb-4" />
          <h2 className="text-xl font-semibold text-white">Loading your personalized plan...</h2>
          <p className="text-siso-text">We're preparing everything just for you</p>
        </div>
      </div>
    );
  }
  
  if (!planData) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4 md:p-8">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">Plan Not Found</h2>
          <p className="mb-6 text-siso-text">We couldn't find a plan for this username.</p>
          <Button onClick={() => navigate('/')} variant="default">
            Go Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-siso-bg to-black p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div ref={mainContentRef} className="space-y-8">
          <WelcomeMessage 
            agencyName={planData.company_name || 'Your Company'} 
            industryType="OnlyFans"
            scrollToFeatures={handleShowFeatures}
          />
          
          <section className="space-y-4">
            <GradientHeading 
              className="text-2xl font-bold" 
              variant="primary"
            >
              Understanding Your Agency's Challenges
            </GradientHeading>
            
            <p className="text-siso-text">
              Before we dive into the solution, it's important to understand the challenges 
              that agencies like yours face when scaling beyond $100k/month. Based on our 
              extensive research and surveys, we've identified these key pain points:
            </p>
            
            <AgencyPainPoints onSolutionRequest={handleShowFeatures} />
          </section>
          
          {showSolutionsSection && (
            <section id="solutions-section" className="space-y-4 pt-6">
              <GradientHeading 
                className="text-2xl font-bold" 
                variant="primary"
              >
                Our Complete Solution
              </GradientHeading>
              
              <div className="rounded-lg bg-black/20 backdrop-blur-sm border border-siso-text/10 p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-full bg-siso-orange/10 p-3">
                    <Sparkles className="h-6 w-6 text-siso-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {planData.app_name || 'OnlyFans Management Suite'}
                    </h3>
                    <p className="text-siso-text">
                      A comprehensive platform designed specifically for OnlyFans agencies
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <InteractiveCallout 
                    title="Industry Focus"
                    value="OnlyFans Agency Management"
                    type="niche"
                    description="Our platform is specifically designed for the unique challenges of managing OnlyFans creator accounts as an agency."
                  />
                  
                  <InteractiveCallout 
                    title="Your Company"
                    value={planData.company_name || 'Your Agency'}
                    type="company"
                    description="Customized to match your agency's workflow and branding, ensuring a perfect fit for your team."
                  />
                  
                  <InteractiveCallout 
                    title="Product"
                    value="All-in-One Management Platform"
                    type="product"
                    description="Combining content management, analytics, client communication, and business operations in one seamless platform."
                  />
                  
                  <InteractiveCallout 
                    title="Release Timeline"
                    value={`${planData.estimated_days} Days to Launch`}
                    type="niche"
                    description={`Your custom platform can be ready for your team in just ${planData.estimated_days} days with our expedited implementation process.`}
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-siso-orange" />
                      Core Features
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {planData.features?.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 bg-black/30 rounded-lg p-3 border border-siso-text/10">
                          <CheckCircle className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
                          <span className="text-siso-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-siso-orange" />
                      Business Impact
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-black/30 rounded-lg p-3 border border-siso-text/10">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-siso-orange" />
                          <h4 className="text-white font-medium">Revenue Growth</h4>
                        </div>
                        <p className="text-2xl font-bold text-siso-orange mb-1">+35%</p>
                        <p className="text-xs text-siso-text">Average increase in monthly agency revenue</p>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-3 border border-siso-text/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-siso-orange" />
                          <h4 className="text-white font-medium">Client Retention</h4>
                        </div>
                        <p className="text-2xl font-bold text-siso-orange mb-1">+60%</p>
                        <p className="text-xs text-siso-text">Improvement in creator retention rate</p>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-3 border border-siso-text/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-siso-orange" />
                          <h4 className="text-white font-medium">Time Saved</h4>
                        </div>
                        <p className="text-2xl font-bold text-siso-orange mb-1">15+ hrs</p>
                        <p className="text-xs text-siso-text">Weekly time saved on administrative tasks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {showFeatureSelection && (
            <section id="features-section" className="space-y-4 pt-6">
              <TierFeatureSelection onFeaturesSelected={handleFeatureSelection} />
            </section>
          )}
          
          {selectedTierFeatures.length > 0 && (
            <section id="review-section" className="space-y-4 pt-6">
              <GradientHeading 
                className="text-2xl font-bold" 
                variant="primary"
              >
                Review Your Plan
              </GradientHeading>
              
              <PlanReviewSummary
                selectedFeatures={selectedFeatures}
                timeline={totalTime}
                totalCost={totalPrice}
                onApprove={handleApprovePlan}
                isSubmitting={isSubmitting}
              />
            </section>
          )}
          
          <section className="space-y-4">
            <GradientHeading 
              className="text-2xl font-bold" 
              variant="primary"
            >
              Proven Success Stories
            </GradientHeading>
            
            <p className="text-siso-text mb-4">
              See how other OnlyFans agencies have transformed their businesses with our platform:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {caseStudies.map((study, index) => (
                <CaseStudy 
                  key={index}
                  title={study.title}
                  description={study.description}
                  imageUrl={study.imageUrl}
                  notionUrl={study.notionUrl}
                />
              ))}
            </div>
          </section>
          
          {!selectedTierFeatures.length && (
            <section className="space-y-4">
              <GradientHeading 
                className="text-2xl font-bold" 
                variant="primary"
              >
                Your Implementation Plan
              </GradientHeading>
              
              <div className="rounded-lg bg-black/20 backdrop-blur-sm border border-siso-text/10 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-siso-orange" />
                      Timeline
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="relative pb-8 pl-6 border-l border-siso-text/20 last:border-0">
                        <div className="absolute top-0 left-0 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-siso-orange bg-black"></div>
                        <div>
                          <h4 className="text-white font-medium">Days 1-3: Discovery & Setup</h4>
                          <p className="text-sm text-siso-text">Requirements gathering, account setup, and initial configuration</p>
                        </div>
                      </div>
                      
                      <div className="relative pb-8 pl-6 border-l border-siso-text/20 last:border-0">
                        <div className="absolute top-0 left-0 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-siso-orange bg-black"></div>
                        <div>
                          <h4 className="text-white font-medium">Days 4-7: Core Implementation</h4>
                          <p className="text-sm text-siso-text">Platform customization, branding setup, and feature implementation</p>
                        </div>
                      </div>
                      
                      <div className="relative pb-8 pl-6 border-l border-siso-text/20 last:border-0">
                        <div className="absolute top-0 left-0 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-siso-orange bg-black"></div>
                        <div>
                          <h4 className="text-white font-medium">Days 8-12: Data Migration & Training</h4>
                          <p className="text-sm text-siso-text">Transferring existing data, team onboarding, and hands-on training</p>
                        </div>
                      </div>
                      
                      <div className="relative pb-0 pl-6">
                        <div className="absolute top-0 left-0 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-siso-orange bg-black"></div>
                        <div>
                          <h4 className="text-white font-medium">Days 13-14: Final Review & Launch</h4>
                          <p className="text-sm text-siso-text">Quality assurance, final adjustments, and platform launch</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-siso-orange" />
                      Investment
                    </h3>
                    
                    <div className="bg-black/30 rounded-lg border border-siso-text/10 overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-medium">Platform Implementation</h4>
                          <span className="text-siso-orange font-semibold">£{planData.estimated_cost}</span>
                        </div>
                        <p className="text-sm text-siso-text mb-4">
                          One-time setup fee including customization, training, and data migration
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-siso-text">Base Platform</span>
                            <span className="text-siso-text">£3,997</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-siso-text">Customization & Branding</span>
                            <span className="text-siso-text">£500</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-siso-text">Training & Onboarding</span>
                            <span className="text-siso-text">£500</span>
                          </div>
                        </div>
                        
                        <div className="border-t border-siso-text/10 pt-4 flex justify-between items-center">
                          <span className="text-white font-medium">Monthly Subscription</span>
                          <span className="text-siso-orange font-semibold">£997/month</span>
                        </div>
                        <p className="text-sm text-siso-text">
                          Includes hosting, maintenance, updates, and standard support
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          <section className="space-y-4">
            <GradientHeading 
              className="text-2xl font-bold" 
              variant="primary"
            >
              Next Steps
            </GradientHeading>
            
            <div className="bg-gradient-to-r from-siso-red/20 to-siso-orange/20 rounded-lg p-6 border border-siso-orange/20">
              <h3 className="text-xl font-semibold text-white mb-4">
                Ready to transform your OnlyFans agency?
              </h3>
              
              <p className="text-siso-text mb-6">
                {!showFeatureSelection ? 
                  "Select your features to create a customized plan for your agency's needs." :
                  "Book a call with our implementation team to discuss your specific needs and get started with your custom platform."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {!showFeatureSelection ? (
                  <Button 
                    className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white" 
                    size="lg"
                    onClick={handleShowFeatures}
                  >
                    Customize Your Features
                    <Settings className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white" 
                    size="lg"
                    onClick={() => window.open('https://calendly.com/siso-team/onlyfans-platform', '_blank')}
                  >
                    Schedule Your Free Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  className="border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
                  size="lg"
                  onClick={() => window.open('https://calendly.com/siso-team/demo', '_blank')}
                >
                  Request Live Demo
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <PainPointsModal 
        open={showPainPointModal}
        onOpenChange={setShowPainPointModal}
        painPoint={selectedPainPoint}
      />
    </div>
  );
};

export default Plan;
