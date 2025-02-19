
// [Analysis] Separate statistics calculation logic for better maintainability
export const calculateStats = (items: any[]) => {
  const total = items.length;
  if (total === 0) return null;

  const impactDistribution = {
    high: items.filter(item => item.impact === 'high').length,
    medium: items.filter(item => item.impact === 'medium').length,
    low: items.filter(item => item.impact === 'low').length,
  };

  const categoryDistribution = items.reduce((acc: Record<string, number>, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalDevelopments: total,
    impactDistribution,
    categoryDistribution,
    averageComplexity: items.reduce((sum, item) => {
      const complexityScore = item.technical_complexity === 'advanced' ? 3 
        : item.technical_complexity === 'intermediate' ? 2 : 1;
      return sum + complexityScore;
    }, 0) / total
  };
};
