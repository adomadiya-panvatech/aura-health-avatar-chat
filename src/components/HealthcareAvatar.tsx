import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar3D } from "./Avatar3D";
import { VoiceInterface } from "./VoiceInterface";
import { ConversationPanel } from "./ConversationPanel";
import { HealthcarePrompts } from "./HealthcarePrompts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, Settings } from "lucide-react";
import { toast } from "sonner";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AvatarState {
  isListening: boolean;
  isSpeaking: boolean;
  expression: 'neutral' | 'happy' | 'concerned' | 'thinking';
  gesture: 'idle' | 'greeting' | 'explaining' | 'pointing';
}

export const HealthcareAvatar = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [avatarState, setAvatarState] = useState<AvatarState>({
    isListening: false,
    isSpeaking: false,
    expression: 'neutral',
    gesture: 'idle'
  });
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const voiceInterfaceRef = useRef<any>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      text: "Hello! I'm your AI healthcare assistant. I'm here to help you with patient information, appointment scheduling, and answer any healthcare-related questions. How may I assist you today?",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Speak welcome message after a brief delay
    setTimeout(() => {
      handleSpeakMessage(welcomeMessage.text);
    }, 1000);
  }, []);

  const handleSpeakMessage = async (text: string) => {
    if (!elevenLabsApiKey) {
      toast.error("Please configure your ElevenLabs API key to enable voice synthesis");
      return;
    }

    setIsSpeaking(true);
    setAvatarState(prev => ({
      ...prev,
      isSpeaking: true,
      expression: 'happy'
    }));

    try {
      await voiceInterfaceRef.current?.speak(text);
    } catch (error) {
      console.error("Speech synthesis error:", error);
      toast.error("Voice synthesis failed");
    } finally {
      setIsSpeaking(false);
      setAvatarState(prev => ({
        ...prev,
        isSpeaking: false,
        expression: 'neutral'
      }));
    }
  };

  const handleUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update avatar state to thinking
    setAvatarState(prev => ({
      ...prev,
      expression: 'thinking',
      gesture: 'explaining'
    }));

    // Generate AI response
    setTimeout(() => {
      const response = generateHealthcareResponse(text);
      const aiMessage: Message = {
        id: Date.now().toString() + "_ai",
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      handleSpeakMessage(response);
    }, 1000);
  };

  const generateHealthcareResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Healthcare-specific responses
    if (input.includes('appointment')) {
      return "I can help you schedule an appointment. What type of specialist would you like to see, and do you have any preferred dates or times?";
    }
    
    if (input.includes('symptom') || input.includes('pain') || input.includes('feel')) {
      return "I understand you're experiencing some discomfort. While I can provide general information, it's important to consult with a healthcare professional for proper diagnosis. Would you like me to help you schedule an appointment or find relevant health information?";
    }
    
    if (input.includes('insurance') || input.includes('coverage')) {
      return "I can help you understand your insurance coverage and benefits. What specific information about your insurance would you like to know?";
    }
    
    if (input.includes('medication') || input.includes('prescription')) {
      return "For medication questions, I recommend speaking with your pharmacist or doctor. I can help you schedule a consultation or provide general medication safety information. What would be most helpful?";
    }
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! I'm glad you're here. As your AI healthcare assistant, I'm ready to help with appointments, health information, or any questions you might have about our services.";
    }
    
    if (input.includes('emergency') || input.includes('urgent')) {
      return "If this is a medical emergency, please call 911 immediately or go to the nearest emergency room. For non-emergency urgent care, I can help you find nearby facilities or schedule an urgent appointment.";
    }
    
    // Default healthcare response
    return "I'm here to assist you with healthcare-related questions, appointment scheduling, and patient support. Could you please provide more specific details about how I can help you today?";
  };

  const toggleListening = () => {
    if (isListening) {
      voiceInterfaceRef.current?.stopListening();
      setIsListening(false);
      setAvatarState(prev => ({ ...prev, isListening: false }));
    } else {
      voiceInterfaceRef.current?.startListening();
      setIsListening(true);
      setAvatarState(prev => ({ 
        ...prev, 
        isListening: true, 
        expression: 'happy',
        gesture: 'greeting' 
      }));
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* 3D Avatar Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="relative h-96 lg:h-[600px] overflow-hidden bg-gradient-avatar shadow-medical">
          <Avatar3D avatarState={avatarState} />
          
          {/* Avatar Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
            <Button
              variant={isListening ? "default" : "secondary"}
              size="lg"
              onClick={toggleListening}
              className="shadow-soft animate-glow"
              disabled={isSpeaking}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              {isListening ? "Listening..." : "Start Voice"}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowSettings(!showSettings)}
              className="shadow-soft"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Avatar Status Indicator */}
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSpeaking ? 'bg-primary text-primary-foreground animate-pulse-medical' : 
              isListening ? 'bg-accent text-accent-foreground animate-pulse-medical' : 
              'bg-secondary text-secondary-foreground'
            }`}>
              {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Conversation Section */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="space-y-6"
      >
        <ConversationPanel
          messages={messages}
          onSendMessage={handleUserMessage}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          isListening={isListening}
          isSpeaking={isSpeaking}
        />
        
        <HealthcarePrompts onSelectPrompt={handleUserMessage} />
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <Card className="w-full max-w-md p-6 shadow-medical">
              <h3 className="text-lg font-semibold mb-4">Voice Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">ElevenLabs API Key</label>
                  <input
                    type="password"
                    value={elevenLabsApiKey}
                    onChange={(e) => setElevenLabsApiKey(e.target.value)}
                    placeholder="Enter your ElevenLabs API key"
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your API key from elevenlabs.io
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setShowSettings(false);
                    if (elevenLabsApiKey) {
                      toast.success("Voice settings updated!");
                    }
                  }}>
                    Save
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Interface */}
      <VoiceInterface
        ref={voiceInterfaceRef}
        onTranscript={handleUserMessage}
        apiKey={elevenLabsApiKey}
      />
    </div>
  );
};