import { Sidebar } from "@/components/Sidebar";
import { Hero } from "@/components/Hero";
import { FeaturedSection } from "@/components/FeaturedSection";

const Index = () => {
  return (
    <div className="flex h-screen bg-siso-bg">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-4">
          <Hero />
          <FeaturedSection />
        </div>
      </main>
    </div>
  );
};

export default Index;