import React from 'react';
import { Hero } from '../components/Hero';
import { FeaturedSection } from '../components/FeaturedSection';
import { Sidebar } from '../components/Sidebar';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="flex min-h-screen w-full bg-siso-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-siso-bg overflow-x-hidden">
        <main className="flex-1 p-4 sm:p-8">
          <div className="container mx-auto max-w-7xl">
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