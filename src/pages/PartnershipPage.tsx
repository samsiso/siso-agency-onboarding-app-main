import { memo, useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AgencyPartnershipHeader } from '@/components/ui/agency-partnership-header';
import { Stats } from '@/components/ui/stats-section-with-text';
import PartnershipStats from '@/components/partnership/PartnershipStats';
import CommissionCalculator from '@/components/partnership/CommissionCalculator';
import { PartnershipNavigation } from '@/components/partnership/PartnershipNavigation';
import { PartnershipPortfolio } from '@/components/partnership/PartnershipPortfolio';
import { PartnershipBenefits } from '@/components/partnership/PartnershipBenefits';
import { PartnershipProcess } from '@/components/partnership/PartnershipProcess';
import { PartnershipClientTypes } from '@/components/partnership/PartnershipClientTypes';
import { PartnershipTestimonials } from '@/components/partnership/PartnershipTestimonials';
import { PartnershipFAQ } from '@/components/partnership/PartnershipFAQ';
import Footer from '@/components/Footer';

const PartnershipPage = memo(() => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');

  // Scroll progress tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleApplyNow = () => {
    // Redirect directly to auth with partner context
    navigate('/auth', { 
      state: { 
        userType: 'partner',
        returnTo: '/dashboard',
        source: 'partnership-landing-apply-now'
      }
    });
  };

  // Navigation sections for the sticky nav
  const navigationSections = [
    { id: 'hero', label: 'Get Started' },
    { id: 'stats', label: 'Program Stats' },
    { id: 'portfolio', label: 'Our Work' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'process', label: 'How It Works' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'clients', label: 'Client Types' },
    { id: 'testimonials', label: 'Success Stories' },
    { id: 'faq', label: 'FAQ' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationSections.map(section => section.id);
      const currentSection = sections.find(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, navigationSections]);

  return (
    <div className="min-h-screen w-full bg-black overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-orange-500 transform-origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation Component */}
      <PartnershipNavigation
        navigationSections={navigationSections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        onApplyNow={handleApplyNow}
      />

      {/* SISO Swirly Animation Background - Matching Main Landing Page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] 
          bg-siso-red/15 rounded-full filter blur-[80px] md:blur-[120px] 
          animate-float-slow transform-gpu will-change-transform"
        />
        <div className="absolute bottom-1/4 -right-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] 
          bg-siso-orange/15 rounded-full filter blur-[80px] md:blur-[120px] 
          animate-float-slower transform-gpu will-change-transform"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[350px] md:w-[1000px] h-[350px] md:h-[1000px] 
          bg-siso-red/8 rounded-full filter blur-[100px] md:blur-[150px] transform-gpu will-change-transform"
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section id="hero">
          <AgencyPartnershipHeader />
        </section>

        {/* SISO Platform Stats */}
        <section id="stats">
          <Stats />
        </section>

        {/* Partnership Statistics */}
        <PartnershipStats />

        {/* Portfolio Section */}
        <PartnershipPortfolio onApplyNow={handleApplyNow} />

        {/* Benefits Section */}
        <PartnershipBenefits />

        {/* Process Section */}
        <PartnershipProcess />

        {/* Commission Calculator */}
        <section id="calculator" className="py-20">
          <CommissionCalculator />
        </section>

        {/* Client Types Section */}
        <PartnershipClientTypes />

        {/* Testimonials Section */}
        <PartnershipTestimonials />

        {/* FAQ Section */}
        <PartnershipFAQ onApplyNow={handleApplyNow} />

        {/* Footer Section */}
        <Footer />

        {/* Floating Action Styles */}
        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes float-slower {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(-3deg); }
          }
          .animate-float-slow {
            animation: float-slow 8s ease-in-out infinite;
          }
          .animate-float-slower {
            animation: float-slower 12s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
});

export default PartnershipPage; 