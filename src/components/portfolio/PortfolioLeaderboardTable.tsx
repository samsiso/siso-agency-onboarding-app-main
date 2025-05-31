import React from 'react';
import { Trophy, ExternalLink, Zap, Users, TrendingUp, Code, Database, Palette, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { LeaderboardEntry } from '@/components/leaderboard/types';

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
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">LIVE</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-400 text-xs font-medium">BUILDING</span>
          </div>
        );
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 0:
        return (
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/25">
              <Trophy className="h-8 w-8 text-yellow-900" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-siso-orange to-siso-red rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 animate-pulse"></div>
          </div>
        );
      case 1:
        return (
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg shadow-gray-400/25">
              <Trophy className="h-7 w-7 text-gray-700" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-siso-orange to-siso-red rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-full flex items-center justify-center shadow-lg shadow-amber-600/25">
              <Trophy className="h-6 w-6 text-amber-200" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-siso-orange to-siso-red rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border border-gray-600 shadow-lg">
            <span className="text-gray-300 text-sm font-bold">{position + 1}</span>
          </div>
        );
    }
  };

  const getTechIcon = (tech: string) => {
    const techLower = tech.toLowerCase();
    if (techLower.includes('react') || techLower.includes('next')) return { icon: Code, color: 'text-blue-400 bg-blue-400/10' };
    if (techLower.includes('node') || techLower.includes('express')) return { icon: Database, color: 'text-green-400 bg-green-400/10' };
    if (techLower.includes('typescript') || techLower.includes('javascript')) return { icon: Code, color: 'text-yellow-400 bg-yellow-400/10' };
    if (techLower.includes('tailwind') || techLower.includes('css')) return { icon: Palette, color: 'text-cyan-400 bg-cyan-400/10' };
    if (techLower.includes('vercel') || techLower.includes('netlify')) return { icon: Globe, color: 'text-purple-400 bg-purple-400/10' };
    return { icon: Code, color: 'text-gray-400 bg-gray-400/10' };
  };

  const getBusinessMetrics = (projectName: string, value: number) => {
    const metrics = {
      'Gritness Gym': { users: '1.2K', growth: '+40%', performance: '98%' },
      'OPTIMAL CONSTRUCTION': { users: '5.8K', growth: '+125%', performance: '99%' },
      'UbahCryp': { users: '8.5K', growth: '+220%', performance: '99.9%' },
      'Elementree': { users: '2.1K', growth: '+60%', performance: '97%' },
      'Trojan MMA': { users: '890', growth: '+35%', performance: '96%' },
      'Lets Go': { users: '10K+', growth: '+180%', performance: '98%' },
      'Mu Shin': { users: '1.5K', growth: '+95%', performance: '99%' },
      '5 Star Hire': { users: '3.2K', growth: '+75%', performance: '98%' },
      'NM Construction': { users: '2.8K', growth: '+85%', performance: '97%' }
    };
    return metrics[projectName as keyof typeof metrics] || { users: '1K+', growth: '+50%', performance: '98%' };
  };

  const getProjectDescription = (projectName: string) => {
    const descriptions = {
      'Gritness Gym': 'Fitness platform with class scheduling & membership management',
      'NM Construction': 'Professional construction website with project showcases',
      'OPTIMAL CONSTRUCTION': 'Building maintenance & construction services platform',
      'UbahCryp': 'Advanced cryptocurrency trading platform with real-time data',
      'Elementree': 'Modern restaurant website with online ordering system',
      'Trojan MMA': 'MMA gym with class schedules & training programs',
      'Lets Go': 'Social networking & event planning application',
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
    <div className="space-y-4">
      {projectData.map((entry, index) => {
        const metrics = getBusinessMetrics(entry.project_name, entry.estimated_value);
        const isTopThree = index < 3;
        
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              isTopThree 
                ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 border-siso-orange/30 shadow-lg shadow-siso-orange/10' 
                : 'bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 border-gray-700/50 hover:border-siso-orange/20'
            }`}
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
            onClick={() => handleProjectClick(entry)}
          >
            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-siso-orange/5 via-transparent to-siso-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                {/* Left Section: Rank + Project Info */}
                <div className="flex items-start gap-6">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    {getRankBadge(index)}
                  </div>
                  
                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-siso-orange transition-colors duration-200">
                        {entry.project_name}
                      </h3>
                      {getStatusBadge(entry.development_status)}
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                      {getProjectDescription(entry.project_name)}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-300">
                        <span className="text-gray-500">Client:</span> {entry.profile?.full_name}
                      </span>
                      <span className="text-siso-orange font-bold text-lg">
                        £{entry.estimated_value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Right Section: Action Button */}
                <button
                  onClick={(e) => handleViewLiveClick(entry, e)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-siso-orange to-siso-red hover:from-siso-red hover:to-siso-orange text-black font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-siso-orange/25 hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Live
                </button>
              </div>
              
              {/* Middle Section: Technology Stack */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Technology Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {entry.technologies.slice(0, 6).map((tech, techIndex) => {
                    const { icon: TechIcon, color } = getTechIcon(tech);
                    return (
                      <div
                        key={techIndex}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-600/50 backdrop-blur-sm ${color} transition-all duration-200 hover:scale-105`}
                      >
                        <TechIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium text-gray-200">{tech}</span>
                      </div>
                    );
                  })}
                  {entry.technologies.length > 6 && (
                    <div className="flex items-center px-3 py-1.5 rounded-lg border border-gray-600/50 bg-gray-400/10">
                      <span className="text-xs font-medium text-gray-400">
                        +{entry.technologies.length - 6} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bottom Section: Progress + Metrics */}
              <div className="flex items-center justify-between">
                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-medium">Progress</span>
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-siso-orange to-siso-red transition-all duration-500 ease-out"
                      style={{ width: `${entry.completion_percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-300 font-medium">{entry.completion_percentage}%</span>
                </div>
                
                {/* Business Metrics */}
                <div className="flex items-center gap-6 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-gray-400">Users:</span>
                    <span className="text-blue-400 font-medium">{metrics.users}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-gray-400">Growth:</span>
                    <span className="text-green-400 font-medium">{metrics.growth}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-yellow-400 font-medium">{metrics.performance}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}; 