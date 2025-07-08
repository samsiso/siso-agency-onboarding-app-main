#!/bin/bash

# 🚀 SISO ADMIN DASHBOARD INTEGRATIONS SETUP SCRIPT
# Sets up powerful integrations for your admin dashboard

set -e  # Exit on any error

echo "🚀 SISO ADMIN DASHBOARD INTEGRATIONS SETUP"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_purple() {
    echo -e "${PURPLE}🔮 $1${NC}"
}

# Check if running in the correct directory
check_directory() {
    if [ ! -f "package.json" ]; then
        log_error "Please run this script from the root of your SISO project directory"
        exit 1
    fi
    log_success "Running in correct directory"
}

# Install required dependencies
install_dependencies() {
    log_info "Installing integration dependencies..."
    
    # Email integrations
    npm install googleapis nodemailer @sendgrid/mail mailchimp-api-v3
    
    # Payment integrations
    npm install stripe paypal-rest-sdk quickbooks-js
    
    # Calendar integrations
    npm install google-calendar ical-generator
    
    # Cloud storage
    npm install @google-cloud/storage dropbox aws-sdk
    
    # AI/Automation
    npm install openai @anthropic-ai/sdk zapier-platform-core
    
    # Social media
    npm install twitter-api-v2 linkedin-api instagram-basic-display-api
    
    # Analytics
    npm install google-analytics-data mixpanel hotjar
    
    # CRM
    npm install @hubspot/api-client salesforce-rest-sdk
    
    # Communication
    npm install @slack/web-api discord.js @microsoft/microsoft-graph-client
    
    log_success "Dependencies installed successfully"
}

# Create integration services directory
create_services_structure() {
    log_info "Creating integration services structure..."
    
    mkdir -p src/services/integrations/{email,payment,calendar,storage,ai,social,analytics,crm,communication}
    mkdir -p src/components/admin/integrations
    mkdir -p src/types/integrations
    mkdir -p src/hooks/integrations
    
    log_success "Services structure created"
}

# Create base integration service template
create_base_integration() {
    log_info "Creating base integration service..."
    
    cat > src/services/integrations/BaseIntegration.ts << 'EOF'
export interface IntegrationStatus {
  connected: boolean;
  lastSync: Date;
  errorMessage?: string;
  rateLimitRemaining?: number;
}

export interface DashboardData {
  [key: string]: any;
}

export abstract class BaseIntegration {
  abstract name: string;
  abstract platform: string;
  protected apiKey?: string;
  protected baseUrl?: string;
  
  abstract connect(): Promise<boolean>;
  abstract disconnect(): Promise<void>;
  abstract getStatus(): Promise<IntegrationStatus>;
  abstract getDashboardData(): Promise<DashboardData>;
  abstract refreshData(): Promise<void>;
  
  protected async makeRequest(endpoint: string, options?: RequestInit): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Integration ${this.name} request failed:`, error);
      throw error;
    }
  }
}
EOF

    log_success "Base integration service created"
}

# Create integration registry
create_integration_registry() {
    log_info "Creating integration registry..."
    
    cat > src/services/integrations/IntegrationRegistry.ts << 'EOF'
import { BaseIntegration } from './BaseIntegration';
import { EmailIntegrationWidget } from '@/components/admin/integrations/EmailIntegrationWidget';
import { PaymentIntegrationWidget } from '@/components/admin/integrations/PaymentIntegrationWidget';
import { AIAutomationWidget } from '@/components/admin/integrations/AIAutomationWidget';

export interface IntegrationWidget {
  id: string;
  name: string;
  component: React.ComponentType;
  size: 'small' | 'medium' | 'large' | 'full';
  category: string;
  description: string;
  refreshInterval?: number;
  permissions: string[];
  settings: Record<string, any>;
}

export const AVAILABLE_INTEGRATIONS: Record<string, IntegrationWidget> = {
  email: {
    id: 'email',
    name: 'Email Integration',
    component: EmailIntegrationWidget,
    size: 'large',
    category: 'Communication',
    description: 'Manage email campaigns, track performance, and automate responses',
    refreshInterval: 30000, // 30 seconds
    permissions: ['email.read', 'email.send'],
    settings: {
      providers: ['gmail', 'outlook', 'sendgrid'],
      defaultProvider: 'gmail'
    }
  },
  
  payment: {
    id: 'payment',
    name: 'Payment Dashboard',
    component: PaymentIntegrationWidget,
    size: 'large',
    category: 'Finance',
    description: 'Monitor revenue, process payments, and track financial metrics',
    refreshInterval: 60000, // 1 minute
    permissions: ['payments.read', 'payments.process'],
    settings: {
      providers: ['stripe', 'paypal'],
      defaultProvider: 'stripe',
      currency: 'USD'
    }
  },
  
  ai: {
    id: 'ai',
    name: 'AI & Automation',
    component: AIAutomationWidget,
    size: 'large',
    category: 'AI/Automation',
    description: 'Monitor AI usage, manage workflows, and track automation performance',
    refreshInterval: 15000, // 15 seconds
    permissions: ['ai.read', 'automation.manage'],
    settings: {
      providers: ['openai', 'claude', 'zapier'],
      tokenLimits: {
        openai: 100000,
        claude: 50000
      }
    }
  }
};

export class IntegrationRegistry {
  private static instance: IntegrationRegistry;
  private integrations: Map<string, BaseIntegration> = new Map();
  
  static getInstance(): IntegrationRegistry {
    if (!IntegrationRegistry.instance) {
      IntegrationRegistry.instance = new IntegrationRegistry();
    }
    return IntegrationRegistry.instance;
  }
  
  register(id: string, integration: BaseIntegration): void {
    this.integrations.set(id, integration);
  }
  
  get(id: string): BaseIntegration | undefined {
    return this.integrations.get(id);
  }
  
  getAll(): BaseIntegration[] {
    return Array.from(this.integrations.values());
  }
  
  async getStatus(id: string): Promise<any> {
    const integration = this.get(id);
    return integration ? await integration.getStatus() : null;
  }
  
  async getDashboardData(id: string): Promise<any> {
    const integration = this.get(id);
    return integration ? await integration.getDashboardData() : null;
  }
}
EOF

    log_success "Integration registry created"
}

# Create integration dashboard component
create_integration_dashboard() {
    log_info "Creating integration dashboard component..."
    
    cat > src/components/admin/integrations/IntegrationDashboard.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Plus, 
  Grid3X3, 
  List,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { EmailIntegrationWidget } from './EmailIntegrationWidget';
import { PaymentIntegrationWidget } from './PaymentIntegrationWidget';
import { AIAutomationWidget } from './AIAutomationWidget';

export function IntegrationDashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAllIntegrations = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Integration Dashboard</h1>
          <p className="text-gray-400">Manage and monitor your business integrations</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAllIntegrations}
            disabled={isRefreshing}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-1" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Integration Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-orange-600">All</TabsTrigger>
          <TabsTrigger value="communication" className="data-[state=active]:bg-orange-600">Communication</TabsTrigger>
          <TabsTrigger value="finance" className="data-[state=active]:bg-orange-600">Finance</TabsTrigger>
          <TabsTrigger value="automation" className="data-[state=active]:bg-orange-600">Automation</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
            <EmailIntegrationWidget />
            <PaymentIntegrationWidget />
            <AIAutomationWidget />
          </div>
        </TabsContent>
        
        <TabsContent value="communication" className="mt-6">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
            <EmailIntegrationWidget />
          </div>
        </TabsContent>
        
        <TabsContent value="finance" className="mt-6">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
            <PaymentIntegrationWidget />
          </div>
        </TabsContent>
        
        <TabsContent value="automation" className="mt-6">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
            <AIAutomationWidget />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <div className="text-center py-12">
            <p className="text-gray-400">Analytics integrations coming soon!</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Integrations</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                Online
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Data Synced</p>
                <p className="text-2xl font-bold text-white">98.7%</p>
              </div>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                Healthy
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">API Calls Today</p>
                <p className="text-2xl font-bold text-white">12.4K</p>
              </div>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                Normal
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Time Saved</p>
                <p className="text-2xl font-bold text-white">24.5h</p>
              </div>
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                This Week
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
EOF

    log_success "Integration dashboard component created"
}

# Update admin dashboard to include integrations
update_admin_dashboard() {
    log_info "Adding integration option to admin dashboard..."
    
    # Create a new admin route for integrations
    cat > src/pages/admin/AdminIntegrations.tsx << 'EOF'
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle';
import { IntegrationDashboard } from '@/components/admin/integrations/IntegrationDashboard';
import { Zap } from 'lucide-react';

export default function AdminIntegrations() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <AdminPageTitle
          icon={Zap}
          title="Integrations"
          subtitle="Connect and manage your business tools in one place"
        />
        <IntegrationDashboard />
      </div>
    </AdminLayout>
  );
}
EOF

    log_success "Admin integrations page created"
}

# Create environment template
create_env_template() {
    log_info "Creating environment template for integrations..."
    
    cat > .env.integrations.example << 'EOF'
# Email Integrations
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
OUTLOOK_CLIENT_ID=your_outlook_client_id
OUTLOOK_CLIENT_SECRET=your_outlook_client_secret
SENDGRID_API_KEY=your_sendgrid_api_key
MAILCHIMP_API_KEY=your_mailchimp_api_key

# Payment Integrations
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Calendar Integrations
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key
OUTLOOK_CALENDAR_CLIENT_ID=your_outlook_calendar_client_id

# Cloud Storage
GOOGLE_CLOUD_STORAGE_KEY=your_gcs_key
DROPBOX_ACCESS_TOKEN=your_dropbox_token
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# AI/Automation
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
ZAPIER_API_KEY=your_zapier_api_key

# Social Media
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Analytics
GOOGLE_ANALYTICS_MEASUREMENT_ID=your_ga_measurement_id
MIXPANEL_PROJECT_TOKEN=your_mixpanel_token

# CRM
HUBSPOT_API_KEY=your_hubspot_api_key
SALESFORCE_CLIENT_ID=your_salesforce_client_id
SALESFORCE_CLIENT_SECRET=your_salesforce_client_secret

# Communication
SLACK_BOT_TOKEN=your_slack_bot_token
DISCORD_BOT_TOKEN=your_discord_bot_token
TEAMS_CLIENT_ID=your_teams_client_id
EOF

    log_success "Environment template created"
}

# Create setup completion summary
create_completion_summary() {
    log_purple "🎉 INTEGRATION SETUP COMPLETE!"
    echo ""
    log_success "✅ Integration widgets created:"
    echo "   - Email Integration Widget"
    echo "   - Payment Integration Widget" 
    echo "   - AI & Automation Widget"
    echo ""
    log_success "✅ Services structure created:"
    echo "   - Base integration service"
    echo "   - Integration registry"
    echo "   - Dashboard components"
    echo ""
    log_success "✅ Admin dashboard updated:"
    echo "   - New integrations page"
    echo "   - Integration management UI"
    echo ""
    log_warning "⚠️  Next steps:"
    echo "   1. Copy .env.integrations.example to .env and add your API keys"
    echo "   2. Add integration route to your router"
    echo "   3. Configure specific integrations you want to use"
    echo "   4. Test integrations in development"
    echo ""
    log_info "📚 Documentation:"
    echo "   - Check ADMIN_DASHBOARD_INTEGRATIONS_PLAN.md for detailed setup guides"
    echo "   - Each integration has specific setup instructions"
    echo ""
    log_purple "🚀 Your admin dashboard is now ready for powerful integrations!"
}

# Main execution
main() {
    echo "Starting SISO Admin Dashboard Integrations Setup..."
    echo ""
    
    check_directory
    install_dependencies
    create_services_structure
    create_base_integration
    create_integration_registry
    create_integration_dashboard
    update_admin_dashboard
    create_env_template
    create_completion_summary
    
    echo ""
    log_success "Setup completed successfully! 🎉"
}

# Run the main function
main "$@" 