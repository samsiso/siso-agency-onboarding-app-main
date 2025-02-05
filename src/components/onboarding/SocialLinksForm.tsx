import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/ui/gradient-text';
import { Linkedin, Globe, Twitter } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SocialLinksFormProps {
  userId: string | null;
}

export const SocialLinksForm = ({ userId }: SocialLinksFormProps) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationStates, setValidationStates] = useState({
    linkedin: true,
    website: true,
    twitter: true
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateUrl = (url: string, type: 'linkedin' | 'website' | 'twitter') => {
    if (!url) return true; // Empty URLs are valid (optional fields)
    
    const urlPattern = /^https?:\/\/.+\..+/;
    let isValid = urlPattern.test(url);
    
    if (type === 'linkedin') {
      isValid = isValid && url.includes('linkedin.com');
    } else if (type === 'twitter') {
      isValid = isValid && (url.includes('twitter.com') || url.includes('x.com'));
    }
    
    setValidationStates(prev => ({
      ...prev,
      [type]: isValid
    }));
    
    return isValid;
  };

  const getFilledLinksCount = () => {
    return [linkedinUrl, websiteUrl, twitterUrl]
      .filter(url => url.trim().length > 0).length;
  };

  const handleSubmit = async () => {
    // Validate all URLs
    const isLinkedinValid = validateUrl(linkedinUrl, 'linkedin');
    const isWebsiteValid = validateUrl(websiteUrl, 'website');
    const isTwitterValid = validateUrl(twitterUrl, 'twitter');

    if (!isLinkedinValid || !isWebsiteValid || !isTwitterValid) {
      toast({
        variant: "destructive",
        title: "Invalid URLs",
        description: "Please check your social media links",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (userId) {
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
      }

      toast({
        title: userId ? "Social links saved!" : "Guest profile created",
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

  const SocialInput = ({ 
    icon: Icon, 
    placeholder, 
    value, 
    onChange, 
    tooltip, 
    type,
    isValid
  }: { 
    icon: any, 
    placeholder: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    tooltip: string,
    type: 'linkedin' | 'website' | 'twitter',
    isValid: boolean
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-siso-text/70">
              <Icon className="w-5 h-5" />
            </div>
            <Input
              type="url"
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                onChange(e);
                validateUrl(e.target.value, type);
              }}
              className={`pl-11 w-full bg-white/5 border-siso-border text-siso-text transition-colors duration-300
                ${!isValid ? 'border-red-500' : 'hover:border-siso-border-hover focus:border-siso-red'}`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <GradientText className="text-2xl font-bold">
          Connect Your Social Profiles
        </GradientText>
        <p className="text-siso-text">
          {userId 
            ? "Help us personalize your experience by connecting your professional profiles"
            : "Add your social profiles to enhance your guest experience"
          }
        </p>
      </div>

      <div className="space-y-4">
        <SocialInput
          icon={Linkedin}
          placeholder="LinkedIn Profile URL"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          tooltip="Connect with other professionals and showcase your expertise"
          type="linkedin"
          isValid={validationStates.linkedin}
        />
        <SocialInput
          icon={Globe}
          placeholder="Website URL"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          tooltip="Share your personal or business website"
          type="website"
          isValid={validationStates.website}
        />
        <SocialInput
          icon={Twitter}
          placeholder="Twitter Profile URL"
          value={twitterUrl}
          onChange={(e) => setTwitterUrl(e.target.value)}
          tooltip="Join the conversation and stay updated with the latest trends"
          type="twitter"
          isValid={validationStates.twitter}
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