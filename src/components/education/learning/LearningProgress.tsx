
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Clock, BookOpenCheck, Target, Flame, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface VideoProgress {
  id: string;
  video_id: string;
  progress: number;
  title: string;
  last_watched_at: string;
}

interface LearningMilestone {
  title: string;
  progress: number;
  target: number;
  icon: JSX.Element;
}

export const LearningProgress = () => {
  // [Analysis] Fetch user's recent video progress with video titles
  const { data: progressData } = useQuery({
    queryKey: ['learning-progress'],
    queryFn: async () => {
      const { data: progress, error } = await supabase
        .from('video_progress')
        .select(`
          id,
          video_id,
          progress,
          last_watched_at,
          youtube_videos!inner (
            title
          )
        `)
        .order('last_watched_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching video progress:', error);
        throw error;
      }

      // Transform the data to match VideoProgress interface
      const transformedProgress: VideoProgress[] = progress.map(item => ({
        id: item.id,
        video_id: item.video_id,
        progress: item.progress,
        title: item.youtube_videos.title,
        last_watched_at: item.last_watched_at,
      }));
      
      return transformedProgress;
    },
  });

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
  const milestones: LearningMilestone[] = [
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
            <Flame className="w-5 h-5 text-siso-orange" />
            <span className="text-sm font-medium">
              {learningStats?.weeklyStreak || 0} Day Streak
            </span>
          </div>
        </div>
        
        <Card className="p-6 bg-gradient-to-br from-siso-bg-alt to-siso-bg border-siso-border">
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
            
            {/* Milestones */}
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
        </Card>
      </motion.div>

      {/* Continue Learning Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-2xl font-bold text-siso-text-bold">Continue Learning</h2>
        <Card className="p-6 bg-gradient-to-br from-siso-bg-alt to-siso-bg border-siso-border">
          <div className="flex items-center gap-4 mb-4">
            <Clock className="w-5 h-5 text-siso-orange" />
            <h3 className="text-lg font-semibold">Recently Watched</h3>
          </div>
          <div className="space-y-4">
            {progressData?.map((item) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-siso-bg-alt/50 hover:bg-siso-bg-alt cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-siso-text-bold mb-2">{item.title}</h4>
                  <Progress value={item.progress} className="h-2" />
                </div>
                <span className="text-sm text-siso-text/70">
                  {item.progress}% Complete
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
            <h3 className="font-semibold">Videos Completed</h3>
          </div>
          <p className="text-2xl font-bold">{learningStats?.completedVideos || 0}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-siso-orange/10 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-siso-orange" />
            <h3 className="font-semibold">Skills Gained</h3>
          </div>
          <p className="text-2xl font-bold">{learningStats?.skillsGained || 0}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <BookOpenCheck className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Hours Learned</h3>
          </div>
          <p className="text-2xl font-bold">{learningStats?.hoursLearned || 0}</p>
        </Card>
      </motion.div>
    </motion.div>
  );
};
