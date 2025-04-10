import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { 
  CheckCircle, 
  Loader2, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Users, 
  MessageSquare, 
  FileText, 
  BarChart, 
  Shield, 
  Settings, 
  Target,
  Smartphone,
  Heart,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { MessageLoading } from '@/components/ui/message-loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColorPicker } from '@/components/plan/ColorPicker';
import { FeatureSelection, Feature } from '@/components/plan/FeatureSelection';
import { CaseStudy } from '@/components/plan/CaseStudy';
import { WelcomeMessage } from '@/components/plan/WelcomeMessage';
import { Skeleton } from '@/components/ui/skeleton';
import { InteractiveCallout } from '@/components/plan/InteractiveCallout';
import { PainPointsModal, PainPointDetailProps } from '@/components/plan/PainPointsModal';
import { Progress } from '@/components/ui/progress';
import { SolutionsShowcase } from '@/components/plan/SolutionsShowcase';
import { PlanReviewSummary } from '@/components/plan/PlanReviewSummary';
import { AgencyPainPoints } from '@/components/plan/AgencyPainPoints';

interface PlanData {
  id: string;
  username: string;
  company_name: string | null;
  app_name: string | null;
  features: string[] | null;
  branding: {
    logo?: string;
    primary_color?: string;
    secondary_color?: string;
  } | null;
  estimated_cost: number | null;
  estimated_days: number | null;
  status: string | null;
}

interface FeatureCategory {
  name: string;
  icon: JSX.Element;
  description: string;
  features: string[];
}

interface PainPoint {
  problem: string;
  statistic: string;
  solution: string;
  detailedSolution: string;
  benefits: string[];
  metrics: { label: string; value: string; icon: JSX.Element }[];
  images: { url: string; caption: string }[];
  caseStudyLink: string;
  videoUrl?: string;
  researchSources?: { title: string; url: string; description: string }[];
}

interface Testimonial {
  content: string;
  author: string;
  position: string;
  instagram?: string;
  appLink?: string;
}

const brandColorOptions = [
  { name: 'Classic Red', value: '#E53E3E' },
  { name: 'Vibrant Orange', value: '#ED8936' },
  { name: 'Royal Purple', value: '#805AD5' },
  { name: 'Ocean Blue', value: '#3182CE' },
  { name: 'Emerald Green', value: '#38A169' },
  { name: 'Hot Pink', value: '#D53F8C' },
  { name: 'Slate Gray', value: '#4A5568' },
  { name: 'Midnight Black', value: '#1A202C' },
  { name: 'Modern Teal', value: '#319795' }
];

const caseStudies = [
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

const additionalFeatures: Feature[] = [
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

const Plan = () => {
  // ... keep existing code
};

export default Plan;
