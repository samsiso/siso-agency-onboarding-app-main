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
  FileText, 
  MessageSquare, 
  BarChart, 
  Shield, 
  Settings, 
  Target,
  Smartphone,
  Heart,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock
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
  const { username } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  
  const [primaryColor, setPrimaryColor] = useState('#ED8936');
  const [secondaryColor, setSecondaryColor] = useState('#E53E3E');
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>(additionalFeatures);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const [selectedPainPoint, setSelectedPainPoint] = useState<PainPointDetailProps | null>(null);
  const [isPainPointModalOpen, setIsPainPointModalOpen] = useState(false);
  
  const [activeSolution, setActiveSolution] = useState<any>(null);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [currentFlowStep, setCurrentFlowStep] = useState<'welcome' | 'solutions' | 'features' | 'customize' | 'review'>('welcome');
  const solutionsRef = useRef<HTMLDivElement>(null);
  const customizeRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  
  const isDecoraPlan = username === 'decora';
  const [forceRender, setForceRender] = useState(false);
  
  const loadPlan = async () => {
    try {
      console.log(`Loading plan for username: ${username}, path: ${window.location.pathname}`);
      setLoading(true);
      
      if (isDecoraPlan) {
        console.log("Detected decora plan - bypassing loading animation");
        
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .eq('username', username)
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        const safeData: PlanData = {
          id: data?.id || '',
          username: data?.username || '',
          company_name: data?.company_name || null,
          app_name: data?.app_name || null,
          features: data?.features || null,
          branding: {
            logo: data?.branding?.logo || undefined,
            primary_color: typeof data?.branding === 'object' ? data?.branding.primary_color : '#ED8936',
            secondary_color: typeof data?.branding === 'object' ? data?.branding.secondary_color : '#E53E3E'
          },
          estimated_cost: data?.estimated_cost || null,
          estimated_days: data?.estimated_days || null,
          status: data?.status || null,
        };
        
        setPlan(safeData);
        
        if (safeData.branding?.primary_color) {
          setPrimaryColor(safeData.branding.primary_color);
        }
        
        if (safeData.branding?.secondary_color) {
          setSecondaryColor(safeData.branding.secondary_color);
        }
        
        setTotalCost(safeData.estimated_cost || 0);
        
        setLoading(false);
        console.log("Decora plan data loaded and displayed immediately");
        return;
      }
      
      const loadingAnimationSteps = [
        "Analyzing your business needs...",
        "Customizing platform features...",
        "Finalizing your tailored solution...",
        "Almost ready to showcase your plan!"
      ];
      
      let loadingInterval: NodeJS.Timeout;
      
      const runLoadingAnimation = () => {
        let step = 0;
        let progress = 0;
        let complete = false;
        
        loadingInterval = setInterval(() => {
          step = step + 1 < loadingAnimationSteps.length ? step + 1 : step;
          
          progress = Math.floor((step + 1) * 25);
          
          if (step === loadingAnimationSteps.length - 1) {
            complete = true;
          }
          
          setLoadingStep(step);
          setLoadingProgress(progress);
          setLoadingComplete(complete);
          
        }, 1200);
      };
      
      runLoadingAnimation();
      
      if (!username) {
        throw new Error('Username is required');
      }
      
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('username', username)
        .maybeSingle();
        
      if (error) {
        throw error;
      }
      
      const safeData: PlanData = {
        id: data?.id || '',
        username: data?.username || '',
        company_name: data?.company_name || null,
        app_name: data?.app_name || null,
        features: data?.features || null,
        branding: {
          logo: data?.branding?.logo || undefined,
          primary_color: typeof data?.branding === 'object' ? data?.branding.primary_color : '#ED8936',
          secondary_color: typeof data?.branding === 'object' ? data?.branding.secondary_color : '#E53E3E'
        },
        estimated_cost: data?.estimated_cost || null,
        estimated_days: data?.estimated_days || null,
        status: data?.status || null,
      };
      
      setPlan(safeData);
      
      if (safeData.branding?.primary_color) {
        setPrimaryColor(safeData.branding.primary_color);
      }
      
      if (safeData.branding?.secondary_color) {
        setSecondaryColor(safeData.branding.secondary_color);
      }
      
      setTotalCost(safeData.estimated_cost || 0);
      
      setTimeout(() => {
        clearInterval(loadingInterval);
        
        setTimeout(() => {
          console.log("Transitioning to plan view...");
          setLoading(false);
          setForceRender(prev => !prev);
        }, 800);
      }, 2000);
    } catch (error) {
      console.error('Error fetching plan:', error);
      toast({
        title: "Error loading plan",
        description: "We couldn't load the plan details. Please try again later.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("Plan component mounted, username:", username, "at path:", window.location.pathname);
    loadPlan();
    
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.log("Safety timeout triggered - forcing loading state to complete");
        setLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(safetyTimeout);
  }, [username]);
  
  const handleSelectSolution = (solution: any) => {
    setActiveSolution(solution);
    setShowSolutionModal(true);
  };
  
  const navigateToSection = (section: 'welcome' | 'solutions' | 'features' | 'customize' | 'review') => {
    setCurrentFlowStep(section);
    
    setTimeout(() => {
      if (section === 'solutions' && solutionsRef.current) {
        solutionsRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (section === 'features' && featuresRef.current) {
        featuresRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (section === 'customize' && customizeRef.current) {
        customizeRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (section === 'review' && reviewRef.current) {
        reviewRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const scrollToFeatures = () => {
    navigateToSection('features');
  };
  
  const handleSubmitPlan = async () => {
    if (!plan) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('plans')
        .update({ 
          status: 'approved',
          estimated_cost: totalCost,
          branding: {
            ...plan.branding,
            primary_color: primaryColor,
            secondary_color: secondaryColor
          }
        })
        .eq('id', plan.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Plan approved!",
        description: "Your plan has been submitted successfully. Let's get started!",
      });
      
      setTimeout(() => {
        navigate(`/onboarding-chat`);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error submitting plan",
        description: "We couldn't submit your plan. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleViewPlanNowClick = () => {
    console.log("Plan: Handling View Plan Now button click");
    setLoading(false);
    setForceRender(prev => !prev);
  };

  const handleSkipLoading = () => {
    console.log("User manually skipped loading");
    setLoading(false);
  };

  const renderLoadingUI = () => {
    const loadingAnimationSteps = [
      "Analyzing your business needs...",
      "Customizing platform features...",
      "Finalizing your tailored solution...",
      "Almost ready to showcase your plan!"
    ];
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
        <div className="max-w-md w-full bg-black/40 border border-siso-text/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-center mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-12 w-12 text-siso-orange mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-1">
                {username === 'decora' ? 'Welcome, Decora Agency!' : 'Preparing Your Custom Plan'}
              </h2>
              <p className="text-siso-text text-sm">
                {username === 'decora' 
                  ? "We're finalizing your custom OnlyFans Management Suite"
                  : "We're tailoring a solution just for your business needs"}
              </p>
            </motion.div>
          </div>
          
          <div className="flex justify-center mb-6">
            {loadingComplete ? (
              <CheckCircle className="h-12 w-12 text-siso-orange animate-pulse" />
            ) : (
              <div className="w-12 h-12 border-4 border-siso-orange border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-siso-text">Loading your custom plan</span>
              <span className="text-sm text-siso-orange">
                {loadingComplete ? 'Ready!' : `${loadingProgress}%`}
              </span>
            </div>
            <Progress 
              value={loadingProgress} 
              className="h-2 bg-black/30" 
              indicatorClassName="bg-gradient-to-r from-siso-red to-siso-orange" 
            />
          </motion.div>
          
          <div className="space-y-3">
            {loadingAnimationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: loadingStep >= index ? 1 : 0.4,
                  x: 0
                }}
                transition={{ delay: index * 0.2, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  loadingStep >= index ? 'bg-siso-orange/20' : 'bg-siso-text/5'
                }`}>
                  {loadingStep > index ? (
                    <CheckCircle className="h-4 w-4 text-siso-orange" />
                  ) : loadingStep === index ? (
                    <Loader2 className="h-4 w-4 text-siso-orange animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-siso-text/20" />
                  )}
                </div>
                <p className={`text-sm ${
                  loadingStep >= index ? 'text-siso-text' : 'text-siso-text/50'
                }`}>
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
          
          {username === 'decora' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 rounded-lg bg-siso-orange/5 border border-siso-orange/20 p-4 text-sm text-siso-text"
            >
              <p className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-siso-orange shrink-0" />
                <span>Your OnlyFans management platform is almost ready. We've added special features just for agencies like yours!</span>
              </p>
            </motion.div>
          )}
          
          {loadingComplete && (
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleViewPlanNowClick}
                className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
              >
                View Your Plan Now
              </Button>
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleSkipLoading}
              className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
            >
              Skip Loading
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderNoPlanUI = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
        <div className="text-center max-w-md mx-auto">
          <Card className="bg-black/40 backdrop-blur-md border-siso-text/10 shadow-xl">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Plan Not Found</h1>
              <p className="text-siso-text mb-6">
                We couldn't find a plan with this username. Please check the URL and try again.
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
              >
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  if (loading && !isDecoraPlan) {
    return renderLoadingUI();
  }
  
  if (!plan) {
    return renderNoPlanUI();
  }
  
  const isDecoraPlanFromUsername = plan.username === 'decora';
  
  const featureCategories = isDecoraPlanFromUsername ? [
    {
      name: 'Client Management',
      icon: <Users className="h-5 w-5 text-siso-orange" />,
      description: 'Comprehensive suite of tools for managing OnlyFans creator clients effectively',
      features: [
        'Multi-step onboarding forms with document uploads',
        'Client profiles with performance history',
        'Progress tracking with visual timelines',
        'Activity logging and status tags',
        'Client-specific notes and content preferences'
      ]
    },
    {
      name: 'Content Management',
      icon: <FileText className="h-5 w-5 text-siso-orange" />,
      description: 'Advanced content planning, review, and scheduling tools',
      features: [
        'Drag-and-drop content calendar',
        'Media library with tagging and search',
        'Content approval workflow',
        'Direct posting integration with OnlyFans',
        'Content templates for different niches'
      ]
    },
    {
      name: 'Communication Tools',
      icon: <MessageSquare className="h-5 w-5 text-siso-orange" />,
      description: 'Seamless tools for agency-client and fan interactions',
      features: [
        'In-app messaging with file sharing',
        'Fan interaction management with auto-replies',
        'Notification system for all activities',
        'WhatsApp and Telegram integration',
        'Group chats for team collaboration'
      ]
    },
    {
      name: 'Analytics & Financials',
      icon: <BarChart className="h-5 w-5 text-siso-orange" />,
      description: 'Comprehensive performance tracking and financial management',
      features: [
        'Real-time earnings and subscriber tracking',
        'Custom reports with export options',
        'Invoice generation for agency fees',
        'Payout split calculations',
        'Tax reporting and compliance tools'
      ]
    },
    {
      name: 'Security & Compliance',
      icon: <Shield className="h-5 w-5 text-siso-orange" />,
      description: 'Enterprise-grade security and compliance features',
      features: [
        'End-to-end data encryption',
        'Two-factor authentication',
        'Content compliance checking',
        'Role-based access control',
        'Comprehensive audit trails'
      ]
    },
    {
      name: 'Advanced Features',
      icon: <Settings className="h-5 w-5 text-siso-orange" />,
      description: 'Premium capabilities to maximize agency effectiveness',
      features: [
        'AI-powered content optimization',
        'Subscription tier management',
        'Social media cross-posting',
        'Automated task workflows',
        'White-label branding options'
      ]
    }
  ] : [];

  const painPoints = isDecoraPlanFromUsername ? [
    {
      problem: 'Client Retention Issues',
      statistic: "80% of agencies report the average model lifecycle with an agency is 3-6 months",
      solution: "Increase client retention by 40% with transparent reporting",
      detailedSolution: "OnlyFans agencies often struggle with client churn due to lack of transparency and unclear performance metrics. Our platform solves this by providing real-time dashboards showing creator performance, revenue tracking, and activity metrics that agencies can share with clients. This transparency builds trust and demonstrates the agency's value, keeping creators loyal to your services.",
      benefits: [
        "Build trust through transparent performance reporting",
        "Demonstrate your agency's value with clear metrics",
        "Establish longer-term relationships with creators",
        "Reduce churn and stabilize your revenue"
      ],
      metrics: [
        { label: "Average Retention Increase", value: "40%", icon: <TrendingUp className="h-4 w-4 text-siso-orange" /> },
        { label: "Client Satisfaction Score", value: "92%", icon: <Heart className="h-4 w-4 text-siso-orange" /> },
        { label: "Revenue Growth", value: "35%", icon: <DollarSign className="h-4 w-4 text-siso-orange" /> },
        { label: "Client Lifetime Value", value: "2.4x higher", icon: <Users className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/c7ac43fd-bc3e-478d-8b4f-809beafb6838.png", caption: "Client retention dashboard showing performance metrics" },
        { url: "/lovable-uploads/1f9eba1e-c2af-4ed8-84e7-a375872c9182.png", caption: "Transparent reporting shared with creators" }
      ],
      caseStudyLink: "https://notion.so/case-study/client-retention"
    },
    {
      problem: "Inefficient Onboarding",
      statistic: "Agencies spend an average of 10 hours per new client on manual onboarding tasks",
      solution: "Cut onboarding time by 60% with automated flows",
      detailedSolution: "Traditional onboarding processes for new creators are manual, time-consuming, and often inconsistent. Our platform provides customizable onboarding workflows with automated reminders, document collection, and progress tracking. New creators are guided through each step of the process, ensuring all necessary information and assets are collected without overwhelming them with paperwork all at once.",
      benefits: [
        "Streamline client setup with guided multi-step workflows",
        "Collect all necessary documents and information efficiently",
        "Create a professional first impression for new creators",
        "Free up staff time previously spent on manual onboarding"
      ],
      metrics: [
        { label: "Onboarding Time Reduction", value: "60%", icon: <Clock className="h-4 w-4 text-siso-orange" /> },
        { label: "Information Accuracy", value: "95%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Document Completion Rate", value: "100%", icon: <FileText className="h-4 w-4 text-siso-orange" /> },
        { label: "Time to First Content", value: "40% faster", icon: <Calendar className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/66b63935-28a0-4212-8e2a-ab375279b188.png", caption: "Multi-step onboarding workflow" }
      ],
      caseStudyLink: "https://notion.so/case-study/onboarding-optimization"
    },
    {
      problem: "Content Disorganization",
      statistic: "60% of agencies miss at least one content deadline per week due to disorganization",
      solution: "Save 15+ hours weekly with centralized content management",
      detailedSolution: "Managing content for multiple creators across different platforms leads to confusion, missed posts, and inefficient workflows. Our centralized content library and scheduling system allows your team to organize assets by creator, content type, and posting date. The visual calendar interface makes it easy to spot gaps in your content schedule and ensure consistent posting for all your clients.",
      benefits: [
        "Keep all content organized in a central, searchable library",
        "Never miss a posting deadline with visual scheduling tools",
        "Maintain consistency across multiple creator accounts",
        "Reduce time spent locating and organizing content"
      ],
      metrics: [
        { label: "Time Saved Weekly", value: "15+ hours", icon: <Clock className="h-4 w-4 text-siso-orange" /> },
        { label: "Posting Consistency", value: "98%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Content Organization", value: "100%", icon: <Calendar className="h-4 w-4 text-siso-orange" /> },
        { label: "Team Productivity", value: "62% increase", icon: <Users className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/19ca8c73-3736-4506-bfb2-de867b272e12.png", caption: "Content calendar with drag-and-drop functionality" }
      ],
      caseStudyLink: "https://notion.so/case-study/content-management"
    },
    {
      problem: "Communication Breakdowns",
      statistic: "75% of agencies experience miscommunication that leads to client dissatisfaction monthly",
      solution: "Never miss important messages with unified inbox",
      detailedSolution: "Communication scattered across emails, texts, and DMs leads to missed messages and delayed responses. Our unified inbox consolidates all communications in one place, with thread organization by creator and topic. Automated prioritization ensures urgent messages get immediate attention, while notification systems alert team members to new messages in their assigned areas.",
      benefits: [
        "Track all client conversations in one centralized system",
        "Respond faster with prioritized messages and notifications",
        "Maintain clear communication records for accountability",
        "Eliminate crossed wires between team members and clients"
      ],
      metrics: [
        { label: "Response Time", value: "75% faster", icon: <MessageSquare className="h-4 w-4 text-siso-orange" /> },
        { label: "Message Organization", value: "100%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Client Satisfaction", value: "88%", icon: <Heart className="h-4 w-4 text-siso-orange" /> },
        { label: "Missed Messages", value: "0%", icon: <Users className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png", caption: "Unified messaging interface with priority sorting" }
      ],
      caseStudyLink: "https://notion.so/case-study/communication"
    },
    {
      problem: "Fan Engagement Challenges",
      statistic: "Agencies see a 20% drop in subscriber retention without consistent engagement strategies",
      solution: "Boost subscriber satisfaction and retention by 25%",
      detailedSolution: "Keeping fans engaged and reducing subscription cancellations is a constant challenge for creators. Our platform includes fan interaction tools that help prioritize high-value subscribers, manage message volume with smart auto-replies, and analyze engagement patterns to identify at-risk subscribers before they cancel. This proactive approach maintains satisfaction and reduces subscription churn.",
      benefits: [
        "Identify and prioritize high-value subscribers",
        "Maintain engagement with automated response systems",
        "Reduce subscription cancellations with proactive retention",
        "Optimize fan interactions for maximum satisfaction"
      ],
      metrics: [
        { label: "Fan Retention Rate", value: "58%", icon: <Heart className="h-4 w-4 text-siso-orange" /> },
        { label: "Message Response Rate", value: "100%", icon: <MessageSquare className="h-4 w-4 text-siso-orange" /> },
        { label: "Fan Satisfaction Score", value: "94%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Resubscription Rate", value: "72% increase", icon: <TrendingUp className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/c7ac43fd-bc3e-478d-8b4f-809beafb6838.png", caption: "Fan engagement dashboard with priority sorting" }
      ],
      caseStudyLink: "https://notion.so/case-study/fan-engagement"
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black">
      <>
        <PainPointsModal 
          open={isPainPointModalOpen} 
          onOpenChange={setIsPainPointModalOpen}
          painPoint={selectedPainPoint}
        />
        
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col space-y-8">
            <div className="bg-black/30 rounded-lg p-4 mb-6 border border-siso-text/10">
              <div className="flex flex-nowrap overflow-x-auto gap-2">
                {[
                  { key: 'welcome', label: 'Welcome' },
                  { key: 'solutions', label: 'Solutions' },
                  { key: 'features', label: 'Features' },
                  { key: 'customize', label: 'Customize' },
                  { key: 'review', label: 'Review' }
                ].map((step, index) => (
                  <div 
                    key={step.key} 
                    className={`flex items-center ${index !== 0 ? 'ml-1' : ''}`}
                  >
                    {index !== 0 && (
                      <div className="h-0.5 w-4 bg-siso-text/20 mx-1" />
                    )}
                    <Button
                      variant={currentFlowStep === step.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => navigateToSection(step.key as any)}
                      className={`
                        whitespace-nowrap
                        ${currentFlowStep === step.key ? 
                          'bg-gradient-to-r from-siso-red to-siso-orange border-none' : 
                          'border-siso-text/20 text-siso-text hover:text-white'
                        }
                      `}
                    >
                      {step.label}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GradientHeading className="text-4xl md:text-5xl lg:text-6xl mb-4">
                    {isDecoraPlanFromUsername ? 'Your OnlyFans Management Suite' : 'Your Custom Plan'}
                  </GradientHeading>
                  
                  <p className="text-siso-text text-lg mb-6">
                    {isDecoraPlanFromUsername
                      ? "Elevate your OnlyFans management agency with our comprehensive solution tailored for agencies like yours."
                      : "We've crafted a custom solution to address your specific business needs."}
                  </p>
                </motion.div>
                
                <WelcomeMessage 
                  agencyName="Decora" 
                  industryType="OnlyFans" 
                  scrollToFeatures={() => navigateToSection('solutions')} 
                />
              </div>
              
              <div className="lg:w-2/5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-siso-text/10"
                >
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-siso-orange" />
                    Plan Investment
                  </h2>
                  
                  <div className="mb-6">
                    <motion.div 
                      className="text-4xl font-bold text-siso-orange mb-1"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      £{totalCost || plan.estimated_cost || 0}
                    </motion.div>
                    <p className="text-siso-text text-sm">Estimated total for development and setup</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-siso-text">Development Time:</span>
                      <span className="text-sm font-medium text-white">{plan.estimated_days || 30} days</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-siso-text">Includes:</span>
                      <span className="text-sm font-medium text-white">Custom Development</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-siso-text">App Type:</span>
                      <span className="text-sm font-medium text-white">{plan.app_name || "Web Application"}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={() => navigateToSection('solutions')}
                      className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                    >
                      Explore Solutions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div ref={solutionsRef} className="pt-12 mt-8 border-t border-siso-text/10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <GradientHeading className="text-3xl mb-6">
                  Solutions for Your Agency
                </GradientHeading>
                
                <SolutionsShowcase onSelectSolution={handleSelectSolution} />
                
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={() => navigateToSection('features')}
                    className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                  >
                    See All Features
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
            
            <div 
              ref={featuresRef}
              className="pt-12 mt-8 border-t border-siso-text/10"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <GradientHeading className="text-3xl mb-6">
                  Key Features
                </GradientHeading>
                
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="bg-black/30 border border-siso-text/10">
                    <TabsTrigger value="features" onClick={() => setActiveTab('features')}>Feature Categories</TabsTrigger>
                    <TabsTrigger value="pain-points" onClick={() => setActiveTab('pain-points')}>Solutions</TabsTrigger>
                    <TabsTrigger value="customize" onClick={() => setActiveTab('customize')}>Customize</TabsTrigger>
                    <TabsTrigger value="case-studies" onClick={() => setActiveTab('case-studies')}>Case Studies</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="features" className="border-0 p-0 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {featureCategories.map((category, index) => (
                        <motion.div
                          key={category.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                          <Card className="h-full bg-black/20 border-siso-text/10 hover:border-siso-orange/30 transition-all">
                            <CardContent className="p-5">
                              <div className="flex items-center mb-3">
                                <div className="p-2 rounded-full bg-siso-orange/10 mr-3">
                                  {category.icon}
                                </div>
                                <h3 className="font-semibold text-white">{category.name}</h3>
                              </div>
                              <p className="text-sm text-siso-text mb-4">{category.description}</p>
                              <div className="space-y-2">
                                {category.features.map((feature, i) => (
                                  <div key={i} className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-siso-orange shrink-0 mt-0.5 mr-2" />
                                    <span className="text-sm text-siso-text">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pain-points" className="border-0 p-0 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {painPoints.map((painPoint, index) => (
                        <motion.div
                          key={painPoint.problem}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                          <Card 
                            className="h-full bg-black/20 border-siso-text/10 hover:border-siso-orange/30 transition-all cursor-pointer"
                            onClick={() => {
                              setSelectedPainPoint({
                                problem: painPoint.problem,
                                statistic: painPoint.statistic,
                                solution: painPoint.solution,
                                detailedSolution: painPoint.detailedSolution,
                                benefits: painPoint.benefits,
                                metrics: painPoint.metrics,
                                images: painPoint.images,
                                caseStudyLink: painPoint.caseStudyLink
                              });
                              setIsPainPointModalOpen(true);
                            }}
                          >
                            <CardContent className="p-5">
                              <div className="bg-siso-orange/10 text-siso-orange text-xs font-medium px-2.5 py-0.5 rounded mb-3 inline-block">
                                {painPoint.statistic}
                              </div>
                              <h3 className="font-semibold text-white mb-2">{painPoint.problem}</h3>
                              <p className="text-sm text-siso-text mb-4">{painPoint.solution}</p>
                              
                              <div className="flex justify-between items-center mt-auto">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-siso-orange/30 bg-black/50 text-siso-orange transition-all hover:bg-siso-orange/10"
                                >
                                  Learn More
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="customize" className="border-0 p-0 mt-6">
                    <FeatureSelection 
                      features={selectedFeatures} 
                      onChange={setSelectedFeatures}
                      showPricing={true}
                    />
                  </TabsContent>
                  
                  <TabsContent value="case-studies" className="border-0 p-0 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {caseStudies.map((caseStudy, index) => (
                        <CaseStudy 
                          key={index} 
                          title={caseStudy.title} 
                          description={caseStudy.description} 
                          imageUrl={caseStudy.imageUrl} 
                          notionUrl={caseStudy.notionUrl} 
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={() => navigateToSection('customize')}
                    className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                  >
                    Customize Your Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
            
            <div 
              ref={customizeRef}
              className="pt-12 mt-8 border-t border-siso-text/10"
            >
              <GradientHeading className="text-3xl mb-6">
                Customize Your Plan
              </GradientHeading>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/20 border-siso-text/10">
                  <CardContent className="p-4">
                    <ColorPicker
                      title="Primary Brand Color"
                      colors={brandColorOptions}
                      selectedColor={primaryColor}
                      onChange={setPrimaryColor}
                    />
                  </CardContent>
                </Card>
                
                <Card className="bg-black/20 border-siso-text/10">
                  <CardContent className="p-4">
                    <ColorPicker
                      title="Secondary Brand Color"
                      colors={brandColorOptions}
                      selectedColor={secondaryColor}
                      onChange={setSecondaryColor}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <FeatureSelection 
                  features={selectedFeatures} 
                  onChange={setSelectedFeatures}
                  showPricing={true}
                />
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => navigateToSection('review')}
                  className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                >
                  Review Your Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div 
              ref={reviewRef}
              className="pt-12 mt-8 border-t border-siso-text/10"
            >
              <GradientHeading className="text-3xl mb-6">
                Review & Approve Your Plan
              </GradientHeading>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Your Custom Solution</h3>
                  <p className="text-siso-text mb-6">
                    We've created a comprehensive plan tailored specifically for your OnlyFans management agency. 
                    Review the details below and approve your plan to begin the development process.
                  </p>
                  
                  <div className="bg-black/30 p-4 rounded-lg border border-siso-text/10 mb-6">
                    <h4 className="text-white font-medium mb-2">Need Assistance?</h4>
                    <p className="text-sm text-siso-text mb-3">
                      Have questions before approving? Our team is ready to help.
                    </p>
                    <Button 
                      variant="outline"
                      className="w-full border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
                      onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                    >
                      Contact Us on WhatsApp
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">After Approval</h4>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="bg-siso-orange/10 text-siso-orange rounded-full h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">1</div>
                        <div>
                          <p className="text-siso-text">You'll be connected with your dedicated project manager</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-siso-orange/10 text-siso-orange rounded-full h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">2</div>
                        <div>
                          <p className="text-siso-text">We'll schedule a kickoff meeting within 48 hours</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-siso-orange/10 text-siso-orange rounded-full h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">3</div>
                        <div>
                          <p className="text-siso-text">Development begins with weekly progress updates</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
                
                <PlanReviewSummary
                  selectedFeatures={['Client Management', 'Content Management', 'Communication Tools', 'Analytics & Financials']}
                  timeline={plan.estimated_days || 30}
                  totalCost={totalCost || plan.estimated_cost || 0}
                  onApprove={handleSubmitPlan}
                  isSubmitting={submitting}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Plan;
