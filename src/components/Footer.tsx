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
    <footer className="relative w-full overflow-hidden">
      {/* Circular Gradient Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-[800px] h-[800px] left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2
            bg-gradient-radial from-orange-500/30 via-orange-900/20 to-transparent"
        />
      </div>

      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative container mx-auto px-4 py-20 flex flex-col items-center">
        {/* Logo */}
        <img 
          src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
          alt="SISO" 
          className="h-16 w-16 mb-12 animate-float"
        />

        {/* CTA Section */}
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display tracking-tight">
            Ready to transform your business with AI?
          </h3>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto font-light">
            Connect with our experts today and discover how our innovative solutions can drive your success.
          </p>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 transform hover:scale-105 
              transition-all duration-300 text-white px-8 py-6 rounded-lg font-medium text-lg group shadow-lg shadow-orange-500/20"
          >
            Start Free Trial
            <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">
              →
            </span>
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex gap-8 mb-16">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0A0A0A] p-4 rounded-full hover:bg-gray-900 transition-all duration-300 group
                hover:shadow-lg hover:shadow-orange-500/10"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

        {/* Copyright */}
        <div className="text-gray-500 text-sm mb-16 font-light">
          ©SISO 2024, All rights reserved.
        </div>

        {/* Product Hunt Badge */}
        <a 
          href="https://www.producthunt.com/posts/siso-ai-resource-hub?utm_source=badge-featured"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-8 right-8 opacity-90 hover:opacity-100 transition-opacity duration-300"
        >
          <img 
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=123456&theme=dark" 
            alt="SISO on Product Hunt" 
            className="h-12"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;