// Voice Service for AI Chat
// Handles speech-to-text and text-to-speech functionality

export interface VoiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface TTSConfig {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private groqApiKey: string | null = null;

  constructor() {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
    this.groqApiKey = import.meta.env.VITE_GROQ_API_KEY || null;
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionConstructor();
    }
  }

  private initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  // Check if speech recognition is supported
  public isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  // Check if text-to-speech is supported
  public isTTSSupported(): boolean {
    return this.synthesis !== null || this.groqApiKey !== null;
  }

  // Start listening for speech input
  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    config: VoiceConfig = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🎤 [VOICE AI] Starting speech recognition...');
      console.log('🎤 [VOICE AI] Config:', { 
        language: config.language || 'en-US',
        continuous: config.continuous || false,
        interimResults: config.interimResults || true,
        maxAlternatives: config.maxAlternatives || 1 
      });

      if (!this.recognition) {
        const error = 'Speech recognition not supported';
        console.error('❌ [VOICE AI] Recognition not supported:', error);
        reject(new Error(error));
        return;
      }

      if (this.isListening) {
        const error = 'Already listening';
        console.warn('⚠️ [VOICE AI] Already listening:', error);
        reject(new Error(error));
        return;
      }

      // Configure recognition
      this.recognition.lang = config.language || 'en-US';
      this.recognition.continuous = config.continuous || false;
      this.recognition.interimResults = config.interimResults || true;
      this.recognition.maxAlternatives = config.maxAlternatives || 1;

      // Set up event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('✅ [VOICE AI] Speech recognition started successfully');
        console.log('🎯 [VOICE AI] Listening state:', this.isListening);
        resolve();
      };

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        console.log('📝 [VOICE AI] Processing speech results...');
        console.log('📊 [VOICE AI] Results count:', event.results.length);
        console.log('📍 [VOICE AI] Result index:', event.resultIndex);

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          const isFinal = event.results[i].isFinal;
          
          console.log(`📋 [VOICE AI] Result ${i}:`, {
            transcript,
            confidence,
            isFinal,
            alternatives: event.results[i].length
          });

          if (isFinal) {
            finalTranscript += transcript;
            console.log('✅ [VOICE AI] Final transcript:', finalTranscript);
          } else {
            interimTranscript += transcript;
            console.log('⏳ [VOICE AI] Interim transcript:', interimTranscript);
          }
        }

        if (finalTranscript) {
          console.log('🎯 [VOICE AI] Sending final result:', finalTranscript);
          onResult(finalTranscript, true);
        } else if (interimTranscript) {
          console.log('📝 [VOICE AI] Sending interim result:', interimTranscript);
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        const errorMsg = `Speech recognition error: ${event.error}`;
        console.error('❌ [VOICE AI] Recognition error:', {
          error: event.error,
          message: event.message,
          timestamp: new Date().toISOString()
        });
        onError(errorMsg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        console.log('🔚 [VOICE AI] Speech recognition ended');
        console.log('🎯 [VOICE AI] Final listening state:', this.isListening);
      };

      // Start recognition
      try {
        console.log('🚀 [VOICE AI] Attempting to start recognition...');
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        console.error('❌ [VOICE AI] Failed to start recognition:', error);
        reject(error);
      }
    });
  }

  // Stop listening
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Check if currently listening
  public getIsListening(): boolean {
    return this.isListening;
  }

  // Speak text using available TTS
  public async speak(
    text: string,
    config: TTSConfig = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    console.log('🔊 [VOICE AI] TTS Request initiated');
    console.log('📄 [VOICE AI] Text to speak:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
    console.log('⚙️ [VOICE AI] TTS Config:', config);
    console.log('🔑 [VOICE AI] Groq API available:', !!this.groqApiKey);

    try {
      if (this.groqApiKey && text.length <= 10000) {
        console.log('🌟 [VOICE AI] Using Groq TTS (Premium)');
        await this.speakWithGroqTTS(text, config, onStart, onEnd, onError);
      } else {
        console.log('🔄 [VOICE AI] Using Web Speech API (Fallback)');
        if (!this.groqApiKey) {
          console.warn('⚠️ [VOICE AI] No Groq API key configured');
        }
        if (text.length > 10000) {
          console.warn('⚠️ [VOICE AI] Text too long for Groq TTS:', text.length);
        }
        await this.speakWithWebAPI(text, config, onStart, onEnd, onError);
      }
    } catch (error) {
      console.error('❌ [VOICE AI] TTS failed, falling back to Web Speech API:', error);
      try {
        await this.speakWithWebAPI(text, config, onStart, onEnd, onError);
      } catch (fallbackError) {
        console.error('❌ [VOICE AI] All TTS methods failed:', fallbackError);
        onError?.(fallbackError instanceof Error ? fallbackError.message : 'TTS failed');
        throw fallbackError;
      }
    }
  }

  // Speak using Groq TTS API
  private async speakWithGroqTTS(
    text: string,
    config: TTSConfig = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    console.log('🌟 [VOICE AI] Groq TTS Starting...');
    console.log('📊 [VOICE AI] Request details:', {
      textLength: text.length,
      voice: config.voice || 'Fritz-PlayAI',
      model: 'playai-tts',
      apiKeyPresent: !!this.groqApiKey
    });

    if (!this.groqApiKey) {
      throw new Error('Groq API key not configured');
    }

    try {
      onStart?.();
      console.log('🚀 [VOICE AI] Calling Groq TTS API...');

      const requestBody = {
        model: 'playai-tts',
        input: text.substring(0, 10000), // Groq TTS limit
        voice: config.voice || 'Fritz-PlayAI',
        response_format: 'mp3'
      };

      console.log('📝 [VOICE AI] API Request:', requestBody);

      const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 [VOICE AI] API Response status:', response.status);
      console.log('📋 [VOICE AI] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [VOICE AI] Groq API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Groq TTS API error: ${response.statusText}`);
      }

      console.log('✅ [VOICE AI] Groq TTS API success');
      const audioBlob = await response.blob();
      console.log('🎵 [VOICE AI] Audio blob created:', {
        size: audioBlob.size,
        type: audioBlob.type
      });

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      console.log('🎧 [VOICE AI] Audio element created, starting playback...');

      audio.onended = () => {
        console.log('🏁 [VOICE AI] Groq TTS playback completed');
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };

      audio.onerror = () => {
        console.error('❌ [VOICE AI] Audio playback failed');
        URL.revokeObjectURL(audioUrl);
        onError?.('Audio playback failed');
      };

      await audio.play();
      console.log('▶️ [VOICE AI] Groq TTS playback started successfully');

    } catch (error) {
      console.error('❌ [VOICE AI] Groq TTS Error:', error);
      onError?.(error instanceof Error ? error.message : 'TTS failed');
      throw error;
    }
  }

  // Speak using Web Speech API
  private async speakWithWebAPI(
    text: string,
    config: TTSConfig = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    console.log('🔄 [VOICE AI] Web Speech API TTS Starting...');
    console.log('📊 [VOICE AI] Web API details:', {
      textLength: text.length,
      rate: config.rate || 1,
      pitch: config.pitch || 1,
      volume: config.volume || 1,
      voice: config.voice || 'default'
    });

    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        const error = 'Text-to-speech not supported';
        console.error('❌ [VOICE AI] Web Speech API not supported:', error);
        onError?.(error);
        reject(new Error(error));
        return;
      }

      // Cancel any ongoing speech
      console.log('🛑 [VOICE AI] Canceling any existing speech...');
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure utterance
      utterance.rate = config.rate || 1;
      utterance.pitch = config.pitch || 1;
      utterance.volume = config.volume || 1;

      console.log('⚙️ [VOICE AI] Utterance configured:', {
        rate: utterance.rate,
        pitch: utterance.pitch,
        volume: utterance.volume
      });

      // Set voice if specified
      if (config.voice) {
        const voices = this.synthesis.getVoices();
        console.log('🎭 [VOICE AI] Available voices:', voices.length);
        const selectedVoice = voices.find(voice => 
          voice.name.includes(config.voice!) || voice.lang.includes(config.voice!)
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log('✅ [VOICE AI] Voice selected:', {
            name: selectedVoice.name,
            lang: selectedVoice.lang,
            gender: selectedVoice.gender
          });
        } else {
          console.warn('⚠️ [VOICE AI] Requested voice not found:', config.voice);
        }
      }

      utterance.onstart = () => {
        console.log('▶️ [VOICE AI] Web Speech API playback started');
        onStart?.();
      };

      utterance.onend = () => {
        console.log('🏁 [VOICE AI] Web Speech API playback completed');
        onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        const error = `Speech synthesis error: ${event.error}`;
        console.error('❌ [VOICE AI] Web Speech API Error:', {
          error: event.error,
          message: event.message,
          timestamp: new Date().toISOString()
        });
        onError?.(error);
        reject(new Error(error));
      };

      console.log('🚀 [VOICE AI] Starting Web Speech API synthesis...');
      this.synthesis.speak(utterance);
    });
  }

  // Stop current speech
  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Get available voices for Web Speech API
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  // Get Groq TTS voices
  public getGroqVoices(): string[] {
    return [
      'Arista-PlayAI', 'Atlas-PlayAI', 'Basil-PlayAI', 'Briggs-PlayAI',
      'Calum-PlayAI', 'Celeste-PlayAI', 'Cheyenne-PlayAI', 'Chip-PlayAI',
      'Cillian-PlayAI', 'Deedee-PlayAI', 'Fritz-PlayAI', 'Gail-PlayAI',
      'Indigo-PlayAI', 'Mamaw-PlayAI', 'Mason-PlayAI', 'Mikail-PlayAI',
      'Mitch-PlayAI', 'Quinn-PlayAI', 'Thunder-PlayAI'
    ];
  }

  // Clean up resources
  public cleanup(): void {
    this.stopListening();
    this.stopSpeaking();
  }
}

// Global voice service instance
export const voiceService = new VoiceService();

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new() => SpeechRecognition;
    webkitSpeechRecognition: new() => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: SpeechGrammarList;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromURI(src: string, weight?: number): void;
  addFromString(string: string, weight?: number): void;
}

interface SpeechGrammar {
  src: string;
  weight: number;
} 