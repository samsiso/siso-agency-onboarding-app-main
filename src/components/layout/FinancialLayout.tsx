import { ReactNode, useEffect } from 'react';
import { AppLayout } from './AppLayout';
import { Link, useLocation } from 'react-router-dom';

interface FinancialLayoutProps {
  children: ReactNode;
  title?: string;
}

export function FinancialLayout({ children, title = "Financial & Account" }: FinancialLayoutProps) {
  const location = useLocation();
  
  // Log when the component mounts
  useEffect(() => {
    console.log("FinancialLayout mounted", { path: location.pathname });
  }, [location.pathname]);
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <Link 
                to="/financial/payments" 
                className={`text-sm transition-colors ${isActive('/financial/payments') ? 'text-siso-orange font-medium' : 'text-siso-text hover:text-siso-text-bold'}`}
              >
                Payments & Billing
              </Link>
              <span className="text-siso-text/30">•</span>
              <Link 
                to="/economy/leaderboards" 
                className={`text-sm transition-colors ${isActive('/economy/leaderboards') ? 'text-siso-orange font-medium' : 'text-siso-text hover:text-siso-text-bold'}`}
              >
                Leaderboards
              </Link>
              <span className="text-siso-text/30">•</span>
              <Link 
                to="/profile" 
                className={`text-sm transition-colors ${isActive('/profile') ? 'text-siso-orange font-medium' : 'text-siso-text hover:text-siso-text-bold'}`}
              >
                Profile & Settings
              </Link>
            </div>
          </div>
          {children}
        </div>
      </div>
    </AppLayout>
  );
}
