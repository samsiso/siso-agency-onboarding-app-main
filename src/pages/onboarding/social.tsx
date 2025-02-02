import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialMediaModal } from '@/components/auth/SocialMediaModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
    return null; // Or a loading state
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-siso-red/5 to-siso-orange/5 flex items-center justify-center">
      <SocialMediaModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSkip={handleSkip}
        userId={userId}
      />
    </div>
  );
}