
import { Mail, MapPin, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate subscription - replace with actual API call
    setTimeout(() => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-black to-siso-bg border-t border-siso-border">
      <div className="relative container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-10">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/8fa1a06e-e80e-4869-8ef8-683326c20870.png"
              alt="Logo"
              className="w-20 h-20"
            />
          </div>

          {/* Description */}
          <p className="text-gray-400 max-w-md mx-auto">
            Elevate your productivity with our enterprise-grade AI automation suite.
          </p>

          {/* Newsletter Section */}
          <div className="w-full max-w-md space-y-4">
            <h3 className="text-lg font-medium text-white">
              Stay updated with our latest AI innovations
            </h3>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-siso-bg border-siso-border focus:border-siso-red"
                required
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            {[
              { icon: Twitter, href: "https://twitter.com/sisoai" },
              { icon: Linkedin, href: "https://linkedin.com/company/sisoai" },
              { icon: Instagram, href: "https://instagram.com/sisoai" },
              { icon: Youtube, href: "https://youtube.com/@sisoai" }
            ].map(({ icon: Icon, href }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-siso-bg p-3 rounded-full hover:bg-siso-bg-alt transition-all duration-300 hover:scale-110"
              >
                <Icon className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span>siso@sisoinnovatorshub.io</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>London, UK</span>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-sm pt-4 border-t border-siso-border/30 w-full">
            ©{new Date().getFullYear()}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
