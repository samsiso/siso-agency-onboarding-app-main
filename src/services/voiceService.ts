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
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
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
        resolve();
      };

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript, true);
        } else if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        onError(`Speech recognition error: ${event.error}`);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      // Start recognition
      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
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

  // Speak text using Groq TTS (preferred) or Web Speech API (fallback)
  public async speak(
    text: string, 
    config: TTSConfig = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    // Try Groq TTS first if API key is available
    if (this.groqApiKey) {
      try {
        await this.speakWithGroqTTS(text, config, onStart, onEnd, onError);
        return;
      } catch (error) {
        console.warn('Groq TTS failed, falling back to Web Speech API:', error);
      }
    }

    // Fallback to Web Speech API
    await this.speakWithWebAPI(text, config, onStart, onEnd, onError);
  }

  // Speak using Groq TTS API
  private async speakWithGroqTTS(
    text: string,
    config: TTSConfig = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!this.groqApiKey) {
      throw new Error('Groq API key not configured');
    }

    try {
      onStart?.();

      const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'playai-tts',
          input: text.substring(0, 10000), // Groq TTS limit
          voice: config.voice || 'Fritz-PlayAI',
          response_format: 'mp3'
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq TTS API error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        onError?.('Audio playback failed');
      };

      await audio.play();

    } catch (error) {
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
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        const error = 'Text-to-speech not supported';
        onError?.(error);
        reject(new Error(error));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure utterance
      utterance.rate = config.rate || 1;
      utterance.pitch = config.pitch || 1;
      utterance.volume = config.volume || 1;

      // Set voice if specified
      if (config.voice) {
        const voices = this.synthesis.getVoices();
        const selectedVoice = voices.find(voice => 
          voice.name.includes(config.voice!) || voice.lang.includes(config.voice!)
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        const error = `Speech synthesis error: ${event.error}`;
        onError?.(error);
        reject(new Error(error));
      };

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