
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

/** Shows dashboard linked to a logged-in client-portal user */
export default function ClientDashboard() {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/client-portal");
        return;
      }
      
      try {
        // Fetch client link using raw SQL query to avoid type issues
        const { data: links, error: linkError } = await supabase
          .from('client_user_links')
          .select('client_id')
          .eq('user_id', user.id)
          .limit(1);

        if (linkError) {
          console.error('Error fetching client link:', linkError);
          toast({
            variant: "destructive",
            title: "Error fetching client data",
            description: linkError.message,
          });
          setLoading(false);
          return;
        }

        if (!links || links.length === 0) {
          toast({
            variant: "destructive",
            title: "No client linked",
            description: "You are not linked to any client profile.",
          });
          setLoading(false);
          return;
        }
        
        const clientId = links[0].client_id;

        // Fetch client info
        const { data: clientData, error: clientError } = await supabase
          .from('client_onboarding')
          .select('*')
          .eq('id', clientId)
          .maybeSingle();

        if (clientError) {
          console.error('Error fetching client data:', clientError);
          toast({
            variant: "destructive",
            title: "Client not found",
            description: clientError.message,
          });
          setLoading(false);
          return;
        }
        
        setClient(clientData);
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
    return <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Card className="bg-white px-4 py-8">
        <p className="text-2xl font-semibold text-center mb-5">No client profile linked to your login.</p>
        <Button onClick={() => navigate("/client-portal")}>
          Go to Login
        </Button>
      </Card>
    </div>
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
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={() => navigate("/client-portal")}>Logout</Button>
          {/* You can add more dashboard features here */}
        </div>
      </Card>
    </div>
  );
}
