import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialMediaModal } from '@/components/auth/SocialMediaModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Waves } from '@/components/ui/waves-background';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, Linkedin, Globe, Youtube, Instagram, Sparkles, Brain, Bot } from 'lucide-react';

export default function SocialOnboarding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSkip = async () => {
    try {
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
      
      <Card className="relative z-10 w-full max-w-2xl p-8 space-y-8 bg-siso-bg/80 backdrop-blur-lg border-siso-border animate-fadeIn">
        <div className="absolute -top-10 left-0 w-full flex justify-center text-siso-text/70">
          <span className="px-4 py-1 rounded-full bg-siso-bg-alt border border-siso-border text-sm">
            Step 2 of 3
          </span>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-siso-red/10 to-siso-orange/10">
            <Users className="w-6 h-6 text-siso-orange" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
              Unlock Personalized AI Insights
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-siso-text/80 leading-relaxed">
              By sharing your social media profiles, you're enabling our advanced AI to understand your business needs better. We'll analyze your digital presence to provide:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center p-4 rounded-lg bg-black/20 border border-siso-border/20">
                <Sparkles className="w-8 h-8 text-siso-orange mb-2" />
                <h3 className="font-semibold text-siso-text-bold">Tailored Tools</h3>
                <p className="text-sm text-siso-text/70 text-center">AI-curated tool recommendations based on your business profile</p>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-black/20 border border-siso-border/20">
                <Brain className="w-8 h-8 text-siso-orange mb-2" />
                <h3 className="font-semibold text-siso-text-bold">Smart Networking</h3>
                <p className="text-sm text-siso-text/70 text-center">Connect with relevant communities and resources</p>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-black/20 border border-siso-border/20">
                <Bot className="w-8 h-8 text-siso-orange mb-2" />
                <h3 className="font-semibold text-siso-text-bold">LLM Insights</h3>
                <p className="text-sm text-siso-text/70 text-center">Personalized AI analysis of growth opportunities</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => setIsModalOpen(true)} className="flex items-center space-x-3 p-4 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 transition-all duration-300 cursor-pointer hover:scale-105">
              <Linkedin className="w-6 h-6 text-[#0A66C2]" />
              <span className="text-siso-text">LinkedIn</span>
            </div>
            <div onClick={() => setIsModalOpen(true)} className="flex items-center space-x-3 p-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-300 cursor-pointer hover:scale-105">
              <Globe className="w-6 h-6 text-emerald-500" />
              <span className="text-siso-text">Website</span>
            </div>
            <div onClick={() => setIsModalOpen(true)} className="flex items-center space-x-3 p-4 rounded-lg bg-red-600/10 hover:bg-red-600/20 transition-all duration-300 cursor-pointer hover:scale-105">
              <Youtube className="w-6 h-6 text-red-600" />
              <span className="text-siso-text">YouTube</span>
            </div>
            <div onClick={() => setIsModalOpen(true)} className="flex items-center space-x-3 p-4 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-all duration-300 cursor-pointer hover:scale-105">
              <Instagram className="w-6 h-6 text-pink-500" />
              <span className="text-siso-text">Instagram</span>
            </div>
          </div>

          <div className="text-center text-sm text-siso-text/60 mt-4">
            <p>We only collect public information to enhance your experience. No passwords or private data required.</p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
            >
              Connect Profiles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-siso-text/70 hover:text-siso-text"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </Card>

      <SocialMediaModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSkip={handleSkip}
        userId={userId || 'demo-user'}
      />
    </div>
  );
}