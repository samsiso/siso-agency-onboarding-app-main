import { supabase } from '@/integrations/supabase/client';
import { multiStagePromptSystem, type ResearchPromptInput } from '@/services/multiStagePromptSystem';
import { type AppPlanInput } from '@/types/appPlan.types';

export interface AppPlanData {
  company: string;
  industry: string;
  description: string;
  website: string;
  researchResults?: {
    industryAnalysis: string[];
    companyAnalysis: string[];
    techRecommendations: string[];
    marketOpportunities: string[];
  };
  features?: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;
  totalCost?: number;
  totalDays?: number;
}

export interface SavedAppPlan {
  id: string;
  app_name: string;
  company_name: string;
  description: string;
  features: string[];
  created_at: string;
  status: string;
  username: string;
}

interface EnhancedFeature {
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

/**
 * Generate a unique username for the app plan
 */
function generateUsername(companyName: string): string {
  const baseUsername = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 20);
  
  const timestamp = Date.now().toString(36);
  return `${baseUsername}-${timestamp}`;
}

/**
 * Enhanced app plan generation using Multi-Stage Research System
 * Implements: Initial Research → Refined Research → App Plan workflow
 */
async function generateAdvancedAppPlan(data: AppPlanData): Promise<{
  features: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;
  researchResults: {
    industryAnalysis: string[];
    companyAnalysis: string[];
    techRecommendations: string[];
    marketOpportunities: string[];
  };
}> {
  try {
    // Prepare research input from app plan data
    const researchInput: ResearchPromptInput = {
      companyName: data.company,
      industry: data.industry,
      location: 'UK', // Default location, could be enhanced to extract from website
      productsServices: data.description,
      targetUsers: 'Business users and customers' // Could be enhanced with user analysis
    };

    // Prepare app plan input
    const appPlanInput: AppPlanInput = {
      businessName: data.company,
      appPurpose: `Business application for ${data.description}`,
      industry: data.industry,
      targetAudience: 'Business users and customers',
      budget: 'To be determined',
      timeline: 'To be determined'
    };

    // Execute the complete three-stage workflow
    const result = await multiStagePromptSystem.executeThreeStageWorkflow(
      researchInput,
      appPlanInput
    );

    // Extract and format features from the app plan
    const features = [];
    
    // Essential features (high priority)
    if (result.appPlan.features.essential) {
      result.appPlan.features.essential.forEach((feature, index) => {
        features.push({
          id: `essential_${index}`,
          title: feature.name,
          description: feature.description,
          priority: 'high' as const,
          category: 'Essential'
        });
      });
    }

    // Additional features (medium/low priority)
    if (result.appPlan.features.additionalAddOns) {
      result.appPlan.features.additionalAddOns.forEach((feature, index) => {
        features.push({
          id: `additional_${index}`,
          title: feature.name,
          description: feature.description,
          priority: (index < 3 ? 'medium' : 'low'),
          category: 'Additional'
        });
      });
    }

    // If no features extracted, provide fallback from feature priorities
    if (features.length === 0) {
      const priorities = result.refinedResearch.strategicRecommendations.featurePriorities || [];
      priorities.slice(0, 8).forEach((featurePriority, index) => {
        features.push({
          id: `priority_${index}`,
          title: featurePriority.feature,
          description: featurePriority.rationale || `${featurePriority.priority} priority feature`,
          priority: featurePriority.priority.toLowerCase() as any,
          category: featurePriority.competitiveDifferentiator ? 'Competitive Advantage' : 'Business Logic'
        });
      });
    }

    // Format research results
    const researchResults = {
      industryAnalysis: [
        result.initialResearch.industryOverview.marketSize,
        ...result.initialResearch.industryOverview.keyTrends,
        ...result.initialResearch.industryOverview.growthDrivers
      ].filter(Boolean),
      companyAnalysis: [
        result.refinedResearch.strategicRecommendations.differentiationStrategy,
        result.refinedResearch.strategicRecommendations.marketEntryStrategy,
        ...result.refinedResearch.strategicRecommendations.competitiveAdvantages
      ].filter(Boolean),
      techRecommendations: [
        ...result.refinedResearch.technicalConsiderations.requiredIntegrations,
        ...result.refinedResearch.technicalConsiderations.platformConsiderations,
        ...result.refinedResearch.technicalConsiderations.scalabilityFactors
      ].filter(Boolean),
      marketOpportunities: [
        ...result.initialResearch.marketOpportunities.identifiedGaps,
        ...result.refinedResearch.deepMarketAnalysis.validatedOpportunities.map(opp => opp.opportunity)
      ].filter(Boolean)
    };

    return { features, researchResults };

  } catch (error) {
    console.error('Advanced app plan generation failed:', error);
    
    // Fallback to basic features if advanced system fails
    return generateBasicFallbackPlan(data);
  }
}

/**
 * Fallback plan generation for when advanced system fails
 */
function generateBasicFallbackPlan(data: AppPlanData): {
  features: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;
  researchResults: {
    industryAnalysis: string[];
    companyAnalysis: string[];
    techRecommendations: string[];
    marketOpportunities: string[];
  };
} {
  const basicFeatures = [
    {
      id: 'auth',
      title: 'User Authentication & Security',
      description: `Secure user registration, login, and profile management for ${data.company}`,
      priority: 'high' as const,
      category: 'Security'
    },
    {
      id: 'dashboard',
      title: 'Core Dashboard',
      description: `Centralized dashboard for ${data.industry} business operations`,
      priority: 'high' as const,
      category: 'Core Functionality'
    },
    {
      id: 'mobile',
      title: 'Mobile-Responsive Design',
      description: 'Optimized mobile experience across all devices',
      priority: 'high' as const,
      category: 'User Experience'
    },
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Real-time notifications for important updates',
      priority: 'medium' as const,
      category: 'Communication'
    },
    {
      id: 'analytics',
      title: 'Analytics & Reporting',
      description: 'Business insights and performance tracking',
      priority: 'medium' as const,
      category: 'Analytics'
    }
  ];

  const basicResearch = {
    industryAnalysis: [
      `${data.industry} is a growing market with digital transformation opportunities`,
      'Mobile-first approach is essential for modern business applications',
      'User experience and security are key competitive advantages'
    ],
    companyAnalysis: [
      `${data.company} can benefit from digital process automation`,
      'Custom application will improve operational efficiency',
      'Enhanced customer engagement through digital channels'
    ],
    techRecommendations: [
      'React/TypeScript for modern web application development',
      'Responsive design for multi-device compatibility',
      'Cloud-based hosting for scalability and reliability'
    ],
    marketOpportunities: [
      'Digital transformation in traditional industries',
      'Mobile-first business applications demand',
      'Integration opportunities with existing business tools'
    ]
  };

  return { features: basicFeatures, researchResults: basicResearch };
}

/**
 * Save app plan to database
 */
export async function saveAppPlan(data: AppPlanData): Promise<SavedAppPlan> {
  try {
    // Generate enhanced features and research using advanced multi-stage system
    const { features, researchResults } = await generateAdvancedAppPlan(data);
    const featureNames = features.map(f => f.title);
    
    // Update data with research results
    data.researchResults = researchResults;
    data.features = features;
    
    const username = generateUsername(data.company);
    const appName = `${data.company} Business App`;

    const { data: savedPlan, error } = await supabase
      .from('plans')
      .insert({
        app_name: appName,
        company_name: data.company,
        description: data.description,
        features: featureNames,
        username,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving app plan:', error);
      throw new Error(`Failed to save app plan: ${error.message}`);
    }

    return savedPlan as SavedAppPlan;
  } catch (error) {
    console.error('Error in saveAppPlan:', error);
    throw error;
  }
}

/**
 * Get app plan by username
 */
export async function getAppPlanByUsername(username: string): Promise<SavedAppPlan | null> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('username', username)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('Error fetching app plan:', error);
      throw new Error(`Failed to fetch app plan: ${error.message}`);
    }

    return data as SavedAppPlan;
  } catch (error) {
    console.error('Error in getAppPlanByUsername:', error);
    throw error;
  }
}

/**
 * Get app plan by ID
 */
export async function getAppPlanById(id: string): Promise<SavedAppPlan | null> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching app plan:', error);
      throw new Error(`Failed to fetch app plan: ${error.message}`);
    }

    return data as SavedAppPlan;
  } catch (error) {
    console.error('Error in getAppPlanById:', error);
    throw error;
  }
} 