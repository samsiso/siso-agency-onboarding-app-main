import { Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/sisoai", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/sisoai", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/sisoai", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@sisoai", label: "YouTube" },
  ];

  return (
    <footer className="relative w-full bg-gradient-to-b from-black via-gray-900 to-orange-900/20 overflow-hidden">
      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{
          backgroundImage: `linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative container mx-auto px-4 py-16 flex flex-col items-center">
        {/* Logo */}
        <img 
          src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
          alt="SISO" 
          className="h-12 w-12 mb-8 animate-float"
        />

        {/* CTA Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to transform your business with AI?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with our experts today to drive your success with cutting-edge AI solutions tailored for your agency.
          </p>
          <Button 
            className="bg-gradient-to-r from-siso-orange to-siso-red hover:opacity-90 transform hover:scale-105 transition-all duration-300 text-white px-8 py-6 rounded-lg font-medium text-lg"
          >
            Start Free Trial
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 mb-12">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/50 p-3 rounded-full hover:bg-gray-800/50 transition-colors duration-300 group"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-gray-400 text-sm">
          © 2024 SISO Resource Hub. All rights reserved.
        </div>

        {/* Product Hunt Badge */}
        <a 
          href="https://www.producthunt.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 opacity-90 hover:opacity-100 transition-opacity duration-300"
        >
          <img 
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=undefined&theme=dark" 
            alt="SISO on Product Hunt" 
            className="h-10"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;