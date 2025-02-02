import { Hero } from '@/components/Hero';
import { AuthButton } from '@/components/AuthButton';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col w-full relative">
      {/* [Analysis] Adding a key prop to force re-render and debug */}
      <Hero key="main-hero" />
      <AuthButton />
      <Footer />
    </div>
  );
}