import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TierSection } from './TierSection';
import { TestimonialSection } from './TestimonialSection';

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
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-orange-900/20 overflow-y-auto">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full filter blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-siso-orange/10 rounded-full filter blur-[100px] animate-float-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-siso-red/5 rounded-full filter blur-[120px]"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <img src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" alt="SISO" className="h-8 w-8" />
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="nav-link">Features</a>
                <a href="#tools" className="nav-link">Tools</a>
                <a href="#resources" className="nav-link">Resources</a>
                <a href="#education" className="nav-link">Education</a>
              </div>
            </div>
            <button
              onClick={handleSignInClick}
              className="bg-gradient-to-r from-siso-orange to-siso-red text-white px-6 py-2 rounded-lg font-medium
                transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
            >
              Sign In to Hub
            </button>
          </div>
        </div>
      </nav>

      {/* Content Container */}
      <div className="relative">
        {/* Hero Section */}
        <div className="relative pt-32 pb-16">
          <div className="text-center relative z-10">
            {/* Stats Bar */}
            <div className="flex justify-center gap-8 mb-12">
              <div className="text-gray-300 flex items-center gap-2">
                <span className="text-siso-orange">⭐️⭐️⭐️⭐️⭐️</span>
                Reviews from 200+ users
              </div>
              <div className="text-gray-300 flex items-center gap-2">
                <span className="text-siso-orange">🚀</span>
                10,000+ active members
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in">
                <span className="text-white">Transform Your Agency with </span>
                <span className="title-glow">AI-Powered</span>
                <br />
                <span className="text-white">Resources</span>
              </h1>

              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-400 animate-fade-in">
                Join our AI-powered resource hub and supercharge your agency's growth. 
                Access cutting-edge tools, education, and networking—all in one place.
              </p>

              <div className="flex justify-center gap-6 pt-8 animate-fade-in">
                <button
                  onClick={handleSignInClick}
                  className="px-8 py-3 bg-gradient-to-r from-siso-orange to-siso-red text-white rounded-lg font-medium
                    transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
                >
                  Get Started Now
                </button>
                <button className="px-8 py-3 bg-white/5 backdrop-blur-sm text-white rounded-lg font-medium
                  border border-white/10 transition-all duration-300 hover:bg-white/10">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
              className="p-6 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 transition-all duration-300
                hover:bg-white/5 group cursor-pointer"
            >
              <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </span>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Tier Section */}
        <TierSection />

        {/* Testimonials Section */}
        <TestimonialSection />

        {/* Final CTA Section */}
        <div className="text-center py-24">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-gray-400 mb-8">Join thousands of successful agencies already using our platform</p>
          <button
            onClick={handleSignInClick}
            className="px-8 py-3 bg-gradient-to-r from-siso-orange to-siso-red text-white rounded-lg font-medium
              transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};