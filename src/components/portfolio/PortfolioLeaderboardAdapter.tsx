import React from 'react';
import { PortfolioItem } from '@/types/portfolio';
import { LeaderboardEntry } from '@/components/leaderboard/types';

interface PortfolioLeaderboardAdapterProps {
  portfolioItems: PortfolioItem[];
}

export const adaptPortfolioToLeaderboard = (portfolioItems: PortfolioItem[]): LeaderboardEntry[] => {
  return portfolioItems.map((item, index) => {
    // Calculate points based on status and features
    const getPoints = (status: string, highlights: string[]) => {
      let basePoints = 0;
      switch (status) {
        case 'completed': basePoints = 1000; break;
        case 'near_complete': basePoints = 800; break;
        case 'in_progress': basePoints = 600; break;
        case 'pending': basePoints = 200; break;
        default: basePoints = 100;
      }
      return basePoints + (highlights.length * 50);
    };

    // Calculate estimated value based on project complexity
    const getEstimatedValue = (technologies: string[], highlights: string[]) => {
      const techMultiplier = technologies.length * 500;
      const featureMultiplier = highlights.length * 200;
      const baseValue = 2000;
      return baseValue + techMultiplier + featureMultiplier;
    };

    // Map development status to completion percentage
    const getCompletionPercentage = (status: string) => {
      switch (status) {
        case 'completed': return 100;
        case 'near_complete': return 90;
        case 'in_progress': return 60;
        case 'pending': return 10;
        default: return 0;
      }
    };

    return {
      id: item.id,
      user_id: item.user_id,
      points: getPoints(item.development_status, item.highlights),
      rank: index + 1,
      level: Math.ceil((index + 1) / 2), // Simple level calculation
      streak_days: Math.floor(Math.random() * 100), // Mock data
      siso_tokens: getEstimatedValue(item.technologies, item.highlights),
      updated_at: new Date().toISOString(),
      contribution_count: item.highlights.length,
      referral_count: item.technologies.length,
      achievements: item.highlights.map(highlight => ({
        name: highlight,
        icon: '🎯'
      })),
      profile: {
        full_name: item.client_name,
        email: `contact@${item.client_name.toLowerCase().replace(/\s+/g, '-')}.com`,
        bio: item.description,
        avatar_url: item.image_url,
        website_url: item.live_url,
        professional_role: 'Client',
        business_name: item.client_name,
        industry: 'Technology'
      },
      // Custom fields for portfolio display
      project_name: item.title,
      live_url: item.live_url,
      technologies: item.technologies,
      development_status: item.development_status,
      completion_percentage: getCompletionPercentage(item.development_status),
      estimated_value: getEstimatedValue(item.technologies, item.highlights)
    } as LeaderboardEntry & {
      project_name: string;
      live_url: string;
      technologies: string[];
      development_status: string;
      completion_percentage: number;
      estimated_value: number;
    };
  });
};

export const PortfolioLeaderboardAdapter: React.FC<PortfolioLeaderboardAdapterProps> = ({ 
  portfolioItems 
}) => {
  return null; // This is a utility component
}; 