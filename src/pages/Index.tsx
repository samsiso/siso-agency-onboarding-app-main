
import { Suspense } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { LoadingFallback } from '@/components/landing/sections/LoadingFallback';

export default function Index() {
  return (
    <div className="relative">
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage />
      </Suspense>
    </div>
  );
}
