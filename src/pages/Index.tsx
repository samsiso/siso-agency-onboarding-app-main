
import { Suspense } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { LoadingFallback } from '@/components/landing/sections/LoadingFallback';
import LandingPage from '@/components/landing/LandingPage';

export default function Index() {
  const { user, loading } = useAuthSession();

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
