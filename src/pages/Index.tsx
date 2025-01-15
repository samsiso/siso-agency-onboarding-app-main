import { Hero } from '@/components/Hero';
import { Sidebar } from '@/components/ui/sidebar';

const Index = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-siso-bg">
        <Hero />
      </main>
    </div>
  );
};

export default Index;