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
  AlertTriangle,
  Search,
  ChevronDown,
  Zap
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const featureCategories = [
  {
    id: 'client',
    name: 'Client Management',
    icon: <Users className="h-5 w-5" />,
    features: [
      { id: 'client-profiles', name: 'Client Profiles', description: 'Detailed profiles for each creator with basic information.', timeEstimate: 0.5 },
      { id: 'performance-dashboard', name: 'Basic Performance Dashboard', description: 'View key metrics like earnings and subscriber count.', timeEstimate: 1 },
      { id: 'earnings-tracking', name: 'Earnings Tracking', description: 'Monitor creator revenue over time with basic charts.', timeEstimate: 1.5 },
      { id: 'subscriber-tracking', name: 'Subscriber Count Tracking', description: 'Track subscriber growth or decline over time.', timeEstimate: 1 },
      { id: 'advanced-analytics', name: 'Advanced Creator Analytics', description: 'In-depth performance insights with predictive trends.', timeEstimate: 3 },
    ]
  },
  {
    id: 'content',
    name: 'Content Management',
    icon: <FileText className="h-5 w-5" />,
    features: [
      { id: 'content-calendar', name: 'Simple Content Calendar', description: 'Plan posts with a basic scheduling tool.', timeEstimate: 1.5 },
      { id: 'media-library', name: 'Media Library with Basic Tagging', description: 'Store and categorize assets with simple tags.', timeEstimate: 2 },
      { id: 'content-approval', name: 'Content Approval Workflow', description: 'Approve or reject creator content before posting.', timeEstimate: 1.5 },
      { id: 'ai-content-optimization', name: 'AI Content Optimization', description: 'Get suggestions to improve content based on trending topics.', timeEstimate: 4 },
    ]
  },
  {
    id: 'communication',
    name: 'Communication Tools',
    icon: <MessageSquare className="h-5 w-5" />,
    features: [
      { id: 'in-app-messaging', name: 'In-App Messaging', description: 'Direct messaging between agency and creators.', timeEstimate: 3 },
      { id: 'notification-system', name: 'Notification System', description: 'Alerts for deadlines, updates, and important events.', timeEstimate: 2 },
      { id: 'fan-interaction', name: 'Fan Interaction Tools', description: 'Manage fan messages and interactions efficiently.', timeEstimate: 4 },
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: <BarChart className="h-5 w-5" />,
    features: [
      { id: 'basic-earnings', name: 'Basic Earnings Report', description: 'Simple revenue overview with basic filtering.', timeEstimate: 1 },
      { id: 'subscriber-growth', name: 'Subscriber Growth Chart', description: 'Visualize subscriber trends over time.', timeEstimate: 1 },
      { id: 'content-performance', name: 'Content Performance Metrics', description: 'Track likes, views, and engagement for each post.', timeEstimate: 2 },
    ]
  },
  {
    id: 'security',
    name: 'Security',
    icon: <Shield className="h-5 w-5" />,
    features: [
      { id: 'user-authentication', name: 'User Authentication', description: 'Secure login for agency staff and creators.', timeEstimate: 1 },
      { id: 'role-based-access', name: 'Role-Based Access Control', description: 'Limit access based on user roles within the agency.', timeEstimate: 2 },
      { id: 'two-factor', name: 'Two-Factor Authentication', description: 'Extra layer of security for account access.', timeEstimate: 1.5 },
    ]
  },
  {
    id: 'automation',
    name: 'Automation',
    icon: <Settings className="h-5 w-5" />,
    features: [
      { id: 'automated-reminders', name: 'Automated Reminders', description: 'Notify creators of upcoming deadlines automatically.', timeEstimate: 1 },
      { id: 'workflow-automation', name: 'Basic Workflow Automation', description: 'Automate repetitive steps like content approvals.', timeEstimate: 2.5 },
      { id: 'fan-engagement', name: 'Automated Fan Engagement', description: 'Schedule and automate fan outreach campaigns.', timeEstimate: 4 },
    ]
  }
];

const tierComparison = [
  { name: 'Max Features', mvp: '10', advanced: 'Unlimited', premium: 'All Features' },
  { name: 'Base Timeline', mvp: '90 days', advanced: '60 days', premium: '21 days' },
  { name: 'Support Level', mvp: 'Standard', advanced: 'Standard', premium: 'Priority' },
  { name: 'Price', mvp: 'Free', advanced: '£249', premium: '£499' }
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
  const [showFeatureSelection, setShowFeatureSelection] = useState(true);
  
  const [selectedTierFeatures, setSelectedTierFeatures] = useState<FeatureItem[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('mvp');
  const [totalTime, setTotalTime] = useState<number>(14);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [currentTier, setCurrentTier] = useState('mvp');
  
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        if (!username) return;
        
        setLoading(true);
        
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
    
    const featureNames = features.map(f => f.name);
    setSelectedFeatures(featureNames);
    
    setTimeout(() => {
      const reviewSection = document.getElementById('review-section');
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };
  
  const handleFeatureToggle = (featureId: string) => {
    const newSelectedFeatures = [...selectedFeatureIds];
    const featureIndex = newSelectedFeatures.indexOf(featureId);
    
    if (featureIndex === -1) {
      if (currentTier === 'mvp' && newSelectedFeatures.length >= 10) {
        setShowUpgradePrompt(true);
        return;
      }
      
      newSelectedFeatures.push(featureId);
    } else {
      newSelectedFeatures.splice(featureIndex, 1);
    }
    
    setSelectedFeatureIds(newSelectedFeatures);
  };
  
  const calculateTotalTime = () => {
    let baseDays = 90;
    
    if (currentTier === 'advanced') baseDays = 60;
    if (currentTier === 'premium') baseDays = 21;
    
    let additionalTime = 0;
    selectedFeatureIds.forEach(featureId => {
      for (const category of featureCategories) {
        const feature = category.features.find(f => f.id === featureId);
        if (feature) {
          additionalTime += feature.timeEstimate;
          break;
        }
      }
    });
    
    return { baseDays, additionalTime };
  };
  
  const { baseDays, additionalTime } = calculateTotalTime();
  const totalDays = baseDays + Math.floor(additionalTime);
  const additionalHours = (additionalTime % 1) * 24;
  
  const handleTierChange = (tier: string) => {
    setCurrentTier(tier);
    setShowUpgradePrompt(false);
  };
  
  const getFilteredFeatures = (category: any) => {
    return category.features.filter((feature: any) => 
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const handleApprovePlan = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Plan Approved!",
        description: "Your selections have been saved. We'll contact you shortly to begin implementation.",
      });
      setIsSubmitting(false);
      
      navigate('/dashboard');
    }, 2000);
  };
  
  const handleShowFeatures = () => {
    setShowFeatureSelection(true);
    
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
              <GradientHeading 
                className="text-2xl font-bold" 
                variant="primary"
              >
                Customize Your Features
              </GradientHeading>
              
              <div className="bg-black/20 backdrop-blur-sm border border-siso-text/10 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-siso-orange/20 p-3 shrink-0">
                    <Settings className="h-6 w-6 text-siso-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Feature Selection</h3>
                    <p className="text-siso-text mb-4">
                      Pick up to 10 features for the free MVP tier. Each feature adds time to the 90-day base timeline.
                      Need more features or a faster delivery? Upgrade to Advanced or Premium.
                    </p>
                    
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left text-xs font-medium text-siso-text p-2 border-b border-siso-text/10"></th>
                            <th className="text-center text-xs font-medium text-siso-text p-2 border-b border-siso-text/10">MVP</th>
                            <th className="text-center text-xs font-medium text-siso-text p-2 border-b border-siso-text/10">Advanced</th>
                            <th className="text-center text-xs font-medium text-siso-text p-2 border-b border-siso-text/10">Premium</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tierComparison.map((row, index) => (
                            <tr key={index}>
                              <td className="text-left text-xs text-white p-2 border-b border-siso-text/10">{row.name}</td>
                              <td className="text-center text-xs text-siso-text p-2 border-b border-siso-text/10">{row.mvp}</td>
                              <td className="text-center text-xs text-siso-text p-2 border-b border-siso-text/10">{row.advanced}</td>
                              <td className="text-center text-xs text-siso-text p-2 border-b border-siso-text/10">{row.premium}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex space-x-2 mb-4">
                      <Button 
                        size="sm"
                        variant={currentTier === 'mvp' ? 'default' : 'outline'}
                        className={currentTier === 'mvp' ? 'bg-siso-orange hover:bg-siso-orange/90' : 'border-siso-text/20'}
                        onClick={() => handleTierChange('mvp')}
                      >
                        MVP (Free)
                      </Button>
                      <Button 
                        size="sm"
                        variant={currentTier === 'advanced' ? 'default' : 'outline'}
                        className={currentTier === 'advanced' ? 'bg-siso-orange hover:bg-siso-orange/90' : 'border-siso-text/20'}
                        onClick={() => handleTierChange('advanced')}
                      >
                        Advanced (£249)
                      </Button>
                      <Button 
                        size="sm"
                        variant={currentTier === 'premium' ? 'default' : 'outline'}
                        className={currentTier === 'premium' ? 'bg-siso-orange hover:bg-siso-orange/90' : 'border-siso-text/20'}
                        onClick={() => handleTierChange('premium')}
                      >
                        Premium (£499)
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white mr-2">Selected Features:</span>
                        <Badge variant="outline" className="bg-siso-orange/10 text-siso-orange border-siso-orange/30">
                          {selectedFeatureIds.length} {currentTier === 'mvp' ? `/ 10` : ''}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white mr-2">Estimated Timeline:</span>
                        <Badge variant="outline" className="bg-siso-orange/10 text-siso-orange border-siso-orange/30">
                          {totalDays} days {additionalHours > 0 ? `+ ${Math.round(additionalHours)} hours` : ''}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-siso-text" />
                  <Input 
                    placeholder="Search features..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/30 border-siso-text/20 text-white"
                  />
                </div>
                
                <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
                  <Button 
                    size="sm"
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    className={selectedCategory === 'all' ? 'bg-siso-orange hover:bg-siso-orange/90' : 'border-siso-text/20'}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All
                  </Button>
                  
                  {featureCategories.map((category) => (
                    <Button 
                      key={category.id}
                      size="sm"
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      className={selectedCategory === category.id ? 'bg-siso-orange hover:bg-siso-orange/90' : 'border-siso-text/20'}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <TooltipProvider>
                  <Accordion type="multiple" className="space-y-3">
                    {featureCategories
                      .filter(category => selectedCategory === 'all' || category.id === selectedCategory)
                      .map((category) => (
                        <AccordionItem 
                          key={category.id} 
                          value={category.id}
                          className="rounded-lg border border-siso-text/10 bg-black/20 overflow-hidden"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-black/40">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-siso-orange/10 p-1.5">
                                {category.icon}
                              </div>
                              <span className="font-medium text-white">{category.name}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-0">
                            <div className="space-y-2 mt-2">
                              {getFilteredFeatures(category).length === 0 ? (
                                <p className="text-siso-text text-sm italic">No features match your search.</p>
                              ) : (
                                getFilteredFeatures(category).map((feature: any) => (
                                  <div 
                                    key={feature.id}
                                    onClick={() => handleFeatureToggle(feature.id)}
                                    className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                                      selectedFeatureIds.includes(feature.id) 
                                        ? 'bg-siso-orange/10 border border-siso-orange/30' 
                                        : 'bg-black/30 border border-siso-text/10 hover:bg-black/40'
                                    }`}
                                  >
                                    <div className="mt-0.5 flex-shrink-0">
                                      {selectedFeatureIds.includes(feature.id) ? (
                                        <CheckCircle className="h-5 w-5 text-siso-orange" />
                                      ) : (
                                        <div className="h-5 w-5 rounded-full border-2 border-siso-text/50" />
                                      )}
                                    </div>
                                    
                                    <div className="flex-grow">
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-white">{feature.name}</h4>
                                        
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Badge variant="outline" className="bg-black/40 text-siso-text border-siso-text/20 flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {feature.timeEstimate < 1 
                                                ? `+${Math.round(feature.timeEstimate * 24)} hours` 
                                                : `+${feature.timeEstimate} day${feature.timeEstimate !== 1 ? 's' : ''}`}
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>This feature adds {feature.timeEstimate < 1 
                                              ? `${Math.round(feature.timeEstimate * 24)} hours` 
                                              : `${feature.timeEstimate} day${feature.timeEstimate !== 1 ? 's' : ''}`} to your timeline</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                      <p className="text-sm text-siso-text mt-1">{feature.description}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </TooltipProvider>
              </div>
              
              {showUpgradePrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-siso-orange/10 border border-siso-orange/30 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-siso-orange shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Feature Limit Reached</h4>
                      <p className="text-sm text-siso-text mb-3">
                        You've reached the 10-feature limit for the MVP tier. Upgrade to Advanced or Premium for unlimited features.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleTierChange('advanced')}
                          className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                        >
                          Upgrade to Advanced
                          <Zap className="ml-2 h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowUpgradePrompt(false)}
                          className="border-siso-text/20 text-siso-text"
                        >
                          Deselect Features
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                  size="lg"
                  onClick={() => {
                    const selectedFeatureNames = selectedFeatureIds.map(id => {
                      for (const category of featureCategories) {
                        const feature = category.features.find(f => f.id === id);
                        if (feature) return feature.name;
                      }
                      return '';
                    }).filter(Boolean);
                    
                    setSelectedFeatures(selectedFeatureNames);
                    
                    const reviewSection = document.getElementById('review-section');
                    if (reviewSection) {
                      reviewSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setTimeout(() => {
                        const reviewSection = document.getElementById('review-section');
                        if (reviewSection) {
                          reviewSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }
                  }}
                >
                  Finalize Feature Selection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </section>
          )}
          
          {selectedFeatures.length > 0 && (
            <section id="review-section" className="space-y-4 pt-6">
              <GradientHeading 
                className="text-2xl font-bold" 
                variant="primary"
              >
                Review Your Plan
              </GradientHeading>
              
              <PlanReviewSummary
                selectedFeatures={selectedFeatures}
                timeline={totalDays}
                totalCost={currentTier === 'mvp' ? 0 : (currentTier === 'advanced' ? 249 : 499)}
                onApprove={handleApprovePlan}
                isSubmitting={isSubmitting}
              />
              
              <div className="mt-8">
                <GradientHeading 
                  className="text-xl font-bold mb-4" 
                  variant="primary"
                >
                  Calculate Your Return on Investment
                </GradientHeading>
                
                <ROICalculator
                  selectedFeatures={selectedFeatures}
                  featuresTimeEstimate={totalDays}
                  tier={currentTier}
                  basePrice={currentTier === 'mvp' ? 0 : (currentTier === 'advanced' ? 249 : 499)}
                />
              </div>
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
          
          {!selectedFeatures.length && (
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
