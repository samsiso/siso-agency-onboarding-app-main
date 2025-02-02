import { Hero } from '@/components/Hero';
import { AuthButton } from '@/components/AuthButton';
import Footer from '@/components/Footer';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* [Analysis] Adding a key prop to force re-render and debug */}
        <Hero key="main-hero" />
        <AuthButton />
        <Footer />
      </div>
    </SidebarProvider>
  );
}