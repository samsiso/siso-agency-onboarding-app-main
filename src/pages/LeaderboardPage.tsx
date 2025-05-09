
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LeaderboardContent } from '@/components/leaderboard/components/LeaderboardContent';
import { LeaderboardStats } from '@/components/leaderboard/LeaderboardStats';
import { useUser } from '@/hooks/useUser';
import { Spotlight } from '@/components/ui/spotlight';
import { LeaderboardEntry } from '@/components/leaderboard/types';

export default function LeaderboardPage() {
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
  
  const stats = {
    totalParticipants: projectData.length,
    avgPoints: Math.round(projectData.reduce((sum, entry) => sum + entry.points, 0) / projectData.length),
    topScore: Math.max(...projectData.map(entry => entry.points))
  };
  
  const trends = {
    trend: 'up' as const,
    percentage: 12,
    points: 125,
    users: 3,
    tokens: 250
  };
  
  const loading = false;
  
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter the entries based on search query and filters
  const filteredEntries = projectData.filter(entry => {
    const nameMatch = entry.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || searchQuery === '';
  });

  // Handle user click - navigate to project portfolio page
  const handleUserClick = (entry: LeaderboardEntry) => {
    if (entry.id) {
      // Format the project name for URL (lowercase, spaces to hyphens)
      const formattedName = entry.name 
        ? entry.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        : `project-${entry.id}`;
        
      // Navigate to our new project portfolio page with ID and name in URL
      navigate(`/project-portfolio/${entry.id}/${formattedName}`);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Calculate total stats from entries
  const totalPoints = projectData.reduce((sum, entry) => sum + entry.points, 0);
  const totalUsers = projectData.length;
  const totalSisoTokens = projectData.reduce((sum, entry) => sum + (entry.siso_tokens || 0), 0);

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <Spotlight className="-top-40 left-0" />
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent mb-2">
                Top 10 Projects: Celebrating Our Biggest Achievements
              </h1>
              <p className="text-siso-text/80">
                Track project performance, investment metrics, and client engagement across the SISO platform. 
                <span className="text-white font-medium ml-1">Click on any project to view detailed information!</span>
              </p>
            </div>
            
            <LeaderboardStats
              totalUsers={stats.totalParticipants}
              totalPoints={totalPoints}
              totalSisoTokens={totalSisoTokens}
            />
            
            <LeaderboardContent 
              filteredData={filteredEntries}
              onUserClick={handleUserClick}
              onSearchChange={handleSearchChange}
              onPeriodChange={handlePeriodChange}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
