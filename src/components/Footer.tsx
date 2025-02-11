
import { Twitter, Linkedin, Instagram, Youtube, Mail, Phone, Clock, MapPin, ExternalLink, Book, Database, Rocket, Users, MessageCircle, Shield, Award } from "lucide-react";
import { RainbowButton } from "./ui/rainbow-button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  const quickLinks = [
    { label: "Features", href: "#features" },
    { label: "Why Choose Us", href: "#why-choose" },
    { label: "Getting Started", href: "#getting-started" },
    { label: "Pricing", href: "#pricing" },
  ];

  const resources = [
    { label: "Documentation", href: "/docs", icon: Book },
    { label: "API Reference", href: "/api", icon: Database },
    { label: "Getting Started Guide", href: "/guide", icon: Rocket },
  ];

  const community = [
    { label: "Discord Community", href: "https://discord.gg/sisoai", icon: MessageCircle },
    { label: "Success Stories", href: "/success-stories", icon: Users },
    { label: "Partner Program", href: "/partners", icon: Award },
  ];

  const contact = [
    { label: "support@siso.ai", value: "support@siso.ai", icon: Mail },
    { label: "Book a Demo", value: "Schedule time with our team", icon: Clock },
    { label: "London, UK", value: "Our HQ", icon: MapPin },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-black to-siso-bg border-t border-siso-border">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] 
          bg-gradient-radial from-siso-orange/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] 
          bg-gradient-radial from-siso-red/20 via-transparent to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company & About */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Transform Your Workflow</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enterprise-grade AI automation suite trusted by 500+ agencies worldwide. Start your journey to enhanced productivity today.
            </p>
            <RainbowButton 
              onClick={handleGetStarted}
              className="w-full justify-center text-base"
            >
              Get Started Free
            </RainbowButton>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li 
                  key={link.label}
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <a href={link.href} className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <motion.li 
                  key={resource.label}
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <a href={resource.href} className="flex items-center gap-2">
                    <resource.icon className="w-4 h-4" />
                    {resource.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {contact.map((item) => (
                <li key={item.label} className="text-gray-400 flex items-start gap-3">
                  <item.icon className="w-4 h-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white">{item.label}</p>
                    <p className="text-sm">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Elements */}
        <div className="border-t border-siso-border pt-8 pb-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Shield className="w-4 h-4" />
              <span>Enterprise-grade security</span>
              <span className="mx-2">•</span>
              <Award className="w-4 h-4" />
              <span>ISO 27001 Certified</span>
            </div>
            {/* Social Links */}
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
              <a
                href="https://instagram.com/sisoai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-siso-bg p-2 rounded-full hover:bg-siso-bg-alt transition-colors"
              >
                <Instagram className="w-5 h-5 text-gray-400" />
              </a>
              <a
                href="https://youtube.com/@sisoai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-siso-bg p-2 rounded-full hover:bg-siso-bg-alt transition-colors"
              >
                <Youtube className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-siso-border mt-4 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              ©SISO {new Date().getFullYear()}. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="text-gray-600">•</span>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <span className="text-gray-600">•</span>
              <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
