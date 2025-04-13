
import { Button } from "@/components/ui/button";
import { Plus, FileText, Bell, Users } from "lucide-react";

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button 
        size="sm" 
        className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white flex gap-2"
      >
        <Plus className="h-4 w-4" />
        <span>New Project</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        className="bg-black/30 border-siso-text/10 hover:bg-siso-bg-alt hover:border-siso-border-hover flex gap-2"
      >
        <FileText className="h-4 w-4" />
        <span>Create Invoice</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        className="bg-black/30 border-siso-text/10 hover:bg-siso-bg-alt hover:border-siso-border-hover flex gap-2"
      >
        <Bell className="h-4 w-4" />
        <span>Notifications</span>
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        className="bg-black/30 border-siso-text/10 hover:bg-siso-bg-alt hover:border-siso-border-hover flex gap-2"
      >
        <Users className="h-4 w-4" />
        <span>Team</span>
      </Button>
    </div>
  );
}
