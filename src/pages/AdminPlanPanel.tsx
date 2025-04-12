
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { PlanList } from '@/components/admin/PlanList';
import { PlanSearch } from '@/components/admin/PlanSearch';
import { CreatePlanForm } from '@/components/admin/CreatePlanForm';
import { Button } from '@/components/ui/button';
import { Plus, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlanData } from '@/contexts/plan/PlanContext';

export default function AdminPlanPanel() {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  // Fetch all plans from Supabase
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        console.log('Fetched plans:', data);
        setPlans(data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Failed to load plans",
        description: "There was an error loading the plans. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  // Filter plans based on search query
  const filteredPlans = searchQuery 
    ? plans.filter(plan => 
        plan.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.app_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : plans;

  // Handle plan creation success
  const handlePlanCreated = () => {
    fetchPlans();
    setShowCreateForm(false);
    toast({
      title: "Plan created",
      description: "The new plan has been successfully created.",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-2">
              Plan Administration
            </h1>
            <p className="text-siso-text">
              Manage, search, and create customer plans from this dashboard
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-siso-red to-siso-orange"
          >
            {showCreateForm ? (
              <><List className="mr-2 h-4 w-4" /> Show Plans</>
            ) : (
              <><Plus className="mr-2 h-4 w-4" /> Create Plan</>
            )}
          </Button>
        </div>

        {showCreateForm ? (
          <CreatePlanForm onPlanCreated={handlePlanCreated} onCancel={() => setShowCreateForm(false)} />
        ) : (
          <>
            <PlanSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <PlanList 
              plans={filteredPlans} 
              loading={loading} 
              onPlanUpdated={fetchPlans}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
