
import React from 'react';
import { Helmet } from 'react-helmet';
import { ClientDashboardLayout } from '@/components/client/ClientDashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useProjects } from '@/hooks/useProjects';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientProjectsPage() {
  const { data: project, isLoading, error } = useProjects();

  return (
    <ProtectedRoute>
      <Helmet>
        <title>All Projects | SISO Agency</title>
      </Helmet>
      <ClientDashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">All Projects</h1>
            <Button asChild className="bg-gradient-to-r from-siso-orange to-siso-red hover:opacity-90">
              <Link to="/client-dashboard/plan-builder">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Project
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* UbahCrypt Project Card */}
            <Card className="bg-black/30 border-siso-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-siso-orange" />
                  UbahCrypt Project
                </CardTitle>
                <CardDescription>
                  A secure and innovative cryptocurrency platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-siso-text">Status:</span>
                    <span className="text-siso-orange">In Development</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-siso-text">Tasks:</span>
                    <span>12 / 24 Complete</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/client-dashboard/projects/ubahcrypt">View Project</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* NFT Marketplace Project Card */}
            <Card className="bg-black/30 border-siso-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-siso-orange" />
                  NFT Marketplace
                </CardTitle>
                <CardDescription>
                  Digital marketplace for buying and selling NFTs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-siso-text">Status:</span>
                    <span className="text-green-500">Completed</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-siso-text">Tasks:</span>
                    <span>24 / 24 Complete</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/client-dashboard/projects/nftmarket">View Project</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* DeFi Trading App Project Card */}
            <Card className="bg-black/30 border-siso-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-siso-orange" />
                  DeFi Trading App
                </CardTitle>
                <CardDescription>
                  Decentralized finance trading application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-siso-text">Status:</span>
                    <span className="text-yellow-500">Planning</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-siso-text">Tasks:</span>
                    <span>0 / 18 Complete</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/client-dashboard/projects/defiapp">View Project</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </ClientDashboardLayout>
    </ProtectedRoute>
  );
}
