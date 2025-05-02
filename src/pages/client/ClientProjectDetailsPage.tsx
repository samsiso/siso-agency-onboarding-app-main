
import React from 'react';
import { Helmet } from 'react-helmet';
import { ClientDashboardLayout } from '@/components/client/ClientDashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function ClientProjectDetailsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  
  // In a real app, you would fetch project details from an API
  const projectName = projectId === 'ubahcrypt' ? 'UbahCrypt Project' : 
                     projectId === 'nftmarket' ? 'NFT Marketplace' : 
                     projectId === 'defiapp' ? 'DeFi Trading App' : 'Unknown Project';

  return (
    <ProtectedRoute>
      <Helmet>
        <title>{projectName} Overview | SISO Agency</title>
      </Helmet>
      <ClientDashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{projectName} Overview</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="border-siso-border">
                <Calendar className="mr-2 h-4 w-4" />
                View Timeline
              </Button>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                View Tasks
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Stats */}
            <Card className="bg-black/30 border-siso-border col-span-3 md:col-span-1">
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-siso-text">Status:</span>
                  <span className="text-siso-orange font-semibold">In Progress</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-siso-text">Start Date:</span>
                  <span>March 15, 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-siso-text">Estimated Completion:</span>
                  <span>June 30, 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-siso-text">Tasks Complete:</span>
                  <span>12 / 24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-siso-text">Budget Used:</span>
                  <span>$4,500 / $10,000</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Project Description */}
            <Card className="bg-black/30 border-siso-border col-span-3 md:col-span-2">
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {projectId === 'ubahcrypt' && "UbahCrypt is a secure and innovative cryptocurrency platform designed to simplify crypto trading, wallet management, and investment tracking. The platform will include advanced security features, real-time market data, and an intuitive user interface."}
                  {projectId === 'nftmarket' && "The NFT Marketplace is a digital platform for buying, selling, and trading unique digital assets. The marketplace supports various NFT formats, includes artist profiles, auction functionality, and secure wallet integration."}
                  {projectId === 'defiapp' && "DeFi Trading App is a decentralized finance application that enables users to trade, lend, borrow, and earn interest on their digital assets. The app will connect to multiple DeFi protocols and provide a unified interface for managing DeFi investments."}
                </p>
                <div className="mt-4">
                  <Button variant="link" className="text-siso-orange p-0 h-auto">
                    View Full Project Plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming Milestones */}
            <Card className="bg-black/30 border-siso-border col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-black/20">
                    <Clock className="h-5 w-5 text-siso-orange mt-1" />
                    <div>
                      <h3 className="font-semibold">Frontend Development Completion</h3>
                      <p className="text-sm text-siso-text">All user interface components will be completed and ready for integration.</p>
                      <div className="flex gap-2 mt-2 text-xs text-siso-text">
                        <span className="bg-black/30 px-2 py-1 rounded">Due: April 15, 2025</span>
                        <span className="bg-black/30 px-2 py-1 rounded">In Progress</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-black/20">
                    <Clock className="h-5 w-5 text-siso-orange mt-1" />
                    <div>
                      <h3 className="font-semibold">API Integration</h3>
                      <p className="text-sm text-siso-text">Connect to cryptocurrency data providers and implement transaction functionality.</p>
                      <div className="flex gap-2 mt-2 text-xs text-siso-text">
                        <span className="bg-black/30 px-2 py-1 rounded">Due: May 10, 2025</span>
                        <span className="bg-black/30 px-2 py-1 rounded">Not Started</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-black/20">
                    <Clock className="h-5 w-5 text-siso-orange mt-1" />
                    <div>
                      <h3 className="font-semibold">Security Audit</h3>
                      <p className="text-sm text-siso-text">Third-party security firm will perform comprehensive audit of the platform.</p>
                      <div className="flex gap-2 mt-2 text-xs text-siso-text">
                        <span className="bg-black/30 px-2 py-1 rounded">Due: June 5, 2025</span>
                        <span className="bg-black/30 px-2 py-1 rounded">Not Started</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ClientDashboardLayout>
    </ProtectedRoute>
  );
}
