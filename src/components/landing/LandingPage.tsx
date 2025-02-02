import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useEffect } from 'react';
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

  const handleSignInClick = () => {
    console.log('Sign in button clicked');
    navigate('/auth');
    toast({
      title: "Navigating to sign in",
      description: "Opening authentication page...",
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* Sign In Button - Positioned in top right */}
      <div className="fixed top-4 right-4 z-[100]">
        <button
          onClick={handleSignInClick}
          className="bg-white text-black hover:bg-gray-100 active:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
        >
          Sign In to Hub
        </button>
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
      </div>
    </div>
  );
};