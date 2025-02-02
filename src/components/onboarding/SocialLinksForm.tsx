import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/ui/gradient-text';

interface SocialLinksFormProps {
  userId: string;
}

export const SocialLinksForm = ({ userId }: SocialLinksFormProps) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getFilledLinksCount = () => {
    return [linkedinUrl, websiteUrl, twitterUrl]
      .filter(url => url.trim().length > 0).length;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          linkedin_url: linkedinUrl,
          website_url: websiteUrl,
          twitter_url: twitterUrl,
          has_completed_social_info: true,
          social_info_completed_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Social links saved!",
        description: "Moving to the next step...",
      });

      navigate('/onboarding/congratulations');
    } catch (error: any) {
      console.error('Error saving social links:', error);
      toast({
        variant: "destructive",
        title: "Error saving social links",
        description: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <GradientText className="text-2xl font-bold">
          Connect Your Social Profiles
        </GradientText>
        <p className="text-siso-text">
          Help us personalize your experience by connecting your professional profiles
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="url"
          placeholder="LinkedIn Profile URL"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          className="w-full bg-white/5 border-siso-border text-siso-text"
        />
        <Input
          type="url"
          placeholder="Website URL"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="w-full bg-white/5 border-siso-border text-siso-text"
        />
        <Input
          type="url"
          placeholder="Twitter Profile URL"
          value={twitterUrl}
          onChange={(e) => setTwitterUrl(e.target.value)}
          className="w-full bg-white/5 border-siso-border text-siso-text"
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-siso-text">
          {getFilledLinksCount()} of 3 profiles connected
        </span>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/onboarding/congratulations')}
            className="bg-white/10 text-white hover:bg-white/20"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};