
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Instagram, Youtube, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-siso-bg border-t border-gray-800 pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
                alt="SISO Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                SISO
              </span>
            </div>
            <p className="text-sm text-siso-text-muted max-w-xs">
              Your one-stop AI knowledge source for agencies looking to scale with the latest technology
            </p>
          </div>

          {/* Newsletter signup column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-siso-text-bold">Subscribe to our newsletter</h3>
            <p className="text-sm text-siso-text-muted">Stay updated with our latest news and offerings</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-siso-bg-alt border-siso-border"
              />
              <Button 
                className="bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 text-white"
              >
                Subscribe
              </Button>
            </div>
          </div>

          {/* Links column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-siso-text-bold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/tools" className="text-siso-text-muted hover:text-siso-orange transition-colors">Tools</a></li>
              <li><a href="/education" className="text-siso-text-muted hover:text-siso-orange transition-colors">Education</a></li>
              <li><a href="/community" className="text-siso-text-muted hover:text-siso-orange transition-colors">Community</a></li>
              <li><a href="/blog" className="text-siso-text-muted hover:text-siso-orange transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-siso-text-bold">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-siso-text-muted">
                <Mail size={16} />
                <span>contact@siso-agency.com</span>
              </div>
              <div className="flex items-center gap-2 text-siso-text-muted">
                <MapPin size={16} />
                <span>123 Agency St, San Francisco, CA</span>
              </div>
            </div>
            {/* Social icons */}
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="text-siso-text-muted hover:text-siso-red transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-siso-text-muted hover:text-siso-red transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-siso-text-muted hover:text-siso-red transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="text-siso-text-muted hover:text-siso-red transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright and legal links */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-siso-text-muted">
            © {currentYear} SISO Agency. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/terms" className="text-sm text-siso-text-muted hover:text-siso-orange transition-colors">
              Terms
            </a>
            <a href="/privacy-policy" className="text-sm text-siso-text-muted hover:text-siso-orange transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
