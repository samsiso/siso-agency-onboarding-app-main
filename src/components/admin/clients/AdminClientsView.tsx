import { useEffect, useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import { ClientViewPreference } from '@/types/client.types';
import { updateExistingClientData, makeCurrentUserAdmin } from '@/utils/clientDataUtils';
import { useToast } from '@/hooks/use-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ClientsCardGrid } from "@/components/admin/clients/ClientsCardGrid";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ViewModeSwitcher } from './ViewModeSwitcher';
import { AirtableClientsTable } from './AirtableClientsTable';

interface AdminClientsViewProps {
  isAdmin: boolean;
}

export function AdminClientsView({ isAdmin }: AdminClientsViewProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Enhanced view preferences with all columns visible by default
  const [viewPreference, setViewPreference] = useState<ClientViewPreference>({
    columns: [
      { key: 'full_name', visible: true, label: 'Client Name', width: 200, pinned: true },
      { key: 'business_name', visible: true, label: 'Business Name', width: 180 },
      { key: 'email', visible: true, label: 'Email', width: 200 },
      { key: 'phone', visible: true, label: 'Phone', width: 150 },
      { key: 'status', visible: true, label: 'Status', width: 120, pinned: true },
      { key: 'project_name', visible: true, label: 'Project Name', width: 180 },
      { key: 'company_niche', visible: true, label: 'Company Niche', width: 160 },
      { key: 'notion_plan_url', visible: true, label: 'Notion Plan', width: 150 },
      { key: 'key_research', visible: true, label: 'Key Research', width: 200 },
      { key: 'development_url', visible: true, label: 'Development URL', width: 180 },
      { key: 'next_steps', visible: true, label: 'Next Steps', width: 220 },
      { key: 'payment_status', visible: true, label: 'Payment Status', width: 150 },
      { key: 'estimated_price', visible: true, label: 'Estimated Price', width: 150 },
      { key: 'initial_contact_date', visible: true, label: 'First Contact', width: 150 },
      { key: 'start_date', visible: true, label: 'Start Date', width: 150 },
      { key: 'estimated_completion_date', visible: true, label: 'Due Date', width: 150 },
      { key: 'updated_at', visible: true, label: 'Last Updated', width: 150 },
      { key: 'todos', visible: true, label: 'Todo Items', width: 150 },
      { key: 'purchase_history', visible: true, label: 'Purchase History', width: 180 },
      { key: 'client_contact', visible: true, label: 'Client Contact', width: 160 },
      { key: 'referral_source', visible: true, label: 'Referral Source', width: 160 },
      { key: 'assigned_to', visible: true, label: 'Assigned To', width: 150 },
      { key: 'priority', visible: true, label: 'Priority', width: 120 },
    ],
    sortColumn: 'updated_at',
    sortDirection: 'desc',
    pageSize: 10,
    showAllColumns: true
  });

  useEffect(() => {
    const initializeData = async () => {
      // Try to make current user admin for easier testing
      const isAdminSuccess = await makeCurrentUserAdmin();
      if (isAdminSuccess) {
        // Admin role setup complete
      }
      // Check client data
      const hasClientData = await updateExistingClientData();
      if (hasClientData) {
        toast({
          title: "Client data initialized",
          description: "Sample client data is ready for use."
        });
      } else {
        toast({
          variant: "destructive",
          title: "No client data found",
          description: "There appears to be an issue with the client data. Please check the database."
        });
      }
    };
    initializeData();
    // eslint-disable-next-line
  }, [toast]);

  // Save view preferences to localStorage
  useEffect(() => {
    if (viewPreference) {
      localStorage.setItem('clientViewPreference', JSON.stringify(viewPreference));
    }
  }, [viewPreference]);

  // Load view preferences from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('clientViewPreference');
    if (savedPreference) {
      try {
        setViewPreference(JSON.parse(savedPreference));
      } catch (e) {
        // Failed to parse saved view preference
      }
    }
  }, []);

  const handleViewPreferenceChange = (newPreference: Partial<ClientViewPreference>) => {
    setViewPreference(prev => ({
      ...prev,
      ...newPreference
    }));
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/15 flex items-center justify-center shadow-sm">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage your agency's client data, statuses, and project details.
              </p>
            </div>
          </div>
          <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>
      
      {viewMode === "table" ? (
        <AirtableClientsTable
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
        />
      ) : (
        <ClientsCardGrid
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          sortColumn={viewPreference.sortColumn}
          sortDirection={viewPreference.sortDirection}
        />
      )}
    </div>
  );
}
