import React from 'react';
import { Hero } from '../components/Hero';
import { FeaturedSection } from '../components/FeaturedSection';
import { Sidebar } from '../components/Sidebar';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <main className="flex-1">
          <div className="container mx-auto">
            <Hero />
            <FeaturedSection />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;