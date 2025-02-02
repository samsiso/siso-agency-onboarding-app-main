import { useNavigate } from 'react-router-dom';
import { AuthButton } from '../AuthButton';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const LandingPage = () => {
  const { user } = useAuthSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('LandingPage mounted');
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleTestClick = () => {
    console.log('Test button clicked');
    toast({
      title: "Test Button Clicked",
      description: "The test button is working correctly!",
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* Test Button - Now with visual feedback */}
      <Button
        onClick={handleTestClick}
        className="fixed top-4 left-4 z-[100] bg-blue-500 hover:bg-blue-600 text-white"
      >
        Test Button
      </Button>

      {/* Auth Button - Positioned in top right */}
      <div className="fixed top-4 right-4 z-[100]">
        <AuthButton />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-[1]">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
            SISO Agency
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-siso-text max-w-2xl mx-auto leading-relaxed">
          Your gateway to AI-powered tools, education, and networking—designed to help your agency thrive in the digital age.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: "🔧",
              title: "Core Tools",
              desc: "Access curated tools and platforms"
            },
            {
              icon: "📚",
              title: "Education Hub",
              desc: "Learn from industry experts"
            },
            {
              icon: "🌐",
              title: "Network",
              desc: "Connect with professionals"
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-6 rounded-lg bg-siso-bg-alt/50 border border-siso-border 
                hover:border-siso-border-hover transition-all duration-300"
            >
              <span className="text-3xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-siso-text/80">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 space-y-4 relative z-[100]">
          <p className="text-lg text-siso-text/90 mb-4">
            Get started by signing in with your Google account
          </p>
          <div className="inline-block">
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  );
};