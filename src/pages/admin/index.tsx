import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, FileCode, Layout, Settings, AlertTriangle } from 'lucide-react';

export default function AdminHomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Layout className="mr-2 h-5 w-5" />
              Prompt Agent
            </CardTitle>
            <CardDescription>
              Manage AI prompt templates and workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/prompt-agent">
                  Page Prompts System
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/prompt-agent/Crypto%20Trading%20Platform">
                  Crypto Trading Platform
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Database Management
            </CardTitle>
            <CardDescription>
              Manage database configurations and setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/database-setup">
                  UI Prompt System Setup
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <FileCode className="mr-2 h-5 w-5" />
              Development Tools
            </CardTitle>
            <CardDescription>
              Tools for developers and administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/settings">
                  Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6 border-yellow-500/20 bg-yellow-500/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center text-yellow-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Administrative Area
          </CardTitle>
          <CardDescription>
            This area is restricted to administrators only. Be careful when making changes.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
} 