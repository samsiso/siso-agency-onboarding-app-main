
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdminCheck();
  
  useEffect(() => {
    if (!isLoading) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        // For regular users, stay on /home as it's their dashboard
        return;
      }
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-siso-orange" />
      </div>
    );
  }

  // Return the actual home page content for regular users
  // For admins, they will be redirected before this renders
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>
      {/* Add your dashboard content here */}
    </div>
  );
}
