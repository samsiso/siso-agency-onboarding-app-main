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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <img src="/logo.png" alt="SISO" className="h-8 w-8" />
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#tools" className="text-gray-300 hover:text-white transition-colors">Tools</a>
                <a href="#resources" className="text-gray-300 hover:text-white transition-colors">Resources</a>
                <a href="#education" className="text-gray-300 hover:text-white transition-colors">Education</a>
              </div>
            </div>
            <button
              onClick={handleSignInClick}
              className="bg-white text-black hover:bg-gray-100 active:bg-gray-200 px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              Sign In to Hub
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
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

          {/* Testimonials Section */}
          <div className="mt-32">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Members Say</h2>
            <p className="text-gray-400 mb-12">Real stories from businesses that have transformed with our resources</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah K.",
                  role: "Digital Marketing Director",
                  company: "Growth Co",
                  text: "The AI tools have revolutionized how we approach client campaigns. Our efficiency has increased by 300%."
                },
                {
                  name: "Michael R.",
                  role: "Agency Owner",
                  company: "Digital Spark",
                  text: "SISO's resource hub has been a game-changer. The ROI from implementing these tools has been incredible."
                },
                {
                  name: "Lisa M.",
                  role: "Operations Manager",
                  company: "Tech Solutions",
                  text: "The educational resources and community support have helped us scale our agency beyond expectations."
                }
              ].map((testimonial, i) => (
                <div key={i} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-gray-800">
                  <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-siso-orange to-siso-red" />
                    <div>
                      <h4 className="text-white font-medium">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      <p className="text-gray-400 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="mt-32 mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
            <p className="text-gray-400 mb-8">Join thousands of successful agencies already using our platform</p>
            <button
              onClick={handleSignInClick}
              className="bg-gradient-to-r from-siso-orange to-siso-red text-white px-12 py-4 rounded-lg font-medium text-lg
                hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              Get Started Now
            </button>
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