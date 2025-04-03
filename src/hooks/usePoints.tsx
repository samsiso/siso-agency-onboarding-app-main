
import { useState } from 'react';

export const usePoints = (userId?: string | undefined) => {
  const [points, setPoints] = useState(100);
  const [rank, setRank] = useState('Beginner');
  const [isLoading, setIsLoading] = useState(false);

  // Mock function for award points
  const awardPoints = async (actionType: string) => {
    console.log(`Mock awarding points for: ${actionType}`);
    return true;
  };

  return {
    points,
    rank,
    isLoading,
    awardPoints
  };
};
