import { useState } from 'react';
import { ChevronDown, ChevronRight, Link, Users, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarLogoProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogoClick: () => void;
}

export const SidebarLogo = ({ collapsed, setCollapsed, onLogoClick }: SidebarLogoProps) => {
  const [showAlternateMenu, setShowAlternateMenu] = useState(false);

  const businessLinks = [
    {
      name: 'SISO LinkedIn Sales Team',
      description: 'Automate and earn from LinkedIn B2B deal closing',
      icon: <Link className="w-5 h-5" />,
      url: 'https://sisosaas.framer.website/',
    },
    {
      name: 'SISO Sales Partners',
      description: 'Join our partner program and earn from deal flow',
      icon: <Users className="w-5 h-5" />,
      url: 'https://siso-sales-team.framer.website/',
    },
    {
      name: 'SISO Apparel',
      description: 'Exclusive clothing brand for business leaders',
      icon: <ShoppingBag className="w-5 h-5" />,
      url: 'https://sisoapparel.framer.website/',
    },
  ];

  const toggleMenu = () => {
    setShowAlternateMenu(!showAlternateMenu);
    onLogoClick();
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
            <div className="text-sm text-siso-text">
              <p className="font-medium mb-2">👋 Welcome to SISO AGENCY</p>
              <p className="text-siso-text/70">
                Discover our suite of powerful tools and exclusive offerings for business growth
              </p>
            </div>

            <div className="space-y-2">
              {businessLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r from-siso-red/10 to-siso-orange/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-siso-red/10 to-siso-orange/10 group-hover:from-siso-red/20 group-hover:to-siso-orange/20 transition-colors">
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-siso-text group-hover:text-siso-text-bold">
                      {link.name}
                    </h3>
                    <p className="text-xs text-siso-text/70 mt-1">
                      {link.description}
                    </p>
                  </div>
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