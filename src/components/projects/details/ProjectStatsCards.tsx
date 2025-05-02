
import { Card } from "@/components/ui/card";
import { Users, Code, CheckSquare, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

function StatCard({ 
  title, 
  value, 
  icon, 
  bgColor, 
  textColor, 
  delay = 0,
  progress,
  subtitle
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  bgColor: string; 
  textColor: string; 
  delay?: number;
  progress?: number;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={`border-0 ${bgColor} shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-400 text-sm font-medium">{title}</p>
              <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
              {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </div>
            <div className={`h-12 w-12 rounded-full bg-white/5 flex items-center justify-center ${textColor}`}>
              {icon}
            </div>
          </div>
          
          {progress !== undefined && (
            <div className="mt-4">
              <Progress 
                value={progress} 
                className="h-1.5" 
                indicatorClassName={`${progress >= 70 ? 'bg-green-500' : progress >= 40 ? 'bg-amber-500' : 'bg-[#ea384c]'}`} 
              />
              <div className="flex justify-between mt-1.5">
                <p className="text-xs text-gray-500">{progress}% Complete</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs py-0 px-1.5 ${
                    progress >= 70 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                    progress >= 40 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    'bg-[#ea384c]/10 text-[#ea384c] border-[#ea384c]/20'
                  }`}
                >
                  {progress >= 70 ? 'On track' : progress >= 40 ? 'In progress' : 'Needs attention'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export function ProjectStatsCards() {
  // This would be replaced with actual data from your backend
  const stats = {
    tasksTotal: 24,
    tasksCompleted: 16,
    teamMembers: 3,
    daysRemaining: 14,
    taskProgress: 66,
    teamProgress: 75,
    developmentProgress: 68,
    timelineProgress: 58
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Tasks"
        value={`${stats.tasksCompleted}/${stats.tasksTotal}`}
        subtitle="67% completion rate"
        icon={<CheckSquare className="h-6 w-6 text-[#ea384c]" />}
        bgColor="bg-gradient-to-br from-[#ea384c]/10 to-red-900/5"
        textColor="text-[#ea384c]"
        delay={0}
        progress={stats.taskProgress}
      />
      
      <StatCard 
        title="Team Members"
        value={stats.teamMembers.toString()}
        subtitle="All members active"
        icon={<Users className="h-6 w-6 text-red-400" />}
        bgColor="bg-gradient-to-br from-red-500/10 to-red-700/5"
        textColor="text-red-400"
        delay={1}
        progress={stats.teamProgress}
      />
      
      <StatCard 
        title="Development Progress"
        value="68%"
        subtitle="5% ahead of schedule"
        icon={<Code className="h-6 w-6 text-[#ea384c]" />}
        bgColor="bg-gradient-to-br from-[#ea384c]/10 to-red-900/5"
        textColor="text-[#ea384c]"
        delay={2}
        progress={stats.developmentProgress}
      />
      
      <StatCard 
        title="Timeline Remaining"
        value={`${stats.daysRemaining} days`}
        subtitle="Next milestone: Apr 30"
        icon={<Clock className="h-6 w-6 text-red-400" />}
        bgColor="bg-gradient-to-br from-red-500/10 to-red-700/5"
        textColor="text-red-400"
        delay={3}
        progress={stats.timelineProgress}
      />
    </div>
  );
}
