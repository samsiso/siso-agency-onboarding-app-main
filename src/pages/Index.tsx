import React from 'react';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-[#121212]">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <div className="flex-1">
          <Hero />
          <FeaturedSection />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Index;