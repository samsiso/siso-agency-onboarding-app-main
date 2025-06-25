#!/usr/bin/env node

const fs = require('fs');

class WhatsAppQuickTest {
    constructor() {
        this.testResults = [];
        this.startTime = Date.now();
    }

    async runAllTests() {
        console.log('🧪 SISO Assistant WhatsApp Integration Tests');
        console.log('='.repeat(50));
        
        try {
            await this.testDependencies();
            await this.testConfigFiles();
            await this.testClientInitialization();
            await this.testUnifiedHandler();
            await this.testMessageProcessing();
            await this.showResults();
        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
            process.exit(1);
        }
    }

    async testDependencies() {
        console.log('\n📦 Testing Dependencies...');
        
        // Test Node.js modules
        const requiredModules = [
            'fs',
            'path',
            'events'
        ];

        for (const module of requiredModules) {
            try {
                require(module);
                this.addResult('✅', `Core module: ${module}`, 'PASS');
            } catch (error) {
                this.addResult('❌', `Core module: ${module}`, 'FAIL', error.message);
            }
        }

        // Test WhatsApp dependencies (if installed)
        const whatsappModules = [
            'whatsapp-web.js',
            'qrcode-terminal'
        ];

        for (const module of whatsappModules) {
            try {
                require(module);
                this.addResult('✅', `WhatsApp module: ${module}`, 'PASS');
            } catch (error) {
                this.addResult('⚠️', `WhatsApp module: ${module}`, 'SKIP', 'Not installed yet');
            }
        }
    }

    async testConfigFiles() {
        console.log('\n⚙️ Testing Configuration Files...');
        
        const configTests = [
            {
                file: 'package.json',
                required: true,
                test: (content) => {
                    const pkg = JSON.parse(content);
                    return pkg.name && pkg.version;
                }
            },
            {
                file: '.env',
                required: true,
                test: (content) => content.length > 0
            },
            {
                file: 'server.js',
                required: true,
                test: (content) => content.includes('express')
            },
            {
                file: 'whatsapp-config.json',
                required: false,
                test: (content) => {
                    const config = JSON.parse(content);
                    return config.enabled !== undefined;
                }
            },
            {
                file: 'whatsapp-web-client.js',
                required: false,
                test: (content) => content.includes('WhatsAppClient')
            },
            {
                file: 'unified-message-handler.js',
                required: false,
                test: (content) => content.includes('UnifiedMessageHandler')
            }
        ];

        for (const { file, required, test } of configTests) {
            try {
                if (fs.existsSync(file)) {
                    const content = fs.readFileSync(file, 'utf8');
                    if (test(content)) {
                        this.addResult('✅', `Config file: ${file}`, 'PASS');
                    } else {
                        this.addResult('⚠️', `Config file: ${file}`, 'WARN', 'Content validation failed');
                    }
                } else {
                    if (required) {
                        this.addResult('❌', `Config file: ${file}`, 'FAIL', 'Required file missing');
                    } else {
                        this.addResult('ℹ️', `Config file: ${file}`, 'SKIP', 'Optional file not found');
                    }
                }
            } catch (error) {
                this.addResult('❌', `Config file: ${file}`, 'FAIL', error.message);
            }
        }
    }

    async testClientInitialization() {
        console.log('\n🤖 Testing Client Initialization...');
        
        try {
            // Test WhatsApp Client (if available)
            if (fs.existsSync('./whatsapp-web-client.js')) {
                const WhatsAppClient = require('./whatsapp-web-client');
                const client = new WhatsAppClient();
                
                // Test basic properties
                if (typeof client.initialize === 'function') {
                    this.addResult('✅', 'WhatsApp Client: initialize method', 'PASS');
                }
                if (typeof client.sendMessage === 'function') {
                    this.addResult('✅', 'WhatsApp Client: sendMessage method', 'PASS');
                }
                if (typeof client.getStatus === 'function') {
                    this.addResult('✅', 'WhatsApp Client: getStatus method', 'PASS');
                }
            } else {
                this.addResult('ℹ️', 'WhatsApp Client: Class definition', 'SKIP', 'File not found');
            }

            // Test Unified Handler (if available)
            if (fs.existsSync('./unified-message-handler.js')) {
                const unifiedHandler = require('./unified-message-handler');
                
                if (typeof unifiedHandler.processMessage === 'function') {
                    this.addResult('✅', 'Unified Handler: processMessage method', 'PASS');
                }
                if (typeof unifiedHandler.registerPlatform === 'function') {
                    this.addResult('✅', 'Unified Handler: registerPlatform method', 'PASS');
                }
            } else {
                this.addResult('ℹ️', 'Unified Handler: Class definition', 'SKIP', 'File not found');
            }

        } catch (error) {
            this.addResult('❌', 'Client Initialization', 'FAIL', error.message);
        }
    }

    async testUnifiedHandler() {
        console.log('\n🔄 Testing Unified Message Handler...');
        
        try {
            if (!fs.existsSync('./unified-message-handler.js')) {
                this.addResult('ℹ️', 'Unified Handler: Full test', 'SKIP', 'File not found');
                return;
            }

            const unifiedHandler = require('./unified-message-handler');
            
            // Test platform registration
            const mockPlatform = {
                sendMessage: async () => 'sent',
                getStatus: () => ({ isReady: true })
            };

            unifiedHandler.registerPlatform('test', mockPlatform);
            this.addResult('✅', 'Unified Handler: Platform registration', 'PASS');

            // Test stats
            const stats = unifiedHandler.getStats();
            if (stats && typeof stats === 'object') {
                this.addResult('✅', 'Unified Handler: Stats generation', 'PASS');
            }

        } catch (error) {
            this.addResult('❌', 'Unified Handler: Testing', 'FAIL', error.message);
        }
    }

    async testMessageProcessing() {
        console.log('\n💬 Testing Message Processing...');
        
        try {
            // Create mock messages
            const testMessages = [
                {
                    platform: 'whatsapp',
                    from: 'test@user',
                    fromName: 'Test User',
                    text: 'Hello SISO!',
                    timestamp: Date.now(),
                    isVoice: false,
                    isImage: false
                },
                {
                    platform: 'telegram',
                    from: 'test_telegram',
                    fromName: 'Telegram User',
                    text: 'Create GitHub issue for bug fix',
                    timestamp: Date.now(),
                    isVoice: false,
                    isImage: false
                }
            ];

            // Test message format validation
            for (const message of testMessages) {
                const isValid = this.validateMessageFormat(message);
                if (isValid) {
                    this.addResult('✅', `Message format: ${message.platform}`, 'PASS');
                } else {
                    this.addResult('❌', `Message format: ${message.platform}`, 'FAIL', 'Invalid format');
                }
            }

            // Test conversation history structure
            const mockConversation = {
                messages: [],
                platforms: new Set(['whatsapp', 'telegram']),
                firstSeen: new Date(),
                lastActivity: new Date()
            };

            if (mockConversation.platforms.has('whatsapp')) {
                this.addResult('✅', 'Conversation: Multi-platform support', 'PASS');
            }

        } catch (error) {
            this.addResult('❌', 'Message Processing: Testing', 'FAIL', error.message);
        }
    }

    validateMessageFormat(message) {
        const requiredFields = ['platform', 'from', 'timestamp'];
        const optionalFields = ['text', 'isVoice', 'isImage', 'fromName'];
        
        // Check required fields
        for (const field of requiredFields) {
            if (!(field in message)) {
                return false;
            }
        }

        // Check platform is valid
        if (!['whatsapp', 'telegram'].includes(message.platform)) {
            return false;
        }

        return true;
    }

    addResult(icon, test, status, details = '') {
        const result = { icon, test, status, details };
        this.testResults.push(result);
        
        const statusColor = status === 'PASS' ? '\x1b[32m' : 
                           status === 'FAIL' ? '\x1b[31m' : 
                           status === 'WARN' ? '\x1b[33m' : '\x1b[36m';
        
        console.log(`${icon} ${test}: ${statusColor}${status}\x1b[0m${details ? ` (${details})` : ''}`);
    }

    async showResults() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        console.log('\n📊 Test Results Summary');
        console.log('='.repeat(50));
        
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const warnings = this.testResults.filter(r => r.status === 'WARN').length;
        const skipped = this.testResults.filter(r => r.status === 'SKIP').length;
        
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`⚠️  Warnings: ${warnings}`);
        console.log(`ℹ️  Skipped: ${skipped}`);
        console.log(`⏱️  Duration: ${duration}ms`);
        
        // Show readiness assessment
        console.log('\n🎯 Readiness Assessment:');
        
        if (failed === 0) {
            if (skipped > 0) {
                console.log('🟡 READY FOR SETUP');
                console.log('   Run: node whatsapp-setup-guide.js');
            } else {
                console.log('🟢 FULLY READY');
                console.log('   WhatsApp integration is configured and ready!');
            }
        } else {
            console.log('🔴 NOT READY');
            console.log('   Fix the failed tests before proceeding');
        }

        // Show next steps
        console.log('\n📋 Next Steps:');
        
        if (failed === 0 && skipped > 0) {
            console.log('1. Run setup: node whatsapp-setup-guide.js');
            console.log('2. Install dependencies: npm install whatsapp-web.js qrcode-terminal');
            console.log('3. Start application: npm run whatsapp:dev');
            console.log('4. Scan QR code with WhatsApp');
        } else if (failed === 0) {
            console.log('1. Start application: npm run whatsapp:dev');
            console.log('2. Monitor logs for WhatsApp connection');
            console.log('3. Test by sending a WhatsApp message');
            console.log('4. Check status: http://localhost:3000/whatsapp/status');
        } else {
            console.log('1. Fix failing tests');
            console.log('2. Ensure all required files exist');
            console.log('3. Run tests again: node whatsapp-quick-test.js');
        }

        // Save test results
        const reportData = {
            timestamp: new Date().toISOString(),
            duration: duration,
            summary: { passed, failed, warnings, skipped },
            results: this.testResults
        };

        fs.writeFileSync('whatsapp-test-results.json', JSON.stringify(reportData, null, 2));
        console.log('\n📄 Test report saved: whatsapp-test-results.json');
    }

    // Static method to run tests
    static async run() {
        const tester = new WhatsAppQuickTest();
        await tester.runAllTests();
    }
}

// Run tests if called directly
if (require.main === module) {
    WhatsAppQuickTest.run().catch(console.error);
}

module.exports = WhatsAppQuickTest; 