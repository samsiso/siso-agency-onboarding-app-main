
import { useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import { ClientStatusBadge } from './ClientStatusBadge';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Mail, Phone, Globe, MessageCircle, Edit } from 'lucide-react';
import { useClientDetails } from '@/hooks/client/useClientDetails';
import { Loader2 } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatters';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface ClientDetailSheetProps {
  clientId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDetailSheet({ clientId, isOpen, onClose }: ClientDetailSheetProps) {
  const { client, isLoading, error } = useClientDetails(clientId);
  
  // Close sheet when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (error) {
    console.error("Error loading client details:", error);
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent className="w-[600px] sm:max-w-xl overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between mb-6">
          <SheetTitle>Client Details</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !client ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Client details not available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with Avatar and Status */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-muted">
                {client.avatar_url ? (
                  <img 
                    src={client.avatar_url} 
                    alt={client.full_name || 'Client avatar'} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                    {(client.full_name || 'C').charAt(0)}
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-bold">{client.full_name}</h2>
                <p className="text-muted-foreground">{client.business_name || 'No company'}</p>
                <div className="mt-2">
                  <ClientStatusBadge status={client.status} />
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="border rounded-md p-4 space-y-3">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              
              <div className="grid grid-cols-1 gap-3">
                {client.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${client.email}`} 
                      className="text-blue-500 hover:underline"
                    >
                      {client.email}
                    </a>
                  </div>
                )}
                
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`tel:${client.phone}`} 
                      className="text-blue-500 hover:underline"
                    >
                      {client.phone}
                    </a>
                  </div>
                )}
                
                {client.website_url && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={client.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      {client.website_url}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Project Information */}
            <div className="border rounded-md p-4">
              <h3 className="font-semibold mb-4">Project Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Project Name</p>
                  <p>{client.project_name || 'Not specified'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p>{client.company_niche || 'Not specified'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Development URL</p>
                  {client.development_url ? (
                    <a 
                      href={client.development_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      View Site <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  ) : (
                    <p>Not available</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Initial Contact</p>
                  <p>{client.initial_contact_date 
                    ? formatRelativeTime(client.initial_contact_date) 
                    : 'Unknown'}</p>
                </div>
              </div>
              
              {/* Onboarding Progress */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Onboarding Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {client.current_step} of {client.total_steps} steps
                  </p>
                </div>
                
                <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ 
                      width: `${(client.current_step / client.total_steps) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {client.email ? 'Send an email' : 'No email available'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Send an internal message
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button variant="default">
                <Edit className="h-4 w-4 mr-2" />
                Edit Client
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
