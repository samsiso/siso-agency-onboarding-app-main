import React from 'react';
import { Trophy } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
        return <span className="px-3 py-1 text-xs bg-siso-orange/20 text-siso-orange rounded-full border border-siso-orange/30">Live</span>;
      default:
        return <span className="px-3 py-1 text-xs bg-gray-800 text-gray-400 rounded-full border border-gray-700">In Progress</span>;
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 0:
        return (
          <div className="flex items-center justify-center">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="ml-2 text-yellow-500 font-bold">#1</span>
          </div>
        );
      case 1:
        return (
          <div className="flex items-center justify-center">
            <Trophy className="h-6 w-6 text-gray-300" />
            <span className="ml-2 text-gray-300 font-bold">#2</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center">
            <Trophy className="h-6 w-6 text-amber-600" />
            <span className="ml-2 text-amber-600 font-bold">#3</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-sm font-medium">
            {position + 1}
          </div>
        );
    }
  };

  const getProjectDescription = (projectName: string) => {
    const descriptions = {
      'Gritness Gym': 'Modern fitness platform with class scheduling and membership management',
      'NM Construction': 'Professional construction company website with project showcases',
      'OPTIMAL CONSTRUCTION': 'Building maintenance and construction services platform',
      'UbahCryp': 'Advanced cryptocurrency trading platform with real-time data',
      'Elementree': 'Modern restaurant website with online ordering system',
      'Trojan MMA': 'Mixed Martial Arts gym with class schedules and training programs',
      'Lets Go': 'Social networking and event planning application',
      'Mu Shin': 'Self-defense training platform with video courses',
      '5 Star Hire': 'Premium car rental service with booking system'
    };
    return descriptions[projectName as keyof typeof descriptions] || 'Custom digital solution';
  };

  const handleProjectClick = (entry: any) => {
    onProjectClick(entry);
  };

  const handleViewLiveClick = (entry: any, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(entry.live_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-800">
            <TableHead className="w-[100px] text-center text-gray-400 font-medium">Rank</TableHead>
            <TableHead className="text-gray-400 font-medium">Project</TableHead>
            <TableHead className="text-center text-gray-400 font-medium">Client</TableHead>
            <TableHead className="text-center text-gray-400 font-medium">Status</TableHead>
            <TableHead className="text-center text-gray-400 font-medium">Progress</TableHead>
            <TableHead className="text-center text-gray-400 font-medium">Technologies</TableHead>
            <TableHead className="text-center text-gray-400 font-medium">Value</TableHead>
            <TableHead className="text-center text-gray-400 font-medium">Action</TableHead>
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
                className={`border-b border-gray-900 hover:bg-gray-900/50 cursor-pointer transition-colors duration-200 ${
                  index === 0 ? 'bg-yellow-500/5' : 
                  index === 1 ? 'bg-gray-500/5' : 
                  index === 2 ? 'bg-amber-600/5' : ''
                }`}
                onClick={() => handleProjectClick(entry)}
              >
                <TableCell className="text-center">
                  {getRankBadge(index)}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-siso-orange to-siso-red flex items-center justify-center text-white font-bold text-sm">
                      {entry.project_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{entry.project_name}</p>
                      <p className="text-sm text-gray-500 max-w-[200px] truncate">{getProjectDescription(entry.project_name)}</p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="text-gray-300">{entry.profile?.full_name}</span>
                </TableCell>
                
                <TableCell className="text-center">
                  {getStatusBadge(entry.development_status)}
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-siso-orange to-siso-red transition-all duration-300"
                        style={{ width: `${entry.completion_percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{entry.completion_percentage}%</span>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm text-gray-400">{entry.technologies.length} techs</span>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="text-white font-medium">${entry.estimated_value.toLocaleString()}</span>
                </TableCell>
                
                <TableCell className="text-center">
                  <button
                    onClick={(e) => handleViewLiveClick(entry, e)}
                    className="px-4 py-2 bg-siso-orange hover:bg-siso-orange/90 text-black text-sm font-medium rounded-lg transition-colors"
                  >
                    View Live
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