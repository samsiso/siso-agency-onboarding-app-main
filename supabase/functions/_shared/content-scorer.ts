
// [Analysis] Agency-focused content scoring system
// [Framework] Using a weighted scoring approach to prioritize relevant articles

type ScoringCriteria = {
  keywords: {[key: string]: number},
  categories: {[key: string]: number},
  titleMultiplier: number,
  descriptionMultiplier: number,
  contentMultiplier: number
};

// [Analysis] Scoring configuration focused on agency-relevant content
export const agencyScoringCriteria: ScoringCriteria = {
  keywords: {
    // [Analysis] Client-focused terms get higher weights
    'agency': 10,
    'client': 9,
    'business': 8,
    'revenue': 8,
    'marketing': 7,
    'implementation': 7,
    'service': 7,
    'strategy': 7,
    'automation': 6,
    'productivity': 6,
    'workflow': 6,
    'roi': 6,
    'enterprise': 5,
    'integration': 5,
    'solution': 5,
    'ai model': 4,
    'llm': 4,
    'chatgpt': 4,
    'claude': 4,
    'gpt-4': 4,
    'gemini': 4
  },
  categories: {
    'industry_applications': 1.5,
    'breakthrough_technologies': 1.3,
    'products_launches': 1.2,
    'ai_research': 0.8,
    'policy_ethics': 0.5,
  },
  titleMultiplier: 2.0,
  descriptionMultiplier: 1.0,
  contentMultiplier: 0.5
};

/**
 * Scores content based on agency relevance
 * [Analysis] This helps prioritize the most valuable content for our audience
 */
export function scoreContent(article: {
  title: string;
  description?: string;
  content?: string;
  category?: string;
}, criteria: ScoringCriteria = agencyScoringCriteria): number {
  let score = 0;
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  const content = article.content?.toLowerCase() || '';
  const category = article.category || 'industry_applications';
  
  // Score keywords in title (highest weight)
  Object.entries(criteria.keywords).forEach(([keyword, weight]) => {
    if (title.includes(keyword.toLowerCase())) {
      score += weight * criteria.titleMultiplier;
    }
    
    if (description.includes(keyword.toLowerCase())) {
      score += weight * criteria.descriptionMultiplier;
    }
    
    if (content.includes(keyword.toLowerCase())) {
      score += weight * criteria.contentMultiplier;
    }
  });
  
  // Apply category multiplier
  if (criteria.categories[category]) {
    score *= criteria.categories[category];
  }
  
  // [Analysis] Bonus for business implementation terms in title
  const businessTerms = ['roi', 'client', 'revenue', 'business', 'agency'];
  const hasBusiness = businessTerms.some(term => title.includes(term));
  if (hasBusiness) {
    score *= 1.25; // 25% bonus
  }
  
  return Math.round(score);
}

/**
 * Determines if an article should be processed based on score threshold
 * [Analysis] Acts as a quality gate to filter low-relevance content
 */
export function shouldProcessArticle(
  article: {title: string; description?: string; content?: string; category?: string},
  minimumScore: number = 10
): boolean {
  const score = scoreContent(article);
  return score >= minimumScore;
}
