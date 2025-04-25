import { Card } from "@/components/ui/card";
import { Users, Code, CheckSquare, Clock } from "lucide-react";
import { motion } from "framer-motion";

function StatCard({ title, value, icon, bgColor, textColor, delay = 0 }: { title: string; value: string; icon: React.ReactNode; bgColor: string; textColor: string; delay?: number; }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
    >
      <Card className={`border-0 ${bgColor} shadow-md hover:shadow-lg transition-all duration-300`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
          </div>
          <div className={`h-12 w-12 rounded-full bg-white/5 flex items-center justify-center ${textColor}`}>
            {icon}
          </div>
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
    daysRemaining: 14
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Tasks"
        value={`${stats.tasksCompleted}/${stats.tasksTotal}`}
        icon={<CheckSquare className="h-6 w-6 text-[#ea384c]" />}
        bgColor="bg-gradient-to-br from-[#ea384c]/10 to-red-900/5"
        textColor="text-[#ea384c]"
        delay={0}
      />
      
      <StatCard 
        title="Team Members"
        value={stats.teamMembers.toString()}
        icon={<Users className="h-6 w-6 text-red-400" />}
        bgColor="bg-gradient-to-br from-red-500/10 to-red-700/5"
        textColor="text-red-400"
        delay={1}
      />
      
      <StatCard 
        title="Development Progress"
        value="68%"
        icon={<Code className="h-6 w-6 text-[#ea384c]" />}
        bgColor="bg-gradient-to-br from-[#ea384c]/10 to-red-900/5"
        textColor="text-[#ea384c]"
        delay={2}
      />
      
      <StatCard 
        title="Timeline Remaining"
        value={`${stats.daysRemaining} days`}
        icon={<Clock className="h-6 w-6 text-red-400" />}
        bgColor="bg-gradient-to-br from-red-500/10 to-red-700/5"
        textColor="text-red-400"
        delay={3}
      />
    </div>
  );
}
