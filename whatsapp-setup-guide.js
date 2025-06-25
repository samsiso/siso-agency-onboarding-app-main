#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class WhatsAppSetupGuide {
    constructor() {
        this.requiredFiles = [
            'package.json',
            'server.js',
            '.env'
        ];
        
        this.optionalFiles = [
            'telegram-ai-conversation-engine.js',
            'telegram-repository-config.js',
            'telegram-workflow-automation.js'
        ];
    }

    async runSetup() {
        console.log('🚀 SISO Assistant WhatsApp Integration Setup');
        console.log('='.repeat(50));
        
        try {
            await this.checkPrerequisites();
            await this.installDependencies();
            await this.createConfigFiles();
            await this.updateServerFile();
            await this.createStartupScript();
            await this.showCompletionInstructions();
        } catch (error) {
            console.error('❌ Setup failed:', error.message);
            process.exit(1);
        }
    }

    async checkPrerequisites() {
        console.log('\n📋 Checking prerequisites...');
        
        // Check Node.js version
        const nodeVersion = process.version;
        console.log(`✅ Node.js version: ${nodeVersion}`);
        
        if (!nodeVersion.startsWith('v16') && !nodeVersion.startsWith('v18') && !nodeVersion.startsWith('v20')) {
            console.warn('⚠️  Warning: Node.js 16+ recommended for WhatsApp Web.js');
        }

        // Check required files
        for (const file of this.requiredFiles) {
            if (fs.existsSync(file)) {
                console.log(`✅ Found: ${file}`);
            } else {
                throw new Error(`Required file not found: ${file}`);
            }
        }

        // Check optional files
        for (const file of this.optionalFiles) {
            if (fs.existsSync(file)) {
                console.log(`✅ Found: ${file} (existing SISO component)`);
            } else {
                console.log(`ℹ️  Optional: ${file} (not found, will use fallbacks)`);
            }
        }
    }

    async installDependencies() {
        console.log('\n📦 Installing WhatsApp dependencies...');
        
        const dependencies = [
            'whatsapp-web.js',
            'qrcode-terminal'
        ];

        try {
            console.log('Installing:', dependencies.join(', '));
            execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });
            console.log('✅ Dependencies installed successfully');
        } catch (error) {
            throw new Error(`Failed to install dependencies: ${error.message}`);
        }
    }

    async createConfigFiles() {
        console.log('\n⚙️ Creating configuration files...');

        // Create WhatsApp config
        const whatsappConfig = {
            enabled: true,
            authStrategy: 'local',
            clientId: 'siso-assistant',
            puppeteerOptions: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            },
            features: {
                voiceProcessing: true,
                imageProcessing: false,
                documentProcessing: false,
                groupMessages: false
            }
        };

        fs.writeFileSync('whatsapp-config.json', JSON.stringify(whatsappConfig, null, 2));
        console.log('✅ Created: whatsapp-config.json');

        // Update .env file
        this.updateEnvFile();
    }

    updateEnvFile() {
        let envContent = '';
        
        if (fs.existsSync('.env')) {
            envContent = fs.readFileSync('.env', 'utf8');
        }

        const whatsappVars = [
            'WHATSAPP_ENABLED=true',
            'MULTI_PLATFORM=true',
            'WHATSAPP_SESSION_PATH=./whatsapp-session'
        ];

        for (const envVar of whatsappVars) {
            const [key] = envVar.split('=');
            if (!envContent.includes(key)) {
                envContent += `\n${envVar}`;
            }
        }

        fs.writeFileSync('.env', envContent);
        console.log('✅ Updated: .env');
    }

    async updateServerFile() {
        console.log('\n🔧 Updating server configuration...');

        if (!fs.existsSync('server.js')) {
            throw new Error('server.js not found');
        }

        let serverContent = fs.readFileSync('server.js', 'utf8');

        // Check if WhatsApp integration is already added
        if (serverContent.includes('whatsapp-web-client')) {
            console.log('ℹ️  WhatsApp integration already present in server.js');
            return;
        }

        // Add WhatsApp imports
        const whatsappImports = `
// WhatsApp Integration
const WhatsAppClient = require('./whatsapp-web-client');
const unifiedHandler = require('./unified-message-handler');
`;

        // Add after existing imports
        const importIndex = serverContent.indexOf('const express = require');
        if (importIndex !== -1) {
            serverContent = serverContent.slice(0, importIndex) + whatsappImports + serverContent.slice(importIndex);
        }

        // Add WhatsApp initialization
        const whatsappInit = `
// Initialize WhatsApp Client
let whatsappClient = null;

if (process.env.WHATSAPP_ENABLED === 'true') {
    whatsappClient = new WhatsAppClient();
    unifiedHandler.registerPlatform('whatsapp', whatsappClient);
    
    // Initialize WhatsApp
    whatsappClient.initialize().catch(console.error);
}
`;

        // Add before app.listen
        const listenIndex = serverContent.lastIndexOf('app.listen');
        if (listenIndex !== -1) {
            serverContent = serverContent.slice(0, listenIndex) + whatsappInit + '\n' + serverContent.slice(listenIndex);
        }

        // Add WhatsApp status endpoint
        const statusEndpoint = `
// WhatsApp status endpoint
app.get('/whatsapp/status', (req, res) => {
    if (!whatsappClient) {
        return res.json({ status: 'disabled', message: 'WhatsApp not enabled' });
    }
    
    res.json({
        status: whatsappClient.getStatus(),
        timestamp: new Date().toISOString()
    });
});

// Multi-platform health check
app.get('/health', (req, res) => {
    const health = {
        server: 'running',
        telegram: 'active',
        whatsapp: whatsappClient ? whatsappClient.getStatus() : { status: 'disabled' },
        timestamp: new Date().toISOString()
    };
    
    res.json(health);
});
`;

        // Add before the last app.listen
        const finalListenIndex = serverContent.lastIndexOf('app.listen');
        if (finalListenIndex !== -1) {
            serverContent = serverContent.slice(0, finalListenIndex) + statusEndpoint + '\n' + serverContent.slice(finalListenIndex);
        }

        // Backup original server.js
        fs.writeFileSync('server.js.backup', fs.readFileSync('server.js'));
        console.log('✅ Created backup: server.js.backup');

        // Write updated server.js
        fs.writeFileSync('server.js', serverContent);
        console.log('✅ Updated: server.js');
    }

    async createStartupScript() {
        console.log('\n📜 Creating startup scripts...');

        // Development script
        const devScript = `#!/bin/bash
echo "🚀 Starting SISO Assistant (Development Mode)"
echo "📱 Platforms: Telegram + WhatsApp"
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start the application
npm run dev || node server.js
`;

        fs.writeFileSync('start-dev.sh', devScript);
        fs.chmodSync('start-dev.sh', '755');
        console.log('✅ Created: start-dev.sh');

        // Production script
        const prodScript = `#!/bin/bash
echo "🚀 Starting SISO Assistant (Production Mode)"
echo "📱 Platforms: Telegram + WhatsApp"
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start the application
npm start || node server.js
`;

        fs.writeFileSync('start-prod.sh', prodScript);
        fs.chmodSync('start-prod.sh', '755');
        console.log('✅ Created: start-prod.sh');

        // Package.json scripts update
        this.updatePackageScripts();
    }

    updatePackageScripts() {
        if (!fs.existsSync('package.json')) return;

        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        if (!packageJson.scripts) {
            packageJson.scripts = {};
        }

        packageJson.scripts['whatsapp:dev'] = 'WHATSAPP_ENABLED=true node server.js';
        packageJson.scripts['whatsapp:prod'] = 'NODE_ENV=production WHATSAPP_ENABLED=true node server.js';
        packageJson.scripts['multi:dev'] = 'WHATSAPP_ENABLED=true MULTI_PLATFORM=true node server.js';

        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
        console.log('✅ Updated: package.json scripts');
    }

    async showCompletionInstructions() {
        console.log('\n🎉 WhatsApp Integration Setup Complete!');
        console.log('='.repeat(50));
        
        console.log('\n📱 Next Steps:');
        console.log('1. Start the application:');
        console.log('   npm run whatsapp:dev');
        console.log('   # or');
        console.log('   ./start-dev.sh');
        
        console.log('\n2. Scan QR Code:');
        console.log('   • Open WhatsApp on your phone');
        console.log('   • Go to Settings > Linked Devices');
        console.log('   • Tap "Link a Device"');
        console.log('   • Scan the QR code displayed in terminal');
        
        console.log('\n3. Test the Integration:');
        console.log('   • Send a message to your WhatsApp');
        console.log('   • Check server logs for processing');
        console.log('   • Visit http://localhost:3000/whatsapp/status');
        
        console.log('\n📊 Monitoring:');
        console.log('   • Health Check: http://localhost:3000/health');
        console.log('   • WhatsApp Status: http://localhost:3000/whatsapp/status');
        
        console.log('\n🔧 Configuration Files Created:');
        console.log('   • whatsapp-config.json - WhatsApp settings');
        console.log('   • whatsapp-web-client.js - WhatsApp client');
        console.log('   • unified-message-handler.js - Message processor');
        console.log('   • server.js.backup - Original server backup');
        
        console.log('\n💡 Tips:');
        console.log('   • Keep your phone connected to internet');
        console.log('   • WhatsApp Web session will persist');
        console.log('   • Use WHATSAPP_ENABLED=false to disable');
        
        console.log('\n🚀 Your SISO Assistant now supports:');
        console.log('   ✅ Telegram Bot');
        console.log('   ✅ WhatsApp Web');
        console.log('   ✅ Unified AI Processing');
        console.log('   ✅ Voice Messages');
        console.log('   ✅ GitHub Integration');
        console.log('   ✅ Multi-platform Analytics');
        
        console.log('\n🎯 Ready to revolutionize your assistant experience!');
    }

    // Utility method to run setup
    static async run() {
        const setup = new WhatsAppSetupGuide();
        await setup.runSetup();
    }
}

// Run setup if called directly
if (require.main === module) {
    WhatsAppSetupGuide.run().catch(console.error);
}

module.exports = WhatsAppSetupGuide; 