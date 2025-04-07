
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { CheckCircle, Loader2, ArrowRight, Calendar, DollarSign, Users, FileText, MessageSquare, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { MessageLoading } from '@/components/ui/message-loading';

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

const Plan = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
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
  
  // Group features by categories for Decora plan
  const featureCategories = isDecoraPlan ? {
    'Client Management': plan.features?.filter(f => 
      ['client onboarding', 'communication tools', 'task management'].includes(f)
    ) || [],
    'Content & Engagement': plan.features?.filter(f => 
      ['content management', 'fan interaction', 'social media integration'].includes(f)
    ) || [],
    'Analysis & Finance': plan.features?.filter(f => 
      ['analytics dashboard', 'payment processing'].includes(f)
    ) || [],
  } : null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-black/40 backdrop-blur-md rounded-lg border border-siso-text/10 shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <GradientHeading className="text-3xl md:text-4xl mb-2">
              {plan.company_name}'s App Plan
            </GradientHeading>
            
            <p className="text-siso-text mb-8">
              We've crafted a custom app solution for your business needs
            </p>
            
            {plan.branding?.logo && (
              <div className="mb-8">
                <p className="text-sm text-siso-text/70 mb-2">Your brand:</p>
                <img 
                  src={plan.branding.logo} 
                  alt={`${plan.company_name} logo`} 
                  className="max-h-24 rounded-md object-contain" 
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              
              {isDecoraPlan ? (
                <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-2 text-siso-orange mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Target Users</h3>
                      <p className="text-siso-orange">OnlyFans Creators & Managers</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            
            {isDecoraPlan ? (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Key Feature Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(featureCategories || {}).map(([category, features]) => (
                    <div key={category} className="bg-black/30 rounded-lg p-5 border border-siso-text/5">
                      <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                        {category === 'Client Management' && <Users className="h-4 w-4 mr-2 text-siso-orange" />}
                        {category === 'Content & Engagement' && <MessageSquare className="h-4 w-4 mr-2 text-siso-orange" />}
                        {category === 'Analysis & Finance' && <BarChart className="h-4 w-4 mr-2 text-siso-orange" />}
                        {category}
                      </h4>
                      <ul className="space-y-1">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-center text-siso-text">
                            <CheckCircle className="h-4 w-4 mr-2 text-siso-orange" />
                            <span className="capitalize">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5 mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Features</h3>
                <ul className="space-y-1">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex items-center text-siso-text">
                      <CheckCircle className="h-4 w-4 mr-2 text-siso-orange" />
                      <span className="capitalize">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {isDecoraPlan && (
              <div className="bg-black/30 rounded-lg p-5 border border-siso-text/5 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Additional Details</h3>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p>The OnlyFans Management Suite for Decora includes a complete ecosystem for managing creators, content, and fan interactions. The platform provides tools for efficient onboarding, content scheduling, analytics tracking, and secure payment processing.</p>
                  <p>Our comprehensive solution helps agencies streamline operations, improve client retention, and maximize revenue potential through advanced analytics and automation.</p>
                </div>
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
