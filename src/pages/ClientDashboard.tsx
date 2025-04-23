import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TodoList } from "@/components/admin/clients/TodoList";
import { ClientData, TodoItem } from "@/types/client.types";
import { ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ClientDashboardLayout } from "@/components/client/ClientDashboardLayout";

export default function ClientDashboard() {
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpdateTodos = async (todos: TodoItem[]) => {
    if (!client) return;
    try {
      const { error } = await supabase
        .from('client_onboarding')
        .update({ todos: JSON.parse(JSON.stringify(todos)) })
        .eq('id', client.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating todos",
          description: error.message,
        });
      } else {
        setClient(prev => prev ? { ...prev, todos } : null);
      }
    } catch (error) {
      console.error('Unexpected error updating todos:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while updating todos.",
      });
    }
  };

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/client-portal");
          return;
        }
        // Use RPC to fetch client ID safely
        const { data: clientIdData, error: clientIdError } = await supabase.rpc('get_client_by_user_id', { user_uuid: user.id });
        if (clientIdError || !clientIdData || clientIdData.length === 0) {
          setLoading(false);
          setClient(null);
          return;
        }
        const clientId = clientIdData[0].client_id;
        // Fetch client info and properly type with todos
        type DBClient = {
          id: string;
          full_name?: string;
          email?: string | null;
          business_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          status: string;
          current_step: number;
          total_steps: number;
          completed_steps: string[];
          created_at: string;
          updated_at: string;
          website_url?: string | null;
          professional_role?: string | null;
          bio?: string | null;
          project_name?: string | null;
          company_niche?: string | null;
          development_url?: string | null;
          mvp_build_status?: string | null;
          notion_plan_url?: string | null;
          payment_status?: string | null;
          estimated_price?: number | null;
          initial_contact_date?: string | null;
          start_date?: string | null;
          estimated_completion_date?: string | null;
          todos?: any;
          next_steps?: string | null;
          key_research?: string | null;
          priority?: string | null;
          contact_name?: string | null;
          company_name?: string | null;
        };
        const { data: clientDataRaw, error: clientError } = await supabase
          .from('client_onboarding')
          .select('*')
          .eq('id', clientId)
          .maybeSingle();
        if (clientError || !clientDataRaw) {
          setClient(null);
          setLoading(false);
          return;
        }
        const clientData = clientDataRaw as DBClient;
        let todos: TodoItem[] = [];
        if (clientData.todos && Array.isArray(clientData.todos)) {
          todos = clientData.todos as TodoItem[];
        }
        const completeClientData: ClientData = {
          id: clientData.id,
          full_name: clientData.contact_name || '',
          email: null,
          business_name: clientData.company_name || null,
          phone: null,
          avatar_url: null,
          status: clientData.status,
          current_step: clientData.current_step,
          total_steps: clientData.total_steps,
          completed_steps: clientData.completed_steps || [],
          created_at: clientData.created_at,
          updated_at: clientData.updated_at,
          website_url: clientData.website_url,
          project_name: clientData.project_name,
          company_niche: clientData.company_niche,
          contact_name: clientData.contact_name,
          company_name: clientData.company_name,
          todos: todos,
        };
        setClient(completeClientData);
      } catch (error) {
        console.error('Unexpected error in fetchClientData:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred while fetching client data.",
        });
        setClient(null);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <ClientDashboardLayout>
        <div className="max-w-5xl mx-auto p-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </ClientDashboardLayout>
    );
  }

  if (!client) {
    // Show a clear, user-friendly message consistent with the client portal UI
    return (
      <ClientDashboardLayout>
        <div className="max-w-2xl mx-auto flex flex-col gap-6 justify-center items-center min-h-[65vh]">
          <img
            src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
            alt="Client Portal"
            className="w-20 h-20 rounded border border-slate-200"
          />
          <h1 className="font-bold text-2xl text-slate-800 mt-2">Welcome to your Client Portal</h1>
          <Card className="p-6 bg-white/90 border border-slate-200 flex flex-col items-center gap-2">
            <p className="text-md text-slate-700 mb-2">
              We couldn't find a client profile linked to your login.<br />
              If you believe this is an error, please contact your project manager or support.
            </p>
            <div className="flex gap-2 flex-wrap w-full">
              <Button onClick={() => navigate("/client-portal")} variant="outline" className="w-full">Return to Login</Button>
              <Button onClick={() => navigate("/client-dashboard/support")} className="w-full">Contact Support</Button>
            </div>
          </Card>
        </div>
      </ClientDashboardLayout>
    );
  }

  const calculateProgress = () => {
    if (!client.completed_steps || !client.total_steps) return 0;
    return (client.completed_steps.length / client.total_steps) * 100;
  };

  return (
    <ClientDashboardLayout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          Welcome, {client.contact_name || client.company_name || "Client"}
        </h1>
        <p className="text-slate-500 mb-6">Here's an overview of your project</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Project Status Card */}
          <Card className="p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-500">Project Status</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${client.status === 'active' ? 'bg-green-100 text-green-800' :
                  client.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'}`}>
                {client.status.toUpperCase()}
              </span>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-slate-500">Project Progress</h4>
              <Progress value={calculateProgress()} className="h-2 mt-2" />
              <p className="text-right text-xs text-slate-500 mt-1">{Math.round(calculateProgress())}% Complete</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/client-dashboard/status')}
              className="w-full mt-4 flex justify-between items-center"
            >
              <span>View Details</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Card>

          {/* Tasks Overview Card */}
          <Card className="p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-500">Tasks</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-semibold mt-2">{client.todos?.length || 0}</p>
            <p className="text-sm text-slate-500">Pending tasks</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/client-dashboard/tasks')}
              className="w-full mt-4 flex justify-between items-center"
            >
              <span>Manage Tasks</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Card>

          {/* Timeline Card */}
          <Card className="p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-500">Project Timeline</h3>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Start:</span>
                <span className="text-slate-600">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="font-medium">Est. Completion:</span>
                <span className="text-slate-600">
                  {client.estimated_completion_date
                    ? new Date(client.estimated_completion_date).toLocaleDateString()
                    : 'TBD'}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/client-dashboard/status')}
              className="w-full mt-4 flex justify-between items-center"
            >
              <span>View Timeline</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Card>
        </div>

        <Card className="p-6 border border-slate-200 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Project Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Project Name</p>
              <p className="font-medium">{client.project_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Company</p>
              <p className="font-medium">{client.company_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Industry/Niche</p>
              <p className="font-medium">{client.company_niche || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Website</p>
              <p className="font-medium">
                {client.website_url ? (
                  <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {client.website_url}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
        </Card>

        {/* Todo List Section */}
        <Card className="p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/client-dashboard/tasks')}
            >
              View All
            </Button>
          </div>
          <TodoList
            todos={client.todos || []}
            onUpdate={handleUpdateTodos}
            clientId={client.id}
          />
        </Card>
      </div>
    </ClientDashboardLayout>
  );
}
