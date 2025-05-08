
import React from 'react';
import { ClientData } from '@/types/client.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface PriorityCardProps {
  client: ClientData;
  onClick?: () => void;
}

export function PriorityCard({ client, onClick }: PriorityCardProps) {
  return (
    <Card 
      className="overflow-hidden border border-orange-500/20 bg-black/30 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(255,167,38,0.2)]"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="font-medium text-white">
              {client.business_name || client.full_name}
            </h3>
            <p className="text-sm text-siso-text/70">{client.project_name || 'No project name'}</p>
          </div>
          <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500/20">
            Priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 text-sm">
        <div className="flex items-center gap-2 mb-2 text-siso-text/80">
          <Calendar className="h-4 w-4" />
          <span>
            Updated {formatDistanceToNow(new Date(client.updated_at), { addSuffix: true })}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <span className="text-white">Requires immediate attention</span>
          </div>
          <p className="text-siso-text/80 mt-1 text-sm">
            {client.todos && client.todos.length > 0
              ? `${client.todos.length} pending tasks`
              : 'No pending tasks'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto text-xs text-siso-text hover:text-white hover:bg-orange-500/20"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          View Details <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
