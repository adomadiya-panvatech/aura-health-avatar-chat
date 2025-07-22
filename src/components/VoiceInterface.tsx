import { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import { toast } from "sonner";

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  
  start(): void;
  stop(): void;
  abort(): void;
  
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface VoiceInterfaceProps {
  onTranscript: (text: string) => void;
  apiKey?: string;
}

export interface VoiceInterfaceRef {
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => Promise<void>;
}

export const VoiceInterface = forwardRef<VoiceInterfaceRef, VoiceInterfaceProps>(
  ({ onTranscript, apiKey }, ref) => {
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const synthesisRef = useRef<SpeechSynthesis | null>(null);
    const isListeningRef = useRef(false);

    // Initialize speech recognition
    const initializeSpeechRecognition = useCallback(() => {
      if (typeof window === 'undefined') return null;

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Speech recognition not supported in this browser");
        return null;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log("Speech recognition started");
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript.trim()) {
          onTranscript(finalTranscript.trim());
          recognition.stop();
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'no-speech') {
          toast.error("No speech detected. Please try again.");
        } else {
          toast.error(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        console.log("Speech recognition ended");
      };

      return recognition;
    }, [onTranscript]);

    // ElevenLabs TTS function
    const speakWithElevenLabs = useCallback(async (text: string): Promise<void> => {
      if (!apiKey) {
        throw new Error("ElevenLabs API key not provided");
      }

      try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.2,
              use_speaker_boost: true
            }
          })
        });

        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        return new Promise((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            reject(new Error("Audio playback error"));
          };
          audio.play().catch(reject);
        });
      } catch (error) {
        console.error("ElevenLabs TTS error:", error);
        throw error;
      }
    }, [apiKey]);

    // Fallback browser TTS
    const speakWithBrowser = useCallback(async (text: string): Promise<void> => {
      if (!synthesisRef.current) {
        synthesisRef.current = window.speechSynthesis;
      }

      return new Promise((resolve, reject) => {
        if (!synthesisRef.current) {
          reject(new Error("Speech synthesis not available"));
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to use a more natural voice
        const voices = synthesisRef.current.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Google') || voice.name.includes('Natural'))
        ) || voices.find(voice => voice.lang.startsWith('en'));
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

        synthesisRef.current.speak(utterance);
      });
    }, []);

    const startListening = useCallback(() => {
      if (isListeningRef.current) return;

      const recognition = initializeSpeechRecognition();
      if (!recognition) return;

      recognitionRef.current = recognition;
      isListeningRef.current = true;
      
      try {
        recognition.start();
        toast.success("Listening... Speak now!");
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        toast.error("Failed to start listening");
        isListeningRef.current = false;
      }
    }, [initializeSpeechRecognition]);

    const stopListening = useCallback(() => {
      if (recognitionRef.current && isListeningRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
        isListeningRef.current = false;
      }
    }, []);

    const speak = useCallback(async (text: string): Promise<void> => {
      try {
        // Try ElevenLabs first if API key is available
        if (apiKey) {
          await speakWithElevenLabs(text);
        } else {
          // Fallback to browser TTS
          await speakWithBrowser(text);
        }
      } catch (error) {
        console.error("Speech synthesis failed:", error);
        // If ElevenLabs fails, try browser TTS as fallback
        if (apiKey) {
          try {
            await speakWithBrowser(text);
          } catch (browserError) {
            console.error("Browser TTS also failed:", browserError);
            throw new Error("Both ElevenLabs and browser TTS failed");
          }
        } else {
          throw error;
        }
      }
    }, [apiKey, speakWithElevenLabs, speakWithBrowser]);

    useImperativeHandle(ref, () => ({
      startListening,
      stopListening,
      speak
    }), [startListening, stopListening, speak]);

    return null;
  }
);