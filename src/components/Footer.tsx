import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Facebook } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/images/siso-logo.svg"
                alt="SISO AGENCY"
                className="w-10 h-10 mr-3"
              />
              <h3 className="text-xl font-semibold">SISO AGENCY</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Transforming businesses with innovative digital solutions and strategic growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-200 dark:border-gray-800" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} SISO AGENCY. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mx-3">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mx-3">
              Privacy
            </Link>
            <Link to="/cookies" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mx-3">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
