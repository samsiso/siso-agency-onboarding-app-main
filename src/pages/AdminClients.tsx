
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { ClientsTable } from '@/components/admin/clients/ClientsTable';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2 } from 'lucide-react';
import { ClientViewPreference } from '@/types/client.types';
import { updateExistingClientData, makeCurrentUserAdmin } from '@/utils/clientDataUtils';
import { useToast } from '@/hooks/use-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function AdminClients() {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  
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

  // Initialize the clients data and add admin role 
  useEffect(() => {
    const initializeData = async () => {
      console.log('Initializing admin client data');
      
      // Try to make current user admin for easier testing
      const isAdminSuccess = await makeCurrentUserAdmin();
      
      if (isAdminSuccess) {
        console.log('Admin role setup complete');
      }
      
      // Check client data
      const hasClientData = await updateExistingClientData();
      
      if (hasClientData) {
        console.log('Client data verified');
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
  }, [toast]);

  useEffect(() => {
    // Only redirect if we're not loading and admin check is complete
    if (!isLoading && !isAdmin) {
      console.log('Not an admin, redirecting to home');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have admin privileges to access this page.",
      });
      navigate('/home');
    }
  }, [isAdmin, isLoading, navigate, toast]);

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
        console.error('Failed to parse saved view preference', e);
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-siso-orange mb-4" />
        <p className="text-siso-text">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <DndProvider backend={HTML5Backend}>
          <ClientsTable 
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            viewPreference={viewPreference}
            onViewPreferenceChange={handleViewPreferenceChange}
            onSearchChange={handleSearchChange}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </DndProvider>
      </div>
    </AdminLayout>
  );
}
