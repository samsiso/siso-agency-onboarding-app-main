import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wrench, Filter, Star } from 'lucide-react';

export function ToolsCategories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 animate-fade-in delay-300">
      <Alert className="bg-siso-text/5 border border-siso-text/10 transition-all duration-300 hover:bg-siso-text/10">
        <Wrench className="h-4 w-4 text-siso-orange" />
        <AlertDescription className="text-siso-text/80">
          <span className="font-semibold text-siso-text">Development:</span> Tools for coding, AI, and technical tasks.
        </AlertDescription>
      </Alert>
      
      <Alert className="bg-siso-text/5 border border-siso-text/10 transition-all duration-300 hover:bg-siso-text/10">
        <Filter className="h-4 w-4 text-siso-orange" />
        <AlertDescription className="text-siso-text/80">
          <span className="font-semibold text-siso-text">Database:</span> Data storage and management solutions.
        </AlertDescription>
      </Alert>
      
      <Alert className="bg-siso-text/5 border border-siso-text/10 transition-all duration-300 hover:bg-siso-text/10">
        <Star className="h-4 w-4 text-siso-orange" />
        <AlertDescription className="text-siso-text/80">
          <span className="font-semibold text-siso-text">Automation:</span> Workflow automation tools.
        </AlertDescription>
      </Alert>
    </div>
  );
}