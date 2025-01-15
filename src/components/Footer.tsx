import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6 text-gray-400">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
        <div className="text-center text-gray-500 mt-4">
          © {new Date().getFullYear()} Siso Resource Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;