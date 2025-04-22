
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TodoList } from "@/components/admin/clients/TodoList";
import { ClientData, TodoItem } from "@/types/client.types";

/** Shows dashboard linked to a logged-in client-portal user */
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
        .update({ todos })
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
          toast({
            variant: "destructive",
            title: "No client linked",
            description: "You are not linked to any client profile.",
          });
          setLoading(false);
          return;
        }

        const clientId = clientIdData[0].client_id;

        // Fetch client info
        const { data: clientData, error: clientError } = await supabase
          .from('client_onboarding')
          .select('*')
          .eq('id', clientId)
          .maybeSingle();

        if (clientError || !clientData) {
          toast({
            variant: "destructive",
            title: "Client not found",
            description: clientError?.message || "Unable to retrieve client data",
          });
          setLoading(false);
          return;
        }
        
        // Create a complete ClientData object with all required fields
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
          todos: Array.isArray(clientData.todos) ? clientData.todos : []
        };
        
        setClient(completeClientData);
      } catch (error) {
        console.error('Unexpected error in fetchClientData:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred while fetching client data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-8 w-80" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Card className="bg-white px-4 py-8">
          <p className="text-2xl font-semibold text-center mb-5">No client profile linked to your login.</p>
          <Button onClick={() => navigate("/client-portal")}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">
          Welcome, {client.contact_name || client.company_name || "Client"}
        </h1>
        <p className="mb-3">Status: <span className="font-semibold">{client.status}</span></p>
        <p className="mb-1">Project Name: <span className="font-semibold">{client.project_name || "-"}</span></p>
        <p className="mb-1">Niche: <span className="font-semibold">{client.company_niche || "-"}</span></p>
        <p className="mb-1">Website: {client.website_url ? <a href={client.website_url} className="text-blue-600 underline">{client.website_url}</a> : "-"}</p>
        
        {/* Todo List Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <TodoList 
            todos={client.todos || []} 
            onUpdate={handleUpdateTodos} 
            clientId={client.id} 
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={() => navigate("/client-portal")}>Logout</Button>
        </div>
      </Card>
    </div>
  );
}
