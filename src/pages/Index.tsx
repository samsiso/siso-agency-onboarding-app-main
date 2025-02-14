
import { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { LoadingFallback } from '@/components/landing/sections/LoadingFallback';
import LandingPage from '@/components/landing/LandingPage';

export default function Index() {
  const { user, loading } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <div className="relative">
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage />
      </Suspense>
    </div>
  );
}
