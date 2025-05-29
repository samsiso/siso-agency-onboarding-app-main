import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Share2, Eye, Edit, Trash2, ExternalLink, Copy, Calendar, TrendingUp } from 'lucide-react';
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
  },
  {
    id: '3', 
    title: 'Juice Bar Mobile App Plan',
    slug: 'juice-bar',
    view_count: 5,
    status: 'active',
    created_at: new Date(Date.now() - 172800000).toISOString(),
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

  const handlePlanClick = (slug: string) => {
    window.open(`/plan/share/${slug}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-slate-900/90 via-purple-900/50 to-slate-900/90 backdrop-blur-sm shadow-xl rounded-xl">
        <CardHeader className="pb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <CardTitle className="flex items-center text-white text-2xl font-bold">
                <Share2 className="mr-4 h-7 w-7 text-purple-400" />
                Shareable App Plans
              </CardTitle>
              <p className="text-slate-200 text-base max-w-2xl leading-relaxed">
                Create professional app plans from ChatGPT content and share with clients via secure URLs. 
                Perfect for proposals, quotes, and project presentations.
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 px-8 py-3 h-12 rounded-lg font-semibold"
              size="lg"
            >
              <Plus className="mr-3 h-5 w-5" />
              Create New Plan
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Plans Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Your Shareable Plans</h2>
          <div className="text-sm text-neutral-300">
            {plans.length} plan{plans.length !== 1 ? 's' : ''} created
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-gray-700 bg-gray-800/50">
                <CardHeader className="space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16 bg-gray-700" />
                    <Skeleton className="h-8 w-16 bg-gray-700" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-600/50 bg-slate-800/30 rounded-xl">
            <CardContent className="py-20 text-center">
              <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                <Share2 className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No plans created yet</h3>
              <p className="text-slate-300 mb-8 max-w-md mx-auto text-base leading-relaxed">
                Create your first shareable app plan to get started. Perfect for client proposals and project presentations.
              </p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-12 px-8 rounded-lg font-semibold"
                size="lg"
              >
                <Plus className="mr-3 h-5 w-5" />
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className="border-slate-600/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 hover:from-slate-700/90 hover:to-slate-800/90 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 rounded-xl backdrop-blur-sm"
                onClick={() => handlePlanClick(plan.slug)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-white text-lg group-hover:text-purple-200 transition-colors duration-200 truncate font-semibold">
                        {plan.title}
                      </CardTitle>
                      <div className="flex items-center mt-3 space-x-3">
                        {plan.is_public && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-3 py-1">
                            Public
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-slate-300 border-slate-500 text-xs px-3 py-1">
                          {plan.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-slate-300">
                      <Eye className="w-4 h-4 mr-2 text-blue-400" />
                      <span className="text-white font-semibold">{plan.view_count}</span>
                      <span className="ml-1">views</span>
                    </div>
                    <div className="flex items-center text-slate-300">
                      <Calendar className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-white font-semibold">
                        {new Date(plan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-2 font-mono border border-slate-700/30">
                    /plan/share/{plan.slug}
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyPlanUrl(plan.slug);
                      }}
                      className="text-slate-300 hover:text-white hover:bg-slate-700/50 flex-1 h-9 rounded-lg transition-all duration-200"
                    >
                      {copiedSlug === plan.slug ? (
                        <span className="text-green-400 text-xs font-medium">Copied!</span>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          <span className="text-xs">Copy URL</span>
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPlanInNewTab(plan.slug);
                      }}
                      className="text-slate-300 hover:text-white hover:bg-slate-700/50 h-9 w-9 rounded-lg transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-300 hover:text-white hover:bg-slate-700/50 h-9 w-9 rounded-lg transition-all duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-9 w-9 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Plan Dialog */}
      <CreatePlanDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
} 