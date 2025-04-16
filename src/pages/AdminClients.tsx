
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { ClientsTable } from '@/components/admin/clients/ClientsTable';
import { ClientsToolbar } from '@/components/admin/clients/ClientsToolbar';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2 } from 'lucide-react';
import { ClientViewPreference } from '@/types/client.types';

export default function AdminClients() {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // New state for view preferences
  const [viewPreference, setViewPreference] = useState<ClientViewPreference>({
    columns: [
      { key: 'full_name', visible: true },
      { key: 'business_name', visible: true },
      { key: 'email', visible: true },
      { key: 'phone', visible: false },
      { key: 'status', visible: true },
      { key: 'project_name', visible: true },
      { key: 'company_niche', visible: true },
      { key: 'development_url', visible: true },
      { key: 'payment_status', visible: false },
      { key: 'estimated_price', visible: false },
      { key: 'start_date', visible: false },
      { key: 'estimated_completion_date', visible: false },
      { key: 'updated_at', visible: true },
    ],
    sortColumn: 'updated_at',
    sortDirection: 'desc',
    pageSize: 10
  });

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
