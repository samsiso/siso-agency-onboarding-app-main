import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RainbowButton } from './ui/rainbow-button';
import { useSidebar } from './ui/sidebar';
import { Sidebar } from './Sidebar';

export const Hero = () => {
  const navigate = useNavigate();
  const { setOpen } = useSidebar();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('Hero component mounted');
    setIsLoaded(true);
    return () => {
      console.log('Hero component unmounted');
    };
  }, []);

  const handleResourceClick = (path: string) => {
    setOpen(true);
    navigate(path);
  };

  const handleGetStarted = () => {
    navigate('/auth');
  };

  console.log('Hero rendering, isLoaded:', isLoaded);

  const resourceGuideItems = [
    {
      icon: "🔧",
      title: "Core Tools & Platforms",
      desc: "Access our curated list of daily tools, complete with how-to videos and integration guides.",
      path: "/tools"
    },
    {
      icon: "📚",
      title: "SISO Education Hub",
      desc: "Learn from top educators and creators, with access to valuable templates and workflows.",
      path: "/education"
    },
    {
      icon: "🌐",
      title: "SISO Networking",
      desc: "Connect with professional communities and experts to accelerate your growth.",
      path: "/networking"
    }
  ];

  return (
    <div className="flex-1 relative">
      <Sidebar />
      <div className="absolute inset-0 bg-gradient-to-br from-siso-bg via-siso-bg/95 to-siso-bg/90" />
      
      <div className="relative max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8">
        <div className="text-center">
          {/* Welcome Message - Further optimized for mobile */}
          <div className="space-y-2 sm:space-y-4 md:space-y-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-siso-text-bold leading-tight max-w-[90vw] mx-auto">
              Welcome to{' '}
              <span className="relative block mt-2 sm:mt-3 md:mt-4">
                <span className="relative inline-block p-2 sm:p-3 rounded-lg bg-black/30 backdrop-blur-sm border border-siso-text/10 max-w-[85vw] mx-auto">
                  <span className="relative bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text break-words hyphens-auto">
                    SISO Agency Resources
                  </span>
                </span>
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-siso-text max-w-[85vw] mx-auto leading-relaxed px-2">
              Your gateway to tools, education, networking, and AI-powered innovation—crafted to help your agency thrive.
            </p>
            
            {/* CTA Button */}
            <div className="mt-3 sm:mt-4 md:mt-6">
              <RainbowButton
                onClick={handleGetStarted}
                className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 font-semibold"
              >
                Get Started
              </RainbowButton>
            </div>
          </div>

          {/* Resource Guide */}
          <div className="mt-4 sm:mt-6 md:mt-8">
            <div className="relative p-2 sm:p-3 md:p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-siso-text/10 
              hover:border-siso-text/20 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-siso-orange/5 to-siso-red/5" />
              
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-siso-text-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-siso-orange to-siso-red 
                text-transparent bg-clip-text">
                Resource Hub Guide
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {resourceGuideItems.map((item, i) => (
                  <div
                    key={i}
                    className="group p-2 sm:p-3 rounded-lg bg-siso-bg/50 hover:bg-siso-bg/70 
                      border border-siso-text/10 hover:border-siso-text/20 transition-all duration-300
                      cursor-pointer"
                    onClick={() => handleResourceClick(item.path)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base sm:text-lg md:text-xl group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <div>
                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-siso-text-bold mb-1">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-siso-text/90 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};