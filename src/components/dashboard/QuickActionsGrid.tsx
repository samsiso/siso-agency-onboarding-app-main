import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  UserPlus, 
  Receipt, 
  BarChart3,
  FolderPlus,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActionsGrid() {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Project',
      description: 'Start a new client project',
      icon: Plus,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => navigate('/plan-builder')
    },
    {
      title: 'Add Client',
      description: 'Onboard new client',
      icon: UserPlus,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/onboarding')
    },
    {
      title: 'Send Invoice',
      description: 'Create client invoice',
      icon: Receipt,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/admin/financials')
    },
    {
      title: 'View Reports',
      description: 'Analytics & insights',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => navigate('/admin/dashboard')
    }
  ];

  return (
    <Card className="bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <FolderPlus className="h-5 w-5 text-orange-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white h-20 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105`}
            >
              <action.icon className="h-5 w-5" />
              <div className="text-center">
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="pt-2 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            Common agency operations for faster workflow
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 