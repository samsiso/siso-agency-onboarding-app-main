import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Share2, Eye, Edit, Trash2, ExternalLink, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { CreatePlanDialog } from './CreatePlanDialog';
// import { planTemplatesApi, PlanTemplate } from '@/utils/planTemplatesApi';

// Temporary interface until we set up the database
interface PlanTemplate {
  id: string;
  title: string;
  slug: string;
  view_count: number;
  status: string;
  created_at: string;
  is_public: boolean;
}

// Temporary mock data until database is set up
const mockPlans: PlanTemplate[] = [
  {
    id: '1',
    title: 'E-commerce App Development Plan',
    slug: 'ecommerce-app-development-plan',
    view_count: 12,
    status: 'active',
    created_at: new Date().toISOString(),
    is_public: true
  },
  {
    id: '2', 
    title: 'Social Media Dashboard Plan',
    slug: 'social-media-dashboard-plan',
    view_count: 8,
    status: 'active',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    is_public: true
  }
];

export function ShareablePlansSection() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // TODO: Replace with real API call when database is ready
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['plan-templates'],
    queryFn: async () => {
      // return planTemplatesApi.getAll();
      return mockPlans; // Temporary mock data
    },
  });

  const copyPlanUrl = async (slug: string) => {
    const url = `${window.location.origin}/plan/share/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const openPlanInNewTab = (slug: string) => {
    window.open(`/plan/share/${slug}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border border-gray-800 bg-black/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Share2 className="mr-2 h-5 w-5 text-purple-400" />
                Shareable App Plans
              </CardTitle>
              <p className="text-sm text-neutral-100 mt-1">
                Create professional app plans from ChatGPT content and share with clients
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Plans List */}
      <Card className="border border-gray-800 bg-black/30">
        <CardHeader>
          <CardTitle className="text-lg">Your Shareable Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No plans created yet</h3>
              <p className="text-neutral-100 mb-4">
                Create your first shareable app plan to get started
              </p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Plan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-white">{plan.title}</h3>
                      {plan.is_public && (
                        <Badge variant="success" className="bg-green-500/20 text-green-400">
                          Public
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-100">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {plan.view_count} views
                      </span>
                      <span>/{plan.slug}</span>
                      <span>
                        Created {new Date(plan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPlanUrl(plan.slug)}
                      className="text-neutral-100 hover:text-white"
                    >
                      {copiedSlug === plan.slug ? (
                        <>
                          <span className="mr-2 text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy URL
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openPlanInNewTab(plan.slug)}
                      className="text-neutral-100 hover:text-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-100 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Plan Dialog */}
      <CreatePlanDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
} 