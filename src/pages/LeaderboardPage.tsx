
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import Leaderboard from '@/components/leaderboard/Leaderboard';
import { LeaderboardEntry } from '@/components/leaderboard/types';
import { useState } from 'react';

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(false);
  
  // Mock leaderboard entries
  const mockEntries: LeaderboardEntry[] = Array.from({ length: 10 }, (_, i) => ({
    id: `user-${i + 1}`,
    user_id: `user-${i + 1}`,
    points: Math.floor(Math.random() * 1000) + 100,
    level: Math.floor(Math.random() * 10) + 1,
    streak_days: Math.floor(Math.random() * 30),
    rank: (i + 1).toString(),
    siso_tokens: Math.floor(Math.random() * 500),
    updated_at: new Date().toISOString(),
    contribution_count: Math.floor(Math.random() * 50),
    referral_count: Math.floor(Math.random() * 20),
    achievements: [
      { name: 'First Contribution', icon: '🏆' },
      { name: 'Streak Master', icon: '🔥' }
    ],
    profile: {
      full_name: `User ${i + 1}`,
      email: `user${i+1}@example.com`,
      avatar_url: '',
      bio: `This is user ${i + 1}'s bio`,
      professional_role: 'Developer'
    }
  }));

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-6">
          Leaderboard
        </h1>
        <Leaderboard entries={mockEntries} loading={loading} />
      </div>
    </MainLayout>
  );
}
