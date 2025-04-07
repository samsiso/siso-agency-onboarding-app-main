
import { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { MessageLoading } from '@/components/ui/message-loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColorPicker } from '@/components/plan/ColorPicker';
import { FeatureSelection, Feature } from '@/components/plan/FeatureSelection';
import { CaseStudy } from '@/components/plan/CaseStudy';

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

// Add categories for features
interface FeatureCategory {
  name: string;
  icon: JSX.Element;
  description: string;
  features: string[];
}

// Add pain points
interface PainPoint {
  problem: string;
  solution: string;
}

// Add testimonials
interface Testimonial {
  content: string;
  author: string;
  position: string;
  instagram?: string;
  appLink?: string;
}

// Define color options
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

// Case studies data
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

// Additional features that can be added
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
  
  // New state for customization
  const [primaryColor, setPrimaryColor] = useState('#ED8936');
  const [secondaryColor, setSecondaryColor] = useState('#E53E3E');
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>(additionalFeatures);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        
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
        
        setPlan(data);
        
        // Initialize colors if available in the plan
        if (data?.branding?.primary_color) {
          setPrimaryColor(data.branding.primary_color);
        }
        
        if (data?.branding?.secondary_color) {
          setSecondaryColor(data.branding.secondary_color);
        }
        
        // Calculate initial total cost
        setTotalCost(data?.estimated_cost || 0);
        
      } catch (error) {
        console.error('Error fetching plan:', error);
        toast({
          title: "Error loading plan",
          description: "We couldn't load the plan details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlan();
  }, [username, toast]);
  
  // Calculate total cost when selected features change
  useEffect(() => {
    if (plan) {
      const additionalCost = selectedFeatures
        .filter(feature => feature.included)
        .reduce((total, feature) => total + feature.price, 0);
        
      setTotalCost((plan.estimated_cost || 0) + additionalCost);
    }
  }, [selectedFeatures, plan]);
  
  const handleSubmitPlan = async () => {
    if (!plan) return;
    
    try {
      setSubmitting(true);
      
      // Update the plan with the new colors and total cost
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
      
      // Navigate to onboarding
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
        <div className="text-center">
          <MessageLoading className="mx-auto mb-4" />
          <p className="text-siso-text">Loading your plan...</p>
        </div>
      </div>
    );
  }
  
  if (!plan) {
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
  }
  
  // Check if this is the Decora plan to show enhanced features
  const isDecoraPlan = plan.username === 'decora';
  
  // Define feature categories for the Decora plan
  const featureCategories: FeatureCategory[] = isDecoraPlan ? [
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

  // Define pain points solved for Decora plan
  const painPoints: PainPoint[] = isDecoraPlan ? [
    {
      problem: 'Client Retention Issues',
      solution: 'Professional platform creates transparency and improves communication, dramatically reducing churn and increasing long-term client satisfaction.'
    },
    {
      problem: 'Inefficient Onboarding',
      solution: 'Streamlined multi-step forms and automated reminders collect all necessary information without overwhelming new clients, cutting onboarding time by 60%.'
    },
    {
      problem: 'Content Disorganization',
      solution: 'Centralized content library and scheduling tools keep everything organized and on-time, eliminating missed posts and reducing management overhead.'
    },
    {
      problem: 'Communication Breakdowns',
      solution: 'In-app messaging and notification system ensures nothing falls through the cracks, with a clear paper trail of all conversations and decisions.'
    },
    {
      problem: 'Fan Engagement Challenges',
      solution: 'Managed fan interaction tools help maintain high engagement and subscriber satisfaction, with smart auto-replies and prioritization features.'
    },
    {
      problem: 'Manual Task Overload',
      solution: 'Automated workflows and AI-powered features reduce manual work by up to 40%, freeing up time for strategy and high-value activities.'
    }
  ] : [];

  // Sample testimonials for Decora plan with social links
  const testimonials: Testimonial[] = isDecoraPlan ? [
    {
      content: "This platform has completely transformed how we manage our creator clients. Our retention rate has increased by 35% since implementation.",
      author: "Sarah Johnson",
      position: "Agency Owner",
      instagram: "https://instagram.com/sarahj_agency",
      appLink: "https://apps.apple.com/us/app/onlymgmt"
    },
    {
      content: "The content management tools alone have saved us countless hours every week. Our team can now handle twice as many clients with the same resources.",
      author: "Michael Rodriguez",
      position: "Operations Manager",
      instagram: "https://instagram.com/mike_rodriguez"
    },
    {
      content: "The detailed analytics help us show our clients exactly how we're helping them grow. It's made all the difference in justifying our fees.",
      author: "Taylor Williams",
      position: "Client Success Manager",
      appLink: "https://play.google.com/store/apps/details?id=com.onlymgmt"
    }
  ] : [];

  // Group features for non-Decora plans
  const regularFeatures = !isDecoraPlan
    ? (plan.features || [])
    : [];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Personalized Welcome Message */}
        {isDecoraPlan && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg border border-siso-orange/20 shadow-lg p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-6 w-6 text-siso-orange" />
              <h2 className="text-xl font-semibold text-white">Welcome, Decora Team!</h2>
            </div>
            <p className="text-siso-text mb-3">
              We've crafted this custom OnlyFans Management Suite specifically for your agency needs. This platform addresses your unique challenges and will help you scale your operations while improving client retention.
            </p>
            <p className="text-siso-text/80 text-sm">
              Review the plan below, customize it to your needs, and click "Approve This Plan" when you're ready to get started. Our team is excited to work with you!
            </p>
          </motion.div>
        )}

        <div className="bg-black/40 backdrop-blur-md rounded-lg border border-siso-text/10 shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <GradientHeading className="text-3xl md:text-4xl mb-2">
                  {plan.company_name}'s App Plan
                </GradientHeading>
                
                <p className="text-siso-text mb-4">
                  We've crafted a custom app solution for your business needs
                </p>
              </div>
              
              {plan.branding?.logo && (
                <div className="mt-4 md:mt-0">
                  <img 
                    src={plan.branding.logo} 
                    alt={`${plan.company_name} logo`} 
                    className="max-h-24 rounded-md object-contain" 
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-2 text-siso-orange mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">App Name</h3>
                    <p className="text-siso-orange">{plan.app_name}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 text-siso-orange mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Timeline</h3>
                    <p className="text-siso-orange">{plan.estimated_days} days</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 mr-2 text-siso-orange mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Investment</h3>
                    <p className="text-siso-orange">£{totalCost}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {isDecoraPlan && (
              <div className="mb-8">
                {/* Branding Customization Section */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Customize Your Branding</h2>
                  <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                    <p className="text-siso-text mb-4">
                      Select the colors that match your brand identity. These colors will be used throughout your app.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <ColorPicker
                          title="Primary Color"
                          colors={brandColorOptions}
                          selectedColor={primaryColor}
                          onChange={setPrimaryColor}
                        />
                      </div>
                      
                      <div>
                        <ColorPicker
                          title="Secondary Color"
                          colors={brandColorOptions}
                          selectedColor={secondaryColor}
                          onChange={setSecondaryColor}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg" style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}>
                      <div className="flex gap-3">
                        <div className="h-12 w-12 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        <div className="h-12 w-12 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
                      </div>
                      <p className="mt-2 text-sm text-siso-text">Preview of your selected brand colors</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Features Section */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Customize Your Plan</h2>
                  <FeatureSelection 
                    features={selectedFeatures} 
                    onChange={setSelectedFeatures}
                  />
                </div>
                
                {/* Case Studies Section */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-siso-orange" />
                    Case Studies
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
                
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-siso-orange" />
                    Target Users
                  </h2>
                  <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                    <p className="text-siso-text">
                      This app is designed specifically for <span className="text-siso-orange font-semibold">OnlyFans Management Agencies</span> who need to efficiently manage creators, content, and fan interactions. It's perfect for agencies like Decora who are looking to scale operations while maintaining high-quality service.
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-siso-orange" />
                    Pain Points Solved
                  </h2>
                  <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {painPoints.map((point, index) => (
                        <motion.div 
                          key={index} 
                          className="p-4 border border-siso-text/10 rounded-lg bg-black/20"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.5 }}
                        >
                          <h3 className="text-white font-medium mb-2">{point.problem}</h3>
                          <p className="text-siso-text text-sm">{point.solution}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimonials Section */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-siso-orange" />
                    What Other Agencies Are Saying
                  </h2>
                  <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {testimonials.map((testimonial, index) => (
                        <motion.div 
                          key={index} 
                          className="p-4 border border-siso-text/10 rounded-lg bg-gradient-to-br from-siso-red/5 to-siso-orange/5"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 * index, duration: 0.5 }}
                        >
                          <p className="text-siso-text text-sm italic mb-3">{`"${testimonial.content}"`}</p>
                          <div className="mb-3">
                            <p className="text-white font-medium">{testimonial.author}</p>
                            <p className="text-siso-text/70 text-xs">{testimonial.position}</p>
                          </div>
                          <div className="flex gap-2">
                            {testimonial.instagram && (
                              <a 
                                href={testimonial.instagram} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-siso-orange flex items-center hover:underline"
                              >
                                Instagram <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            )}
                            {testimonial.appLink && (
                              <a 
                                href={testimonial.appLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-siso-orange flex items-center hover:underline"
                              >
                                App Link <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-6 bg-black/20">
                    <TabsTrigger value="features" className="data-[state=active]:bg-siso-orange/20">
                      Feature Categories
                    </TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-siso-orange/20">
                      Technical Details
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="features" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featureCategories.map((category, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-black/30 rounded-lg p-5 border border-siso-text/5 flex flex-col h-full"
                        >
                          <div className="flex items-center mb-4">
                            <div className="p-2 rounded-lg bg-siso-orange/10 mr-3">
                              {category.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                          </div>
                          
                          <p className="text-siso-text/80 text-sm mb-4">{category.description}</p>
                          
                          <ul className="space-y-2 mt-auto">
                            {category.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 text-siso-orange shrink-0 mt-0.5" />
                                <span className="text-siso-text text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details">
                    <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5 mb-6">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <Smartphone className="h-5 w-5 mr-2 text-siso-orange" />
                        Technical Implementation
                      </h3>
                      
                      <Table>
                        <TableHeader>
                          <TableRow className="border-siso-text/10">
                            <TableHead className="text-siso-text">Component</TableHead>
                            <TableHead className="text-siso-text">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Platform</TableCell>
                            <TableCell className="text-siso-text">Web-based application accessible on all devices with responsive design</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Frontend</TableCell>
                            <TableCell className="text-siso-text">React.js with Tailwind CSS for responsive design and smooth animations</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Backend</TableCell>
                            <TableCell className="text-siso-text">Node.js with Supabase for database, authentication, and real-time updates</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Integrations</TableCell>
                            <TableCell className="text-siso-text">Only Fans API, WhatsApp Business API, payment processing, messaging services</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Security</TableCell>
                            <TableCell className="text-siso-text">End-to-end encryption, 2FA, role-based access control, regular security audits</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Deployment</TableCell>
                            <TableCell className="text-siso-text">Cloud-based with automated scaling, daily backups, and 99.9% uptime guarantee</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Mobile Access</TableCell>
                            <TableCell className="text-siso-text">Fully responsive web app with optional native app wrapper for iOS and Android</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                      <h3 className="text-xl font-semibold text-white mb-4">Additional Details</h3>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <p>The OnlyFans Management Suite for Decora includes a complete ecosystem for managing creators, content, and fan interactions. The platform provides tools for efficient onboarding, content scheduling, analytics tracking, and secure payment processing.</p>
                        <p>Our comprehensive solution helps agencies like yours streamline operations, improve client retention, and maximize revenue potential through advanced analytics and automation. The application is built with scalability in mind, allowing it to grow alongside your agency from 10 to 100+ creators.</p>
                        <p>All system components adhere to industry best practices for security and performance, ensuring a reliable platform for your business operations. The white-label options allow you to fully brand the platform as your own, enhancing your professional image with clients.</p>
                        <p>After approval, we'll work closely with your team to customize the platform to your specific workflow and processes, ensuring a seamless transition and maximum adoption across your organization.</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5 mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Features</h3>
                <ul className="space-y-1">
                  {regularFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-siso-text">
                      <CheckCircle className="h-4 w-4 mr-2 text-siso-orange" />
                      <span className="capitalize">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <motion.div 
              className="mt-8 text-center"
              whileHover={{ scale: plan.status !== 'approved' && !submitting ? 1.02 : 1 }}
            >
              <Button
                onClick={handleSubmitPlan}
                disabled={submitting || plan.status === 'approved'}
                className="w-full md:w-auto px-8 py-6 text-lg bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : plan.status === 'approved' ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Plan Approved
                  </>
                ) : (
                  <>
                    Approve This Plan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              
              {plan.status === 'approved' ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-siso-text"
                >
                  Your plan has been approved. We're getting everything ready for you!
                </motion.p>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-siso-text/70 text-sm"
                >
                  By approving this plan, you'll begin the implementation process for your custom OnlyFans Management Suite.
                </motion.p>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Plan;
