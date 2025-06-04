import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AppPlanGenerator } from '@/components/app-plan/AppPlanGenerator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AppPlan() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-black via-black to-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">AI App Plan Generator</h1>
              <p className="text-gray-400 mt-1">
                Generate comprehensive app development plans using artificial intelligence
              </p>
            </div>
          </div>

          {/* Main Content */}
          <AppPlanGenerator />
        </div>
      </div>
    </MainLayout>
  );
} 