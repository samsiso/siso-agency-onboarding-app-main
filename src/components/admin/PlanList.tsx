
import { useState } from 'react';
import { PlanData } from '@/contexts/plan/PlanContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Edit, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface PlanListProps {
  plans: PlanData[];
  loading: boolean;
  onPlanUpdated: () => void;
}

export const PlanList = ({ plans, loading, onPlanUpdated }: PlanListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeletePlan = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Plan deleted",
        description: "The plan has been successfully deleted.",
      });
      onPlanUpdated();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the plan.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const viewPlan = (username: string) => {
    // Use React Router's navigate instead of direct window.location
    navigate(`/plan/${username.toLowerCase()}`);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 bg-black/20 border border-siso-text/10 animate-pulse">
            <div className="h-6 bg-gray-700/30 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-700/30 rounded w-3/4 mb-4"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-700/30 rounded w-20"></div>
              <div className="h-8 bg-gray-700/30 rounded w-20"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="p-8 bg-black/20 border border-siso-text/10 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">No plans found</h3>
        <p className="text-siso-text mb-4">There are no plans in the system yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <Card key={plan.id} className="p-6 bg-black/20 border border-siso-text/10 hover:border-siso-orange/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-white mr-2">
                  {plan.company_name || 'Unnamed Company'}
                </h3>
                <span className="text-xs bg-siso-orange/10 text-siso-orange px-2 py-0.5 rounded-full">
                  {plan.status}
                </span>
              </div>
              <p className="text-siso-text">
                <strong>Username:</strong> {plan.username}
                {plan.app_name && <> • <strong>App:</strong> {plan.app_name}</>}
              </p>
              <div className="text-xs text-siso-text/60">
                Created: {formatDate(plan.created_at)}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="bg-black/30 rounded px-2 py-1 text-sm">
                  <span className="text-siso-orange">£{plan.estimated_cost}</span>
                </div>
                <div className="bg-black/30 rounded px-2 py-1 text-sm">
                  <span className="text-siso-orange">{plan.estimated_days} days</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => viewPlan(plan.username)}
              >
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={deletingId === plan.id}
                onClick={() => handleDeletePlan(plan.id)}
                className="text-red-500 hover:text-red-600"
              >
                {deletingId === plan.id ? (
                  <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
