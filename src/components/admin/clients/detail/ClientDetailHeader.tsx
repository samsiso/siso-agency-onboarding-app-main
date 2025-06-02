import React from 'react';
import { ClientData } from '@/types/client.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClientStatusBadge } from '@/components/admin/clients/ClientStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, Phone, Globe, Calendar, FileEdit, MessageCircle, AlertCircle 
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatters';

interface ClientDetailHeaderProps {
  client: ClientData;
}

export function ClientDetailHeader({ client }: ClientDetailHeaderProps) {
  const initials = client.full_name
    ? client.full_name.split(' ').map((n) => n[0]).join('')
    : client.business_name?.substring(0, 2) || 'CL';

  return (
    <Card className="border-t-4 border-t-primary bg-gray-900/50 border-gray-700/30">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-gray-600">
              <AvatarImage src={client.avatar_url || undefined} alt={client.full_name || 'Client'} />
              <AvatarFallback className="text-lg bg-primary/20 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-100">
                  {client.full_name || 'Unnamed Client'}
                </h1>
                <ClientStatusBadge status={client.status} className="h-fit" />
              </div>

              {client.business_name && (
                <p className="text-gray-300 text-lg mb-1">
                  {client.business_name}
                </p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                {client.email && (
                  <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </a>
                )}

                {client.phone && (
                  <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary">
                    <Phone className="h-4 w-4" />
                    {client.phone}
                  </a>
                )}

                {client.website_url && (
                  <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary">
                    <Globe className="h-4 w-4" />
                    {client.website_url.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                )}

                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  {client.created_at && (
                    <span>Client since {new Date(client.created_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2 justify-end">
            <Button className="flex gap-2 items-center">
              <MessageCircle className="h-4 w-4" />
              Contact
            </Button>
            <Button variant="outline" className="flex gap-2 items-center border-gray-600 text-gray-200 hover:bg-gray-800">
              <FileEdit className="h-4 w-4" />
              Edit Details
            </Button>
            <Button variant="outline" className="flex gap-2 items-center border-gray-600 text-gray-200 hover:bg-gray-800">
              <AlertCircle className="h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap mt-6 gap-x-6 gap-y-2 text-sm text-gray-400">
          <div>
            <span className="font-medium text-gray-300">Project Name:</span>{' '}
            {client.project_name || 'Not specified'}
          </div>
          <div>
            <span className="font-medium text-gray-300">Industry:</span>{' '}
            {client.company_niche || 'Not specified'}
          </div>
          <div>
            <span className="font-medium text-gray-300">Last Updated:</span>{' '}
            {client.updated_at ? formatRelativeTime(client.updated_at) : 'Unknown'}
          </div>
          <div>
            <span className="font-medium text-gray-300">Onboarding:</span>{' '}
            {`${client.current_step || 0}/${client.total_steps || 1} Steps Completed`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
