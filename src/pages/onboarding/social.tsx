import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialMediaModal } from '@/components/auth/SocialMediaModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function SocialOnboarding() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSkip = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error('No user found');
      }

      // Update profile to mark social info as skipped
      const { error } = await supabase
        .from('profiles')
        .update({
          has_completed_social_info: true,
          social_info_completed_at: new Date().toISOString()
        })
        .eq('id', user.id);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-siso-red/5 to-siso-orange/5 flex items-center justify-center">
      <SocialMediaModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSkip={handleSkip}
      />
    </div>
  );
}