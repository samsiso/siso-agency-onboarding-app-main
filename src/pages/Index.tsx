import { Hero } from '@/components/Hero';
import { AuthButton } from '@/components/AuthButton';
import Footer from '@/components/Footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LandingPage } from '@/components/landing/LandingPage';
import { useAuthSession } from '@/hooks/useAuthSession';

export default function Index() {
  const { user } = useAuthSession();

  // [Analysis] Show landing page for non-authenticated users
  if (!user) {
    return <LandingPage />;
  }

  // [Analysis] Show main app for authenticated users with proper event handling
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <SidebarProvider>
        <div className="relative min-h-screen flex flex-col">
          <div className="flex-grow relative z-10">
            <Hero key="main-hero" />
          </div>
          <div className="relative z-20">
            <AuthButton />
          </div>
          <div className="relative z-10">
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}