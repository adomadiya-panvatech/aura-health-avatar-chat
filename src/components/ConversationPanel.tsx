import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Volume2 } from "lucide-react";
import { Message } from "./HealthcareAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  currentInput: string;
  setCurrentInput: (text: string) => void;
  isListening: boolean;
  isSpeaking: boolean;
}

export const ConversationPanel = ({
  messages,
  onSendMessage,
  currentInput,
  setCurrentInput,
  isListening,
  isSpeaking,
}: ConversationPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (currentInput.trim() && !isListening && !isSpeaking) {
      onSendMessage(currentInput);
      setCurrentInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-96 lg:h-[500px] flex flex-col shadow-medical">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Healthcare Conversation</h3>
        <p className="text-sm text-muted-foreground">
          Chat with your AI healthcare assistant
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg shadow-soft ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-secondary text-secondary-foreground mr-4'
                }`}
              >
                {!message.isUser && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                      <Volume2 className="w-3 h-3 text-accent-foreground" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Healthcare AI
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isListening ? "Listening for your voice..." :
              isSpeaking ? "AI is speaking..." :
              "Type your healthcare question or use voice..."
            }
            className="min-h-[60px] resize-none"
            disabled={isListening || isSpeaking}
          />
          <Button
            onClick={handleSend}
            disabled={!currentInput.trim() || isListening || isSpeaking}
            size="lg"
            className="shadow-soft"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </span>
          <div className="flex items-center gap-2">
            {(isListening || isSpeaking) && (
              <div className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-medical"></div>
                {isListening ? "Listening..." : "Speaking..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};