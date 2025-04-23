
import React from 'react';
import { ClientData } from '@/types/client.types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, ArrowRight } from 'lucide-react';

interface ClientCardProps {
  client: ClientData;
  onClick?: () => void;
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20';
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/20';
      case 'paused':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/20';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/20';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card 
      className="overflow-hidden border border-siso-text/10 bg-black/30 backdrop-blur-sm transition-all hover:border-siso-orange/30 hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={client.avatar_url || undefined} alt={client.full_name} />
              <AvatarFallback className="bg-siso-orange/10 text-siso-orange">
                {getInitials(client.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-white">
                {client.business_name || client.full_name}
              </h3>
              <p className="text-sm text-siso-text/70">{client.project_name || 'No project name'}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className={getStatusColor(client.status)}>
            {client.status}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-siso-text/60">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(client.updated_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        {client.company_niche && (
          <p className="text-xs text-siso-text/70 mb-1">
            <span className="font-medium">Industry:</span> {client.company_niche}
          </p>
        )}
        
        {/* Progress indicator */}
        {client.current_step && client.total_steps && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-siso-text/70">Progress</span>
              <span className="text-siso-text/90">{Math.round((client.current_step / client.total_steps) * 100)}%</span>
            </div>
            <div className="w-full h-1 bg-siso-text/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-siso-orange rounded-full"
                style={{ width: `${(client.current_step / client.total_steps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1 justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-siso-text hover:text-white hover:bg-siso-orange/10"
        >
          View Details <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
