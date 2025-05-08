import { supabase } from "@/lib/supabase";

export type ProjectFeature = {
  id: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  currency: string;
  project_id: string;
  status: string;
};

export async function fetchProjectFeatures(projectId: string | null): Promise<ProjectFeature[]> {
  if (!projectId) {
    console.log('No project ID provided for fetching features');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('project_features')
      .select('*')
      .eq('project_id', projectId);
      
    if (error) {
      console.error('Error fetching project features:', error);
      return [];
    }
    
    // If there's no data yet, return demo data for visualization
    if (!data || data.length === 0) {
      return [
        {
          id: 'demo-1',
          name: 'Wallet Integration',
          description: 'Secure crypto wallet connection',
          category: 'Trading & Transactions',
          cost: 1200,
          currency: '£',
          project_id: projectId,
          status: 'completed'
        },
        {
          id: 'demo-2',
          name: 'Two-Factor Authentication',
          description: 'Enhanced account security',
          category: 'Security & Trust',
          cost: 800,
          currency: '£',
          project_id: projectId,
          status: 'completed'
        },
        {
          id: 'demo-3',
          name: 'Staking Platform',
          description: 'Earning rewards through staking',
          category: 'Staking & Earning',
          cost: 1500,
          currency: '£',
          project_id: projectId,
          status: 'completed'
        },
        {
          id: 'demo-4',
          name: 'Community Forum',
          description: 'User discussion platform',
          category: 'Community & Engagement',
          cost: 900,
          currency: '£',
          project_id: projectId,
          status: 'completed'
        }
      ];
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error in fetchProjectFeatures:', err);
    return [];
  }
}

export function getFeatureCostsByCategory(features: ProjectFeature[]) {
  const categories = {
    'Trading & Transactions': [],
    'Security & Trust': [],
    'Staking & Earning': [],
    'Community & Engagement': [],
    'Other': []
  };
  
  features.forEach(feature => {
    const category = feature.category || 'Other';
    if (categories[category]) {
      categories[category].push(feature);
    } else {
      categories['Other'].push(feature);
    }
  });
  
  return Object.entries(categories)
    .filter(([_, features]) => features.length > 0)
    .map(([category, features]) => {
      const totalCost = features.reduce((sum, feature) => sum + (feature.cost || 0), 0);
      return {
        category,
        features,
        totalCost
      };
    })
    .sort((a, b) => b.totalCost - a.totalCost); // Sort by highest cost first
}

export function getTotalFeatureCost(features: ProjectFeature[]): number {
  return features.reduce((sum, feature) => sum + (feature.cost || 0), 0);
}

export function getCategoryColor(category: string): string {
  const colors = {
    'Trading & Transactions': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    'Security & Trust': 'from-green-500/20 to-green-600/20 border-green-500/30',
    'Staking & Earning': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    'Community & Engagement': 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    'Other': 'from-gray-500/20 to-gray-600/20 border-gray-500/30'
  };
  
  return colors[category] || colors['Other'];
}

export function getCategoryIcon(category: string): string {
  // Return icon name based on category
  // These can be from lucide-react or any icon library you use
  const icons = {
    'Trading & Transactions': 'arrow-left-right',
    'Security & Trust': 'shield',
    'Staking & Earning': 'piggy-bank',
    'Community & Engagement': 'users',
    'Other': 'layers'
  };
  
  return icons[category] || icons['Other'];
}
