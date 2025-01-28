import { Link } from 'react-router-dom';
import { AuthButton } from './AuthButton';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black py-4 z-50 border-t border-siso-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          {/* Auth Button */}
          <div className="w-full flex justify-center">
            <AuthButton />
          </div>
          
          {/* Links */}
          <div className="flex justify-center space-x-6 text-gray-400 text-sm">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} Siso Resource Hub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;