import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
// Note: In production, the API key should be handled server-side
const getAnthropicClient = () => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || localStorage.getItem('anthropic_api_key');
  
  if (!apiKey) {
    throw new Error('Anthropic API key not found. Please set it in Settings.');
  }
  
  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true // This is required for client-side usage
  });
};

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeSessionOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export class ClaudeService {
  private messages: ClaudeMessage[] = [];
  private systemPrompt: string;
  
  constructor(systemPrompt?: string) {
    this.systemPrompt = systemPrompt || `You are Claude, an AI assistant helping with software development tasks. 
You have access to a project workspace and can help with coding, debugging, and answering questions.
Be concise and helpful in your responses.`;
  }
  
  async sendMessage(
    message: string, 
    options: ClaudeSessionOptions = {}
  ): Promise<string> {
    const client = getAnthropicClient();
    
    // Add user message to history
    this.messages.push({ role: 'user', content: message });
    
    try {
      const response = await client.messages.create({
        model: options.model || 'claude-3-sonnet-20240229',
        max_tokens: options.maxTokens || 1024,
        temperature: options.temperature || 0.7,
        system: options.systemPrompt || this.systemPrompt,
        messages: this.messages
      });
      
      // Extract the assistant's response
      const assistantMessage = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '';
      
      // Add assistant response to history
      this.messages.push({ role: 'assistant', content: assistantMessage });
      
      return assistantMessage;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`Failed to get response from Claude: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Continue conversation with context
  async continueConversation(message: string, options: ClaudeSessionOptions = {}): Promise<string> {
    return this.sendMessage(message, options);
  }
  
  // Clear conversation history
  clearHistory() {
    this.messages = [];
  }
  
  // Get conversation history
  getHistory(): ClaudeMessage[] {
    return [...this.messages];
  }
  
  // Set system prompt
  setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
  }
  
  // Check if API key is available
  static isConfigured(): boolean {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || localStorage.getItem('anthropic_api_key');
    return !!apiKey;
  }
  
  // Save API key to localStorage
  static saveApiKey(apiKey: string) {
    localStorage.setItem('anthropic_api_key', apiKey);
  }
  
  // Remove API key from localStorage
  static removeApiKey() {
    localStorage.removeItem('anthropic_api_key');
  }
}

// Singleton instance for the current session
let currentSession: ClaudeService | null = null;

export const getCurrentSession = (): ClaudeService => {
  if (!currentSession) {
    currentSession = new ClaudeService();
  }
  return currentSession;
};

export const createNewSession = (systemPrompt?: string): ClaudeService => {
  currentSession = new ClaudeService(systemPrompt);
  return currentSession;
};