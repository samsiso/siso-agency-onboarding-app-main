
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { OnboardingChatUI } from '@/components/onboarding/OnboardingChatUI';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';

export default function OnboardingChat() {
  const { isLoading } = useOnboardingAuth();
  const navigate = useNavigate();
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialAnimation(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (isLoading || showInitialAnimation) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-siso-red to-siso-orange rounded-full opacity-50 blur-lg animate-pulse"></div>
            <div className="absolute inset-0 border-2 border-siso-orange rounded-full animate-spin"></div>
          </div>
          <p className="text-siso-text animate-pulse">Loading SISO AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-black via-siso-bg to-black">
      <header className="p-4 flex items-center justify-between border-b border-white/10">
        <Button variant="ghost" onClick={handleBackToHome} className="text-siso-text hover:text-white">
          &larr; Back to Home
        </Button>
        <div className="flex items-center gap-2">
          <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></span>
          <span className="text-siso-text-bold text-sm">SISO AI Preview</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/auth')} className="text-sm">
          Already have an account?
        </Button>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <OnboardingChatUI />
      </div>
    </div>
  );
}
