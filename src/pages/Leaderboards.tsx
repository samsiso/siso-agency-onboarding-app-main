import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { Sidebar } from '@/components/Sidebar';

const Leaderboards = () => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;