const fs = require('fs');
const path = require('path');

class UnifiedMessageHandler {
    constructor() {
        this.platforms = new Map();
        this.conversationHistory = new Map();
        this.isInitialized = false;
        
        // Initialize with existing components
        this.initializeComponents();
    }

    async initializeComponents() {
        try {
            // Load existing AI processor
            if (fs.existsSync('./telegram-ai-conversation-engine.js')) {
                this.aiProcessor = require('./telegram-ai-conversation-engine');
                console.log('✅ AI Conversation Engine loaded');
            }

            // Load existing GitHub manager
            if (fs.existsSync('./telegram-repository-config.js')) {
                this.githubManager = require('./telegram-repository-config');
                console.log('✅ GitHub Repository Manager loaded');
            }

            // Load existing workflow automation
            if (fs.existsSync('./telegram-workflow-automation.js')) {
                this.workflowEngine = require('./telegram-workflow-automation');
                console.log('✅ Workflow Automation Engine loaded');
            }

            // Initialize voice processor
            this.voiceProcessor = {
                transcribe: async (audioBuffer) => {
                    // Implement Groq Whisper transcription
                    console.log('🎤 Transcribing audio...');
                    // For now, return placeholder
                    return "Voice message transcribed";
                },
                synthesize: async (text) => {
                    // Implement Groq TTS
                    console.log('🔊 Synthesizing speech...');
                    // For now, return placeholder buffer
                    return Buffer.from('audio_data');
                }
            };

            this.isInitialized = true;
            console.log('🎯 Unified Message Handler initialized successfully');

        } catch (error) {
            console.error('❌ Error initializing Unified Message Handler:', error);
        }
    }

    registerPlatform(platformName, platformClient) {
        this.platforms.set(platformName, platformClient);
        console.log(`📱 Registered platform: ${platformName}`);
    }

    async processMessage(message) {
        if (!this.isInitialized) {
            console.log('⏳ Handler not initialized, skipping message...');
            return;
        }

        try {
            console.log(`📨 Processing ${message.platform} message from ${message.fromName || message.from}`);
            console.log(`💬 Content: ${message.text?.substring(0, 100) || '[Media]'}`);

            // Update conversation history
            this.updateConversationHistory(message);

            // Handle different message types
            if (message.isVoice) {
                await this.handleVoiceMessage(message);
            } else if (message.isImage) {
                await this.handleImageMessage(message);
            } else if (message.isDocument) {
                await this.handleDocumentMessage(message);
            } else if (message.text) {
                await this.handleTextMessage(message);
            }

        } catch (error) {
            console.error('❌ Error processing message:', error);
            await this.sendErrorMessage(message, '⚠️ Sorry, I encountered an error processing your message.');
        }
    }

    async handleVoiceMessage(message) {
        try {
            console.log('🎤 Processing voice message...');
            
            // Download and transcribe voice
            let audioBuffer;
            if (message.platform === 'whatsapp') {
                const whatsappClient = this.platforms.get('whatsapp');
                const media = await whatsappClient.downloadMedia(message.originalMessage);
                audioBuffer = media.data;
            } else if (message.platform === 'telegram') {
                // Handle Telegram voice download
                audioBuffer = await this.downloadTelegramVoice(message);
            }

            // Transcribe audio
            const transcription = await this.voiceProcessor.transcribe(audioBuffer);
            
            // Send transcription confirmation
            await this.sendPlatformMessage(
                message.platform, 
                message.from, 
                `🎤 Voice transcribed: "${transcription.substring(0, 100)}${transcription.length > 100 ? '...' : ''}"`
            );

            // Process as text message
            const textMessage = { ...message, text: transcription, isVoice: false };
            await this.handleTextMessage(textMessage);

        } catch (error) {
            console.error('❌ Error handling voice message:', error);
            await this.sendErrorMessage(message, '⚠️ Sorry, I couldn\'t process your voice message.');
        }
    }

    async handleImageMessage(message) {
        try {
            console.log('🖼️ Processing image message...');
            
            // Download image
            let imageBuffer;
            if (message.platform === 'whatsapp') {
                const whatsappClient = this.platforms.get('whatsapp');
                const media = await whatsappClient.downloadMedia(message.originalMessage);
                imageBuffer = media.data;
            }

            // For now, acknowledge image receipt
            await this.sendPlatformMessage(
                message.platform,
                message.from,
                '🖼️ Image received! Image processing capabilities will be added soon.'
            );

            // If there's accompanying text, process it
            if (message.text) {
                await this.handleTextMessage(message);
            }

        } catch (error) {
            console.error('❌ Error handling image message:', error);
            await this.sendErrorMessage(message, '⚠️ Sorry, I couldn\'t process your image.');
        }
    }

    async handleDocumentMessage(message) {
        try {
            console.log('📄 Processing document message...');
            
            await this.sendPlatformMessage(
                message.platform,
                message.from,
                '📄 Document received! Document processing capabilities will be added soon.'
            );

            // If there's accompanying text, process it
            if (message.text) {
                await this.handleTextMessage(message);
            }

        } catch (error) {
            console.error('❌ Error handling document message:', error);
            await this.sendErrorMessage(message, '⚠️ Sorry, I couldn\'t process your document.');
        }
    }

    async handleTextMessage(message) {
        try {
            if (!message.text || message.text.trim() === '') {
                return;
            }

            console.log(`💭 Processing text: "${message.text.substring(0, 100)}"`);

            // Get conversation context
            const conversationHistory = this.getConversationHistory(message.from);
            
            // Process with AI (if available)
            let aiResponse;
            if (this.aiProcessor && typeof this.aiProcessor.processMessage === 'function') {
                aiResponse = await this.aiProcessor.processMessage(message.text, {
                    platform: message.platform,
                    userId: message.from,
                    userName: message.fromName,
                    conversationHistory: conversationHistory,
                    timestamp: message.timestamp
                });
            } else {
                // Fallback simple response
                aiResponse = await this.generateSimpleResponse(message);
            }

            // Execute actions based on AI analysis
            if (aiResponse.action === 'github' && this.githubManager) {
                await this.handleGitHubAction(message, aiResponse);
            } else if (aiResponse.action === 'workflow' && this.workflowEngine) {
                await this.handleWorkflowAction(message, aiResponse);
            } else if (aiResponse.action === 'query') {
                await this.handleDatabaseQuery(message, aiResponse);
            } else {
                // Send AI response
                await this.sendPlatformMessage(message.platform, message.from, aiResponse.text || aiResponse);
                
                // Send voice response if enabled and requested
                if (aiResponse.includeVoice && this.voiceProcessor) {
                    try {
                        const voiceBuffer = await this.voiceProcessor.synthesize(aiResponse.text || aiResponse);
                        await this.sendPlatformVoice(message.platform, message.from, voiceBuffer);
                    } catch (voiceError) {
                        console.error('❌ Error generating voice response:', voiceError);
                    }
                }
            }

        } catch (error) {
            console.error('❌ Error handling text message:', error);
            await this.sendErrorMessage(message, '⚠️ Sorry, I couldn\'t process your message.');
        }
    }

    async handleGitHubAction(message, aiResponse) {
        try {
            console.log('🐙 Processing GitHub action...');
            
            const result = await this.githubManager.createIssue({
                title: aiResponse.title || 'Issue from SISO Assistant',
                body: aiResponse.body || message.text,
                repository: aiResponse.repository || 'siso-agency',
                labels: aiResponse.labels || ['assistant-created']
            });

            await this.sendPlatformMessage(
                message.platform, 
                message.from, 
                `✅ GitHub issue created successfully!\n🔗 ${result.url || 'Issue created'}`
            );

        } catch (error) {
            console.error('❌ Error handling GitHub action:', error);
            await this.sendErrorMessage(message, '⚠️ Sorry, I couldn\'t create the GitHub issue.');
        }
    }

    async handleWorkflowAction(message, aiResponse) {
        try {
            console.log('⚙️ Processing workflow action...');
            
            const result = await this.workflowEngine.executeWorkflow(aiResponse.workflow, {
                message: message,
                parameters: aiResponse.parameters
            });

            await this.sendPlatformMessage(
                message.platform,
                message.from,
                result.message || '✅ Workflow completed successfully!'
            );

        } catch (error) {
            console.error('❌ Error handling workflow action:', error);
            await this.sendErrorMessage(message, '⚠️ Sorry, I couldn\'t execute the workflow.');
        }
    }

    async handleDatabaseQuery(message, aiResponse) {
        try {
            console.log('🗃️ Processing database query...');
            
            // Implement Supabase query logic here
            const result = `📊 Database query result: ${aiResponse.query}`;
            
            await this.sendPlatformMessage(
                message.platform,
                message.from,
                result
            );

        } catch (error) {
            console.error('❌ Error handling database query:', error);
            await this.sendErrorMessage(message, '⚠️ Sorry, I couldn\'t execute the database query.');
        }
    }

    async generateSimpleResponse(message) {
        // Simple fallback responses
        const responses = [
            `Hello ${message.fromName || 'there'}! I received your message: "${message.text.substring(0, 50)}"`,
            '🤖 SISO Assistant is here to help! Your message has been processed.',
            '👋 Thanks for your message! I\'m working on processing it.',
            '✨ Message received and understood! How can I assist you further?'
        ];

        return {
            text: responses[Math.floor(Math.random() * responses.length)],
            action: 'response'
        };
    }

    async sendPlatformMessage(platform, chatId, text) {
        try {
            const platformClient = this.platforms.get(platform);
            if (!platformClient) {
                console.error(`❌ Platform client not found: ${platform}`);
                return;
            }

            if (platform === 'telegram') {
                // Assuming Telegram bot API
                await platformClient.sendMessage(chatId, text);
            } else if (platform === 'whatsapp') {
                await platformClient.sendMessage(chatId, text);
            }

            console.log(`📤 ${platform} message sent to ${chatId}: ${text.substring(0, 50)}`);

        } catch (error) {
            console.error(`❌ Error sending ${platform} message:`, error);
        }
    }

    async sendPlatformVoice(platform, chatId, audioBuffer) {
        try {
            const platformClient = this.platforms.get(platform);
            if (!platformClient) {
                console.error(`❌ Platform client not found: ${platform}`);
                return;
            }

            if (platform === 'telegram') {
                // Assuming Telegram bot API
                await platformClient.sendVoice(chatId, audioBuffer);
            } else if (platform === 'whatsapp') {
                await platformClient.sendVoiceMessage(chatId, audioBuffer);
            }

            console.log(`🎤 ${platform} voice message sent to ${chatId}`);

        } catch (error) {
            console.error(`❌ Error sending ${platform} voice message:`, error);
        }
    }

    async sendErrorMessage(message, errorText) {
        try {
            await this.sendPlatformMessage(message.platform, message.from, errorText);
        } catch (error) {
            console.error('❌ Error sending error message:', error);
        }
    }

    updateConversationHistory(message) {
        const userId = message.from;
        if (!this.conversationHistory.has(userId)) {
            this.conversationHistory.set(userId, {
                messages: [],
                platforms: new Set(),
                firstSeen: new Date(),
                lastActivity: new Date()
            });
        }

        const conversation = this.conversationHistory.get(userId);
        conversation.messages.push({
            platform: message.platform,
            text: message.text,
            timestamp: message.timestamp,
            type: message.isVoice ? 'voice' : message.isImage ? 'image' : 'text'
        });

        // Keep only last 50 messages
        if (conversation.messages.length > 50) {
            conversation.messages = conversation.messages.slice(-50);
        }

        conversation.platforms.add(message.platform);
        conversation.lastActivity = new Date();
    }

    getConversationHistory(userId) {
        const conversation = this.conversationHistory.get(userId);
        return conversation ? conversation.messages : [];
    }

    async downloadTelegramVoice(message) {
        // Implement Telegram voice download
        // This would use the Telegram Bot API to download voice files
        console.log('🎤 Downloading Telegram voice message...');
        return Buffer.from('telegram_voice_data'); // Placeholder
    }

    getStats() {
        return {
            totalConversations: this.conversationHistory.size,
            registeredPlatforms: Array.from(this.platforms.keys()),
            isInitialized: this.isInitialized,
            totalMessages: Array.from(this.conversationHistory.values())
                .reduce((total, conv) => total + conv.messages.length, 0)
        };
    }
}

module.exports = new UnifiedMessageHandler(); 