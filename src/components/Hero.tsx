import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useSidebar } from './ui/sidebar';
import { Sidebar } from './Sidebar';

export const Hero = () => {
  const navigate = useNavigate();
  const { setOpen } = useSidebar();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // [Analysis] Adding debug logging to track component lifecycle
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

  // [Analysis] Adding debug check for render
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
    <div className="relative min-h-screen w-full">
      <Sidebar />
      <div className="absolute inset-0 bg-gradient-to-br from-siso-bg via-siso-bg/95 to-siso-bg/90" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center space-y-8 sm:space-y-12">
          {/* Welcome Message */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-siso-text-bold leading-tight">
              Welcome to{' '}
              <span className="relative inline-block mt-4">
                <span className="relative p-3 sm:p-4 rounded-lg bg-black/30 backdrop-blur-sm border border-siso-text/10">
                  <span className="relative bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
                    SISO Agency Resources
                  </span>
                </span>
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-siso-text max-w-3xl mx-auto leading-relaxed">
              Your gateway to tools, education, networking, and AI-powered innovation—crafted to help your agency thrive.
            </p>
          </div>

          {/* Resource Guide */}
          <div className="mt-20">
            <div className="relative p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-siso-text/10 
              hover:border-siso-text/20 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-siso-orange/5 to-siso-red/5" />
              
              <h2 className="text-3xl font-bold text-siso-text-bold mb-8 bg-gradient-to-r from-siso-orange to-siso-red 
                text-transparent bg-clip-text">
                Resource Hub Guide
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {resourceGuideItems.map((item, i) => (
                  <div
                    key={i}
                    className="group p-4 rounded-lg bg-siso-bg/50 hover:bg-siso-bg/70 
                      border border-siso-text/10 hover:border-siso-text/20 transition-all duration-300
                      cursor-pointer"
                    onClick={() => handleResourceClick(item.path)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-siso-text-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-siso-text/90 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-siso-text/80 text-sm">
                  Sign in to access all features and start exploring the SISO Resource Hub
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};