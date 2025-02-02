import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Waves } from '@/components/ui/waves-background';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ButtonCta } from '@/components/ui/button-shiny';
import { GradientText } from '@/components/ui/gradient-text';
import { Input } from '@/components/ui/input';
import { Users, ArrowRight, Linkedin, Globe, Youtube, Instagram, Sparkles, Brain, Bot } from 'lucide-react';

export default function SocialOnboarding() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getFilledLinksCount = () => {
    return [linkedinUrl, websiteUrl, youtubeUrl, instagramUrl]
      .filter(url => url.trim().length > 0).length;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        throw new Error('No user ID found');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          linkedin_url: linkedinUrl || null,
          website_url: websiteUrl || null,
          youtube_url: youtubeUrl || null,
          instagram_url: instagramUrl || null,
          has_completed_social_info: true,
          social_info_completed_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Thank you for providing your social media information!",
      });
      
      // Navigate to the next step (you can change this to the appropriate route)
      navigate('/tools');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Step skipped",
      description: "You can always add your social media links later in your profile.",
    });
    navigate('/tools');
  };

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
      
      <Card className="relative z-10 w-full max-w-2xl p-8 space-y-6 bg-siso-bg/80 backdrop-blur-lg border-siso-border animate-fadeIn">
        <div className="absolute -top-10 left-0 w-full flex justify-center text-siso-text/70">
          <span className="px-4 py-1 rounded-full bg-siso-bg-alt border border-siso-border text-sm">
            Step 2 of 3
          </span>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <div className="p-3 rounded-full bg-gradient-to-br from-siso-red/10 to-siso-orange/10">
              <Users className="w-6 h-6 text-siso-orange" />
            </div>
            <GradientText
              colors={["#FF5722", "#FFA726", "#FF5722"]}
              animationSpeed={6}
              className="text-2xl font-bold"
            >
              Unlock Personalized AI Insights
            </GradientText>
          </div>
          
          <p className="text-siso-text/80 leading-relaxed max-w-xl mx-auto">
            By sharing your social media profiles, you're enabling our advanced AI to understand your business needs better.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex flex-col items-center p-4 rounded-lg bg-black/20 border border-siso-border/20">
              <Sparkles className="w-8 h-8 text-siso-orange mb-2" />
              <h3 className="font-semibold text-siso-text-bold">Tailored Tools</h3>
              <p className="text-sm text-siso-text/70 text-center">AI-curated tool recommendations</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-black/20 border border-siso-border/20">
              <Brain className="w-8 h-8 text-siso-orange mb-2" />
              <h3 className="font-semibold text-siso-text-bold">Smart Networking</h3>
              <p className="text-sm text-siso-text/70 text-center">Connect with relevant communities</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-black/20 border border-siso-border/20">
              <Bot className="w-8 h-8 text-siso-orange mb-2" />
              <h3 className="font-semibold text-siso-text-bold">LLM Insights</h3>
              <p className="text-sm text-siso-text/70 text-center">Personalized growth analysis</p>
            </div>
            
            <div className="flex flex-col items-center p-4 rounded-lg bg-black/20 border border-siso-border/20">
              <Users className="w-8 h-8 text-siso-orange mb-2" />
              <h3 className="font-semibold text-siso-text-bold">Community</h3>
              <p className="text-sm text-siso-text/70 text-center">Connect with like-minded users</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-[#0A66C2] transition-colors group-hover:text-[#0A66C2]/80" />
              <Input
                placeholder="LinkedIn URL"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="bg-siso-bg-alt border-siso-border text-siso-text flex-1 transition-all focus:ring-1 focus:ring-siso-red/50"
              />
            </div>
          </div>
          
          <div className="relative group">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-500 transition-colors group-hover:text-emerald-400" />
              <Input
                placeholder="Website URL"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="bg-siso-bg-alt border-siso-border text-siso-text flex-1 transition-all focus:ring-1 focus:ring-siso-red/50"
              />
            </div>
          </div>
          
          <div className="relative group">
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-600 transition-colors group-hover:text-red-500" />
              <Input
                placeholder="YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="bg-siso-bg-alt border-siso-border text-siso-text flex-1 transition-all focus:ring-1 focus:ring-siso-red/50"
              />
            </div>
          </div>
          
          <div className="relative group">
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-500 transition-colors group-hover:text-pink-400" />
              <Input
                placeholder="Instagram URL"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="bg-siso-bg-alt border-siso-border text-siso-text flex-1 transition-all focus:ring-1 focus:ring-siso-red/50"
              />
            </div>
          </div>

          <div className="mt-2">
            <div className="flex justify-between text-sm text-siso-text/70 mb-1">
              <span>Profile completion</span>
              <span>{Math.min(25 * getFilledLinksCount(), 100)}%</span>
            </div>
            <div className="h-2 bg-siso-bg-alt rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-siso-red to-siso-orange transition-all duration-500 ease-out"
                style={{ width: `${Math.min(25 * getFilledLinksCount(), 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <ButtonCta
            onClick={handleSubmit}
            disabled={isSubmitting}
            label={isSubmitting ? "Saving..." : "Continue"}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowRight className="ml-2 w-4 h-4" />
          </ButtonCta>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-siso-text/70 hover:text-siso-text"
          >
            Skip for now
          </Button>
        </div>
      </Card>
    </div>
  );
}
