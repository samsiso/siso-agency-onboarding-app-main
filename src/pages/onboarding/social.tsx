import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialMediaModal } from '@/components/auth/SocialMediaModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Waves } from '@/components/ui/waves-background';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';

export default function SocialOnboarding() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUserId(user.id);
    };

    checkUser();
  }, [navigate]);

  const handleSkip = async () => {
    try {
      if (!userId) {
        throw new Error('No user found');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          has_completed_social_info: true,
          social_info_completed_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Step skipped",
        description: "You can always add your social media links later in your profile.",
      });

      navigate('/onboarding/chat');
    } catch (error: any) {
      console.error('Error skipping step:', error);
      toast({
        variant: "destructive",
        title: "Error skipping step",
        description: error.message,
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/onboarding/chat');
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-siso-red/5 to-siso-orange/5 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 space-y-4 animate-fadeIn">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-siso-red/10 h-12 w-12"></div>
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-siso-red/10 rounded w-3/4"></div>
              <div className="h-4 bg-siso-orange/10 rounded w-1/2"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-siso-bg to-black p-4 overflow-hidden">
      <Waves 
        lineColor="rgba(255, 87, 34, 0.2)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      
      <Card className="relative z-10 w-full max-w-md p-8 space-y-6 bg-siso-bg/80 backdrop-blur-lg border-siso-border">
        <div className="flex items-center justify-center space-x-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-siso-red/10 to-siso-orange/10">
            <Users className="w-6 h-6 text-siso-orange" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
              Connect Your Profiles
            </h2>
            <p className="text-siso-text/70">Step 2 of 3</p>
          </div>
        </div>

        <p className="text-center text-siso-text/80">
          Link your social media accounts to unlock additional features and earn points
        </p>

        <div className="flex justify-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
          >
            Connect Profiles
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Card>

      {userId && (
        <SocialMediaModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSkip={handleSkip}
          userId={userId}
        />
      )}
    </div>
  );
}