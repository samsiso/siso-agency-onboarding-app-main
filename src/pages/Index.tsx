import { Hero } from '@/components/Hero';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';

const Index = () => {
  return (
    <>
      <Hero />
      <div className="px-4 py-8">
        <Leaderboard />
      </div>
    </>
  );
};

export default Index;