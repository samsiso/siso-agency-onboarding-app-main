const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

class WhatsAppClient {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth({
                clientId: "siso-assistant"
            }),
            puppeteer: {
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
            }
        });
        
        this.isReady = false;
        this.messageQueue = [];
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            console.log('📱 WhatsApp QR Code Generated!');
            console.log('📲 Scan this QR code with your WhatsApp mobile app:');
            qrcode.generate(qr, { small: true });
            console.log('\n🔗 Or open WhatsApp Web and scan the QR code above');
        });

        this.client.on('ready', () => {
            console.log('✅ WhatsApp Client is ready!');
            this.isReady = true;
            this.processMessageQueue();
            
            // Get client info
            this.client.info.then(info => {
                console.log(`📱 Connected as: ${info.pushname}`);
                console.log(`📞 Phone: ${info.wid.user}`);
            }).catch(console.error);
        });

        this.client.on('authenticated', () => {
            console.log('🔐 WhatsApp Client authenticated!');
        });

        this.client.on('auth_failure', (msg) => {
            console.error('❌ WhatsApp authentication failed:', msg);
        });

        this.client.on('disconnected', (reason) => {
            console.log('⚠️ WhatsApp Client disconnected:', reason);
            this.isReady = false;
        });

        this.client.on('message', async (message) => {
            try {
                await this.handleMessage(message);
            } catch (error) {
                console.error('❌ Error handling WhatsApp message:', error);
            }
        });

        this.client.on('message_create', async (message) => {
            // Handle messages sent by the bot itself
            if (message.fromMe) {
                console.log('📤 Message sent:', message.body?.substring(0, 50));
            }
        });
    }

    async handleMessage(message) {
        // Skip messages from status updates and groups (optional)
        if (message.from === 'status@broadcast') return;
        
        // Skip messages sent by the bot itself
        if (message.fromMe) return;

        console.log(`📨 WhatsApp message from ${message.from}: ${message.body?.substring(0, 50) || '[Media]'}`);

        // Convert to unified format for processing
        const unifiedMessage = await this.convertToUnifiedFormat(message);
        
        // Route to unified message handler
        const unifiedHandler = require('./unified-message-handler');
        await unifiedHandler.processMessage(unifiedMessage);
    }

    async convertToUnifiedFormat(whatsappMessage) {
        const contact = await whatsappMessage.getContact();
        
        return {
            platform: 'whatsapp',
            id: whatsappMessage.id._serialized,
            from: whatsappMessage.from,
            fromName: contact.pushname || contact.name || whatsappMessage.from,
            text: whatsappMessage.body || '',
            isVoice: whatsappMessage.hasMedia && whatsappMessage.type === 'ptt',
            isImage: whatsappMessage.hasMedia && whatsappMessage.type === 'image',
            isDocument: whatsappMessage.hasMedia && whatsappMessage.type === 'document',
            media: whatsappMessage.hasMedia ? whatsappMessage : null,
            timestamp: whatsappMessage.timestamp * 1000, // Convert to milliseconds
            originalMessage: whatsappMessage,
            chat: await whatsappMessage.getChat(),
            contact: contact
        };
    }

    async sendMessage(chatId, text, options = {}) {
        if (!this.isReady) {
            console.log('⏳ WhatsApp not ready, queuing message...');
            this.messageQueue.push({ type: 'text', chatId, text, options });
            return;
        }

        try {
            const message = await this.client.sendMessage(chatId, text, options);
            console.log(`📤 WhatsApp message sent to ${chatId}: ${text.substring(0, 50)}`);
            return message;
        } catch (error) {
            console.error('❌ Error sending WhatsApp message:', error);
            throw error;
        }
    }

    async sendVoiceMessage(chatId, audioBuffer) {
        if (!this.isReady) {
            console.log('⏳ WhatsApp not ready, queuing voice message...');
            this.messageQueue.push({ type: 'voice', chatId, audioBuffer });
            return;
        }

        try {
            const media = new MessageMedia('audio/ogg; codecs=opus', audioBuffer.toString('base64'), 'voice.ogg');
            const message = await this.client.sendMessage(chatId, media);
            console.log(`🎤 WhatsApp voice message sent to ${chatId}`);
            return message;
        } catch (error) {
            console.error('❌ Error sending WhatsApp voice message:', error);
            throw error;
        }
    }

    async sendImageMessage(chatId, imageBuffer, caption = '') {
        if (!this.isReady) {
            console.log('⏳ WhatsApp not ready, queuing image message...');
            this.messageQueue.push({ type: 'image', chatId, imageBuffer, caption });
            return;
        }

        try {
            const media = new MessageMedia('image/jpeg', imageBuffer.toString('base64'), 'image.jpg');
            const message = await this.client.sendMessage(chatId, media, { caption });
            console.log(`🖼️ WhatsApp image sent to ${chatId}`);
            return message;
        } catch (error) {
            console.error('❌ Error sending WhatsApp image:', error);
            throw error;
        }
    }

    async downloadMedia(message) {
        try {
            if (!message.hasMedia) {
                throw new Error('Message has no media');
            }

            const media = await message.downloadMedia();
            return {
                data: Buffer.from(media.data, 'base64'),
                mimetype: media.mimetype,
                filename: media.filename || 'download'
            };
        } catch (error) {
            console.error('❌ Error downloading WhatsApp media:', error);
            throw error;
        }
    }

    async processMessageQueue() {
        console.log(`📋 Processing ${this.messageQueue.length} queued messages...`);
        
        while (this.messageQueue.length > 0) {
            const queuedMessage = this.messageQueue.shift();
            
            try {
                switch (queuedMessage.type) {
                    case 'text':
                        await this.sendMessage(queuedMessage.chatId, queuedMessage.text, queuedMessage.options);
                        break;
                    case 'voice':
                        await this.sendVoiceMessage(queuedMessage.chatId, queuedMessage.audioBuffer);
                        break;
                    case 'image':
                        await this.sendImageMessage(queuedMessage.chatId, queuedMessage.imageBuffer, queuedMessage.caption);
                        break;
                }
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error('❌ Error processing queued message:', error);
            }
        }
    }

    async getChats() {
        if (!this.isReady) {
            throw new Error('WhatsApp client not ready');
        }

        try {
            const chats = await this.client.getChats();
            return chats.map(chat => ({
                id: chat.id._serialized,
                name: chat.name,
                isGroup: chat.isGroup,
                unreadCount: chat.unreadCount,
                lastMessage: chat.lastMessage?.body?.substring(0, 100)
            }));
        } catch (error) {
            console.error('❌ Error getting WhatsApp chats:', error);
            throw error;
        }
    }

    async getContacts() {
        if (!this.isReady) {
            throw new Error('WhatsApp client not ready');
        }

        try {
            const contacts = await this.client.getContacts();
            return contacts.map(contact => ({
                id: contact.id._serialized,
                name: contact.name,
                pushname: contact.pushname,
                isMyContact: contact.isMyContact
            }));
        } catch (error) {
            console.error('❌ Error getting WhatsApp contacts:', error);
            throw error;
        }
    }

    async initialize() {
        console.log('🚀 Initializing WhatsApp Client...');
        try {
            await this.client.initialize();
        } catch (error) {
            console.error('❌ Failed to initialize WhatsApp client:', error);
            throw error;
        }
    }

    async destroy() {
        console.log('🛑 Destroying WhatsApp Client...');
        try {
            await this.client.destroy();
            this.isReady = false;
        } catch (error) {
            console.error('❌ Error destroying WhatsApp client:', error);
        }
    }

    getStatus() {
        return {
            isReady: this.isReady,
            queuedMessages: this.messageQueue.length,
            platform: 'whatsapp'
        };
    }
}

module.exports = WhatsAppClient; 