import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowDownToLine, 
  Expand, 
  Loader2, 
  LayoutGrid, 
  Network,
  Sparkles,
  Edit 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { UserFlowCardGrid } from '@/components/projects/userflow/cards/UserFlowCardGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';

export default function AdminUserFlow() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'diagram' | 'cards'>('cards');
  
  // Parse view mode from query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const viewParam = searchParams.get('view');
    if (viewParam === 'diagram') {
      setViewMode('diagram');
    }
  }, [location.search]);
  
  // Handle view mode change
  const handleViewModeChange = (mode: 'diagram' | 'cards') => {
    setViewMode(mode);
    const searchParams = new URLSearchParams(location.search);
    if (mode === 'diagram') {
      searchParams.set('view', 'diagram');
    } else {
      searchParams.delete('view');
    }
    navigate({ search: searchParams.toString() });
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Card className="bg-black/20 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-300" />
                  Admin User Flow Collection
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Create and manage user journey diagrams for client projects
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-black/30 border border-gray-800 rounded-md flex items-center p-1 mr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 ${viewMode === 'diagram' ? 'bg-indigo-900/50 text-indigo-300' : 'text-gray-400'}`}
                    onClick={() => handleViewModeChange('diagram')}
                  >
                    <Network className="w-4 h-4 mr-2" />
                    <span>Diagram</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 ${viewMode === 'cards' ? 'bg-indigo-900/50 text-indigo-300' : 'text-gray-400'}`}
                    onClick={() => handleViewModeChange('cards')}
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    <span>Cards</span>
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black/30 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Full screen mode will be available in the next update.",
                    });
                  }}
                >
                  <Expand className="w-4 h-4 mr-2" />
                  <span>Full Screen</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Export functionality will be available in the next update.",
                    });
                  }}
                >
                  <ArrowDownToLine className="w-4 h-4 mr-2" />
                  <span>Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'cards' ? (
                <UserFlowCardGrid projectId={projectId || 'ubahcrypt'} />
              ) : (
                <div className="flex items-center justify-center h-[600px] bg-black/20 rounded-lg border border-gray-800">
                  <div className="p-6 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Admin Flow Editor Coming Soon</h3>
                    <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
                      We're implementing a powerful flow diagram editor for creating user journey visualizations.
                      This feature will be available in the next update.
                    </p>
                    <Button 
                      variant="outline" 
                      className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/30"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "The User Flow editor is currently being implemented.",
                        });
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Check Status
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
