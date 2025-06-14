import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Award, Loader2 } from 'lucide-react';
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

  return (
    <section id="stats" className="min-h-[90vh] flex items-center px-4 bg-gray-800/20">
      <div className="container mx-auto max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Partnership Program <span className="text-orange-500">Statistics</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Real results from our growing community of successful partners
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* Real-time data indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Live Data - Updated Every 5 Minutes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

PartnershipStats.displayName = 'PartnershipStats';

export default PartnershipStats; 