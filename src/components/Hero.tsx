import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RainbowButton } from './ui/rainbow-button';
import { useSidebar } from './ui/sidebar';
import { Sidebar } from './Sidebar';

// [Analysis] Optimizing Hero component for faster initial render
// [Plan] Monitor performance metrics and adjust loading strategy if needed
const Hero = () => {
  const navigate = useNavigate();
  const { setOpen } = useSidebar();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // [Analysis] Using requestIdleCallback for non-critical initialization
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    idleCallback(() => {
      console.log('Hero component mounted');
      setIsLoaded(true);
    });

    return () => {
      console.log('Hero component unmounted');
    };
  }, []);

  const handleResourceClick = (path: string) => {
    console.log('Resource clicked:', path);
    setOpen(true);
    navigate(path);
  };

  const handleGetStarted = () => {
    console.log('Get Started clicked - attempting navigation to /auth');
    try {
      navigate('/auth');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  console.log('Hero rendering, isLoaded:', isLoaded);

  const resourceGuideItems = [
    {
      icon: "🔧",
      title: "Core Tools",
      desc: "Access daily tools with guides.",
      path: "/tools"
    },
    {
      icon: "📚",
      title: "Education",
      desc: "Learn from top creators.",
      path: "/education"
    },
    {
      icon: "🌐",
      title: "Network",
      desc: "Connect with experts.",
      path: "/networking"
    }
  ];

  return (
    <div className="flex-1 relative">
      <Sidebar />
      {/* Background layer with optimized rendering */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-siso-bg via-siso-bg/95 to-siso-bg/90" />
      </div>
      
      {/* Content layer with explicit z-index and pointer-events-auto */}
      <div className="relative z-30 max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
        <div className="text-center">
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-siso-text-bold leading-tight max-w-[85vw] mx-auto">
              <span className="text-siso-text-bold">Welcome to</span>
              <span className="relative block mt-1 sm:mt-2">
                <span className="relative inline-block p-1.5 sm:p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-siso-text/10 max-w-[80vw] mx-auto">
                  <span className="relative bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text break-words hyphens-auto">
                    SISO Resources
                  </span>
                </span>
              </span>
            </h1>
            <div className="relative h-[120px] sm:h-[140px] md:h-[160px] flex w-full justify-center overflow-hidden text-center">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm sm:text-base md:text-lg text-siso-text max-w-[80vw] mx-auto leading-relaxed px-2">
                  Tools, education & networking for agency growth.
                </span>
              </div>
            </div>
            
            <div className="relative mt-2 sm:mt-3 md:mt-4">
              <RainbowButton
                onClick={handleGetStarted}
                className="relative z-30 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 font-semibold pointer-events-auto"
              >
                Start Onboarding
              </RainbowButton>
            </div>
          </div>

          <div className="relative z-30 mt-3 sm:mt-4 md:mt-6">
            <div className="relative p-2 sm:p-3 rounded-xl bg-black/30 backdrop-blur-sm border border-siso-text/10 
              hover:border-siso-text/20 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-siso-orange/5 to-siso-red/5 pointer-events-none" />
              
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-siso-text-bold mb-2 sm:mb-3 bg-gradient-to-r from-siso-orange to-siso-red 
                text-transparent bg-clip-text">
                Resource Hub
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {resourceGuideItems.map((item, i) => (
                  <div
                    key={i}
                    className="group relative z-30 p-1.5 sm:p-2 rounded-lg bg-siso-bg/50 hover:bg-siso-bg/70 
                      border border-siso-text/10 hover:border-siso-text/20 transition-all duration-300
                      cursor-pointer pointer-events-auto"
                    onClick={() => handleResourceClick(item.path)}
                  >
                    <div className="flex items-start gap-1.5">
                      <span className="text-sm sm:text-base group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-siso-text-bold mb-0.5">{item.title}</h3>
                        <p className="text-xs text-siso-text/90 leading-relaxed">{item.desc}</p>
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

export default Hero;