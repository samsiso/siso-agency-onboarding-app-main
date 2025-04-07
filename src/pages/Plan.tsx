
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
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { MessageLoading } from '@/components/ui/message-loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PlanData {
  id: string;
  username: string;
  company_name: string | null;
  app_name: string | null;
  features: string[] | null;
  branding: {
    logo?: string;
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

const Plan = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  
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
  
  const handleSubmitPlan = async () => {
    if (!plan) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('plans')
        .update({ status: 'approved' })
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
      description: 'Tools for managing OnlyFans creator clients effectively',
      features: [
        'Multi-step onboarding forms',
        'Client profiles and dashboards',
        'Progress tracking',
        'Activity logging',
        'Client status management'
      ]
    },
    {
      name: 'Content Management',
      icon: <FileText className="h-5 w-5 text-siso-orange" />,
      description: 'Content planning, review, and scheduling tools',
      features: [
        'Content calendar',
        'Media library',
        'Content approval workflow',
        'Direct posting integration',
        'Content templates'
      ]
    },
    {
      name: 'Communication',
      icon: <MessageSquare className="h-5 w-5 text-siso-orange" />,
      description: 'Tools for agency-client and fan interactions',
      features: [
        'In-app messaging',
        'Fan interaction management',
        'Notification system',
        'External platform integration',
        'Canned responses'
      ]
    },
    {
      name: 'Analytics & Financials',
      icon: <BarChart className="h-5 w-5 text-siso-orange" />,
      description: 'Performance tracking and financial management',
      features: [
        'Performance metrics dashboard',
        'Custom reports generation',
        'Earnings tracking',
        'Invoice management',
        'Tax reporting tools'
      ]
    },
    {
      name: 'Security & Compliance',
      icon: <Shield className="h-5 w-5 text-siso-orange" />,
      description: 'Keeping data secure and compliant with regulations',
      features: [
        'Data encryption',
        'Two-factor authentication',
        'Compliance checking',
        'Role-based access control',
        'Audit trails'
      ]
    },
    {
      name: 'Advanced Features',
      icon: <Settings className="h-5 w-5 text-siso-orange" />,
      description: 'Premium capabilities to maximize agency effectiveness',
      features: [
        'AI-powered content insights',
        'Subscription tier management',
        'Social media integration',
        'Automated task workflows',
        'White-label branding'
      ]
    }
  ] : [];

  // Define pain points solved for Decora plan
  const painPoints: PainPoint[] = isDecoraPlan ? [
    {
      problem: 'Client Retention Issues',
      solution: 'Professional platform creates transparency and improves communication, dramatically reducing churn.'
    },
    {
      problem: 'Inefficient Onboarding',
      solution: 'Streamlined multi-step forms and automated reminders collect all necessary information without overwhelming new clients.'
    },
    {
      problem: 'Content Disorganization',
      solution: 'Centralized content library and scheduling tools keep everything organized and on-time.'
    },
    {
      problem: 'Communication Breakdowns',
      solution: 'In-app messaging and notification system ensures nothing falls through the cracks.'
    },
    {
      problem: 'Fan Engagement Challenges',
      solution: 'Managed fan interaction tools help maintain high engagement and subscriber satisfaction.'
    },
    {
      problem: 'Manual Task Overload',
      solution: 'Automated workflows and AI-powered features reduce manual work and free up time for strategy.'
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
                    <p className="text-siso-orange">£{plan.estimated_cost}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {isDecoraPlan ? (
              <div className="mb-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-siso-orange" />
                    Target Users
                  </h2>
                  <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                    <p className="text-siso-text">
                      This app is designed specifically for <span className="text-siso-orange font-semibold">OnlyFans Management Agencies</span> who need to efficiently manage creators, content, and fan interactions.
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
                        <div key={index} className="p-4 border border-siso-text/10 rounded-lg bg-black/20">
                          <h3 className="text-white font-medium mb-2">{point.problem}</h3>
                          <p className="text-siso-text text-sm">{point.solution}</p>
                        </div>
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
                            <TableCell className="text-siso-text">Web-based application accessible on all devices</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Frontend</TableCell>
                            <TableCell className="text-siso-text">React.js with Tailwind CSS for responsive design</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Backend</TableCell>
                            <TableCell className="text-siso-text">Node.js with Supabase for database and authentication</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Integrations</TableCell>
                            <TableCell className="text-siso-text">Only Fans API, payment processing, messaging services</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Security</TableCell>
                            <TableCell className="text-siso-text">End-to-end encryption, 2FA, role-based access control</TableCell>
                          </TableRow>
                          <TableRow className="border-siso-text/10">
                            <TableCell className="font-medium text-white">Deployment</TableCell>
                            <TableCell className="text-siso-text">Cloud-based with automated scaling and backups</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                      <h3 className="text-xl font-semibold text-white mb-4">Additional Details</h3>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <p>The OnlyFans Management Suite for Decora includes a complete ecosystem for managing creators, content, and fan interactions. The platform provides tools for efficient onboarding, content scheduling, analytics tracking, and secure payment processing.</p>
                        <p>Our comprehensive solution helps agencies streamline operations, improve client retention, and maximize revenue potential through advanced analytics and automation. The application is built with scalability in mind, allowing it to grow alongside your agency.</p>
                        <p>All system components adhere to industry best practices for security and performance, ensuring a reliable platform for your business operations.</p>
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
              
              {plan.status === 'approved' && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-siso-text"
                >
                  Your plan has been approved. We're getting everything ready for you!
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
