
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, BarChart, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AgencyPainPointModal } from './AgencyPainPointModal';

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  statistic: string;
  icon: React.ReactNode;
  surveyData: {
    percentage: number;
    label: string;
  };
  solutions: string[];
  impactAreas: string[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
}

interface AgencyPainPointsProps {
  onSolutionRequest?: () => void;
}

export const AgencyPainPoints = ({ onSolutionRequest }: AgencyPainPointsProps) => {
  const [selectedPainPoint, setSelectedPainPoint] = useState<PainPoint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const painPoints: PainPoint[] = [
    {
      id: 'client-retention',
      title: 'Client Retention Issues',
      description: 'Agencies struggle to maintain long-term relationships with creators, leading to unstable revenue and constant acquisition costs.',
      severity: 'high',
      statistic: '80% of agencies lose creators within 6 months',
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      surveyData: {
        percentage: 80,
        label: 'of agencies report high creator churn'
      },
      solutions: [
        'Transparent performance reporting',
        'Clear ROI demonstration',
        'Revenue growth visualization',
        'Client success tracking'
      ],
      impactAreas: ['Revenue stability', 'Team morale', 'Business growth', 'Market reputation'],
      testimonial: {
        quote: "Before implementing proper retention systems, we were losing 1 in 3 creators monthly. Now our average client stays for over a year.",
        author: "Maria Rodriguez",
        position: "CEO, Stellar OnlyFans Agency"
      }
    },
    {
      id: 'content-management',
      title: 'Content Chaos & Missed Posts',
      description: 'Managing content across multiple creators leads to disorganization, missed deadlines, and inconsistent posting schedules.',
      severity: 'high',
      statistic: '65% of agencies miss content deadlines weekly',
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      surveyData: {
        percentage: 65,
        label: 'miss at least one deadline per week'
      },
      solutions: [
        'Centralized content calendar',
        'Automated scheduling',
        'Content inventory management',
        'Performance tracking by content type'
      ],
      impactAreas: ['Creator satisfaction', 'Fan engagement', 'Team efficiency', 'Content quality'],
      testimonial: {
        quote: "We were using spreadsheets and missing posts constantly. Now with a proper system, we never miss a deadline and our content engagement has improved dramatically.",
        author: "James Chen",
        position: "Operations Director, ContentMax Agency"
      }
    },
    {
      id: 'communication',
      title: 'Communication Breakdowns',
      description: 'Messages scattered across emails, texts, and DMs lead to missed communications and delayed responses to creators and fans.',
      severity: 'medium',
      statistic: '75% report critical messages being missed monthly',
      icon: <Info className="h-6 w-6 text-amber-500" />,
      surveyData: {
        percentage: 75,
        label: 'experience communication issues monthly'
      },
      solutions: [
        'Unified messaging inbox',
        'Priority message flagging',
        'Automated response systems',
        'Communication audit trails'
      ],
      impactAreas: ['Creator trust', 'Fan satisfaction', 'Team coordination', 'Crisis management'],
      testimonial: {
        quote: "Our biggest creator almost left because important messages kept falling through the cracks. A unified communication system saved that relationship.",
        author: "Alex Torres",
        position: "Client Success Manager, Elite Creator Management"
      }
    },
    {
      id: 'analytics',
      title: 'Poor Performance Insights',
      description: 'Lack of clear analytics makes it difficult to demonstrate value to creators and optimize content strategy.',
      severity: 'medium',
      statistic: '70% can\'t accurately track ROI for creators',
      icon: <BarChart className="h-6 w-6 text-amber-500" />,
      surveyData: {
        percentage: 70,
        label: 'struggle with performance reporting'
      },
      solutions: [
        'Real-time performance dashboards',
        'Revenue attribution tracking',
        'Content effectiveness analysis',
        'Growth trend visualization'
      ],
      impactAreas: ['Strategic decision-making', 'Creator confidence', 'Revenue optimization', 'Market positioning'],
      testimonial: {
        quote: "When we implemented proper analytics, we discovered which content types were 3x more profitable. This insight alone increased creator earnings by 40%.",
        author: "Sarah Johnson",
        position: "Analytics Director, Creator Growth Partners"
      }
    }
  ];
  
  const handleOpenModal = (painPoint: PainPoint) => {
    setSelectedPainPoint(painPoint);
    setIsModalOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-siso-orange/10 border border-siso-orange/30 rounded-lg p-4 mb-6">
        <p className="text-siso-text text-sm flex items-start gap-2">
          <Info className="h-4 w-4 text-siso-orange shrink-0 mt-0.5" />
          <span>
            <span className="font-semibold text-siso-text-bold">Based on our survey of 200+ OnlyFans agencies</span> - These are the most common pain points agencies face when trying to scale past $100k/month in revenue.
          </span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {painPoints.map((painPoint) => (
          <motion.div
            key={painPoint.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenModal(painPoint)}
            className="cursor-pointer"
          >
            <Card className="bg-black/20 border-siso-text/10 hover:border-siso-orange/30 transition-all h-full">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${
                      painPoint.severity === 'high' ? 'bg-red-500/10' : 
                      painPoint.severity === 'medium' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                    }`}>
                      {painPoint.icon}
                    </div>
                    <h3 className="font-semibold text-white">{painPoint.title}</h3>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    painPoint.severity === 'high' ? 'bg-red-500/10 text-red-400' : 
                    painPoint.severity === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {painPoint.severity === 'high' ? 'Critical Issue' : 
                     painPoint.severity === 'medium' ? 'Major Challenge' : 'Moderate Problem'}
                  </div>
                </div>
                
                <p className="text-siso-text text-sm mb-4">{painPoint.description}</p>
                
                <div className="bg-black/40 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-siso-text/70">Industry Survey</span>
                    <span className="text-xs font-medium text-siso-orange">{painPoint.surveyData.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-siso-text/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-siso-red to-siso-orange rounded-full"
                      style={{ width: `${painPoint.surveyData.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-siso-text/70 mt-1">{painPoint.surveyData.label}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-siso-orange">
                    {painPoint.statistic}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-siso-text hover:text-siso-orange hover:bg-transparent p-0"
                  >
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button
          onClick={onSolutionRequest}
          className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
        >
          See How We Solve These Issues
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <AgencyPainPointModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        painPoint={selectedPainPoint}
        onRequestSolution={onSolutionRequest}
      />
    </div>
  );
};
