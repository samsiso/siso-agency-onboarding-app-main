
import { motion } from 'framer-motion';
import { Bot, Star, Grid, MessageSquare, TrendingUp, Info } from 'lucide-react';
import CountUp from 'react-countup';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatsDisplayProps {
  totalAssistants: number;
  featuredCount: number;
  categoryCount: number;
  conversationsCount: number;
}

export const StatsDisplay = ({ 
  totalAssistants, 
  featuredCount,
  categoryCount,
  conversationsCount 
}: StatsDisplayProps) => {
  const stats = [
    {
      icon: Bot,
      label: "Total Assistants",
      value: totalAssistants,
      color: "text-siso-orange",
      tooltip: "Total number of AI assistants available",
      trend: "+5% this week"
    },
    {
      icon: Star,
      label: "Featured",
      value: featuredCount,
      color: "text-yellow-500",
      tooltip: "Highly rated and popular assistants",
      trend: "+3 new"
    },
    {
      icon: Grid,
      label: "Categories",
      value: categoryCount,
      color: "text-blue-500",
      tooltip: "Different types of assistants available",
      trend: "2 trending"
    },
    {
      icon: MessageSquare,
      label: "Conversations",
      value: conversationsCount,
      color: "text-green-500",
      tooltip: "Total conversations with assistants",
      trend: "+12% today"
    }
  ];

  return (
    <TooltipProvider>
      <motion.div 
        className="flex justify-center gap-4 flex-wrap py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Tooltip key={stat.label}>
              <TooltipTrigger asChild>
                <motion.div
                  className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-siso-text/5 
                    hover:bg-siso-text/10 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <motion.div 
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-siso-orange"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    />
                  </div>
                  
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <CountUp
                        end={stat.value}
                        duration={2}
                        separator=","
                        className="text-lg font-semibold text-siso-text-bold"
                      />
                      <span className="text-sm text-siso-text/70">{stat.label}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-green-500">{stat.trend}</span>
                    </div>
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/90 text-white border-siso-text/20">
                <p>{stat.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </motion.div>
    </TooltipProvider>
  );
};
