
// [Analysis] Utility functions to analyze news data and extract meaningful stats
import { NewsItem } from '@/types/blog';
import { format, subDays } from 'date-fns';

// [Analysis] Calculates the most common categories among news items
export const calculateTopCategories = (newsItems: NewsItem[], limit: number = 5) => {
  const categories: Record<string, number> = {};
  
  newsItems.forEach(item => {
    if (item.category) {
      const category = item.category.replace(/_/g, ' ');
      categories[category] = (categories[category] || 0) + 1;
    }
  });
  
  return Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / newsItems.length) * 100) || 0
    }));
};

// [Analysis] Calculates the breakdown of impact levels (high, medium, low)
export const calculateImpactBreakdown = (newsItems: NewsItem[]) => {
  const impacts: Record<string, number> = {
    high: 0,
    medium: 0,
    low: 0
  };
  
  newsItems.forEach(item => {
    if (item.impact && impacts.hasOwnProperty(item.impact)) {
      impacts[item.impact] += 1;
    } else {
      impacts.medium += 1; // Default to medium if not specified
    }
  });
  
  const total = newsItems.length || 1; // Avoid division by zero
  return {
    high: {
      count: impacts.high,
      percentage: Math.round((impacts.high / total) * 100) || 0
    },
    medium: {
      count: impacts.medium,
      percentage: Math.round((impacts.medium / total) * 100) || 0
    },
    low: {
      count: impacts.low,
      percentage: Math.round((impacts.low / total) * 100) || 0
    }
  };
};

// [Analysis] Calculates the breakdown of technical complexity levels
export const calculateComplexityBreakdown = (newsItems: NewsItem[]) => {
  const complexity: Record<string, number> = {
    basic: 0,
    intermediate: 0,
    advanced: 0,
    mixed: 0
  };
  
  newsItems.forEach(item => {
    const level = item.technical_complexity || 'intermediate';
    if (complexity.hasOwnProperty(level)) {
      complexity[level] += 1;
    } else {
      complexity.intermediate += 1; // Default to intermediate if not specified
    }
  });
  
  const total = newsItems.length || 1; // Avoid division by zero
  return Object.entries(complexity)
    .filter(([_, count]) => count > 0) // Only include non-zero counts
    .map(([level, count]) => ({
      level,
      count,
      percentage: Math.round((count / total) * 100) || 0
    }))
    .sort((a, b) => b.count - a.count);
};

// [Analysis] Extracts commonly mentioned technologies/topics from titles and descriptions
export const extractTrendingTopics = (newsItems: NewsItem[]) => {
  // Common AI-related keywords to look for
  const keywordRegex = /\b(GPT-4|GPT-5|Gemini|Claude|LLM|multimodal|AI model|transformer|deep learning|neural network|machine learning|NLP|computer vision|OpenAI|Anthropic|Google|Microsoft|Meta|Apple|generative AI|diffusion|prompt|fine-tuning|RAG|retrieval|augmented|embedding|vectorstore|chatbot|agent|autonomous|robotics)\b/gi;
  
  const topics: Record<string, number> = {};
  
  newsItems.forEach(item => {
    const text = `${item.title} ${item.description || ''}`;
    const matches = text.match(keywordRegex);
    
    if (matches) {
      matches.forEach(match => {
        const normalizedMatch = match.toLowerCase();
        topics[normalizedMatch] = (topics[normalizedMatch] || 0) + 1;
      });
    }
  });
  
  return Object.entries(topics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([topic, count]) => ({
      topic: topic.charAt(0).toUpperCase() + topic.slice(1),
      count
    }));
};

// [Analysis] Calculates the distribution of content by source
export const calculateSourceDistribution = (newsItems: NewsItem[]) => {
  const sources: Record<string, number> = {};
  
  newsItems.forEach(item => {
    if (item.source) {
      sources[item.source] = (sources[item.source] || 0) + 1;
    }
  });
  
  return Object.entries(sources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Increase to support expanded view
    .map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / newsItems.length) * 100) || 0
    }));
};

// [Analysis] NEW: Generate simulated historical data for trend analysis
// In a real app, this would fetch actual historical data
export const generateHistoricalTrends = (daysBack: number = 7) => {
  const trends = [];
  const today = new Date();
  
  for (let i = daysBack - 1; i >= 0; i--) {
    const date = subDays(today, i);
    trends.push({
      date: format(date, 'MMM dd'),
      high: Math.floor(Math.random() * 30) + 10,
      medium: Math.floor(Math.random() * 40) + 30,
      low: Math.floor(Math.random() * 20) + 10
    });
  }
  
  return trends;
};

// [Analysis] NEW: Calculate sentiment distribution from news content
export const calculateSentimentDistribution = (newsItems: NewsItem[]) => {
  // In a real app, this would use NLP to analyze sentiment
  // Here we're using a simple keyword-based approach
  const positiveKeywords = ['breakthrough', 'innovation', 'success', 'advance', 'improve'];
  const negativeKeywords = ['concern', 'risk', 'danger', 'problem', 'issue', 'controversy'];
  
  let positive = 0;
  let negative = 0;
  let neutral = 0;
  
  newsItems.forEach(item => {
    const text = `${item.title} ${item.description || ''}`.toLowerCase();
    
    const posMatches = positiveKeywords.some(keyword => text.includes(keyword));
    const negMatches = negativeKeywords.some(keyword => text.includes(keyword));
    
    if (posMatches && !negMatches) {
      positive++;
    } else if (negMatches && !posMatches) {
      negative++;
    } else if (posMatches && negMatches) {
      // If both positive and negative keywords are found, check which has more
      const posCount = positiveKeywords.filter(keyword => text.includes(keyword)).length;
      const negCount = negativeKeywords.filter(keyword => text.includes(keyword)).length;
      
      if (posCount > negCount) positive++;
      else if (negCount > posCount) negative++;
      else neutral++;
    } else {
      neutral++;
    }
  });
  
  const total = newsItems.length || 1;
  return {
    positive: {
      count: positive,
      percentage: Math.round((positive / total) * 100)
    },
    neutral: {
      count: neutral,
      percentage: Math.round((neutral / total) * 100)
    },
    negative: {
      count: negative,
      percentage: Math.round((negative / total) * 100)
    }
  };
};
