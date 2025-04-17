
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { ClientsTable } from '@/components/admin/clients/ClientsTable';
import { ClientsToolbar } from '@/components/admin/clients/ClientsToolbar';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2 } from 'lucide-react';
import { ClientViewPreference } from '@/types/client.types';
import { updateExistingClientData, makeCurrentUserAdmin } from '@/utils/clientDataUtils';
import { useToast } from '@/hooks/use-toast';

export default function AdminClients() {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  
  // New state for view preferences
  const [viewPreference, setViewPreference] = useState<ClientViewPreference>({
    columns: [
      { key: 'full_name', visible: true, label: 'Full Name' },
      { key: 'business_name', visible: true, label: 'Business Name' },
      { key: 'email', visible: true, label: 'Email' },
      { key: 'phone', visible: false, label: 'Phone' },
      { key: 'status', visible: true, label: 'Status' },
      { key: 'project_name', visible: true, label: 'Project Name' },
      { key: 'company_niche', visible: true, label: 'Company Niche' },
      { key: 'development_url', visible: true, label: 'Development URL' },
      { key: 'payment_status', visible: false, label: 'Payment Status' },
      { key: 'estimated_price', visible: false, label: 'Estimated Price' },
      { key: 'start_date', visible: false, label: 'Start Date' },
      { key: 'estimated_completion_date', visible: false, label: 'Estimated Completion Date' },
      { key: 'updated_at', visible: true, label: 'Last Updated' },
    ],
    sortColumn: 'updated_at',
    sortDirection: 'desc',
    pageSize: 10
  });

  // Initialize the clients data and add admin role 
  useEffect(() => {
    const initializeData = async () => {
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
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-siso-orange" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Client Management</h1>
        
        <ClientsToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewPreference={viewPreference}
          onViewPreferenceChange={handleViewPreferenceChange}
        />
        
        <div className="mt-6">
          <ClientsTable 
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            viewPreference={viewPreference}
            onViewPreferenceChange={handleViewPreferenceChange}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
