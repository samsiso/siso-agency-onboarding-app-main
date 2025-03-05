
// [Analysis] Utility functions to analyze news data and extract meaningful stats
import { NewsItem } from '@/types/blog';

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
      percentage: Math.round((count / newsItems.length) * 100)
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
  
  const total = newsItems.length;
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
  
  const total = newsItems.length;
  return Object.entries(complexity).map(([level, count]) => ({
    level,
    count,
    percentage: Math.round((count / total) * 100) || 0
  })).sort((a, b) => b.count - a.count);
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
    .slice(0, 5)
    .map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / newsItems.length) * 100)
    }));
};
