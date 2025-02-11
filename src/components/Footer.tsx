
import { Twitter, Linkedin, Mail, MapPin } from "lucide-react";
import { RainbowButton } from "./ui/rainbow-button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  const importantLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-black to-siso-bg border-t border-siso-border">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] 
          bg-gradient-radial from-siso-orange/20 via-transparent to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company & Logo */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/8fa1a06e-e80e-4869-8ef8-683326c20870.png"
                alt="SISO AI Logo"
                className="w-12 h-12"
              />
              <h3 className="text-xl font-bold text-white">SISO AI</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enterprise-grade AI automation suite for enhanced productivity.
            </p>
            <RainbowButton 
              onClick={handleGetStarted}
              className="w-full justify-center text-base"
            >
              Get Started Free
            </RainbowButton>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Important Links</h4>
            <ul className="space-y-3">
              {importantLinks.map((link) => (
                <motion.li 
                  key={link.label}
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <a href={link.href}>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <ul className="space-y-3">
              <li className="text-gray-400 flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">support@siso.ai</p>
                </div>
              </li>
              <li className="text-gray-400 flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">London, UK</p>
                </div>
              </li>
              {/* Social Links */}
              <li className="pt-2">
                <div className="flex gap-4">
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
              </li>
            </ul>
          </div>
        </div>

        {/* Simple Bottom Bar */}
        <div className="border-t border-siso-border pt-6">
          <div className="text-center text-gray-400 text-sm">
            ©SISO {new Date().getFullYear()}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
