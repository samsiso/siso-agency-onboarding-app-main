
import React from 'react';
import { FinancialLayout } from '@/components/layout/FinancialLayout';
import { useNavigate } from 'react-router-dom';
import { Spotlight } from '@/components/ui/spotlight';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FolderOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { LeaderboardEntry } from '@/components/leaderboard/types';

// Project data for the leaderboard
const projectData: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Optimal Construction',
    website_url: 'https://optimal-building-maintenance.vercel.app/',
    points: 1500,
    spending: 15000,
    siso_tokens: 3000,
    milestones_achieved: '4/8',
    client_engagement: 60,
    community_impact: 5,
    updated_at: '2025-03-01T00:00:00Z',
    description: 'Building maintenance and construction services',
    status: 'in-progress',
    rank: 1
  },
  {
    id: '2',
    name: 'UbahCryp',
    website_url: 'https://ubahcrypcom.vercel.app/',
    points: 500,
    spending: 5000,
    siso_tokens: 1000,
    milestones_achieved: '8/8',
    client_engagement: 90,
    community_impact: 10,
    updated_at: '2025-03-20T00:00:00Z',
    description: 'A cryptocurrency trading platform built with React and Web3 technologies',
    status: 'completed',
    rank: 2
  },
  {
    id: '3',
    name: 'Gritness',
    website_url: 'https://gritnessgym.vercel.app/',
    points: 25,
    spending: 249,
    siso_tokens: 50,
    milestones_achieved: '6/8',
    client_engagement: 40,
    community_impact: 3,
    updated_at: '2025-05-09T00:00:00Z',
    description: 'A gym management and fitness tracking application',
    status: 'in-progress',
    rank: 3
  },
  {
    id: '4',
    name: 'Trojan MMA',
    website_url: 'https://trojan-mma.vercel.app/',
    points: 25,
    spending: 249,
    siso_tokens: 50,
    milestones_achieved: '6/8',
    client_engagement: 35,
    community_impact: 2,
    updated_at: '2025-03-27T00:00:00Z',
    description: 'MMA gym and training center website',
    status: 'in-progress',
    rank: 4
  },
  {
    id: '5',
    name: 'Lets Go',
    website_url: 'https://lets-go-u7hh.vercel.app/',
    points: 25,
    spending: 249,
    siso_tokens: 50,
    milestones_achieved: '7/8',
    client_engagement: 80,
    community_impact: 4,
    updated_at: '2025-03-26T00:00:00Z',
    description: 'Travel and adventure booking platform',
    status: 'nearly-completed',
    rank: 5
  },
  {
    id: '6',
    name: 'NM Construction',
    website_url: 'https://nm-construction.vercel.app/',
    points: 0,
    spending: 0,
    siso_tokens: 0,
    milestones_achieved: '4/8',
    client_engagement: 50,
    community_impact: 1,
    updated_at: '2025-03-01T00:00:00Z',
    description: 'Construction company website with project portfolio',
    status: 'in-progress',
    rank: 6
  },
  {
    id: '7',
    name: 'Elementree',
    website_url: 'https://elementree.vercel.app/',
    points: 0,
    spending: 0,
    siso_tokens: 0,
    milestones_achieved: '5/8',
    client_engagement: 30,
    community_impact: 1,
    updated_at: '2025-05-09T00:00:00Z',
    description: 'Arborist and tree care services website',
    status: 'in-progress',
    rank: 7
  },
  {
    id: '8',
    name: 'Mu Shin',
    website_url: 'https://siso-mu-shin.vercel.app/',
    points: 0,
    spending: 0,
    siso_tokens: 0,
    milestones_achieved: '8/8',
    client_engagement: 20,
    community_impact: 0,
    updated_at: '2025-03-20T00:00:00Z',
    description: 'Martial arts school and training center',
    status: 'declined',
    rank: 8
  },
  {
    id: '9',
    name: '5 Star Hire',
    website_url: 'https://5-star-hire.vercel.app/',
    points: 0,
    spending: 0,
    siso_tokens: 0,
    milestones_achieved: '3/8',
    client_engagement: 25,
    community_impact: 0,
    updated_at: '2025-05-09T00:00:00Z',
    description: 'Equipment hire and rental service',
    status: 'early-progress',
    rank: 9
  },
  {
    id: '10',
    name: 'Keegan Saas',
    website_url: '',
    points: 0,
    spending: 0,
    siso_tokens: 0,
    milestones_achieved: '0/8',
    client_engagement: 15,
    community_impact: 0,
    updated_at: '2025-05-09T00:00:00Z',
    description: 'SaaS platform for business management',
    status: 'not-started',
    rank: 10
  }
];

export default function LeaderboardsPage() {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/20";
      case "in-progress": return "bg-amber-500/20 text-amber-400 border-amber-500/20";
      case "nearly-completed": return "bg-blue-500/20 text-blue-400 border-blue-500/20";
      case "early-progress": return "bg-purple-500/20 text-purple-400 border-purple-500/20";
      case "not-started": return "bg-gray-500/20 text-gray-400 border-gray-500/20";
      case "declined": return "bg-red-500/20 text-red-400 border-red-500/20";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <FinancialLayout title="Leaderboards">
      <div className="relative">
        <Spotlight className="-top-40 left-0" />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
            Top 10 Projects: Celebrating Our Biggest Achievements
          </h1>
          <p className="text-siso-text mt-2 max-w-3xl">
            Our top 10 projects showcase innovation and investment, ranked by project value, points, and SISO tokens earned.
          </p>
        </div>
        
        <div className="mb-10">
          <LeaderboardTable leaderboardData={projectData} />
          
          <div className="mt-4 text-center italic text-gray-500 text-sm">
            Want to see your project shine on the leaderboard? Start building with Siso Agency and earn points and SISO tokens with every milestone!
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Project Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectData.slice(0, 3).map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="group"
              >
                <Card className="overflow-hidden border border-white/10 bg-black/30 transition-all duration-300 hover:border-siso-orange/30 hover:shadow-lg">
                  <div className="relative h-52 w-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                    <div className="h-full w-full bg-gradient-to-br from-siso-bg-alt to-black"></div>
                    <div className="absolute bottom-4 left-4 z-20">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-6 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                        <p className="text-sm text-siso-text">
                          {project.points} Points · £{project.spending.toLocaleString()} · {project.siso_tokens} SISO
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {project.website_url && (
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white/10" asChild>
                            <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 rounded-full hover:bg-white/10" 
                          onClick={() => navigate(`/portfolio/${project.id.toLowerCase()}`)}
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="mb-6 text-sm text-gray-400 line-clamp-3">
                      {project.description}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="border-t border-white/10 p-4 bg-black/20">
                    <Button 
                      className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 text-white"
                      onClick={() => navigate(`/portfolio/${project.id.toLowerCase()}`)}
                    >
                      View Portfolio
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </FinancialLayout>
  );
}
