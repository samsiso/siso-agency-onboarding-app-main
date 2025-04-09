
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';

export default function LeaderboardPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-6">
          Leaderboard
        </h1>
        <Leaderboard />
      </div>
    </MainLayout>
  );
}
