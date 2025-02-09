
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Clock, BookOpenCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

export const LearningProgress = () => {
  const { data: progressData } = useQuery({
    queryKey: ['learning-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_summaries')
        .select('*')
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Continue Learning Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-2xl font-bold text-siso-text-bold">Continue Learning</h2>
        <Card className="p-6 bg-gradient-to-br from-siso-bg-alt to-siso-bg border-siso-border">
          <div className="flex items-center gap-4 mb-4">
            <Clock className="w-5 h-5 text-siso-orange" />
            <h3 className="text-lg font-semibold">Recently Watched</h3>
          </div>
          <div className="space-y-4">
            {progressData?.map((item: any) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-siso-bg-alt/50 hover:bg-siso-bg-alt cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-siso-text-bold mb-2">{item.title}</h4>
                  <Progress value={item.progress || 0} className="h-2" />
                </div>
                <span className="text-sm text-siso-text/70">
                  {item.progress || 0}% Complete
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Learning Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-siso-red/10 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-siso-red" />
            <h3 className="font-semibold">Current Streak</h3>
          </div>
          <p className="text-2xl font-bold">7 Days</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-siso-orange/10 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-siso-orange" />
            <h3 className="font-semibold">Skills Gained</h3>
          </div>
          <p className="text-2xl font-bold">12</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <BookOpenCheck className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Hours Learned</h3>
          </div>
          <p className="text-2xl font-bold">24</p>
        </Card>
      </motion.div>
    </motion.div>
  );
};
