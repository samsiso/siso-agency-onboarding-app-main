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

  // [Analysis] Show main app for authenticated users
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Hero key="main-hero" />
        <AuthButton />
        <Footer />
      </div>
    </SidebarProvider>
  );
}