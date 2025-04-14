
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { PlansList } from '@/components/admin/PlansList';
import { PlanForm } from '@/components/admin/PlanForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminPlans() {
  const { planId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Check if we're in create mode
  const isCreateMode = location.pathname.endsWith('/create');
  const isEditMode = location.pathname.includes('/edit');
  
  const handleBack = () => {
    navigate('/admin/plans');
  };
  
  const handleFormSuccess = () => {
    navigate('/admin/plans');
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          {(isCreateMode || isEditMode) && (
            <Button
              onClick={handleBack}
              variant="ghost"
              className="mr-4 bg-black/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>
          )}
          
          <h1 className="text-2xl font-bold text-white">
            {isCreateMode ? 'Create New Plan' : isEditMode ? 'Edit Plan' : 'App Plans'}
          </h1>
        </div>
        
        {isCreateMode ? (
          <PlanForm
            onSuccess={handleFormSuccess}
            mode="create"
          />
        ) : isEditMode && planId ? (
          <PlanForm
            onSuccess={handleFormSuccess}
            initialData={{ id: planId }}
            mode="edit"
          />
        ) : (
          <PlansList />
        )}
      </div>
    </MainLayout>
  );
}
