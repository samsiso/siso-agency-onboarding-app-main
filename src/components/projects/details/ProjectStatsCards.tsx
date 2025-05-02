
import { Card } from "@/components/ui/card";
import { Clock, FileText, ListTodo, Coin, AlertCircle, Envelope } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "@/components/ui/nav-link";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "./CircularProgress";

function StatCard({ 
  title, 
  value, 
  icon, 
  bgColor, 
  textColor, 
  delay = 0,
  progress,
  subtitle,
  linkHref,
  linkText
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  bgColor: string; 
  textColor: string; 
  delay?: number;
  progress?: number;
  subtitle?: string;
  linkHref?: string;
  linkText?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={`border-0 ${bgColor} shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full`}>
        <div className="p-6 flex flex-col h-full">
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
            <div className="mt-4 mb-4 flex justify-center">
              <CircularProgress 
                percentage={progress} 
                size={100} 
                strokeWidth={6} 
                circleOneColor="rgba(0,0,0,0.2)"
                circleTwoColor={`${progress >= 70 ? '#10b981' : progress >= 40 ? '#f59e0b' : '#ea384c'}`}
                className="mx-auto"
              />
            </div>
          )}
          
          {linkHref && linkText && (
            <div className="mt-auto pt-3">
              <NavLink href={linkHref} className="text-[#ea384c] hover:text-[#ea384c]/80 text-sm font-medium flex items-center justify-center">
                {linkText}
              </NavLink>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function PhaseProgressCard({ phases, delay = 0, linkHref, linkText }: { 
  phases: Array<{ name: string; progress: number }>;
  delay?: number;
  linkHref?: string;
  linkText?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="border-0 bg-gradient-to-br from-[#ea384c]/10 to-red-900/5 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm font-medium">Phase Progress</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-[#ea384c]">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {phases.map((phase, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-2 text-center">
                  <p className="text-xs text-gray-400">{phase.name}</p>
                </div>
                <CircularProgress 
                  percentage={phase.progress} 
                  size={70} 
                  strokeWidth={5} 
                  circleOneColor="rgba(0,0,0,0.2)"
                  circleTwoColor={`${phase.progress >= 70 ? '#10b981' : phase.progress >= 40 ? '#f59e0b' : '#ea384c'}`}
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-bold text-white">{phase.progress}%</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-1 py-0 px-1.5 ${
                      phase.progress > 0 && phase.progress < 100 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      phase.progress >= 100 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}
                  >
                    {phase.progress > 0 && phase.progress < 100 ? 'In progress' : 
                     phase.progress >= 100 ? 'Complete' : 'Upcoming'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {linkHref && linkText && (
            <div className="mt-auto pt-5">
              <NavLink href={linkHref} className="text-[#ea384c] hover:text-[#ea384c]/80 text-sm font-medium flex items-center justify-center">
                {linkText}
              </NavLink>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function ActionMessageCard({ 
  title, 
  icon, 
  bgColor, 
  textColor,
  items,
  delay = 0,
  linkHref,
  linkText
}: { 
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  items: Array<{ text: string; type?: string; date?: string }>;
  delay?: number;
  linkHref?: string;
  linkText?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={`border-0 ${bgColor} shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium">{title}</p>
            </div>
            <div className={`h-12 w-12 rounded-full bg-white/5 flex items-center justify-center ${textColor}`}>
              {icon}
            </div>
          </div>
          
          <div className="space-y-3 flex-grow">
            {items.map((item, index) => (
              <div key={index} className="p-3 bg-black/20 rounded-md border border-white/5">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {item.type === "warning" && <AlertCircle className="h-4 w-4 text-amber-400" />}
                    {item.type === "message" && <Envelope className="h-4 w-4 text-blue-400" />}
                    {!item.type && <div className="w-4 h-4" />}
                  </div>
                  <div className="flex-grow">
                    <p className="text-white text-sm">{item.text}</p>
                    {item.date && <p className="text-xs text-gray-400 mt-1">{item.date}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {linkHref && linkText && (
            <div className="mt-4 pt-2">
              <NavLink href={linkHref} className="text-[#ea384c] hover:text-[#ea384c]/80 text-sm font-medium flex items-center justify-center">
                {linkText}
              </NavLink>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export function ProjectStatsCards() {
  // Project data with updated stats
  const stats = {
    overallProgress: 25,
    timelineProgress: 25,
    nextMilestone: {
      name: "Phase 1 Completion",
      date: "May 21, 2025",
      tasksCompleted: 3,
      totalTasks: 6
    },
    credits: {
      spent: 614,
      tokens: 78592000,
      costPerCredit: 0.50, // Updated to £0.50 per credit
      totalValue: 6000
    },
    phases: [
      { name: "Phase 1", progress: 50 },
      { name: "Phase 2", progress: 0 },
      { name: "Phase 3", progress: 0 },
      { name: "Phase 4", progress: 0 }
    ],
    actions: [
      { text: "Make Upfront Payment (£900)", type: "warning", date: "Due today" }
    ],
    messages: [
      { text: "New message: Web3 integration update", type: "message", date: "1 hour ago" },
      { text: "Completed Initial Setup & Planning", date: "May 2, 2025" }
    ]
  };

  // Calculate total spent based on updated cost per credit
  const totalSpent = stats.credits.spent * stats.credits.costPerCredit;
  
  // Calculate next milestone percentage
  const nextMilestonePercentage = (stats.nextMilestone.tasksCompleted / stats.nextMilestone.totalTasks) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard 
        title="Overall Progress"
        value="25%"
        subtitle="Project completion"
        icon={<FileText className="h-6 w-6" />}
        bgColor="bg-gradient-to-br from-[#ea384c]/10 to-red-900/5"
        textColor="text-[#ea384c]"
        delay={0}
        progress={stats.overallProgress}
        linkHref="/projects/ubahcrypt/timeline"
        linkText="View Timeline"
      />
      
      <StatCard 
        title="Timeline"
        value="35 days"
        subtitle="Remaining until June 6, 2025"
        icon={<Clock className="h-6 w-6" />}
        bgColor="bg-gradient-to-br from-red-500/10 to-red-700/5"
        textColor="text-red-400"
        delay={1}
        progress={stats.timelineProgress}
        linkHref="/projects/ubahcrypt/timeline"
        linkText="View Timeline"
      />
      
      <StatCard 
        title="Next Milestone"
        value={stats.nextMilestone.name}
        subtitle={`${stats.nextMilestone.date} (${stats.nextMilestone.tasksCompleted}/${stats.nextMilestone.totalTasks} tasks)`}
        icon={<ListTodo className="h-6 w-6" />}
        bgColor="bg-gradient-to-br from-[#ea384c]/10 to-red-900/5"
        textColor="text-[#ea384c]"
        delay={2}
        progress={nextMilestonePercentage}
        linkHref="/projects/ubahcrypt/active-tasks"
        linkText="View Tasks"
      />

      <PhaseProgressCard 
        phases={stats.phases} 
        delay={3}
        linkHref="/projects/ubahcrypt/timeline"
        linkText="View Timeline"
      />
      
      <StatCard 
        title="Credits Spent"
        value={`£${totalSpent.toFixed(2)}`}
        subtitle={`${stats.credits.spent} credits (${(stats.credits.tokens / 1000000).toFixed(1)}M tokens)`}
        icon={<Coin className="h-6 w-6" />}
        bgColor="bg-gradient-to-br from-red-500/10 to-red-700/5"
        textColor="text-red-400"
        delay={4}
        linkHref="/projects/ubahcrypt/financial"
        linkText="View Financial Details"
      />
      
      <ActionMessageCard
        title="Outstanding Actions"
        icon={<AlertCircle className="h-6 w-6" />}
        bgColor="bg-gradient-to-br from-amber-500/10 to-amber-700/5"
        textColor="text-amber-400"
        items={stats.actions}
        delay={5}
        linkHref="/projects/ubahcrypt/active-tasks"
        linkText="View Tasks"
      />
      
      <ActionMessageCard
        title="Messages & Updates"
        icon={<Envelope className="h-6 w-6" />}
        bgColor="bg-gradient-to-br from-blue-500/10 to-blue-700/5"
        textColor="text-blue-400"
        items={stats.messages}
        delay={6}
        linkHref="#"
        linkText="View Messages"
      />
    </div>
  );
}
