
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { MasonryDashboard } from '@/components/dashboard/MasonryDashboard';
import { useAdminCheck } from '@/hooks/useAdminCheck';

export default function Home() {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdminCheck();
  
  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, isLoading, navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <MasonryDashboard />
      </div>
    </MainLayout>
  );
}
