
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Instagram, Youtube, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-siso-bg border-t border-gray-800 py-16">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        {/* Logo and description */}
        <div className="flex flex-col items-center space-y-4 mb-10">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
              alt="SISO Logo" 
              className="w-12 h-12"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
              SISO
            </span>
          </div>
          <p className="text-base text-siso-text-muted max-w-md">
            Your one-stop AI knowledge source for agencies looking to scale with the latest technology
          </p>
        </div>

        {/* Newsletter signup */}
        <div className="mb-10 w-full max-w-md space-y-4">
          <h3 className="text-xl font-semibold text-siso-text-bold">Stay updated with our latest AI innovations</h3>
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

        {/* Social media icons */}
        <div className="flex space-x-6 mb-8">
          <a href="#" aria-label="Twitter" className="text-siso-text-muted hover:text-siso-red transition-colors p-2">
            <Twitter size={24} />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-siso-text-muted hover:text-siso-red transition-colors p-2">
            <Linkedin size={24} />
          </a>
          <a href="#" aria-label="Instagram" className="text-siso-text-muted hover:text-siso-red transition-colors p-2">
            <Instagram size={24} />
          </a>
          <a href="#" aria-label="YouTube" className="text-siso-text-muted hover:text-siso-red transition-colors p-2">
            <Youtube size={24} />
          </a>
        </div>

        {/* Contact information */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2 text-siso-text-muted">
            <Mail size={18} />
            <span>siso@sisoinnovatorshub.io</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-siso-text-muted">
            <MapPin size={18} />
            <span>London, UK</span>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex space-x-6 mb-6">
          <a href="/terms" className="text-sm text-siso-text-muted hover:text-siso-orange transition-colors">
            Terms
          </a>
          <a href="/privacy-policy" className="text-sm text-siso-text-muted hover:text-siso-orange transition-colors">
            Privacy
          </a>
        </div>

        {/* Copyright */}
        <div className="text-sm text-siso-text-muted">
          ©{currentYear}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
