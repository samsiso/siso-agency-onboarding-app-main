import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Award, Loader2, Target, Clock, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePartnerStats } from '@/hooks/usePartnerStats';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  index: number;
}

const StatCard = memo(({ icon: Icon, label, value, trend, index }: StatCardProps) => {
  const [currentValue, setCurrentValue] = useState(0);
  const numericValue = parseInt(value.replace(/[^\d]/g, ''));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue(prev => {
        if (prev < numericValue) {
          return Math.min(prev + Math.ceil(numericValue / 50), numericValue);
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [numericValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card className="bg-gray-800/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
        <CardContent className="p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
            <Icon className="w-6 h-6 text-orange-500" />
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentValue}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {value.includes('£') ? `£${currentValue.toLocaleString()}` : currentValue.toLocaleString()}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="text-gray-300 font-medium">{label}</p>
            <div className="text-green-400 text-sm font-semibold flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

const PartnershipStats = memo(() => {
  const { stats, isLoading, error } = usePartnerStats();

  // Show loading state
  if (isLoading) {
    return (
      <section id="stats" className="min-h-[90vh] flex items-center px-4 bg-gray-800/20">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3 text-orange-500">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xl font-medium">Loading partnership statistics...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="stats" className="min-h-[90vh] flex items-center px-4 bg-gray-800/20">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="text-center space-y-4">
            <div className="text-red-400 text-xl font-medium">
              Failed to load statistics
            </div>
            <p className="text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Use real statistics data
  const statsData = stats ? [
    {
      icon: Users,
      label: "Active Partners",
      value: stats.activePartners.toString(),
      trend: "+18% this month"
    },
    {
      icon: DollarSign,
      label: "Total Paid Out",
      value: `£${stats.totalCommissionsPaid.toFixed(2)}`,
      trend: "+23% this month"
    },
    {
      icon: Award,
      label: "Successful Projects",
      value: stats.successfulProjects.toString(),
      trend: "+15% this month"
    },
    {
      icon: TrendingUp,
      label: "Avg Commission",
      value: `£${stats.averageCommission.toFixed(2)}`,
      trend: "+12% this month"
    }
  ] : [];

  // Enhanced stats with verified business data
  const verifiedStats = [
    {
      icon: DollarSign,
      value: "20%",
      label: "Commission Rate",
      subtext: "Of project value (£249-£2,490)",
      verified: true,
      color: "text-orange-500"
    },
    {
      icon: Target,
      value: "£249-£2,490",
      label: "Project Range",
      subtext: "Suitable for most businesses",
      verified: true,
      color: "text-green-500"
    },
    {
      icon: Clock,
      value: "48-72hrs",
      label: "MVP Delivery",
      subtext: "Fast turnaround time",
      verified: true,
      color: "text-blue-500"
    },
    {
      icon: Shield,
      value: "100%",
      label: "Risk-Free",
      subtext: "MVP first, payment later",
      verified: true,
      color: "text-purple-500"
    },
    {
      icon: Users,
      value: "300+",
      label: "Active Partners",
      subtext: "Growing community",
      verified: false, // This should be updated with real data
      color: "text-pink-500"
    },
    {
      icon: Award,
      value: "£1,200",
      label: "Avg Monthly",
      subtext: "Top partner earnings",
      verified: false, // This should be updated with real data
      color: "text-indigo-500"
    }
  ];

  return (
    <motion.section
      id="stats"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 lg:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3"
          >
            Partnership Program Stats
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4"
          >
            Verified program metrics and earning opportunities
          </motion.p>
        </div>

        {/* Enhanced Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {verifiedStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group"
              >
                <Card className="relative bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 
                  border border-gray-700/50 hover:border-orange-500/50 backdrop-blur-sm
                  transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
                  
                  {/* Verified Badge */}
                  {stat.verified && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  )}
                  
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-gray-700/50 to-gray-800/50 
                        flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                      </div>
                      
                      <div>
                        <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.color} mb-1`}>
                          {stat.value}
                        </div>
                        <div className="text-white font-semibold text-sm sm:text-base mb-1">
                          {stat.label}
                        </div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          {stat.subtext}
                        </div>
                        
                        {/* Verification Status */}
                        <div className="mt-2">
                          {stat.verified ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30">
                              ⚡ Estimated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Info Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 lg:mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20 max-w-md mx-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="text-orange-500 font-semibold text-sm mb-2">✓ Verified Contact</div>
              <div className="text-white font-medium">partners@siso.agency</div>
              <div className="text-gray-400 text-sm mt-1">Official partnership inquiries</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
});

PartnershipStats.displayName = 'PartnershipStats';

export default PartnershipStats; 