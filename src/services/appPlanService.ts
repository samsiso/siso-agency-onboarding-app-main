import { supabase } from '@/integrations/supabase/client';

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
    estimatedCost: number;
    estimatedDays: number;
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
  estimated_cost: number;
  estimated_days: number;
  created_at: string;
  status: string;
  username: string;
}

interface EnhancedFeature {
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
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
 * Enhanced app plan features generation based on industry and company data
 */
function generateEnhancedAppPlanFeatures(data: AppPlanData): EnhancedFeature[] {
  const industry = data.industry.toLowerCase();
  const companyName = data.company;
  const description = data.description.toLowerCase();
  
  // Base essential features for all apps
  const essentialFeatures: EnhancedFeature[] = [
    {
      name: 'User Authentication & Security',
      description: `Secure user registration, login, and profile management with multi-factor authentication for ${companyName} users`,
      priority: 'high',
      estimatedHours: 40,
      category: 'Security'
    },
    {
      name: 'Core Dashboard',
      description: `Centralized dashboard displaying key metrics, activities, and quick actions tailored for ${industry} business operations`,
      priority: 'high',
      estimatedHours: 60,
      category: 'Core Functionality'
    },
    {
      name: 'Mobile-First Responsive Design',
      description: 'Optimized mobile experience with responsive design ensuring seamless usage across all devices',
      priority: 'high',
      estimatedHours: 50,
      category: 'User Experience'
    }
  ];

  // Industry-specific essential features
  const industryEssentials: Record<string, EnhancedFeature[]> = {
    'construction': [
      {
        name: 'Project Management Suite',
        description: 'Comprehensive project tracking with timelines, milestones, resource allocation, and progress monitoring',
        priority: 'high',
        estimatedHours: 80,
        category: 'Project Management'
      },
      {
        name: 'Equipment & Inventory Management',
        description: 'Track equipment usage, maintenance schedules, inventory levels, and supplier management',
        priority: 'high',
        estimatedHours: 70,
        category: 'Resource Management'
      }
    ],
    'restaurant': [
      {
        name: 'Menu Management System',
        description: 'Digital menu creation, pricing management, availability tracking, and nutritional information',
        priority: 'high',
        estimatedHours: 60,
        category: 'Core Business'
      },
      {
        name: 'Order Processing & POS',
        description: 'Integrated point-of-sale system with order taking, payment processing, and kitchen communication',
        priority: 'high',
        estimatedHours: 100,
        category: 'Operations'
      }
    ],
    'retail': [
      {
        name: 'Product Catalog & Inventory',
        description: 'Comprehensive product management with categories, variants, pricing, and real-time inventory tracking',
        priority: 'high',
        estimatedHours: 70,
        category: 'E-commerce'
      },
      {
        name: 'Shopping Cart & Checkout',
        description: 'Secure shopping experience with cart management, multiple payment options, and order processing',
        priority: 'high',
        estimatedHours: 90,
        category: 'E-commerce'
      }
    ],
    'finance': [
      {
        name: 'Financial Dashboard & Analytics',
        description: 'Real-time financial data visualization, performance metrics, and business intelligence tools',
        priority: 'high',
        estimatedHours: 80,
        category: 'Analytics'
      },
      {
        name: 'Compliance & Security Suite',
        description: 'Regulatory compliance tools, audit trails, data protection, and advanced security measures',
        priority: 'high',
        estimatedHours: 120,
        category: 'Compliance'
      }
    ],
    'healthcare': [
      {
        name: 'Patient Management System',
        description: 'Comprehensive patient records, appointment scheduling, and health data management',
        priority: 'high',
        estimatedHours: 100,
        category: 'Healthcare Operations'
      },
      {
        name: 'HIPAA Compliance & Security',
        description: 'Healthcare-grade security, data encryption, and regulatory compliance features',
        priority: 'high',
        estimatedHours: 80,
        category: 'Compliance'
      }
    ]
  };

  // Recommended features (medium priority)
  const recommendedFeatures: EnhancedFeature[] = [
    {
      name: 'Push Notifications & Alerts',
      description: 'Real-time notifications for important updates, reminders, and system alerts with customizable preferences',
      priority: 'medium',
      estimatedHours: 35,
      category: 'Communication'
    },
    {
      name: 'Advanced Analytics & Reporting',
      description: 'Detailed business insights, performance metrics, trend analysis, and exportable reports',
      priority: 'medium',
      estimatedHours: 60,
      category: 'Analytics'
    },
    {
      name: 'Customer Support Integration',
      description: 'Built-in help desk, live chat support, ticketing system, and knowledge base',
      priority: 'medium',
      estimatedHours: 45,
      category: 'Support'
    },
    {
      name: 'Third-Party Integrations',
      description: 'API connections to popular business tools, payment gateways, and industry-specific software',
      priority: 'medium',
      estimatedHours: 50,
      category: 'Integration'
    }
  ];

  // Additional features (low priority / nice-to-have)
  const additionalFeatures: EnhancedFeature[] = [
    {
      name: 'AI-Powered Insights',
      description: 'Machine learning algorithms for predictive analytics, automated suggestions, and intelligent automation',
      priority: 'low',
      estimatedHours: 80,
      category: 'AI & Automation'
    },
    {
      name: 'Advanced User Roles & Permissions',
      description: 'Granular access control, team management, custom roles, and permission hierarchies',
      priority: 'low',
      estimatedHours: 40,
      category: 'User Management'
    },
    {
      name: 'API & Developer Tools',
      description: 'RESTful API, webhook support, developer documentation, and third-party integration capabilities',
      priority: 'low',
      estimatedHours: 60,
      category: 'Developer Tools'
    }
  ];

  // Combine features based on industry
  let features = [...essentialFeatures];
  
  // Add industry-specific essentials
  if (industryEssentials[industry]) {
    features.push(...industryEssentials[industry]);
  } else {
    // Generic business features for unspecified industries
    features.push({
      name: 'Business Process Management',
      description: `Customizable workflows and business process automation specific to ${data.description}`,
      priority: 'high',
      estimatedHours: 70,
      category: 'Business Logic'
    });
  }

  // Add recommended features
  features.push(...recommendedFeatures.slice(0, 3)); // Top 3 recommended

  // Add 1-2 additional features
  features.push(...additionalFeatures.slice(0, 2));

  return features;
}

/**
 * Calculate enhanced estimates based on feature complexity
 */
function calculateEnhancedEstimates(features: EnhancedFeature[]): { cost: number; days: number } {
  const totalHours = features.reduce((sum, feature) => sum + feature.estimatedHours, 0);
  
  // UK market rates: £75-100/hour for development
  const hourlyRate = 85;
  const hoursPerDay = 7; // Account for meetings, testing, etc.
  
  const cost = totalHours * hourlyRate;
  const days = Math.ceil(totalHours / hoursPerDay);
  
  return { cost, days };
}

/**
 * Save app plan to database
 */
export async function saveAppPlan(data: AppPlanData): Promise<SavedAppPlan> {
  try {
    // Generate enhanced features if not provided
    const enhancedFeatures = generateEnhancedAppPlanFeatures(data);
    const features = enhancedFeatures.map(f => f.name);
    
    // Calculate enhanced estimates
    const estimates = calculateEnhancedEstimates(enhancedFeatures);
    
    const username = generateUsername(data.company);
    const appName = `${data.company} Business App`;

    const { data: savedPlan, error } = await supabase
      .from('plans')
      .insert({
        app_name: appName,
        company_name: data.company,
        description: data.description,
        features,
        estimated_cost: estimates.cost,
        estimated_days: estimates.days,
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