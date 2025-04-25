
import { motion } from 'framer-motion';
import { useDayPeriod } from '@/hooks/useDayPeriod';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent } from '@/components/ui/card';

export function WelcomeHeader() {
  const { period, greeting, icon: PeriodIcon, gradientClass } = useDayPeriod();
  const { user } = useUser();
  
  const displayName = user?.email ? user.email.split('@')[0] : 'there';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`border-0 bg-gradient-to-r ${gradientClass} backdrop-blur-sm shadow-lg mb-6`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center"
              >
                <PeriodIcon className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-2xl font-bold text-white"
                >
                  {greeting}, {displayName}
                </motion.h1>
                <p className="text-white/80">
                  Welcome to your dashboard
                </p>
              </div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 text-white/80"
            >
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
