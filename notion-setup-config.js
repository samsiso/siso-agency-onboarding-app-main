#!/usr/bin/env node

// 📝 NOTION SETUP & CONFIGURATION SCRIPT
// Automates the complete Notion integration setup for SISO Assistant

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class NotionSetup {
  constructor() {
    this.configPath = '.env';
    this.backupPath = '.env.backup';
    this.templatePath = 'notion-template.json';
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run() {
    console.log('🚀 NOTION INTEGRATION SETUP');
    console.log('================================\n');

    try {
      // Step 1: Check prerequisites
      await this.checkPrerequisites();
      
      // Step 2: Backup existing config
      await this.backupExistingConfig();
      
      // Step 3: Get Notion credentials
      const credentials = await this.getNotionCredentials();
      
      // Step 4: Create Notion databases
      const databases = await this.createNotionDatabases(credentials);
      
      // Step 5: Update environment variables
      await this.updateEnvironmentVariables(credentials, databases);
      
      // Step 6: Generate Notion templates
      await this.generateNotionTemplates();
      
      // Step 7: Test connection
      await this.testNotionConnection();
      
      // Step 8: Create setup summary
      await this.createSetupSummary(credentials, databases);

      console.log('\n✅ NOTION INTEGRATION SETUP COMPLETE!');
      console.log('🔗 Check NOTION_SETUP_SUMMARY.md for next steps');

    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      console.log('💡 Check the troubleshooting guide in the documentation');
    } finally {
      this.rl.close();
    }
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...\n');

    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`✓ Node.js version: ${nodeVersion}`);

    // Check if required packages are installed
    const requiredPackages = ['@notionhq/client', '@supabase/supabase-js'];
    
    for (const pkg of requiredPackages) {
      try {
        require.resolve(pkg);
        console.log(`✓ ${pkg} is installed`);
      } catch (error) {
        throw new Error(`❌ Missing package: ${pkg}. Run: npm install ${pkg}`);
      }
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.log('⚠️  Supabase not configured (optional for Notion-only setup)');
    } else {
      console.log('✓ Supabase configuration found');
    }

    console.log('✅ Prerequisites check passed\n');
  }

  async backupExistingConfig() {
    if (fs.existsSync(this.configPath)) {
      fs.copyFileSync(this.configPath, this.backupPath);
      console.log(`✓ Backed up existing .env to ${this.backupPath}\n`);
    }
  }

  async getNotionCredentials() {
    console.log('🔐 NOTION API SETUP');
    console.log('===================\n');
    
    console.log('📋 To get your Notion API key:');
    console.log('1. Go to https://www.notion.so/my-integrations');
    console.log('2. Click "New Integration"');
    console.log('3. Name it "SISO Assistant"');
    console.log('4. Select your workspace');
    console.log('5. Copy the "Internal Integration Token"\n');

    const apiKey = await this.promptUser('Enter your Notion API key: ');
    
    if (!apiKey || !apiKey.startsWith('secret_')) {
      throw new Error('Invalid Notion API key format. Should start with "secret_"');
    }

    console.log('✅ Notion API key validated\n');
    return { apiKey };
  }

  async createNotionDatabases(credentials) {
    console.log('🗄️  CREATING NOTION DATABASES');
    console.log('==============================\n');

    const { Client } = require('@notionhq/client');
    const notion = new Client({ auth: credentials.apiKey });

    // Get workspace/page to create databases in
    console.log('📋 Database Setup Options:');
    console.log('1. Create in existing page (recommended)');
    console.log('2. Use existing database IDs');
    
    const setupType = await this.promptUser('Choose setup type (1 or 2): ');

    if (setupType === '1') {
      return await this.createNewDatabases(notion);
    } else {
      return await this.useExistingDatabases();
    }
  }

  async createNewDatabases(notion) {
    console.log('\n📝 Creating new databases...');
    
    const pageId = await this.promptUser('Enter the page ID where you want to create databases: ');
    
    const databases = {};
    const dbConfigs = [
      {
        name: 'SISO Tasks',
        key: 'tasks',
        properties: {
          'Name': { title: {} },
          'Status': { 
            select: { 
              options: [
                { name: 'Not Started', color: 'gray' },
                { name: 'In Progress', color: 'blue' },
                { name: 'Done', color: 'green' }
              ]
            }
          },
          'Priority': {
            select: {
              options: [
                { name: 'Low', color: 'gray' },
                { name: 'Medium', color: 'yellow' },
                { name: 'High', color: 'orange' },
                { name: 'Urgent', color: 'red' }
              ]
            }
          },
          'Description': { rich_text: {} },
          'Project': { rich_text: {} },
          'Assignee': { rich_text: {} },
          'Due Date': { date: {} },
          'Source': {
            select: {
              options: [
                { name: 'Telegram', color: 'blue' },
                { name: 'WhatsApp', color: 'green' },
                { name: 'Voice', color: 'purple' },
                { name: 'Web App', color: 'gray' }
              ]
            }
          },
          'Created': { created_time: {} },
          'Task ID': { rich_text: {} },
          'Supabase ID': { rich_text: {} }
        }
      },
      {
        name: 'SISO Projects',
        key: 'projects',
        properties: {
          'Name': { title: {} },
          'Status': {
            select: {
              options: [
                { name: 'Planning', color: 'gray' },
                { name: 'Active', color: 'blue' },
                { name: 'Completed', color: 'green' },
                { name: 'On Hold', color: 'red' }
              ]
            }
          },
          'Client': { rich_text: {} },
          'Progress': { number: { format: 'percent' } },
          'Budget': { number: { format: 'dollar' } },
          'Start Date': { date: {} },
          'End Date': { date: {} },
          'Description': { rich_text: {} },
          'Created': { created_time: {} }
        }
      },
      {
        name: 'SISO Clients',
        key: 'clients',
        properties: {
          'Name': { title: {} },
          'Email': { email: {} },
          'Phone': { phone_number: {} },
          'Company': { rich_text: {} },
          'Status': {
            select: {
              options: [
                { name: 'Lead', color: 'yellow' },
                { name: 'Active', color: 'green' },
                { name: 'Completed', color: 'blue' },
                { name: 'Inactive', color: 'gray' }
              ]
            }
          },
          'Revenue': { number: { format: 'dollar' } },
          'Last Contact': { date: {} },
          'Notes': { rich_text: {} },
          'Created': { created_time: {} }
        }
      },
      {
        name: 'SISO Metrics',
        key: 'metrics',
        properties: {
          'Date': { date: {} },
          'Type': {
            select: {
              options: [
                { name: 'Revenue', color: 'green' },
                { name: 'Expenses', color: 'red' },
                { name: 'Tasks', color: 'blue' },
                { name: 'Clients', color: 'purple' }
              ]
            }
          },
          'Value': { number: {} },
          'Description': { rich_text: {} },
          'Source': {
            select: {
              options: [
                { name: 'Manual', color: 'gray' },
                { name: 'Automated', color: 'blue' },
                { name: 'API', color: 'green' }
              ]
            }
          },
          'Category': {
            select: {
              options: [
                { name: 'Financial', color: 'green' },
                { name: 'Operational', color: 'blue' },
                { name: 'Growth', color: 'purple' }
              ]
            }
          },
          'Created': { created_time: {} }
        }
      }
    ];

    for (const config of dbConfigs) {
      try {
        console.log(`📝 Creating ${config.name} database...`);
        
        const response = await notion.databases.create({
          parent: { page_id: pageId },
          title: [{ text: { content: config.name } }],
          properties: config.properties
        });

        databases[config.key] = response.id;
        console.log(`✅ Created ${config.name}: ${response.id}`);

      } catch (error) {
        console.error(`❌ Failed to create ${config.name}:`, error.message);
        throw error;
      }
    }

    return databases;
  }

  async useExistingDatabases() {
    console.log('\n🔗 Using existing databases...');
    
    const databases = {};
    const dbNames = ['tasks', 'projects', 'clients', 'metrics'];

    for (const dbName of dbNames) {
      const dbId = await this.promptUser(`Enter ${dbName} database ID: `);
      databases[dbName] = dbId;
    }

    return databases;
  }

  async updateEnvironmentVariables(credentials, databases) {
    console.log('\n⚙️  Updating environment variables...');

    let envContent = '';
    
    if (fs.existsSync(this.configPath)) {
      envContent = fs.readFileSync(this.configPath, 'utf8');
    }

    // Add/update Notion configuration
    const notionVars = [
      `NOTION_API_KEY=${credentials.apiKey}`,
      `NOTION_TASKS_DB_ID=${databases.tasks}`,
      `NOTION_PROJECTS_DB_ID=${databases.projects}`,
      `NOTION_CLIENTS_DB_ID=${databases.clients}`,
      `NOTION_METRICS_DB_ID=${databases.metrics}`
    ];

    for (const varLine of notionVars) {
      const [key] = varLine.split('=');
      
      if (envContent.includes(`${key}=`)) {
        // Update existing
        envContent = envContent.replace(
          new RegExp(`${key}=.*`),
          varLine
        );
      } else {
        // Add new
        envContent += `\n${varLine}`;
      }
    }

    fs.writeFileSync(this.configPath, envContent);
    console.log('✅ Environment variables updated');
  }

  async generateNotionTemplates() {
    console.log('\n📋 Generating Notion templates...');

    const templates = {
      taskTemplate: {
        title: 'Sample Task',
        priority: 'Medium',
        status: 'Not Started',
        description: 'This is a sample task created during setup',
        source: 'Setup'
      },
      projectTemplate: {
        name: 'Sample Project',
        status: 'Planning',
        description: 'This is a sample project created during setup',
        startDate: new Date().toISOString().split('T')[0]
      },
      clientTemplate: {
        name: 'Sample Client',
        status: 'Lead',
        notes: 'This is a sample client created during setup'
      },
      metricTemplate: {
        type: 'Revenue',
        value: 1000,
        description: 'Sample revenue metric created during setup',
        source: 'Manual',
        category: 'Financial'
      }
    };

    fs.writeFileSync(
      this.templatePath,
      JSON.stringify(templates, null, 2)
    );

    console.log(`✅ Templates saved to ${this.templatePath}`);
  }

  async testNotionConnection() {
    console.log('\n🔍 Testing Notion connection...');

    try {
      const { NotionService } = require('./src/services/notionService.ts');
      const notionService = new NotionService();
      
      const health = await notionService.healthCheck();
      
      if (health.status === 'healthy') {
        console.log('✅ Notion connection successful!');
        console.log('✅ All databases accessible');
      } else {
        console.log('⚠️  Notion connection partially working');
        console.log('❌ Some databases not accessible:', health.databases);
      }

    } catch (error) {
      console.error('❌ Notion connection failed:', error.message);
      throw error;
    }
  }

  async createSetupSummary(credentials, databases) {
    const summary = `# 📝 NOTION INTEGRATION SETUP SUMMARY

## ✅ Setup Complete!

Your SISO Assistant is now integrated with Notion! Here's what was configured:

### 🔐 API Configuration
- **Notion API Key**: ${credentials.apiKey.substring(0, 20)}...
- **Integration Name**: SISO Assistant
- **Workspace**: Connected

### 🗄️ Databases Created
- **Tasks Database**: ${databases.tasks}
- **Projects Database**: ${databases.projects}
- **Clients Database**: ${databases.clients}
- **Metrics Database**: ${databases.metrics}

### 🚀 Next Steps

1. **Test the Integration**:
   \`\`\`bash
   node notion-quick-test.js
   \`\`\`

2. **Start Using Voice Commands**:
   - "Add task: Fix the login bug"
   - "Create project: Website for ABC Company"
   - "Record revenue: $5000 from client payment"

3. **Access Your Dashboards**:
   - 📊 [Local Dashboard](http://localhost:8081/dashboard)
   - 📝 [Notion Workspace](https://notion.so)

### 🎯 Available Features

#### 📝 Task Management
- Create tasks from voice/text
- Auto-priority detection
- Project linking
- Due date parsing
- Supabase sync

#### 🚀 Project Management
- Natural language project creation
- Auto-generated task templates
- Client association
- Budget tracking

#### 👥 Client Management
- Lead tracking
- Revenue monitoring
- Contact management
- Project association

#### 📈 Business Metrics
- Revenue/expense tracking
- Monthly summaries
- Real-time dashboards
- Automated reporting

### 🔧 Configuration Files
- **Environment**: \`.env\` (updated)
- **Backup**: \`.env.backup\` (created)
- **Templates**: \`notion-template.json\` (created)

### 🆘 Troubleshooting

If you encounter issues:

1. **Check API Key**: Ensure it starts with \`secret_\`
2. **Database Permissions**: Share databases with your integration
3. **Environment Variables**: Restart your application after setup
4. **Logs**: Check console for detailed error messages

### 📞 Support

For additional help:
- 📧 Email: support@siso.agency
- 💬 Telegram: @samsiso
- 📖 Documentation: Check NOTION_API_INTEGRATION_PLAN.md

---

**Setup completed on**: ${new Date().toISOString()}
**Next action**: Run \`node notion-quick-test.js\` to test your integration!
`;

    fs.writeFileSync('NOTION_SETUP_SUMMARY.md', summary);
    console.log('\n✅ Setup summary saved to NOTION_SETUP_SUMMARY.md');
  }

  async promptUser(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new NotionSetup();
  setup.run().catch(console.error);
}

module.exports = { NotionSetup }; 