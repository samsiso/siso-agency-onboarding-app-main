import { memo, useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useInView, useMotionValue, useTransform } from 'framer-motion';
import { 
  ArrowRight, Users, DollarSign, Shield, Zap, Calculator, CheckCircle, 
  Search, Code, Phone, Mail, ChevronDown, ChevronUp, Star, Award,
  Building, ShoppingCart, Heart, GraduationCap, Stethoscope, Utensils,
  Menu, X, ExternalLink, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import PartnershipStats from '@/components/partnership/PartnershipStats';
import CommissionCalculator from '@/components/partnership/CommissionCalculator';

const PartnershipPage = memo(() => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll progress tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleApplyNow = () => {
    // Redirect directly to auth with partner context instead of scrolling to form
    navigate('/auth', { 
      state: { 
        userType: 'partner',
        returnTo: '/dashboard',
        source: 'partnership-landing-apply-now'
      }
    });
  };

  const handleLearnMore = () => {
    const element = document.getElementById('benefits');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('benefits');
    }
  };



  // Navigation sections
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
      setIsMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  const processSteps = [
    {
      icon: Search,
      title: "Identify Potential Clients",
      description: "Use your network to find businesses needing web solutions",
      highlight: "Find & Connect"
    },
    {
      icon: CheckCircle,
      title: "Confirm Interest",
      description: "Ensure business is serious about getting a web app or website",
      highlight: "Qualify & Confirm"
    },
    {
      icon: Code,
      title: "SISO Creates MVP",
      description: "We build a free MVP and demo it to your referred client",
      highlight: "We Build & Demo"
    },
    {
      icon: DollarSign,
      title: "Earn Commission",
      description: "Receive 20% commission once client makes final payment",
      highlight: "Get Paid"
    }
  ];

  const valueProps = [
    {
      icon: DollarSign,
      title: "High Commissions",
      description: "Earn 20% on every successful project",
      stat: "Up to £498 per deal"
    },
    {
      icon: Shield,
      title: "Zero Client Risk",
      description: "We build MVP first, payment only after approval",
      stat: "100% risk-free"
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description: "MVPs delivered in 48-72 hours",
      stat: "48hr delivery"
    },
    {
      icon: Users,
      title: "Full Support",
      description: "We handle all technical aspects and client communication",
      stat: "Complete support"
    }
  ];

  const clientTypes = [
    {
      icon: Utensils,
      title: "Restaurants & Cafes",
      description: "Online ordering, booking systems, menu management",
      priceRange: "£499 - £1,499",
      commission: "£99 - £299"
    },
    {
      icon: Building,
      title: "Professional Services",
      description: "Portfolio sites, client portals, appointment booking",
      priceRange: "£299 - £999",
      commission: "£59 - £199"
    },
    {
      icon: ShoppingCart,
      title: "E-commerce",
      description: "Online stores, product catalogs, payment systems",
      priceRange: "£799 - £2,490",
      commission: "£159 - £498"
    },
    {
      icon: Heart,
      title: "Healthcare",
      description: "Appointment systems, patient portals, telehealth",
      priceRange: "£999 - £2,490",
      commission: "£199 - £498"
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Course platforms, learning management, student portals",
      priceRange: "£699 - £1,999",
      commission: "£139 - £399"
    },
    {
      icon: Stethoscope,
      title: "Local Services",
      description: "Service showcases, booking systems, customer management",
      priceRange: "£349 - £1,299",
      commission: "£69 - £259"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Consultant",
      quote: "Made £1,200 in my first month just from my existing network. The MVP approach makes it so easy to close deals.",
      earnings: "£1,200/month"
    },
    {
      name: "Mike Chen",
      role: "Sales Professional",
      quote: "SISO handles everything technical - I just focus on relationships. Best partnership program I've ever joined.",
      earnings: "£800/month"
    },
    {
      name: "Emma Davis",
      role: "Marketing Freelancer",
      quote: "The zero-risk promise removes all objections. Clients love seeing the MVP before committing.",
      earnings: "£950/month"
    }
  ];

  const faqItems = [
    {
      question: "How quickly do I get paid?",
      answer: "Commission is paid within 7 days of final client payment. We use secure bank transfers for all payments."
    },
    {
      question: "Is there a limit to how many clients I can refer?",
      answer: "No limit! Refer as many clients as you can handle. Our top partners refer 5-10 clients per month."
    },
    {
      question: "What if a client isn't satisfied?",
      answer: "We have a satisfaction guarantee. Commission is only paid on successful projects where the client is happy with the final result."
    },
    {
      question: "Do I need technical knowledge?",
      answer: "Not at all! We handle all technical aspects. You focus on relationship building and connecting us with potential clients."
    },
    {
      question: "What support do I get?",
      answer: "Complete training materials, marketing collateral, technical support, client communication templates, and a dedicated partner manager."
    },
    {
      question: "Can I see examples of previous work?",
      answer: "Yes! We provide a complete portfolio, case studies, and can arrange calls with existing clients for references."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-orange-500 transform-origin-left z-50"
        style={{ scaleX }}
      />

      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-gray-800/95 backdrop-blur-md border border-gray-700/50 
          p-3 rounded-full shadow-2xl hover:bg-gray-700/95 transition-all duration-200 min-h-[48px] min-w-[48px]"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Mobile Menu */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed right-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-md 
                border-l border-gray-700/50 z-45 overflow-y-auto"
            >
              <div className="p-6 pt-20">
                <div className="space-y-2">
                  {navigationSections.map((section, index) => (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => scrollToSection(section.id)}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-6 py-4 rounded-xl font-semibold transition-all duration-300 
                        min-h-[56px] flex items-center border border-transparent relative overflow-hidden group
                        ${activeSection === section.id 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400/30 shadow-lg' 
                          : 'text-gray-300 hover:text-orange-300 hover:bg-gray-800/70 hover:border-gray-600/50'
                        }`}
                    >
                      <span className="relative z-10">{section.label}</span>
                      {activeSection === section.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-300/20"
                          layoutId="activeMobileTab"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
                
                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 pt-6 border-t border-gray-700/50"
                >
                  <Button 
                    onClick={() => {
                      handleApplyNow();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 
                      hover:to-orange-700 text-white min-h-[48px]"
                  >
                    Apply Now
                  </Button>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sticky Navigation - ENHANCED & RESPONSIVE */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-gray-900/95 backdrop-blur-md 
          border border-gray-700/50 rounded-full shadow-2xl hidden lg:block
          max-w-[90vw] 2xl:max-w-[1200px] xl:max-w-[1000px] lg:max-w-[800px]"
      >
        <div className="flex items-center justify-center gap-1 px-4 py-3 overflow-x-auto scrollbar-hide">
          {navigationSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-3 py-2 rounded-full text-xs xl:text-sm font-semibold transition-all duration-300 
                whitespace-nowrap min-w-fit shrink-0 border border-transparent
                ${activeSection === section.id 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg border-orange-400/50 scale-105' 
                  : 'text-gray-300 hover:text-orange-400 hover:bg-gray-800/70 hover:border-gray-600/50 hover:scale-105'
                }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </motion.nav>

      {/* CSS for gradient animation and enhanced styles */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-gpu {
          transform: translateZ(0);
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Enhanced Background Effects with Advanced Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs with parallax */}
        <motion.div 
          className="absolute top-1/4 -left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] 
            bg-gradient-to-r from-orange-500/20 via-orange-400/15 to-red-500/10 rounded-full 
            filter blur-[100px] md:blur-[140px]"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] 
            bg-gradient-to-l from-orange-600/25 via-amber-500/15 to-yellow-500/10 rounded-full 
            filter blur-[100px] md:blur-[140px]"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Floating particles with complex animations */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-[200px] md:w-[400px] h-[200px] md:h-[400px] 
            bg-gradient-to-br from-orange-400/10 to-red-400/5 rounded-full 
            filter blur-[60px] md:blur-[80px]"
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.3, 0.8, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-3/4 left-1/4 w-[150px] md:w-[300px] h-[150px] md:h-[300px] 
            bg-gradient-to-tr from-amber-500/15 to-orange-500/10 rounded-full 
            filter blur-[50px] md:blur-[70px]"
          animate={{ 
            x: [0, -60, 80, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.7, 1.2, 1],
            opacity: [0.6, 1, 0.4, 0.6]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Additional floating elements */}
        <motion.div 
          className="absolute top-1/3 right-1/3 w-[100px] md:w-[200px] h-[100px] md:h-[200px] 
            bg-gradient-to-bl from-orange-300/8 to-red-300/4 rounded-full 
            filter blur-[40px] md:blur-[60px]"
          animate={{ 
            x: [0, 70, -30, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.4, 0.9, 1]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        {/* Particle effect overlay with subtle animation */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10">
        {/* CLEAN PROFESSIONAL HERO SECTION */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-900 to-black">
          {/* Subtle background accent */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] 
              bg-gradient-to-r from-orange-500/8 to-amber-500/8 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center space-y-12"
            >
              {/* ENHANCED ELITE BADGE */}
              <motion.div 
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800/90 to-gray-900/90 
                  border border-orange-500/50 rounded-full backdrop-blur-sm shadow-2xl
                  hover:from-gray-700/90 hover:to-gray-800/90 hover:border-orange-400/70 
                  transition-all duration-500 group"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300 
                  font-bold text-lg tracking-wide group-hover:from-orange-300 group-hover:to-orange-200 
                  transition-all duration-300">
                  Elite Partnership Program
                </span>
                <motion.div
                  className="w-1 h-1 bg-orange-400 rounded-full opacity-50"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* ENHANCED HERO TYPOGRAPHY */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center max-w-6xl mx-auto"
              >
                <motion.h1 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white 
                    mb-8 leading-none tracking-tight"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                >
                  Earn{" "}
                  <motion.span 
                    className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
                      drop-shadow-2xl relative inline-block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    £500
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 
                        rounded-lg blur-lg -z-10"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                  </motion.span>
                  {" "}Per Deal
                </motion.h1>
                
                <motion.p 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-300 mb-10 
                    leading-relaxed px-4 font-light tracking-wide"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Partner with{" "}
                  <span className="text-orange-400 font-semibold">SISO</span>{" "}
                  and earn{" "}
                  <span className="text-green-400 font-semibold">20% commission</span>{" "}
                  on every web solution referral
                </motion.p>
              </motion.div>

              {/* ENHANCED VALUE HIGHLIGHTS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap justify-center items-center gap-6 mb-12"
              >
                {[
                  { text: "20% Commission", color: "orange", gradient: "from-orange-500 to-orange-600" },
                  { text: "Zero Risk", color: "green", gradient: "from-green-500 to-emerald-600" },
                  { text: "48hr Delivery", color: "blue", gradient: "from-blue-500 to-cyan-600" }
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className={`px-6 py-3 bg-gradient-to-r ${item.gradient}/20 border border-${item.color}-500/40 
                      rounded-full backdrop-blur-sm shadow-lg hover:shadow-2xl hover:border-${item.color}-400/60
                      transition-all duration-300 group cursor-pointer`}
                  >
                    <span className={`text-${item.color}-400 font-bold text-lg group-hover:text-${item.color}-300 
                      transition-colors duration-300`}>
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* ENHANCED CTA BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleApplyNow}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 
                      text-white px-10 py-5 text-xl font-bold rounded-xl transition-all duration-300 
                      min-h-[56px] min-w-[180px] touch-manipulation shadow-2xl hover:shadow-orange-500/25
                      border border-orange-400/20 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-300/20 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span className="relative z-10 flex items-center">
                      Apply Now
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleLearnMore}
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800/80 hover:border-gray-500 
                      px-10 py-5 text-xl font-bold rounded-xl transition-all duration-300 
                      min-h-[56px] min-w-[180px] touch-manipulation backdrop-blur-sm
                      hover:text-white hover:shadow-2xl hover:shadow-gray-500/10 group"
                  >
                    <span className="flex items-center">
                      Learn More
                      <ChevronDown className="w-6 h-6 ml-3 group-hover:translate-y-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* ENHANCED TRUST INDICATORS */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2.2 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-center items-center pt-16 max-w-4xl mx-auto"
              >
                {[
                  { icon: Shield, text: "No upfront investment", color: "text-blue-400" },
                  { icon: DollarSign, text: "Commission guaranteed", color: "text-green-400" },
                  { icon: Award, text: "Full training provided", color: "text-orange-400" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center gap-3 p-6 bg-gray-800/40 rounded-2xl border border-gray-700/50 
                      backdrop-blur-sm hover:border-gray-600/70 transition-all duration-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.4 + index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                    <span className="text-lg text-gray-300 font-semibold text-center">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* SCROLL INDICATOR */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 3 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-2 text-gray-400"
                >
                  <span className="text-sm font-medium">Scroll to explore</span>
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center"
                  >
                    <motion.div
                      animate={{ y: [2, 12, 2] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1 h-3 bg-orange-400 rounded-full mt-2"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Partnership Statistics */}
        <PartnershipStats />

        {/* Portfolio Section - Our Work */}
        <section id="portfolio" className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-gray-800/30">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                Our <span className="text-orange-500">Portfolio</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See the quality of work your referrals will receive. These are real projects we've built for clients.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Event Management Majorca */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative"
              >
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/5 transition-all duration-300" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 bg-green-500/30 text-green-200 text-sm rounded-full">Live</div>
                      <div className="text-orange-500 font-bold">€2,500-€5,000</div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">Event Management Majorca</h3>
                    <p className="text-gray-400 mb-4">Complete event management platform with booking, payments, and client communication for luxury events in Majorca.</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">React</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Stripe</span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">Calendar</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-green-400 font-semibold">Commission: €500-€1,000</div>
                      <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Restaurant Template */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group relative"
              >
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/5 transition-all duration-300" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 bg-blue-500/30 text-blue-200 text-sm rounded-full">Demo</div>
                      <div className="text-orange-500 font-bold">£1,500-£3,500</div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">Restaurant Management System</h3>
                    <p className="text-gray-400 mb-4">Online ordering, table reservations, menu management, and customer reviews system for restaurants.</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">React</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Orders</span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">Reviews</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-green-400 font-semibold">Commission: £300-£700</div>
                      <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                        <Eye className="w-4 h-4 mr-2" />
                        View Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Barber Template */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group relative"
              >
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/5 transition-all duration-300" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 bg-blue-500/30 text-blue-200 text-sm rounded-full">Demo</div>
                      <div className="text-orange-500 font-bold">£800-£2,000</div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">Barber Shop Booking System</h3>
                    <p className="text-gray-400 mb-4">Appointment booking, service showcase, staff management, and customer profiles for barbershops.</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Booking</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Calendar</span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">Staff</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-green-400 font-semibold">Commission: £160-£400</div>
                      <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                        <Eye className="w-4 h-4 mr-2" />
                        View Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Crypto App */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="group relative"
              >
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/5 transition-all duration-300" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 bg-purple-500/30 text-purple-200 text-sm rounded-full">Custom</div>
                      <div className="text-orange-500 font-bold">£5,000-£15,000</div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">Crypto Trading Platform</h3>
                    <p className="text-gray-400 mb-4">Full-featured crypto trading app with portfolio tracking, real-time prices, and secure wallet integration.</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Trading</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Wallet</span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">Analytics</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-green-400 font-semibold">Commission: £1,000-£3,000</div>
                      <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                        <Code className="w-4 h-4 mr-2" />
                        Custom Build
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Property Management */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="group relative"
              >
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/5 transition-all duration-300" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 bg-green-500/30 text-green-200 text-sm rounded-full">Live</div>
                      <div className="text-orange-500 font-bold">£3,000-£8,000</div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">Property Management System</h3>
                    <p className="text-gray-400 mb-4">Complete property management with tenant portals, maintenance requests, and financial reporting.</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Tenants</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Finance</span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">Reports</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-green-400 font-semibold">Commission: £600-£1,600</div>
                      <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* More Templates Coming Soon */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="group relative"
              >
                <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 overflow-hidden h-full border-dashed">
                  <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center mb-4">
                      <Star className="w-8 h-8 text-orange-500" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">More Templates</h3>
                    <p className="text-gray-400 mb-4">Healthcare, Education, E-commerce, and more industry-specific templates coming soon.</p>
                    
                    <div className="px-3 py-1 bg-orange-500/30 text-orange-200 text-sm rounded-full">
                      Coming Soon
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Portfolio CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-center mt-12"
            >
              <p className="text-lg text-gray-300 mb-6">
                This is the quality of work your referrals will receive. Ready to start earning?
              </p>
              <Button 
                onClick={handleApplyNow}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg"
              >
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Value Proposition Section */}
        <section id="benefits" className="relative min-h-[80vh] flex items-center px-4 overflow-hidden">
          {/* Section background with dynamic elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          <div className="container mx-auto max-w-6xl relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h2 
                className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Why Partner with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
                  SISO
                </span>?
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Join the most rewarding partnership program in web development
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valueProps.map((prop, index) => (
                <motion.div
                  key={prop.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group"
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="relative h-full bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 
                    border border-gray-700/50 hover:border-orange-500/60 backdrop-blur-sm
                    transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20
                    group-hover:bg-gradient-to-br group-hover:from-gray-800/90 group-hover:via-gray-700/70 group-hover:to-gray-900/90">
                    
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 
                      group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-orange-500/10 
                      transition-all duration-500 pointer-events-none" />
                    
                    <CardContent className="relative p-8 text-center space-y-6">
                      {/* Enhanced Icon */}
                      <motion.div 
                        className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500/20 via-orange-600/30 to-red-500/20 
                          rounded-2xl flex items-center justify-center group-hover:from-orange-500/40 
                          group-hover:via-orange-600/50 group-hover:to-red-500/40 transition-all duration-500
                          shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40
                          border border-orange-500/20 group-hover:border-orange-500/40"
                        whileHover={{ 
                          rotate: 360,
                          scale: 1.1,
                          transition: { duration: 0.6 }
                        }}
                      >
                        <prop.icon className="w-8 h-8 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                      </motion.div>
                      
                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-orange-100 transition-colors duration-300">
                        {prop.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                        {prop.description}
                      </p>
                      
                      {/* Stat with enhanced styling */}
                      <div className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full 
                        border border-orange-500/30 group-hover:border-orange-500/50 transition-all duration-300">
                        <span className="text-orange-400 font-bold text-lg group-hover:text-orange-300 transition-colors duration-300">
                          {prop.stat}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="process" className="min-h-[70vh] flex items-center px-4 bg-gray-800/30">
          <div className="container mx-auto max-w-6xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <GradientHeading variant="secondary" className="text-3xl md:text-4xl font-bold mb-4">
                Simple 4-Step Process
              </GradientHeading>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                From connection to commission in four straightforward steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative text-center group"
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm z-10">
                    {index + 1}
                  </div>

                  {/* Step Content */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 h-full hover:border-orange-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/10">
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                      <step.icon className="w-8 h-8 text-orange-500" />
                    </div>

                    {/* Highlight */}
                    <div className="text-orange-500 font-semibold text-sm mb-2">{step.highlight}</div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>

                  {/* Connector Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 transform -translate-y-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Commission Calculator */}
        <CommissionCalculator />

        {/* Target Client Types Section */}
        <section id="clients" className="py-16 px-4 bg-gray-800/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <GradientHeading variant="secondary" className="text-3xl md:text-4xl font-bold mb-4">
                Who Can Benefit?
              </GradientHeading>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Every industry needs web solutions - here are the most profitable sectors
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clientTypes.map((client, index) => (
                <motion.div
                  key={client.title}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -12,
                    rotateX: 5,
                    rotateY: 5,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="group perspective-1000"
                >
                  <Card className="h-full bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 
                    border border-gray-700/50 hover:border-orange-500/60 transition-all duration-500 
                    hover:shadow-2xl hover:shadow-orange-500/25 relative overflow-hidden
                    group-hover:bg-gradient-to-br group-hover:from-gray-800/90 group-hover:via-gray-700/70 group-hover:to-gray-900/90">
                    
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 
                      group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-orange-500/10 
                      transition-all duration-500" />
                    
                    {/* Floating particles effect */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400/30 rounded-full 
                      group-hover:bg-orange-400/60 transition-all duration-500 group-hover:animate-pulse" />
                    <div className="absolute bottom-6 left-6 w-1 h-1 bg-orange-300/20 rounded-full 
                      group-hover:bg-orange-300/50 transition-all duration-700 group-hover:animate-pulse" 
                      style={{ animationDelay: '0.5s' }} />
                    
                    <CardContent className="relative p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="w-14 h-14 bg-gradient-to-br from-orange-500/20 via-orange-600/30 to-red-500/20 
                            rounded-xl flex items-center justify-center group-hover:from-orange-500/40 
                            group-hover:via-orange-600/50 group-hover:to-red-500/40 transition-all duration-500
                            shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40
                            border border-orange-500/20 group-hover:border-orange-500/40"
                          whileHover={{ 
                            rotate: [0, -10, 10, 0],
                            scale: 1.1,
                            transition: { duration: 0.6 }
                          }}
                        >
                          <client.icon className="w-7 h-7 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-white group-hover:text-orange-100 transition-colors duration-300">
                          {client.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                        {client.description}
                      </p>
                      
                      <div className="space-y-3 pt-4 border-t border-gray-700/50 group-hover:border-gray-600/50 transition-colors duration-300">
                        <motion.div 
                          className="flex justify-between items-center"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                            Project Range:
                          </span>
                          <span className="text-white text-sm font-bold bg-gray-700/50 px-3 py-1 rounded-full
                            group-hover:bg-gray-600/50 transition-all duration-300">
                            {client.priceRange}
                          </span>
                        </motion.div>
                        <motion.div 
                          className="flex justify-between items-center"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        >
                          <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                            Your Commission:
                          </span>
                          <span className="text-orange-400 text-sm font-bold bg-orange-500/20 px-3 py-1 rounded-full
                            group-hover:text-orange-300 group-hover:bg-orange-500/30 transition-all duration-300
                            border border-orange-500/30 group-hover:border-orange-500/50">
                            {client.commission}
                          </span>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <GradientHeading variant="secondary" className="text-3xl md:text-4xl font-bold mb-4">
                Partner Success Stories
              </GradientHeading>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                See how our partners are earning consistent income
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 40, rotateY: -15, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.7, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 80
                  }}
                  whileHover={{ 
                    y: -15,
                    rotateY: 5,
                    scale: 1.03,
                    transition: { duration: 0.4 }
                  }}
                  className="group perspective-1000"
                >
                  <Card className="h-full bg-gradient-to-br from-gray-800/90 via-gray-800/70 to-gray-900/90 
                    border border-gray-700/50 hover:border-orange-500/60 transition-all duration-500 
                    hover:shadow-2xl hover:shadow-orange-500/30 relative overflow-hidden
                    group-hover:bg-gradient-to-br group-hover:from-gray-800/95 group-hover:via-gray-700/75 group-hover:to-gray-900/95">
                    
                    {/* Animated quote background */}
                    <div className="absolute top-4 right-4 text-6xl text-orange-500/10 font-serif leading-none
                      group-hover:text-orange-500/20 transition-all duration-500 select-none">"</div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 
                      group-hover:from-orange-500/5 group-hover:via-orange-500/10 group-hover:to-orange-500/5 
                      transition-all duration-500" />
                    
                    <CardContent className="relative p-8 space-y-6">
                      {/* Enhanced star rating */}
                      <motion.div 
                        className="flex items-center gap-1 mb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            transition={{ 
                              delay: index * 0.2 + 0.4 + i * 0.1,
                              type: "spring",
                              stiffness: 200
                            }}
                            whileHover={{ 
                              scale: 1.2,
                              rotate: 360,
                              transition: { duration: 0.3 }
                            }}
                          >
                            <Star className="w-5 h-5 fill-orange-500 text-orange-500 drop-shadow-lg" />
                          </motion.div>
                        ))}
                      </motion.div>
                      
                      {/* Enhanced quote */}
                      <motion.blockquote 
                        className="text-gray-300 italic text-lg leading-relaxed group-hover:text-gray-200 
                          transition-colors duration-300 relative z-10"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.2 + 0.5 }}
                      >
                        "{testimonial.quote}"
                      </motion.blockquote>
                      
                      {/* Enhanced author section */}
                      <motion.div 
                        className="flex justify-between items-center pt-6 border-t border-gray-700/50 
                          group-hover:border-gray-600/50 transition-colors duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.6 }}
                      >
                        <div className="space-y-1">
                          <motion.div 
                            className="text-white font-bold text-lg group-hover:text-orange-100 transition-colors duration-300"
                            whileHover={{ x: 5 }}
                          >
                            {testimonial.name}
                          </motion.div>
                          <motion.div 
                            className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300"
                            whileHover={{ x: 5 }}
                          >
                            {testimonial.role}
                          </motion.div>
                        </div>
                        <motion.div 
                          className="text-orange-400 font-bold text-xl bg-orange-500/20 px-4 py-2 rounded-full
                            group-hover:text-orange-300 group-hover:bg-orange-500/30 transition-all duration-300
                            border border-orange-500/30 group-hover:border-orange-500/50 shadow-lg"
                          whileHover={{ 
                            scale: 1.1,
                            rotate: [0, -5, 5, 0],
                            transition: { duration: 0.4 }
                          }}
                        >
                          {testimonial.earnings}
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 px-4 bg-gray-800/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <GradientHeading variant="secondary" className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </GradientHeading>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Get answers to common questions about our partnership program
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300">
                    <CardContent className="p-0">
                      <motion.button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-700/30 
                          transition-colors duration-300 min-h-[64px] touch-manipulation group"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <h3 className="text-lg font-semibold text-white group-hover:text-orange-100 transition-colors duration-300">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <ChevronDown className="w-5 h-5 text-orange-500 group-hover:text-orange-400 transition-colors duration-300" />
                        </motion.div>
                      </motion.button>
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <motion.div 
                              className="px-6 pb-6 text-gray-300 leading-relaxed"
                              initial={{ y: -10 }}
                              animate={{ y: 0 }}
                              exit={{ y: -10 }}
                              transition={{ duration: 0.2, delay: 0.1 }}
                            >
                              {faq.answer}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 px-4 bg-gray-800/30">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GradientHeading variant="secondary" className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Earning?
              </GradientHeading>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join our partnership program today and start earning commission on every successful referral.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={handleApplyNow}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <div className="flex gap-4">
                  <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Mail className="w-5 h-5 mr-2" />
                    partners@siso.agency
                  </Button>
                  <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Phone className="w-5 h-5 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
});

PartnershipPage.displayName = 'PartnershipPage';

export default PartnershipPage; 