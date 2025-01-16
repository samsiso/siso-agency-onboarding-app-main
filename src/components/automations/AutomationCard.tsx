import { Download } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Automation } from './types';

interface AutomationCardProps {
  automation: Automation;
  onClick: (automation: Automation) => void;
}

export function AutomationCard({ automation, onClick }: AutomationCardProps) {
  return (
    <Card 
      className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 cursor-pointer"
      onClick={() => onClick(automation)}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:animate-glow">
            <Download className="w-3 h-3 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-siso-text-bold truncate">{automation.name}</h3>
            <p className="text-xs text-siso-text/80">{automation.platform || 'General'}</p>
          </div>
        </div>
        {automation.description && (
          <p className="mt-2 text-xs text-siso-text line-clamp-2">
            {automation.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}