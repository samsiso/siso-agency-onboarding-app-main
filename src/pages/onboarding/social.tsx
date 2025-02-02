import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialMediaModal } from '@/components/auth/SocialMediaModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Waves } from '@/components/ui/waves-background';

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

      // Update profile to mark social info as skipped
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

      // Navigate to the next step or dashboard
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
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-siso-red/10 h-12 w-12"></div>
          <div className="space-y-3">
            <div className="h-4 bg-siso-red/10 rounded w-32"></div>
            <div className="h-4 bg-siso-orange/10 rounded w-24"></div>
          </div>
        </div>
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
      <SocialMediaModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSkip={handleSkip}
        userId={userId}
      />
    </div>
  );
}