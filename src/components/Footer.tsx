import { Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { RainbowButton } from "./ui/rainbow-button";
import { SplineScene } from "./ui/splite";
import { Card } from "./ui/card";
import { Spotlight } from "./ui/spotlight";

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

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - CTA and Social Links */}
          <div className="text-center lg:text-left">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display tracking-tight">
              Ready to transform your business with AI?
            </h3>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto lg:mx-0 font-light">
              Connect with our experts today and discover how our innovative solutions can drive your success.
            </p>
            <RainbowButton 
              className="text-lg px-10 py-6 font-semibold mb-8"
              onClick={() => window.location.href = '/auth'}
            >
              Start Free Trial
            </RainbowButton>

            {/* Social Links */}
            <div className="flex gap-6 justify-center lg:justify-start mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0A0A0A] p-3 rounded-full hover:bg-gray-900 transition-all duration-300 group
                    hover:shadow-lg hover:shadow-orange-500/10"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Side - 3D Scene */}
          <Card className="w-full h-[400px] bg-black/[0.96] relative overflow-hidden">
            <Spotlight
              className="-top-40 left-0 md:left-60 md:-top-20"
              size={400}
            />
            <div className="relative h-full">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </Card>
        </div>

        {/* Divider */}
        <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-12 mx-auto" />

        {/* Copyright and Product Hunt Badge */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm font-light mb-4 md:mb-0">
            ©SISO 2024, All rights reserved.
          </div>
          
          <a 
            href="https://www.producthunt.com/posts/siso-ai-resource-hub?utm_source=badge-featured"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-90 hover:opacity-100 transition-opacity duration-300"
          >
            <img 
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=123456&theme=dark" 
              alt="SISO on Product Hunt" 
              className="h-12"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;