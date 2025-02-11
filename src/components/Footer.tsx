
import { Mail, MapPin, Twitter, Linkedin } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-black to-siso-bg border-t border-siso-border">
      <div className="relative container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo Only - Larger Size */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/8fa1a06e-e80e-4869-8ef8-683326c20870.png"
              alt="Logo"
              className="w-16 h-16"
            />
          </div>

          {/* Description */}
          <p className="text-gray-400 max-w-md mx-auto">
            Elevate your productivity with our enterprise-grade AI automation suite.
          </p>

          {/* Legal Links Only */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
          </div>

          {/* Contact & Social */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span>siso@sisoinnovatorshub.io</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>London, UK</span>
            </div>
            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://twitter.com/sisoai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-siso-bg p-2 rounded-full hover:bg-siso-bg-alt transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-400" />
              </a>
              <a
                href="https://linkedin.com/company/sisoai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-siso-bg p-2 rounded-full hover:bg-siso-bg-alt transition-colors"
              >
                <Linkedin className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            ©{new Date().getFullYear()}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
