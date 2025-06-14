import { memo, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Users, DollarSign, Shield, Zap, Calculator, CheckCircle, 
  Search, Code, Phone, Mail, ChevronDown, ChevronUp, Star, Award,
  Building, ShoppingCart, Heart, GraduationCap, Stethoscope, Utensils,
  Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PartnershipStats from '@/components/partnership/PartnershipStats';
import CommissionCalculator from '@/components/partnership/CommissionCalculator';
import { usePartnerApplication } from '@/hooks/usePartnerApplication';
import { toast } from 'sonner';

const PartnershipPage = memo(() => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { submitApplication, isSubmitting } = usePartnerApplication();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    network: '',
    expectedVolume: ''
  });

  // Scroll progress tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleApplyNow = () => {
    // Scroll to application form instead of navigating away
    const element = document.getElementById('application');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('application');
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Transform form data to match API expectations
      const applicationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: '', // Optional field, set to empty string
        networkDescription: formData.network,
        expectedReferrals: parseInt(formData.expectedVolume) || 1,
        experienceLevel: 'Intermediate' as const // Default value, could be made dynamic
      };

      const success = await submitApplication(applicationData);
      
      if (success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          experience: '',
          network: '',
          expectedVolume: ''
        });

        // Show success message and redirect after delay
        toast.success('Application submitted successfully! We will contact you within 24 hours.');
        
        // Optional: Navigate to a confirmation page or dashboard after delay
        setTimeout(() => {
          navigate('/auth', { 
            state: { 
              userType: 'partner',
              returnTo: '/partner-dashboard',
              source: 'partnership-application-success'
            }
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  // Navigation sections
  const navigationSections = [
    { id: 'hero', label: 'Get Started' },
    { id: 'stats', label: 'Program Stats' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'process', label: 'How It Works' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'clients', label: 'Client Types' },
    { id: 'testimonials', label: 'Success Stories' },
    { id: 'faq', label: 'FAQ' },
    { id: 'application', label: 'Apply Now' }
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
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 
                        min-h-[48px] flex items-center
                        ${activeSection === section.id 
                          ? 'bg-orange-500 text-white' 
                          : 'text-gray-300 hover:text-orange-400 hover:bg-gray-800/50'
                        }`}
                    >
                      {section.label}
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
                      scrollToSection('application');
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

      {/* Desktop Sticky Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-gray-900/95 backdrop-blur-md 
          border border-gray-700/50 rounded-full px-4 py-2 shadow-2xl hidden lg:block"
      >
        <div className="flex items-center gap-2">
          {navigationSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap
                ${activeSection === section.id 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-400 hover:text-orange-400 hover:bg-gray-800/50'
                }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </motion.nav>

      {/* CSS for gradient animation */}
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
      `}</style>

      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] 
          bg-gradient-to-r from-orange-500/20 via-orange-400/15 to-red-500/10 rounded-full 
          filter blur-[100px] md:blur-[140px] animate-pulse"
        />
        <div className="absolute bottom-1/4 -right-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] 
          bg-gradient-to-l from-orange-600/25 via-amber-500/15 to-yellow-500/10 rounded-full 
          filter blur-[100px] md:blur-[140px] animate-pulse"
        />
        
        {/* Additional floating orbs */}
        <div className="absolute top-1/2 left-1/2 w-[200px] md:w-[400px] h-[200px] md:h-[400px] 
          bg-gradient-to-br from-orange-400/10 to-red-400/5 rounded-full 
          filter blur-[60px] md:blur-[80px] animate-bounce"
          style={{ animationDuration: '6s' }}
        />
        <div className="absolute top-3/4 left-1/4 w-[150px] md:w-[300px] h-[150px] md:h-[300px] 
          bg-gradient-to-tr from-amber-500/15 to-orange-500/10 rounded-full 
          filter blur-[50px] md:blur-[70px] animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        
        {/* Particle effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent opacity-50" />
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
              {/* CLEAN PROFESSIONAL BADGE */}
              <motion.div 
                className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800/80 border border-orange-500/30 
                  rounded-full backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-orange-400 font-semibold">Elite Partnership Program</span>
              </motion.div>

              {/* CLEAN HERO TYPOGRAPHY */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center max-w-5xl mx-auto"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                  Earn <span className="text-orange-500">£500</span> Per Deal
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed px-4">
                  Partner with SISO and earn 20% commission on every web solution referral
                </p>
              </motion.div>

              {/* CLEAN VALUE HIGHLIGHTS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center items-center gap-4 mb-8"
              >
                <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
                  <span className="text-orange-400 font-semibold">20% Commission</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                  <span className="text-green-400 font-semibold">Zero Risk</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <span className="text-blue-400 font-semibold">48hr Delivery</span>
                </div>
              </motion.div>

              {/* CLEAN CTA BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  onClick={handleApplyNow}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold 
                    rounded-lg transition-colors duration-200 min-h-[44px] min-w-[140px] touch-manipulation"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg font-semibold 
                    rounded-lg transition-colors duration-200 min-h-[44px] min-w-[140px] touch-manipulation"
                >
                  Learn More
                </Button>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientTypes.map((client, index) => (
                <motion.div
                  key={client.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-gray-800/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center">
                          <client.icon className="w-5 h-5 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{client.title}</h3>
                      </div>
                      <p className="text-gray-400 text-sm">{client.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Project Range:</span>
                          <span className="text-white text-sm font-semibold">{client.priceRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Your Commission:</span>
                          <span className="text-orange-500 text-sm font-semibold">{client.commission}</span>
                        </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-gray-800/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                        ))}
                      </div>
                      <blockquote className="text-gray-300 italic">"{testimonial.quote}"</blockquote>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <div>
                          <div className="text-white font-semibold">{testimonial.name}</div>
                          <div className="text-gray-400 text-sm">{testimonial.role}</div>
                        </div>
                        <div className="text-orange-500 font-semibold">{testimonial.earnings}</div>
                      </div>
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
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-700/30 transition-colors duration-200 min-h-[64px] touch-manipulation"
                      >
                        <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                        {expandedFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-orange-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-orange-500" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-6 pb-6 text-gray-300">
                          {faq.answer}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section id="application" className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <GradientHeading variant="secondary" className="text-3xl md:text-4xl font-bold mb-4">
                Apply to Become a Partner
              </GradientHeading>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Ready to start earning? Fill out our application form and we'll be in touch within 24 hours.
              </p>
            </motion.div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8">
                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white min-h-[48px] text-base"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white min-h-[48px] text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white min-h-[48px] text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-white">Professional Background</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white min-h-[120px] text-base"
                      rows={3}
                      placeholder="Tell us about your professional background and sales experience..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="network" className="text-white">Your Network</Label>
                    <Textarea
                      id="network"
                      value={formData.network}
                      onChange={(e) => setFormData({...formData, network: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white min-h-[120px] text-base"
                      rows={3}
                      placeholder="Describe your network and the types of businesses you have connections with..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedVolume" className="text-white">Expected Monthly Referrals</Label>
                    <Input
                      id="expectedVolume"
                      value={formData.expectedVolume}
                      onChange={(e) => setFormData({...formData, expectedVolume: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white min-h-[48px] text-base"
                      placeholder="e.g., 2-3 businesses per month"
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] touch-manipulation"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
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