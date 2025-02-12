
import { lazy, Suspense } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { LoadingFallback } from '@/components/landing/sections/LoadingFallback';

// [Analysis] Load landing page component lazily for better initial load performance
const LandingPage = lazy(() => import(/* webpackChunkName: "landing" */ '@/components/landing/LandingPage'));

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
