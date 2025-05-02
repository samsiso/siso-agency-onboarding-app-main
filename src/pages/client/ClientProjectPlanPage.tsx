
import React from 'react';
import { Helmet } from 'react-helmet';
import { ClientDashboardLayout } from '@/components/client/ClientDashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

export default function ClientProjectPlanPage() {
  const { projectId } = useParams<{ projectId: string }>();
  
  // In a real app, you would fetch project details from an API
  const projectName = projectId === 'ubahcrypt' ? 'UbahCrypt Project' : 
                     projectId === 'nftmarket' ? 'NFT Marketplace' : 
                     projectId === 'defiapp' ? 'DeFi Trading App' : 'Unknown Project';

  return (
    <ProtectedRoute>
      <Helmet>
        <title>{projectName} Plan & Features | SISO Agency</title>
      </Helmet>
      <ClientDashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{projectName} Plan & Features</h1>
            <Button variant="outline" className="border-siso-border">
              <Download className="mr-2 h-4 w-4" />
              Export Plan PDF
            </Button>
          </div>
          
          {/* Project Plan Overview */}
          <Card className="bg-black/30 border-siso-border">
            <CardHeader>
              <CardTitle>Project Plan Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-black/20 rounded-lg">
                  <h3 className="font-semibold text-siso-orange">Timeline</h3>
                  <p className="text-sm mt-2">3.5 months (14 weeks)</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-siso-text">Start Date:</span>
                      <span>March 15, 2025</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-siso-text">End Date:</span>
                      <span>June 30, 2025</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 bg-black/20 rounded-lg">
                  <h3 className="font-semibold text-siso-orange">Budget</h3>
                  <p className="text-sm mt-2">$10,000 total</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-siso-text">Used:</span>
                      <span>$4,500</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-siso-text">Remaining:</span>
                      <span>$5,500</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 bg-black/20 rounded-lg">
                  <h3 className="font-semibold text-siso-orange">Team</h3>
                  <p className="text-sm mt-2">5 team members</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-siso-text">Project Manager:</span>
                      <span>Alex M.</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-siso-text">Lead Developer:</span>
                      <span>Sarah K.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Features List */}
          <Card className="bg-black/30 border-siso-border">
            <CardHeader>
              <CardTitle>Core Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-green-500">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">User Authentication & Wallet Management</h3>
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Completed</span>
                  </div>
                  <p className="text-sm mt-2 text-siso-text">
                    Secure user authentication system with email verification and 2FA. Wallet creation, import, and management functionality.
                  </p>
                </div>
                
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-siso-orange">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">Trading Interface</h3>
                    <span className="text-xs bg-siso-orange/20 text-siso-orange px-2 py-1 rounded">In Progress</span>
                  </div>
                  <p className="text-sm mt-2 text-siso-text">
                    Real-time trading interface with market and limit orders. Chart integration with technical analysis tools.
                  </p>
                </div>
                
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-blue-500">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">Portfolio Tracking</h3>
                    <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">Not Started</span>
                  </div>
                  <p className="text-sm mt-2 text-siso-text">
                    Comprehensive portfolio tracking with performance metrics, profit/loss calculation, and historical data.
                  </p>
                </div>
                
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-blue-500">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">News & Analytics</h3>
                    <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">Not Started</span>
                  </div>
                  <p className="text-sm mt-2 text-siso-text">
                    Integrated news feed with market analysis, sentiment indicators, and price alerts.
                  </p>
                </div>
                
                <div className="p-4 bg-black/20 rounded-lg border-l-4 border-blue-500">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">Mobile App</h3>
                    <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">Not Started</span>
                  </div>
                  <p className="text-sm mt-2 text-siso-text">
                    Native mobile applications for iOS and Android with trading functionality and push notifications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Project Documents */}
          <Card className="bg-black/30 border-siso-border">
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-siso-orange" />
                    <span>Functional Specifications</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-siso-orange" />
                    <span>Technical Architecture</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-siso-orange" />
                    <span>UI/UX Design Files</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ClientDashboardLayout>
    </ProtectedRoute>
  );
}
