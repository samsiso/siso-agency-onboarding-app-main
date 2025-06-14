import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  const stats = [
    {
      icon: Users,
      label: "Active Partners",
      value: "247",
      trend: "+18% this month"
    },
    {
      icon: DollarSign,
      label: "Total Paid Out",
      value: "£47,285",
      trend: "+23% this month"
    },
    {
      icon: Award,
      label: "Successful Projects",
      value: "186",
      trend: "+15% this month"
    },
    {
      icon: TrendingUp,
      label: "Avg Monthly Earnings",
      value: "£892",
      trend: "+12% this month"
    }
  ];

  return (
    <section className="min-h-[90vh] flex items-center px-4 bg-gray-800/20">
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
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

PartnershipStats.displayName = 'PartnershipStats';

export default PartnershipStats; 