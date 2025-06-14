// Partnership Program TypeScript Interfaces
// Complete type definitions for all database entities and API responses

export interface PartnerApplication {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  networkDescription: string;
  expectedReferrals: number;
  experienceLevel: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface PartnerApplicationData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  networkDescription: string;
  expectedReferrals: number;
  experienceLevel: string;
}

export interface Partner {
  id: string;
  applicationId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalEarnings: number;
  totalDeals: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface ClientLead {
  id: string;
  partnerId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  businessName?: string;
  projectDescription?: string;
  estimatedValue?: number;
  status: 'prospect' | 'qualified' | 'mvp' | 'signed' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ClientLeadData {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  businessName?: string;
  projectDescription?: string;
  estimatedValue?: number;
}

export interface Commission {
  id: string;
  partnerId: string;
  clientLeadId: string;
  projectValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: string;
  createdAt: string;
}

export interface AppPlanPartnership {
  id: string;
  clientLeadId: string;
  partnerId: string;
  businessName: string;
  industry?: string;
  features?: Record<string, any>;
  timelineEstimate?: string;
  investmentRange?: string;
  generatedContent?: string;
  status: 'draft' | 'shared' | 'approved';
  createdAt: string;
  updatedAt: string;
}

// Statistics and Analytics Types
export interface PartnershipStats {
  activePartners: number;
  totalCommissionsPaid: number;
  successfulProjects: number;
  averageCommission: number;
  totalApplications: number;
  approvalRate: number;
}

export interface LeaderboardEntry {
  partnerId: string;
  partnerName: string;
  tier: string;
  totalEarnings: number;
  totalDeals: number;
  monthlyEarnings?: number;
  rank: number;
}

export interface PartnerStats {
  totalEarnings: number;
  totalDeals: number;
  pendingCommissions: number;
  completedDeals: number;
  currentTier: string;
  nextTierRequirement?: number;
  monthlyPerformance: {
    month: string;
    earnings: number;
    deals: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form and UI Types
export interface PartnerApplicationFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  networkDescription: string;
  expectedReferrals: number;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface CommissionCalculation {
  projectValue: number;
  commissionRate: number;
  commissionAmount: number;
  tier: string;
}

// Email notification types
export interface EmailNotification {
  to: string;
  template: 'application_received' | 'application_approved' | 'commission_earned' | 'monthly_report';
  data: Record<string, any>;
}

export interface TierRequirements {
  Bronze: { deals: 0; earnings: 0 };
  Silver: { deals: 5; earnings: 1000 };
  Gold: { deals: 15; earnings: 3000 };
  Platinum: { deals: 30; earnings: 7500 };
} 