import { useState } from 'react';
import { ChevronDown, ChevronRight, Twitter, Linkedin, Instagram, Youtube, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarLogoProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const SidebarLogo = ({ collapsed, setCollapsed }: SidebarLogoProps) => {
  const [showAlternateMenu, setShowAlternateMenu] = useState(false);

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      url: 'https://www.linkedin.com/company/siso-agency/',
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      url: 'https://www.instagram.com/siso.agency/',
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      url: 'https://x.com/AIInnovatorshub',
    },
    {
      name: 'YouTube',
      icon: <Youtube className="w-5 h-5" />,
      url: 'https://www.youtube.com/@SISOAGENCY/',
    },
  ];

  const landingPages = [
    {
      name: 'Resources Hub',
      description: 'Explore tools, automations, and insights',
      url: '#',
    },
    {
      name: 'Affiliate Hub',
      description: 'Join our affiliate program',
      url: '#',
    },
    {
      name: 'YouTube Channel',
      description: 'Watch our latest content',
      url: 'https://www.youtube.com/@SISOAGENCY/',
    },
  ];

  const toggleMenu = () => {
    setShowAlternateMenu(!showAlternateMenu);
  };

  return (
    <div className="p-4 border-b border-siso-text/10 bg-gradient-to-r from-siso-bg to-siso-bg/95">
      {showAlternateMenu ? (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="hover:bg-siso-text/5"
            >
              <ArrowLeft className="w-5 h-5 text-siso-text" />
            </Button>
            <img 
              src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
              alt="Siso Logo" 
              className="w-8 h-8"
            />
          </div>

          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="text-sm text-siso-text">
              <p className="font-medium mb-2">👋 Hi, We're SISO AGENCY</p>
              <p className="text-siso-text/70">
                Stay tuned for more powerful automation tools and follow us to keep up with our latest innovations!
              </p>
            </div>

            {/* Social Media Links */}
            <div className="grid grid-cols-4 gap-2">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-siso-text/5 group"
                  asChild
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.name}
                  >
                    {link.icon}
                  </a>
                </Button>
              ))}
            </div>

            {/* Landing Pages */}
            <div className="space-y-2">
              {landingPages.map((page) => (
                <a
                  key={page.name}
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg hover:bg-siso-text/5 transition-colors group"
                >
                  <h3 className="text-sm font-medium text-siso-text group-hover:text-siso-text-bold">
                    {page.name}
                  </h3>
                  <p className="text-xs text-siso-text/70 mt-1">
                    {page.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={toggleMenu}
          >
            <img 
              src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
              alt="Siso Logo" 
              className="w-8 h-8"
            />
            {!collapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                SISO
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-siso-text/5 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="text-siso-text" />
            ) : (
              <ChevronDown className="text-siso-text" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};