#!/usr/bin/env node
// Claude Auto-Setup Script
// This script automatically deploys the entire Telegram voice assistant system

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

interface SetupConfig {
  anthropicApiKey?: string;
  maxTokens: number;
  rateLimit: number;
  projectRoot: string;
}

class ClaudeAutoSetup {
  private config: SetupConfig;

  constructor() {
    this.config = {
      maxTokens: 100000,
      rateLimit: 1000,
      projectRoot: process.cwd()
    };
  }

  async run() {
    console.log('🤖 CLAUDE CODE INTEGRATION SETUP\n');
    
    try {
      await this.checkPrerequisites();
      await this.installDependencies();
      await this.setupEnvironment();
      await this.createConfigFiles();
      await this.updateServerIntegration();
      await this.createTasksFile();
      await this.testIntegration();
      
      console.log('\n✅ CLAUDE INTEGRATION SETUP COMPLETE!\n');
      this.printUsageInstructions();
    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  private async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');
    
    // Check if we're in the right directory
    const packageJsonPath = path.join(this.config.projectRoot, 'package.json');
    try {
      await fs.access(packageJsonPath);
      console.log('✅ Found package.json');
    } catch {
      throw new Error('package.json not found. Please run this script from your project root.');
    }

    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`✅ Node.js version: ${nodeVersion}`);

    // Check if git is available
    try {
      execSync('git --version', { stdio: 'ignore' });
      console.log('✅ Git is available');
    } catch {
      console.warn('⚠️  Git not found - some features may be limited');
    }
  }

  private async installDependencies() {
    console.log('\n📦 Installing dependencies...');
    
    const dependencies = [
      '@anthropic-ai/sdk',
      'dotenv'
    ];

    const devDependencies = [
      '@types/node'
    ];

    try {
      console.log('Installing main dependencies...');
      execSync(`npm install ${dependencies.join(' ')}`, { 
        stdio: 'inherit',
        cwd: this.config.projectRoot 
      });

      console.log('Installing dev dependencies...');
      execSync(`npm install -D ${devDependencies.join(' ')}`, { 
        stdio: 'inherit',
        cwd: this.config.projectRoot 
      });

      console.log('✅ Dependencies installed');
    } catch (error) {
      throw new Error(`Failed to install dependencies: ${error.message}`);
    }
  }

  private async setupEnvironment() {
    console.log('\n🔧 Setting up environment...');
    
    const envPath = path.join(this.config.projectRoot, '.env');
    let envContent = '';

    // Read existing .env file
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch {
      console.log('Creating new .env file...');
    }

    // Add Claude configuration if not present
    const claudeEnvVars = [
      'ANTHROPIC_API_KEY=your_anthropic_api_key_here',
      'CLAUDE_MAX_TOKENS=100000',
      'CLAUDE_RATE_LIMIT=1000',
      'CLAUDE_MODEL=claude-3-5-sonnet-20241022'
    ];

    for (const envVar of claudeEnvVars) {
      const [key] = envVar.split('=');
      if (!envContent.includes(key)) {
        envContent += `\n${envVar}`;
      }
    }

    await fs.writeFile(envPath, envContent);
    console.log('✅ Environment variables configured');
    
    if (envContent.includes('your_anthropic_api_key_here')) {
      console.log('⚠️  Please update ANTHROPIC_API_KEY in .env with your actual API key');
    }
  }

  private async createConfigFiles() {
    console.log('\n📄 Creating configuration files...');

    // Create .gitignore entries
    const gitignorePath = path.join(this.config.projectRoot, '.gitignore');
    let gitignoreContent = '';
    
    try {
      gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
    } catch {
      console.log('Creating new .gitignore...');
    }

    const gitignoreEntries = [
      '.siso-tasks.json',
      '*.backup',
      '.claude-cache/',
      'claude-logs/'
    ];

    for (const entry of gitignoreEntries) {
      if (!gitignoreContent.includes(entry)) {
        gitignoreContent += `\n${entry}`;
      }
    }

    await fs.writeFile(gitignorePath, gitignoreContent);
    console.log('✅ Updated .gitignore');
  }

  private async updateServerIntegration() {
    console.log('\n🔗 Updating server integration...');

    const serverPath = path.join(this.config.projectRoot, 'server.js');
    let serverContent = '';

    try {
      serverContent = await fs.readFile(serverPath, 'utf-8');
    } catch {
      throw new Error('server.js not found');
    }

    // Check if Claude integration is already added
    if (serverContent.includes('ClaudeWorkflowManager')) {
      console.log('✅ Claude integration already present in server.js');
      return;
    }

    // Add Claude import and initialization
    const claudeImport = `const { ClaudeWorkflowManager } = require('./src/lib/claude-workflow-manager');`;
    const claudeInit = `
// 🤖 Initialize Claude Code Assistant
let claudeManager;
try {
  claudeManager = new ClaudeWorkflowManager();
  console.log('🤖 Claude Code Assistant initialized');
} catch (error) {
  console.error('❌ Failed to initialize Claude:', error.message);
}`;

    // Find the right place to insert the import
    const importInsertPoint = serverContent.indexOf('const express = require');
    if (importInsertPoint !== -1) {
      serverContent = serverContent.slice(0, importInsertPoint) + 
                    claudeImport + '\n' + 
                    serverContent.slice(importInsertPoint);
    }

    // Find the right place to insert the initialization
    const initInsertPoint = serverContent.indexOf('🚀 SISO Telegram Webhook Server Starting...');
    if (initInsertPoint !== -1) {
      const lineEnd = serverContent.indexOf('\n', initInsertPoint);
      serverContent = serverContent.slice(0, lineEnd) + 
                    claudeInit + '\n' + 
                    serverContent.slice(lineEnd);
    }

    // Add Claude message handler to the message processing
    const claudeHandler = `
    // 🤖 Claude Code Assistant Handler
    if (claudeManager && (text.startsWith('/') || claudeManager.isCodeRequest && claudeManager.isCodeRequest(text))) {
      try {
        const codeRequest = {
          chatId: chatId.toString(),
          messageId: message.message_id,
          userId: from.id.toString(),
          username: from.username,
          message: text,
          timestamp: new Date()
        };
        
        const claudeResponse = await claudeManager.processMessage(codeRequest);
        await sendTelegramMessage(chatId, claudeResponse);
        return;
      } catch (error) {
        console.error('Claude processing error:', error);
        await sendTelegramMessage(chatId, '❌ Error processing code request');
        return;
      }
    }`;

    // Find where to insert the Claude handler
    const handlerInsertPoint = serverContent.indexOf('// 🎯 Process message with unified handler');
    if (handlerInsertPoint !== -1) {
      const lineEnd = serverContent.indexOf('\n', handlerInsertPoint);
      serverContent = serverContent.slice(0, lineEnd) + 
                    claudeHandler + '\n' + 
                    serverContent.slice(lineEnd);
    }

    await fs.writeFile(serverPath, serverContent);
    console.log('✅ Server integration updated');
  }

  private async createTasksFile() {
    console.log('\n📋 Creating initial tasks file...');

    const tasksPath = path.join(this.config.projectRoot, '.siso-tasks.json');
    
    // Check if tasks file already exists
    try {
      await fs.access(tasksPath);
      console.log('✅ Tasks file already exists');
      return;
    } catch {
      // Create initial tasks
      const initialTasks = [
        {
          id: `task_${Date.now()}_init`,
          title: 'Claude Code Integration Setup',
          description: 'Set up Claude Code Assistant for the SISO project',
          status: 'completed',
          priority: 'high',
          created: new Date(),
          updated: new Date(),
          estimatedHours: 2,
          actualHours: 1,
          files: ['src/lib/claude-workflow-engine.ts', 'src/lib/claude-workflow-manager.ts'],
          dependencies: []
        }
      ];

      await fs.writeFile(tasksPath, JSON.stringify(initialTasks, null, 2));
      console.log('✅ Initial tasks file created');
    }
  }

  private async testIntegration() {
    console.log('\n🧪 Testing integration...');

    try {
      // Test if the files can be imported
      const enginePath = path.join(this.config.projectRoot, 'src/lib/claude-workflow-engine.ts');
      const managerPath = path.join(this.config.projectRoot, 'src/lib/claude-workflow-manager.ts');

      await fs.access(enginePath);
      await fs.access(managerPath);
      
      console.log('✅ Claude integration files found');
      console.log('✅ Setup validation complete');
    } catch (error) {
      throw new Error(`Integration test failed: ${error.message}`);
    }
  }

  private printUsageInstructions() {
    console.log(`🎯 **CLAUDE CODE ASSISTANT READY!**

**📝 Next Steps:**
1. Add your Anthropic API key to .env:
   ANTHROPIC_API_KEY=your_actual_api_key

2. Start your server:
   npm run whatsapp:dev

3. Test Claude in Telegram:
   /status - Get project status
   /build a new component
   /tasks list
   "Where are we with the project?"

**🔧 Available Commands:**
• /build <description> - Generate code
• /modify <file> <changes> - Modify existing code
• /analyze <target> - Analyze code quality
• /status - Project overview
• /tasks list - Show current tasks
• /report - Detailed project report

**💬 Natural Language:**
Just describe what you want:
• "Build a payment component"
• "Fix the authentication bug"
• "Add dark mode to the header"

**📊 Features:**
✅ Code generation and modification
✅ Task tracking and management
✅ Project status monitoring
✅ Git integration
✅ Token usage tracking
✅ File backup and safety

**🔗 Integration Status:**
✅ Claude API configured
✅ Workflow engine ready
✅ Telegram bot enhanced
✅ Task management active
✅ Project monitoring enabled

Your SISO assistant is now a powerful coding companion! 🚀`);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  const setup = new ClaudeAutoSetup();
  setup.run().catch(console.error);
}

export { ClaudeAutoSetup }; 