import React from 'react';
import { Card } from '@/components/ui/card';
import { CircularProgress } from './CircularProgress';
import { Check, ArrowRight } from 'lucide-react';
import { NavLink } from '@/components/ui/nav-link';

interface ProjectMetricsDashboardProps {
  projectId: string;
}

export function ProjectMetricsDashboard({ projectId }: ProjectMetricsDashboardProps) {
  // This would typically come from your API or state management
  const projectMetrics = {
    totalTokens: '78.6M',
    dailyRate: '1.2M',
    costPerMonth: '£307',
    smartContracts: 4,
    apiEndpoints: 12,
    weeklyCommits: 24,
    averageResponseTime: '4h',
    bugsFixed: 7,
    securityIssues: 0,
  };

  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-white">Metrics Overview</h3>
        </div>
        <NavLink href={`/projects/${projectId}/timeline`} className="flex items-center gap-2 text-[#9b87f5] hover:text-[#9b87f5]/80">
          <span>View All Metrics</span>
          <ArrowRight className="w-4 h-4" />
        </NavLink>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        <MetricItem
          label="Tokens Used"
          value={projectMetrics.totalTokens}
          delay={0}
        />
        <MetricItem
          label="Daily Token Rate"
          value={projectMetrics.dailyRate}
          delay={1}
        />
        <MetricItem
          label="Monthly Cost"
          value={projectMetrics.costPerMonth}
          delay={2}
        />
        <MetricItem
          label="Smart Contracts"
          value={projectMetrics.smartContracts.toString()}
          delay={3}
        />
        <MetricItem
          label="API Endpoints"
          value={projectMetrics.apiEndpoints.toString()}
          delay={4}
        />
        <MetricItem
          label="Weekly Commits"
          value={projectMetrics.weeklyCommits.toString()}
          delay={5}
        />
      </div>
    </Card>
  );
}

function MetricItem({ 
  label, 
  value, 
  delay 
}: { 
  label: string; 
  value: string; 
  delay: number; 
}) {
  return (
    <div 
      className="flex flex-col items-center p-3 bg-black/20 rounded-lg border border-white/5" 
      style={{ 
        animation: `fadeIn 0.5s ease-out forwards ${delay * 0.1}s`,
        opacity: 0
      }}
    >
      <div className="text-lg font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-400 text-center">{label}</div>
    </div>
  );
}
