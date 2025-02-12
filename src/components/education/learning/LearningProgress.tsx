
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Clock, BookOpenCheck, Target, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

export const LearningProgress = () => {
  // [Analysis] Fetch user's learning stats with enhanced metrics
  const { data: learningStats } = useQuery({
    queryKey: ['learning-stats'],
    queryFn: async () => {
      const { data: stats, error } = await supabase
        .from('video_progress')
        .select('*')
        .eq('completed', true);

      if (error) {
        console.error('Error fetching learning stats:', error);
        throw error;
      }

      const totalHours = Math.round((stats?.length || 0) * 0.5);
      
      return {
        completedVideos: stats?.length || 0,
        hoursLearned: totalHours,
        skillsGained: Math.floor((stats?.length || 0) / 2),
        weeklyStreak: 3, // [Plan] Add streak tracking in future iteration
        totalProgress: 45, // [Plan] Calculate based on curriculum completion
      };
    },
  });

  // Learning milestones
  const milestones = [
    {
      title: 'Complete 10 Videos',
      progress: learningStats?.completedVideos || 0,
      target: 10,
      icon: <Trophy className="w-4 h-4 text-yellow-500" />
    },
    {
      title: 'Learn for 5 Hours',
      progress: learningStats?.hoursLearned || 0,
      target: 5,
      icon: <Clock className="w-4 h-4 text-blue-500" />
    },
    {
      title: 'Gain 5 Skills',
      progress: learningStats?.skillsGained || 0,
      target: 5,
      icon: <Target className="w-4 h-4 text-green-500" />
    }
  ];

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
      {/* Overall Progress Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-siso-text-bold">Learning Journey</h2>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-siso-orange" />
            <span className="text-sm font-medium">
              {learningStats?.weeklyStreak || 0} Day Streak
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{learningStats?.totalProgress || 0}%</span>
          </div>
          <Progress 
            value={learningStats?.totalProgress || 0} 
            className="h-2"
            indicatorClassName="bg-gradient-to-r from-siso-orange to-siso-red"
          />
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-siso-bg-alt/50">
              <div className="flex items-center gap-2">
                <BookOpenCheck className="w-4 h-4 text-siso-orange" />
                <span className="font-medium">Videos Completed</span>
              </div>
              <div className="text-2xl font-bold">{learningStats?.completedVideos || 0}</div>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-siso-bg-alt/50">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-siso-orange" />
                <span className="font-medium">Skills Gained</span>
              </div>
              <div className="text-2xl font-bold">{learningStats?.skillsGained || 0}</div>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-siso-bg-alt/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-siso-orange" />
                <span className="font-medium">Hours Learned</span>
              </div>
              <div className="text-2xl font-bold">{learningStats?.hoursLearned || 0}</div>
            </div>
          </div>
          
          {/* Progress Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="bg-siso-bg-alt/50 p-4 rounded-lg space-y-2"
              >
                <div className="flex items-center gap-2">
                  {milestone.icon}
                  <span className="text-sm font-medium">{milestone.title}</span>
                </div>
                <Progress 
                  value={(milestone.progress / milestone.target) * 100} 
                  className="h-1.5"
                />
                <div className="text-xs text-siso-text/70">
                  {milestone.progress} / {milestone.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
