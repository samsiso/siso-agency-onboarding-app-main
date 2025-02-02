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
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-orange-900/20">
      {/* Sign In Button - Positioned in top right */}
      <div className="fixed top-4 right-4 z-[100]">
        <button
          onClick={handleSignInClick}
          className="bg-white text-black hover:bg-gray-100 active:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
        >
          Sign In to Hub
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8 relative z-10">
          {/* Stats Bar */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-siso-orange">⭐️⭐️⭐️⭐️⭐️</span>{' '}
              <span className="text-gray-300">Reviews from 200+ users</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-siso-orange">🚀</span>{' '}
              <span className="text-gray-300">10,000+ active members</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-white">Transform Your Agency with </span>
            <span className="bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
              AI-Powered
            </span>
            <br />
            <span className="text-white">Resources</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            Join our AI-powered resource hub and supercharge your agency's growth. 
            Access cutting-edge tools, education, and networking—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-6 pt-8">
            <button
              onClick={handleSignInClick}
              className="bg-gradient-to-r from-siso-orange to-siso-red text-white px-8 py-4 rounded-lg font-medium text-lg
                hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              Get Started Now
            </button>
            <button
              className="border border-gray-600 text-white px-8 py-4 rounded-lg font-medium text-lg
                hover:bg-white/5 transition-all duration-200"
            >
              Watch Demo
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            {[
              {
                icon: "🔧",
                title: "AI Tools & Resources",
                desc: "Access our curated collection of AI-powered tools and platforms"
              },
              {
                icon: "📚",
                title: "Expert Education",
                desc: "Learn from industry leaders and stay ahead of the curve"
              },
              {
                icon: "🌐",
                title: "Global Network",
                desc: "Connect with professionals and grow your business network"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-gray-800
                  hover:border-siso-orange/50 transition-all duration-300"
              >
                <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </span>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Background Gradient Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-siso-orange/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-siso-red/20 rounded-full filter blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};