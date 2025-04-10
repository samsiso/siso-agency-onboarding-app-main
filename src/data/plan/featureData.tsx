
import React from 'react';
import { FeatureCategory, Feature, PlanTier } from '@/models/plan/features';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart, 
  Shield, 
  Settings,
  Tag,
  Smartphone,
  Zap,
  Heart,
  Target
} from 'lucide-react';

export const featureCategories: FeatureCategory[] = [
  {
    id: 'client',
    name: 'Client Management',
    icon: <Users className="h-5 w-5" />,
    features: [
      { id: 'client-profiles', name: 'Client Profiles', description: 'Detailed profiles for each creator with basic information.', timeEstimate: 0.5 },
      { id: 'performance-dashboard', name: 'Basic Performance Dashboard', description: 'View key metrics like earnings and subscriber count.', timeEstimate: 1 },
      { id: 'earnings-tracking', name: 'Earnings Tracking', description: 'Monitor creator revenue over time with basic charts.', timeEstimate: 1.5 },
      { id: 'subscriber-tracking', name: 'Subscriber Count Tracking', description: 'Track subscriber growth or decline over time.', timeEstimate: 1 },
      { id: 'advanced-analytics', name: 'Advanced Creator Analytics', description: 'In-depth performance insights with predictive trends.', timeEstimate: 3 },
    ]
  },
  {
    id: 'content',
    name: 'Content Management',
    icon: <FileText className="h-5 w-5" />,
    features: [
      { id: 'content-calendar', name: 'Simple Content Calendar', description: 'Plan posts with a basic scheduling tool.', timeEstimate: 1.5 },
      { id: 'media-library', name: 'Media Library with Basic Tagging', description: 'Store and categorize assets with simple tags.', timeEstimate: 2 },
      { id: 'content-approval', name: 'Content Approval Workflow', description: 'Approve or reject creator content before posting.', timeEstimate: 1.5 },
      { id: 'ai-content-optimization', name: 'AI Content Optimization', description: 'Get suggestions to improve content based on trending topics.', timeEstimate: 4 },
    ]
  },
  {
    id: 'communication',
    name: 'Communication Tools',
    icon: <MessageSquare className="h-5 w-5" />,
    features: [
      { id: 'in-app-messaging', name: 'In-App Messaging', description: 'Direct messaging between agency and creators.', timeEstimate: 3 },
      { id: 'notification-system', name: 'Notification System', description: 'Alerts for deadlines, updates, and important events.', timeEstimate: 2 },
      { id: 'fan-interaction', name: 'Fan Interaction Tools', description: 'Manage fan messages and interactions efficiently.', timeEstimate: 4 },
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: <BarChart className="h-5 w-5" />,
    features: [
      { id: 'basic-earnings', name: 'Basic Earnings Report', description: 'Simple revenue overview with basic filtering.', timeEstimate: 1 },
      { id: 'subscriber-growth', name: 'Subscriber Growth Chart', description: 'Visualize subscriber trends over time.', timeEstimate: 1 },
      { id: 'content-performance', name: 'Content Performance Metrics', description: 'Track likes, views, and engagement for each post.', timeEstimate: 2 },
    ]
  },
  {
    id: 'security',
    name: 'Security',
    icon: <Shield className="h-5 w-5" />,
    features: [
      { id: 'user-authentication', name: 'User Authentication', description: 'Secure login for agency staff and creators.', timeEstimate: 1 },
      { id: 'role-based-access', name: 'Role-Based Access Control', description: 'Limit access based on user roles within the agency.', timeEstimate: 2 },
      { id: 'two-factor', name: 'Two-Factor Authentication', description: 'Extra layer of security for account access.', timeEstimate: 1.5 },
    ]
  },
  {
    id: 'automation',
    name: 'Automation',
    icon: <Settings className="h-5 w-5" />,
    features: [
      { id: 'automated-reminders', name: 'Automated Reminders', description: 'Notify creators of upcoming deadlines automatically.', timeEstimate: 1 },
      { id: 'workflow-automation', name: 'Basic Workflow Automation', description: 'Automate repetitive steps like content approvals.', timeEstimate: 2.5 },
      { id: 'fan-engagement', name: 'Automated Fan Engagement', description: 'Schedule and automate fan outreach campaigns.', timeEstimate: 4 },
    ]
  }
];

export const additionalFeatures: Feature[] = [
  {
    id: 'white-label',
    name: 'White Label Branding',
    description: 'Remove all Siso branding and use your own logo and colors throughout the platform.',
    price: 1200,
    included: false
  },
  {
    id: 'mobile-apps',
    name: 'Native Mobile Apps',
    description: 'iOS and Android mobile apps for your team and clients to access the platform on the go.',
    price: 2500,
    included: false
  },
  {
    id: 'api-integration',
    name: 'Custom API Integrations',
    description: 'Connect with additional platforms and services beyond our standard integrations.',
    price: 1800,
    included: false
  },
  {
    id: 'ai-insights',
    name: 'AI Content Insights',
    description: 'Advanced AI tools to analyze content performance and suggest improvements.',
    price: 1500,
    included: false
  },
  {
    id: 'premium-support',
    name: 'Premium Support Package',
    description: '24/7 dedicated support team with 1-hour response time and monthly strategy calls.',
    price: 950,
    included: false
  }
];

export const planTiers: PlanTier[] = [
  {
    id: 'mvp',
    name: 'MVP',
    price: 0,
    maxFeatures: 10,
    timeline: '90 days',
    supportLevel: 'Standard',
    description: 'Essential features included in the base price to get your platform up and running.',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: 249,
    maxFeatures: 'Unlimited',
    timeline: '60 days',
    supportLevel: 'Standard',
    description: 'Enhanced functionality to improve user experience and operational efficiency.',
    recommended: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 499,
    maxFeatures: 'All Features',
    timeline: '21 days',
    supportLevel: 'Priority',
    description: 'Premium capabilities for maximum customization and competitive advantage.',
  }
];

export const caseStudies = [
  {
    title: 'OnlyFans Management Platform for Agency X',
    description: 'How we helped Agency X increase their client retention by 40% and double their revenue with our custom platform.',
    imageUrl: '/lovable-uploads/c7ac43fd-bc3e-478d-8b4f-809beafb6838.png',
    notionUrl: 'https://www.notion.so/Case-Study-OnlyFans-Management-Platform-123456'
  },
  {
    title: 'Creator Content Management System',
    description: 'A dedicated content scheduling and management system that improved workflow efficiency by 60%.',
    imageUrl: '/lovable-uploads/1f9eba1e-c2af-4ed8-84e7-a375872c9182.png',
    notionUrl: 'https://www.notion.so/Case-Study-Content-Management-System-789012'
  },
  {
    title: 'Fan Engagement & Analytics Dashboard',
    description: 'How our analytics tools helped boost fan engagement and increase subscription renewal rates.',
    imageUrl: '/lovable-uploads/19ca8c73-3736-4506-bfb2-de867b272e12.png',
    notionUrl: 'https://www.notion.so/Case-Study-Fan-Engagement-Analytics-345678'
  }
];
