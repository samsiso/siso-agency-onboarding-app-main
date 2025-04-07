
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { MessageLoading } from '@/components/ui/message-loading';
import { Check, ArrowRight } from 'lucide-react';

const DecoraPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [inserting, setInserting] = useState(false);
  const [planExists, setPlanExists] = useState(false);
  
  useEffect(() => {
    const checkPlan = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .eq('username', 'decora')
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        setPlanExists(!!data);
      } catch (error) {
        console.error('Error checking plan:', error);
        toast({
          title: "Error checking plan",
          description: "We couldn't check if the plan exists. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkPlan();
  }, [toast]);
  
  const handleCreatePlan = async () => {
    try {
      setInserting(true);
      
      const planData = {
        username: 'decora',
        company_name: 'Decora',
        app_name: 'OnlyFans Management Suite',
        features: [
          'client onboarding',
          'content management',
          'fan interaction',
          'analytics dashboard',
          'payment processing',
          'task management',
          'communication tools',
          'social media integration'
        ],
        branding: {
          logo: 'https://avdgyrepwrvsvwgxrccr.supabase.co/storage/v1/object/public/plans/decora-logo.png'
        },
        estimated_cost: 1200,
        estimated_days: 90,
        status: 'pending'
      };
      
      const { error } = await supabase
        .from('plans')
        .insert(planData);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Plan created successfully!",
        description: "You can now view the plan details.",
      });
      
      // Navigate to the plan page
      setTimeout(() => {
        navigate('/plan/decora');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Error creating plan",
        description: "We couldn't create the plan. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setInserting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
        <div className="text-center">
          <MessageLoading className="mx-auto mb-4" />
          <p className="text-siso-text">Checking plan status...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-black/40 backdrop-blur-md border-siso-text/10 shadow-xl overflow-hidden">
            <CardContent className="p-6">
              <GradientHeading className="text-2xl md:text-3xl mb-4 text-center">
                Decora OnlyFans Management
              </GradientHeading>
              
              {planExists ? (
                <div className="text-center">
                  <div className="mb-6">
                    <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-siso-text text-lg">
                      The plan for Decora already exists!
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => navigate('/plan/decora')}
                    className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                  >
                    View Plan Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-siso-text mb-6">
                    Create a test plan for Decora, an OnlyFans management agency, with 
                    comprehensive features for client management, content creation, fan
                    engagement, and revenue tracking.
                  </p>
                  
                  <Button
                    onClick={handleCreatePlan}
                    disabled={inserting}
                    className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                  >
                    {inserting ? (
                      <>
                        <MessageLoading className="mr-2" />
                        Creating Plan...
                      </>
                    ) : (
                      <>
                        Create Test Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DecoraPlan;
