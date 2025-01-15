import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedSection } from "@/components/FeaturedSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-siso-bg">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <FeaturedSection />
      </main>
    </div>
  );
};

export default Index;