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

// New dashboard cards
import { ProjectStatusCard } from "@/components/client/dashboard/ProjectStatusCard";
import { TasksOverviewCard } from "@/components/client/dashboard/TasksOverviewCard";
import { TimelineCard } from "@/components/client/dashboard/TimelineCard";
import { ProjectInformationCard } from "@/components/client/dashboard/ProjectInformationCard";
import { ClientTodoListCard } from "@/components/client/dashboard/ClientTodoListCard";
import { ClientPageTitle } from "@/components/client/layout/ClientPageTitle";
import { ArrowRight } from "lucide-react";

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
        <Skeleton className="h-10 w-72 mb-8 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </ClientDashboardLayout>
    );
  }

  if (!client) {
    return (
      <ClientDashboardLayout>
        <ClientPageTitle
          icon={ArrowRight}
          title="Client Portal"
          subtitle="Welcome to your client portal"
        />
        <div className="flex flex-col gap-6 justify-center items-center min-h-[55vh]">
          <img
            src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
            alt="Client Portal"
            className="w-20 h-20 rounded border border-gray-700"
          />
          <div className="p-8 w-full bg-[#1A1A1A] border border-gray-800 rounded-lg flex flex-col items-center gap-2 max-w-xl mx-auto">
            <p className="text-md text-gray-300 mb-2 text-center">
              We couldn't find a client profile linked to your login.<br />
              If you believe this is an error, please contact your project manager or support.
            </p>
            <div className="flex gap-2 flex-wrap w-full">
              <Button
                onClick={() => navigate("/client-portal")}
                variant="outline"
                className="w-full bg-gray-800 text-white hover:bg-gray-700 border-gray-700"
              >
                Return to Login
              </Button>
              <Button
                onClick={() => navigate("/client-dashboard/support")}
                className="w-full bg-red-500 text-white hover:bg-red-600"
              >
                Contact Support
              </Button>
            </div>
          </div>
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
      <ClientPageTitle
        icon={ArrowRight}
        title={
          client.contact_name || client.company_name
            ? `Welcome, ${client.contact_name || client.company_name}`
            : "Welcome, Client"
        }
        subtitle="Here's an overview of your project"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Project Status Card */}
        <ProjectStatusCard
          status={client.status}
          completed={client.completed_steps?.length || 0}
          total={client.total_steps}
          onViewDetails={() => navigate('/client-dashboard/status')}
        />

        {/* Tasks Overview Card */}
        <TasksOverviewCard
          taskCount={client.todos?.length || 0}
          onManageTasks={() => navigate('/client-dashboard/tasks')}
        />

        {/* Timeline Card */}
        <TimelineCard
          startDate={client.start_date || null}
          completionDate={client.estimated_completion_date || null}
          onViewTimeline={() => navigate('/client-dashboard/status')}
        />
      </div>

      <div className="mb-10">
        <ProjectInformationCard
          projectName={client.project_name}
          companyName={client.company_name}
          companyNiche={client.company_niche}
          websiteUrl={client.website_url}
        />
      </div>

      <ClientTodoListCard
        todos={client.todos || []}
        onUpdate={handleUpdateTodos}
        clientId={client.id}
      />
    </ClientDashboardLayout>
  );
}
