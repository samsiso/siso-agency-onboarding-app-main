import React from 'react';
import { Trophy, ExternalLink, Code, Briefcase, Calendar, TrendingUp, TrendingDown, CircleDollarSign, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from '@/components/leaderboard/types';
import { motion } from 'framer-motion';

interface PortfolioLeaderboardTableProps {
  projectData: (LeaderboardEntry & {
    project_name: string;
    live_url: string;
    technologies: string[];
    development_status: string;
    completion_percentage: number;
    estimated_value: number;
  })[];
  onProjectClick: (entry: any) => void;
}

export const PortfolioLeaderboardTable = ({ projectData, onProjectClick }: PortfolioLeaderboardTableProps) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 text-xs bg-green-500/30 text-green-200 rounded-full">Completed</span>;
      case 'near_complete':
        return <span className="px-2 py-0.5 text-xs bg-blue-500/30 text-blue-200 rounded-full">Near Complete</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 text-xs bg-yellow-500/30 text-yellow-200 rounded-full">In Progress</span>;
      case 'pending':
        return <span className="px-2 py-0.5 text-xs bg-gray-500/30 text-gray-200 rounded-full">Pending</span>;
      default:
        return <span className="px-2 py-0.5 text-xs bg-orange-500/30 text-orange-200 rounded-full">Unknown</span>;
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Trophy className="h-6 w-6 text-gray-300" />;
      case 2:
        return <Trophy className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getTrendIndicator = (index: number) => {
    const trends = [
      { value: 5, isUp: true },
      { value: 3, isUp: true },
      { value: -1, isUp: false },
      { value: 2, isUp: true },
      { value: 4, isUp: true },
      { value: -2, isUp: false },
      { value: 1, isUp: true },
    ];
    
    const trend = trends[index] || { value: 0, isUp: true };
    
    return (
      <span className={cn(
        "inline-flex items-center text-xs",
        trend.isUp ? "text-green-500" : "text-red-500"
      )}>
        {trend.isUp ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}
      </span>
    );
  };

  const handleProjectClick = (entry: any) => {
    if (entry.live_url) {
      window.open(entry.live_url, '_blank', 'noopener,noreferrer');
    }
    onProjectClick(entry);
  };

  return (
    <div className="relative overflow-x-auto rounded-lg border border-gray-700 bg-black">
      <Table>
        <TableHeader className="sticky top-0 bg-gray-900 z-10">
          <TableRow className="border-b border-gray-800">
            <TableHead className="w-[80px] text-center text-gray-300">Rank</TableHead>
            <TableHead className="text-gray-300">Project</TableHead>
            <TableHead className="text-center text-gray-300">Client</TableHead>
            <TableHead className="text-center text-gray-300">Status</TableHead>
            <TableHead className="text-center text-gray-300">Progress</TableHead>
            <TableHead className="text-center text-gray-300">Value</TableHead>
            <TableHead className="text-center text-gray-300">Tech Stack</TableHead>
            <TableHead className="text-center text-gray-300">Trend</TableHead>
            <TableHead className="text-center text-gray-300">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectData.map((entry, index) => {
            return (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "transition-all duration-200 cursor-pointer group text-white border-b border-gray-800",
                  index === 0 ? "bg-yellow-500/10 hover:bg-yellow-500/20" :
                  index === 1 ? "bg-gray-500/10 hover:bg-gray-500/20" :
                  index === 2 ? "bg-amber-500/10 hover:bg-amber-500/20" :
                  index < 10 ? "bg-gray-800/50 hover:bg-gray-800/70" :
                  "hover:bg-gray-800/30"
                )}
                onClick={() => handleProjectClick(entry)}
              >
                <TableCell className="text-center font-medium">
                  <div className="flex items-center justify-center gap-2">
                    {getRankBadge(index)}
                    <span className={cn(
                      "font-bold",
                      index < 3 ? "text-white" : "text-gray-300"
                    )}>
                      {index + 1}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-siso-red to-siso-orange flex items-center justify-center text-white font-bold">
                        {entry.project_name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{entry.project_name}</p>
                      <p className="text-xs text-gray-400 max-w-[200px] truncate">{entry.profile?.bio}</p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="h-4 w-4 text-siso-orange" />
                    <span className="font-medium">{entry.profile?.full_name}</span>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  {getStatusBadge(entry.development_status)}
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-siso-red to-siso-orange transition-all duration-300"
                        style={{ width: `${entry.completion_percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{entry.completion_percentage}%</span>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium">${entry.estimated_value.toLocaleString()}</span>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Code className="h-4 w-4 text-blue-400" />
                    <span className="text-xs">{entry.technologies.length} techs</span>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  {getTrendIndicator(index)}
                </TableCell>
                
                <TableCell className="text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(entry.live_url, '_blank', 'noopener,noreferrer');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-siso-orange/20 hover:bg-siso-orange/30 text-siso-orange text-xs rounded-full transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    Live
                  </button>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}; 