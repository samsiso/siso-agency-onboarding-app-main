import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  GitBranch, 
  Activity, 
  Workflow, 
  CheckCircle, 
  Bug, 
  ListTodo 
} from 'lucide-react';

export default function TestPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Testing Environment</h1>
          <p className="text-gray-400">Access prototype pages and features in development</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-black/20 border-gray-800 hover:bg-black/30 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-400" />
                User Flow Diagram
              </CardTitle>
              <CardDescription>Complete user flow diagram with ReactFlow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Link to="/minimal-flow">
                  <Button className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/30">
                    <Workflow className="h-4 w-4 mr-2" />
                    Minimal Flow Diagram
                  </Button>
                </Link>
                <Link to="/test-flow">
                  <Button className="w-full" variant="outline">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Test Flow
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 border-gray-800 hover:bg-black/30 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-400" />
                Feedback System
              </CardTitle>
              <CardDescription>Track and manage feedback and feature requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Link to="/minimal-flow?tab=feedback">
                  <Button className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30">
                    <ListTodo className="h-4 w-4 mr-2" />
                    Feedback Log
                  </Button>
                </Link>
                <Link to="/projects/ubahcrypt/feedback">
                  <Button className="w-full" variant="outline">
                    <Bug className="h-4 w-4 mr-2" />
                    Project Feedback
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 border-gray-800 hover:bg-black/30 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                Validation Tests
              </CardTitle>
              <CardDescription>System validation and component tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Link to="/">
                  <Button className="w-full" variant="outline">
                    Run Integration Tests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
