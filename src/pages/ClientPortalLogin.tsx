
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ClientPortalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);

    if (error) {
      toast({ variant: "destructive", title: "Login failed", description: error.message });
      return;
    }

    toast({ title: "Welcome!", description: "Signed in successfully." });
    navigate("/client-dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 py-10">
      <form onSubmit={handleLogin} className="bg-white max-w-sm rounded shadow p-8 w-full space-y-4">
        <h1 className="text-2xl font-bold text-center mb-2">Client Portal Login</h1>
        <Input 
          type="email"
          placeholder="Your email"
          autoFocus
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input 
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
